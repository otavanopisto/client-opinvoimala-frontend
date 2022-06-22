import { SnapshotOut, types } from 'mobx-state-tree';
import { ImageModel } from './ImageModel';

export const GoalModel = types.model({
  id: types.number,
  description: types.string,
  done: types.boolean,
});

export interface Goal extends SnapshotOut<typeof GoalModel> {}

export const GoalsModel = types.model({
  title: types.string,
  infoText: types.string,
  doneTotal: types.number,
  image: ImageModel,
  goals: types.array(GoalModel),
});

export interface Goals extends SnapshotOut<typeof GoalsModel> {}
