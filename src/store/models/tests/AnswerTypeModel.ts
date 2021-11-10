import { SnapshotOut, types } from 'mobx-state-tree';

export const AnswerTypeModel = types.model({
  id: types.identifierNumber,
  type: types.enumeration([
    'multiple_choice',
    'dropdown',
    'slider',
    'text',
    'none',
  ]),
});

export interface AnswerType extends SnapshotOut<typeof AnswerTypeModel> {}
