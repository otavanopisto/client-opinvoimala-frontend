import { types, SnapshotOut } from 'mobx-state-tree';

export const SpecialistModel = types.model({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  role: types.maybeNull(types.string),
  roleId: types.maybeNull(types.number),
});

export interface Specialist extends SnapshotOut<typeof SpecialistModel> {}
