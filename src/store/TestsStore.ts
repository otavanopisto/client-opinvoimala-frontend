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

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const SimpleTestModel = types.model({
  id: types.number,
  name: types.string,
  slug: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  type: types.enumeration(['test', 'exercise']),
  isPublic: types.boolean,
});

export interface SimpleTest extends SnapshotOut<typeof SimpleTestModel> {}

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
    categoriesState: types.enumeration('State', States),
    categoriesData: types.maybe(types.array(CategoryModel)),

    exercisesState: types.enumeration('State', States),
    exercisesData: types.maybe(types.array(SimpleTestModel)),
  })
  .views(self => ({
    get categories() {
      return self.categoriesData ? getSnapshot(self.categoriesData) : undefined;
    },

    get exercises() {
      return self.exercisesData ? getSnapshot(self.exercisesData) : undefined;
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

    const fetchExercises = flow(function* (params: API.GetExercises = {}) {
      self.exercisesState = 'FETCHING';

      type ResponseType = API.GeneralResponse<API.RES.GetExercises>;
      const response: ResponseType = yield api.getExercises(params);

      if (response.kind === 'ok') {
        self.exercisesData = cast(response.data);
        self.exercisesState = 'FETCHED';
      } else {
        self.exercisesState = 'ERROR';
      }
    });

    return {
      fetchCategories,
      fetchExercises,
    };
  });

export interface ITestsStore extends Instance<typeof TestsStore> {}
