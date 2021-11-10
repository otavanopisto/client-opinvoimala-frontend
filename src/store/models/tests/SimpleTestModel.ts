import { SnapshotOut, types } from 'mobx-state-tree';

export const SimpleTestModel = types.model({
  id: types.identifierNumber,
  name: types.string,
  slug: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  type: types.enumeration(['test', 'exercise']),
  isPublic: types.boolean,
});

export interface SimpleTest extends SnapshotOut<typeof SimpleTestModel> {}
