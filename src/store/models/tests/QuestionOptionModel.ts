import { SnapshotOut, types } from 'mobx-state-tree';
import { AnswerTypeModel } from './AnswerTypeModel';

export const PointOptionModel = types.model({
  id: types.identifierNumber,
  label: types.string,
  points: types.number,
});

export interface Question extends SnapshotOut<typeof PointOptionModel> {}

export const SuitabilityOptionModel = types.model({
  id: types.identifierNumber,
  label: types.string,
  outcomeValue: types.string,
});

export interface SuitabilityOption
  extends SnapshotOut<typeof SuitabilityOptionModel> {}

export const QuestionOptionModel = types.model({
  id: types.identifierNumber,
  answerType: AnswerTypeModel,
  pointOptions: types.array(PointOptionModel),
  suitabilityOptions: types.array(SuitabilityOptionModel),
});

export interface QuestionOption
  extends SnapshotOut<typeof QuestionOptionModel> {}
