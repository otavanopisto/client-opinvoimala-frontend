import { SnapshotOut, types } from 'mobx-state-tree';
import { TagModel } from './TagModel';

export const UserModel = types.model({
  id: types.number,
  tags: types.array(TagModel),
});

export interface User extends SnapshotOut<typeof UserModel> {}
export interface IUserModel extends SnapshotOut<typeof UserModel> {}
export interface UserIn extends SnapshotOut<typeof UserModel> {}
