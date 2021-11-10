import { SnapshotOut, types } from 'mobx-state-tree';
import { AnswerTypeModel } from './AnswerTypeModel';
import {
  PointOptionModel,
  SuitabilityOptionModel,
} from './QuestionOptionModel';

export const QuestionModel = types.model({
  id: types.identifierNumber,
  title: types.string,
  content: types.maybeNull(types.string),
  answerType: types.maybeNull(AnswerTypeModel),
  isTriggerQuestion: types.boolean,
  pointOptions: types.array(PointOptionModel),
  suitabilityOptions: types.array(SuitabilityOptionModel),
});

export interface Question extends SnapshotOut<typeof QuestionModel> {}
