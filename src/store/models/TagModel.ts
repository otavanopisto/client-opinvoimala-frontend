import { SnapshotOut, types } from 'mobx-state-tree';

export const TagModel = types.model({
  id: types.number,
  name: types.string,
  created_at: types.string,
  updated_at: types.string,
});

export interface Tag extends SnapshotOut<typeof TagModel> {}
