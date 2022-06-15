import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  SnapshotOut,
  SnapshotIn,
  applySnapshot,
} from 'mobx-state-tree';
import i18n from '../i18n';
import api from '../services/api/Api';
import { Page, PageModel } from './models';

const States = [
  'IDLE' as const,
  'FETCHING' as const,
  'ERROR' as const,
  'UNAUTHORIZED' as const,
];

const make404page = (params: API.GetContentPages, title: string) => ({
  id: params.id ?? -1,
  title,
  slug: params.slug ?? '',
  lead: null,
  content: null,
  cards: null,
  linkList: {
    title: null,
    links: [],
  },
  feedback: null,
});

const ContentPageModel = types.model({
  pages: types.array(PageModel),
});

export interface IContentPageModel extends Instance<typeof ContentPageModel> {}
export interface ContentPage extends SnapshotOut<typeof ContentPageModel> {}
export interface ContentPageIn extends SnapshotIn<typeof ContentPageModel> {}

export const ContentPageStore = types
  .model({
    state: types.enumeration('State', States),
    data: types.maybe(ContentPageModel),
  })
  .views(self => ({
    get pages() {
      return self.data ? getSnapshot(self.data) : undefined;
    },
    getPage(slug: string | number) {
      const pageId = Number(slug);
      const page = self.data?.pages.find(page =>
        pageId ? page.id === pageId : page.slug === slug
      );
      return page ? getSnapshot(page) : undefined;
    },
  }))
  .actions(self => {
    let initialState = {};

    const fetchPage = flow(function* (params: API.GetContentPages) {
      self.state = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetContentPages> =
        yield api.getContentPages(params);

      const updatePages = (page: Page) => {
        const oldPages = self.data?.pages.filter(({ id }) => id !== page.id);
        return [...(oldPages ?? []), page];
      };

      if (response.kind === 'ok' && response.data.length) {
        const page = response.data[0];
        const pages = updatePages(page);

        self.data = { ...self.data, pages: cast(pages) };
        self.state = 'IDLE';
      } else if (response.data.statusCode === 403) {
        self.state = 'UNAUTHORIZED';
        throw response.data;
      } else {
        const page404 = make404page(params, i18n.t('error.page_not_found'));
        const pages = updatePages(page404);
        self.data = { ...self.data, pages: cast(pages) };
        self.state = 'ERROR';
      }
    });

    const sendFeedback = flow(function* (params: API.SendFeedback) {
      const response: API.GeneralResponse<API.RES.SendFeedback> =
        yield api.sendFeedback(params);

      if (response.kind === 'ok') {
        self.data = cast({
          ...self.data,
          pages: self.data?.pages.map(page => {
            if (page.id !== params.id) return page;
            return {
              ...page,
              feedback: response.data,
            };
          }),
        });
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false };
      }
    });

    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      reset: () => {
        applySnapshot(self, initialState);
      },
      fetchPage,
      sendFeedback,
    };
  });

export interface IContentPageStore extends Instance<typeof ContentPageStore> {}
