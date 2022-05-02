import { Instance, onSnapshot, SnapshotOut, types } from 'mobx-state-tree';
import { AdminAuthStore } from './AdminAuthStore';

const AdminRootStoreModel = types.model({
  auth: types.optional(AdminAuthStore, { state: 'IDLE' }),
});

export interface AdminRootStore extends Instance<typeof AdminRootStoreModel> {}

export interface AdminRootStoreSnapshot
  extends SnapshotOut<typeof AdminRootStoreModel> {}

export const adminRootStore = AdminRootStoreModel.create({});

// Update state in local storage on every snapshot
onSnapshot(adminRootStore, snapshot => {
  if (process.env.NODE_ENV === 'development') {
    console.log('ADMIN/Snapshot:', snapshot);
  }
});
