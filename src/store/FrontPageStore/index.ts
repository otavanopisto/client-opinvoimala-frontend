import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  SnapshotOut,
  SnapshotIn,
} from 'mobx-state-tree';
import api from '../../services/api/Api';

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const FrontPageModel = types.model({
  main_title: types.string,
  subtitle: types.string,
  description: types.string,
});

export interface IFrontPageModel extends Instance<typeof FrontPageModel> {}
export interface FrontPage extends SnapshotOut<typeof FrontPageModel> {}
export interface FrontPageIn extends SnapshotIn<typeof FrontPageModel> {}

export const FrontPageStore = types
  .model({
    state: types.enumeration('State', States),

    data: types.maybe(FrontPageModel),
  })
  .views(self => ({
    get frontPage() {
      return self.data ? getSnapshot(self.data) : undefined;
    },
  }))
  .actions(self => {
    const fetchFrontPage = flow(function* (params: API.GetFrontPage) {
      self.state = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetFrontPage> =
        yield api.getFrontPage(params);

      if (response.kind === 'ok') {
        self.data = cast(response.data);
        self.state = 'FETCHED';
      } else {
        self.state = 'ERROR';
      }
    });

    return {
      fetchFrontPage,
    };
  });

export interface IFrontPageStore extends Instance<typeof FrontPageStore> {}
