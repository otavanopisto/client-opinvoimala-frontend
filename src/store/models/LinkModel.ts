import { SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

const InternalLinkTargetModel = types.model({
  id: types.number,
  title: types.maybeNull(types.string),
  slug: types.maybeNull(types.string),
  isPublic: types.maybeNull(types.boolean),
});

export const LinkModel = types.model({
  id: types.union(types.number, types.string),
  label: types.maybeNull(types.string),
  type: types.enumeration(['external', 'internal', 'page', 'test', 'exercise']),

  external: types.maybeNull(types.string),
  internal: types.maybeNull(types.string),
  page: types.maybeNull(InternalLinkTargetModel),
  test: types.maybeNull(InternalLinkTargetModel),
  exercise: types.maybeNull(InternalLinkTargetModel),
});

export interface Link extends SnapshotOut<typeof LinkModel> {}
export interface LinkIn extends SnapshotIn<typeof LinkModel> {}
