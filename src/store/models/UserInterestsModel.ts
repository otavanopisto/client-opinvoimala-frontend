import { SnapshotOut, types } from 'mobx-state-tree';
import { LinkModel } from './LinkModel';

export const UserInterestsModel = types.model({
  id: types.number,
  slug: types.string,
  title: types.string,
  description: types.maybeNull(types.string),
  tags: types.array(types.string),
  type: types.enumeration(['page', 'test', 'exercise']),
  link: types.maybeNull(LinkModel),
});

export interface UserInterests extends SnapshotOut<typeof UserInterestsModel> {}
