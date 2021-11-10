import { SnapshotOut, types } from 'mobx-state-tree';
import {
  PointOptionModel,
  SuitabilityOptionModel,
} from './QuestionOptionModel';

const AnswerTypes = [
  'multiple_choice' as const,
  'dropdown' as const,
  'slider' as const,
  'text' as const,
  'none' as const,
];
export type AnswerType = typeof AnswerTypes[number];

export const QuestionModel = types.model({
  id: types.identifierNumber,
  title: types.string,
  content: types.maybeNull(types.string),
  answerType: types.maybeNull(types.enumeration(AnswerTypes)),
  pointOptions: types.array(PointOptionModel),
  suitabilityOptions: types.array(SuitabilityOptionModel),
});

export interface Question extends SnapshotOut<typeof QuestionModel> {}
