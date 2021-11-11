import { SnapshotOut, types } from 'mobx-state-tree';
import { QuestionOptionModel } from './QuestionOptionModel';

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
  options: types.array(QuestionOptionModel),
});

export interface Question extends SnapshotOut<typeof QuestionModel> {}
