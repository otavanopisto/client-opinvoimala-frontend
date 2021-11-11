import { SnapshotOut, types } from 'mobx-state-tree';

export const QuestionOptionModel = types.model({
  id: types.identifierNumber,
  label: types.string,
});

export interface QuestionOption
  extends SnapshotOut<typeof QuestionOptionModel> {}
