import { SnapshotOut, types } from 'mobx-state-tree';
import { OutcomeTypeModel } from './OutcomeTypeModel';
import { QuestionOptionModel } from './QuestionOptionModel';

export const TestTemplateModel = types.model({
  id: types.identifierNumber,
  name: types.string,
  outcomeType: OutcomeTypeModel,
  options: QuestionOptionModel,
});

export interface TestTemplate extends SnapshotOut<typeof TestTemplateModel> {}
