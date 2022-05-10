import { SnapshotOut, types } from 'mobx-state-tree';

export const UserInterestsModel = types.model({});
export interface UserInterests extends SnapshotOut<typeof UserInterestsModel> {}
