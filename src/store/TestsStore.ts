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
import {
  TestCategoryModel,
  SimpleTestModel,
  Test,
  TestModel,
  TestOutcomes,
  TestOutcomesModel,
  TestsSummaryModel,
  SimpleTest,
} from './models';

const make404Test = (params: API.GetContentPages, name: string): Test => ({
  id: params.id ?? -1,
  name,
  slug: params.slug ?? '',
  description: null,
  type: 'test',
  categories: [],
  questions: null,
});

const isNil = (item: any) => item === undefined || item === null;

const sortTests = (a: SimpleTest, b: SimpleTest) => {
  const getPrioritySort = () => {
    if (isNil(a.priority) && isNil(b.priority)) return 0;
    else if (isNil(a.priority)) return 1;
    else if (isNil(b.priority)) return -1;
    else return Number(a.priority) - Number(b.priority);
  };

  const priority = getPrioritySort();
  const published = b.publishedAt.localeCompare(a.publishedAt);
  return priority || published;
};

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

    testOutcomeState: types.enumeration('State', TestStates),
    testOutcomeData: types.maybe(types.array(TestOutcomesModel)),

    testsSummaryState: types.enumeration('State', TestStates),
    testsSummaryData: types.maybe(TestsSummaryModel),
  })
  .views(self => ({
    get categories() {
      return self.categoriesData ? getSnapshot(self.categoriesData) : undefined;
    },

    get exercises() {
      return self.exercisesData ? getSnapshot(self.exercisesData) : undefined;
    },

    // Concatenates all tests from categories
    get allTests() {
      const allTests = this.categories?.reduce(
        (arr: SimpleTest[], { id, label, tests }) => {
          const testsWithCategories = tests.map(test => ({
            ...test,
            categories: [{ id, label }],
          }));
          return [...arr, ...testsWithCategories];
        },
        []
      );

      const uniqueTests: { [key: string]: SimpleTest } = {};
      allTests?.forEach(test => {
        const existingCategories = uniqueTests[test.id]?.categories ?? [];
        const currentCategories = test.categories ?? [];
        uniqueTests[test.id] = {
          ...test,
          // Group all categories where test belongs
          categories: [...existingCategories, ...currentCategories],
        };
      });

      const tests = Object.keys(uniqueTests)
        .map((key: string) => uniqueTests[key])
        .sort(sortTests);

      return tests;
    },

    get testsSummary() {
      return self.testsSummaryData
        ? getSnapshot(self.testsSummaryData)
        : undefined;
    },

    getTest(slug: string | number) {
      const testId = Number(slug);
      const test = self.testData?.find(test =>
        testId ? test.id === testId : test.slug === slug
      );
      return test ? getSnapshot(test) : undefined;
    },

    getTestOutcome(slug: string | number) {
      const testId = Number(slug);
      const outcome = self.testOutcomeData?.find(outcome =>
        testId ? outcome.id === testId : outcome.slug === slug
      );
      return outcome ? getSnapshot(outcome) : undefined;
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

    const setCompletedByUserForTest = function (slug: string) {
      self.categoriesData = cast(
        self.categoriesData?.map(category => ({
          ...category,
          tests: category.tests.map(test => ({
            ...test,
            completedByUser: test.slug === slug ? true : test.completedByUser,
          })),
        }))
      );

      self.exercisesData = cast(
        self.exercisesData?.map(test => ({
          ...test,
          completedByUser: test.slug === slug ? true : test.completedByUser,
        }))
      );
    };

    const updateTestOutcomes = (outcome: TestOutcomes) => {
      const oldOutcomes = self.testOutcomeData?.filter(
        ({ id }) => id !== outcome.id
      );
      return [...(oldOutcomes ?? []), outcome];
    };

    const createTestOutcome = flow(function* (params: API.CreateTestOutcome) {
      self.testOutcomeState = 'FETCHING';

      const response: API.GeneralResponse<API.RES.CreateTestOutcome> =
        yield api.createTestOutcome(params);

      if (response.kind === 'ok') {
        const outcome = response.data;
        const outcomes = updateTestOutcomes(outcome);

        self.testOutcomeData = cast(outcomes);
        self.testOutcomeState = 'IDLE';

        // Update categories/exercises data after completed test
        setCompletedByUserForTest(outcome.slug);
      } else if (response.data.statusCode === 403) {
        self.testOutcomeState = 'UNAUTHORIZED';
        throw response.data;
      } else {
        console.log(response.data);
        self.testOutcomeState = 'ERROR';
      }
    });

    const fetchTestOutcome = flow(function* (params: API.GetTestOutcome) {
      self.testOutcomeState = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetTestOutcome> =
        yield api.getTestOutcome(params);

      if (response.kind === 'ok') {
        const outcome = response.data;
        const outcomes = updateTestOutcomes(outcome);

        self.testOutcomeData = cast(outcomes);
        self.testOutcomeState = 'IDLE';
      } else if (response.data.statusCode === 403) {
        self.testOutcomeState = 'UNAUTHORIZED';
        throw response.data;
      } else {
        console.log(response.data);
        self.testOutcomeState = 'ERROR';
      }
    });

    const fetchTestsSummary = flow(function* (
      params: API.GetTestsSummary = {}
    ) {
      self.testsSummaryState = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetTestsSummary> =
        yield api.getTestsSummary(params);

      if (response.kind === 'ok') {
        self.testsSummaryData = response.data ? cast(response.data) : undefined;
        self.testsSummaryState = 'IDLE';
      } else if (response.data.statusCode === 403) {
        self.testsSummaryState = 'UNAUTHORIZED';
        throw response.data;
      } else {
        console.log(response.data);
        self.testsSummaryState = 'ERROR';
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
      createTestOutcome,
      fetchTestOutcome,
      fetchTestsSummary,
    };
  });

export interface ITestsStore extends Instance<typeof TestsStore> {}
