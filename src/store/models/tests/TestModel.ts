import { SnapshotOut, types } from 'mobx-state-tree';
import { TestCategoryModel } from './TestCategoryModel';
import { OutcomeTypeModel } from './OutcomeTypeModel';
import { QuestionModel } from './QuestionModel';
import { TestTemplateModel } from './TestTemplateModel';

export const TestModel = types.model({
  id: types.identifierNumber,
  name: types.string,
  slug: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  type: types.enumeration(['test', 'exercise']),
  affectsUserProfile: types.boolean,
  categories: types.array(TestCategoryModel),
  outcomeType: OutcomeTypeModel,
  template: types.maybeNull(TestTemplateModel),
  questions: types.maybeNull(types.array(QuestionModel)),
  // TODO:
  // outcomes: types.maybeNull(OutcomesModel)
});

export interface Test extends SnapshotOut<typeof TestModel> {}
