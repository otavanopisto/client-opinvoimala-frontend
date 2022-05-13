import { types, SnapshotOut } from 'mobx-state-tree';

export const SpecialistRoleModel = types.model({
  id: types.maybeNull(types.number),
  role: types.maybeNull(types.string),
});

export interface SpecialistRole
  extends SnapshotOut<typeof SpecialistRoleModel> {}
