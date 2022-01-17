import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { ImageModel, LinkModel } from '..';
import { SimpleTestModel } from './SimpleTestModel';

export const TestCategoryModel = types.model({
  id: types.identifierNumber,
  label: types.string,
  image: types.maybeNull(ImageModel),
  tests: types.array(SimpleTestModel),
  testCategoryLink: types.maybeNull(LinkModel),
});

export interface ITestCategoryModel
  extends Instance<typeof TestCategoryModel> {}
export interface TestCategory extends SnapshotOut<typeof TestCategoryModel> {}
export interface TestCategoryIn extends SnapshotIn<typeof TestCategoryModel> {}

export const TestsSummaryCategoryModel = types.model({
  id: types.identifierNumber,
  label: types.string,
  image: types.maybeNull(ImageModel),
  testCategoryLink: types.maybeNull(LinkModel),
  stars: types.maybeNull(types.number),
  completedTests: types.maybeNull(types.number),
  totalTests: types.maybeNull(types.number),
});

export interface TestsSummaryCategory
  extends SnapshotOut<typeof TestsSummaryCategoryModel> {}
