import { types, SnapshotOut, SnapshotIn } from 'mobx-state-tree';

export const SpecialistModel = types.model({
  id: types.maybeNull(types.identifierNumber),
  name: types.maybeNull(types.string),
  role: types.maybeNull(types.string),
  roleId: types.maybeNull(types.number),
  meetingLink: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
});

export interface Specialist extends SnapshotOut<typeof SpecialistModel> {}
export interface SpecialistIn extends SnapshotIn<typeof SpecialistModel> {}
