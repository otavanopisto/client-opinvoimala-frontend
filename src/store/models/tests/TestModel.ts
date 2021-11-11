import { SnapshotOut, types } from 'mobx-state-tree';
import { TestCategoryModel } from './TestCategoryModel';
import { QuestionModel } from './QuestionModel';

const OutcomeTypes = [
  'total_points' as const,
  'suitability_of_answers' as const,
];
export type OutcomeType = typeof OutcomeTypes[number];

export const TestModel = types.model({
  id: types.identifierNumber,
  name: types.string,
  slug: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  type: types.enumeration(['test', 'exercise']),
  affectsUserProfile: types.boolean,
  categories: types.array(TestCategoryModel),
  outcomeType: types.enumeration(OutcomeTypes),
  questions: types.maybeNull(types.array(QuestionModel)),
  // TODO:
  // outcomes: types.maybeNull(OutcomesModel)
});

export interface Test extends SnapshotOut<typeof TestModel> {}
