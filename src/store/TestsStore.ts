import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  applySnapshot,
} from 'mobx-state-tree';
import i18n from '../i18n';
import api from '../services/api/Api';
import { TestCategoryModel, SimpleTestModel, Test, TestModel } from './models';

const make404Test = (params: API.GetContentPages, name: string): Test => ({
  id: params.id ?? -1,
  name,
  slug: params.slug ?? '',
  description: null,
  type: 'test',
  affectsUserProfile: false,
  categories: [],
  outcomeType: 'from_template',
  template: null,
  questions: null,
});

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const TestStates = [
  'IDLE' as const,
  'FETCHING' as const,
  'ERROR' as const,
  'UNAUTHORIZED' as const,
];

export const TestsStore = types
  .model({
    categoriesState: types.enumeration('State', States),
    categoriesData: types.maybe(types.array(TestCategoryModel)),

    exercisesState: types.enumeration('State', States),
    exercisesData: types.maybe(types.array(SimpleTestModel)),

    testState: types.enumeration('State', TestStates),
    testData: types.maybe(types.array(TestModel)),
  })
  .views(self => ({
    get categories() {
      return self.categoriesData ? getSnapshot(self.categoriesData) : undefined;
    },

    get exercises() {
      return self.exercisesData ? getSnapshot(self.exercisesData) : undefined;
    },

    getTest(slug: string | number) {
      const testId = Number(slug);
      const test = self.testData?.find(test =>
        testId ? test.id === testId : test.slug === slug
      );
      return test ? getSnapshot(test) : undefined;
    },
  }))
  .actions(self => {
    let initialState = {};

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

    const fetchTest = flow(function* (params: API.GetTests) {
      self.testState = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetTests> =
        yield api.getTests(params);

      const updateTests = (test: Test) => {
        const oldTests = self.testData?.filter(({ id }) => id !== test.id);
        return [...(oldTests ?? []), test];
      };

      if (response.kind === 'ok' && response.data.length) {
        const test = response.data[0];
        const tests = updateTests(test);

        self.testData = cast(tests);
        self.testState = 'IDLE';
      } else if (response.data.statusCode === 403) {
        self.testState = 'UNAUTHORIZED';
        throw response.data;
      } else {
        const page404 = make404Test(params, i18n.t('error.test_not_found'));
        const tests = updateTests(page404);
        self.testData = cast(tests);
        self.testState = 'ERROR';
      }
    });

    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      reset: () => {
        applySnapshot(self, initialState);
      },
      fetchCategories,
      fetchExercises,
      fetchTest,
    };
  });

export interface ITestsStore extends Instance<typeof TestsStore> {}
