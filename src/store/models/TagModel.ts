import { SnapshotOut, types } from 'mobx-state-tree';

export const TagModel = types.model({
  id: types.number,
  name: types.string,
});

export interface Tag extends SnapshotOut<typeof TagModel> {}
