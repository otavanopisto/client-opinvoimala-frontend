import { SnapshotOut, types } from 'mobx-state-tree';

export const UserInterestsModel = types.model({
  id: types.number,
  slug: types.string,
  title: types.string,
  description: types.string,
  tags: types.array(types.string),
  type: types.enumeration(['page', 'test', 'exercise']),
});

export interface UserInterests extends SnapshotOut<typeof UserInterestsModel> {}
