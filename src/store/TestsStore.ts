import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  SnapshotOut,
  SnapshotIn,
} from 'mobx-state-tree';
import api from '../services/api/Api';
import { ImageModel } from './models';

const CategoriesStates = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const SimpleTestModel = types.model({
  id: types.number,
  name: types.string,
  slug: types.maybeNull(types.string),
  type: types.enumeration(['test', 'exercise']),
  isPublic: types.boolean,
});

const CategoryModel = types.model({
  id: types.number,
  label: types.string,
  image: types.maybeNull(ImageModel),
  tests: types.array(SimpleTestModel),
});

export interface ICategoryModel extends Instance<typeof CategoryModel> {}
export interface Category extends SnapshotOut<typeof CategoryModel> {}
export interface CategoryIn extends SnapshotIn<typeof CategoryModel> {}

export const TestsStore = types
  .model({
    categoriesState: types.enumeration('State', CategoriesStates),
    categoriesData: types.maybe(types.array(CategoryModel)),
  })
  .views(self => ({
    get categories() {
      return self.categoriesData ? getSnapshot(self.categoriesData) : undefined;
    },
  }))
  .actions(self => {
    const fetchCategories = flow(function* (
      params: API.GetTestCategories = {}
    ) {
      self.categoriesState = 'FETCHING';

      type ResponseType = API.GeneralResponse<API.RES.GetTestCategories>;
      const response: ResponseType = yield api.getTestCategories(params);

      if (response.kind === 'ok') {
        self.categoriesData = cast(response.data);
        self.categoriesState = 'FETCHED';
      } else {
        self.categoriesState = 'ERROR';
      }
    });

    return {
      fetchCategories,
    };
  });

export interface ITestsStore extends Instance<typeof TestsStore> {}
