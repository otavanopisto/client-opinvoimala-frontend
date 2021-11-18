import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { TestsSummaryCategoryModel } from '.';

export const TestsSummaryModel = types.model({
  stars: types.maybeNull(types.number),
  summaryText: types.maybeNull(types.string),
  detailsText: types.maybeNull(types.string),
  categories: types.maybeNull(types.array(TestsSummaryCategoryModel)),
});

export interface ITestsSummaryModel
  extends Instance<typeof TestsSummaryModel> {}
export interface TestsSummary extends SnapshotOut<typeof TestsSummaryModel> {}
export interface TestsSummaryIn extends SnapshotIn<typeof TestsSummaryModel> {}
