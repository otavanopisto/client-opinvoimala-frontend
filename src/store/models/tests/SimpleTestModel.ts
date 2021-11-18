import { SnapshotOut, types } from 'mobx-state-tree';

export const SimpleTestModel = types.model({
  id: types.identifierNumber,
  name: types.string,
  slug: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  type: types.enumeration(['test', 'exercise']),
  isPublic: types.boolean,
  priority: types.maybeNull(types.number),
  publishedAt: types.string,
  completedByUser: types.maybeNull(types.boolean),

  categories: types.maybe(
    types.array(
      types.model({
        id: types.number,
        label: types.string,
      })
    )
  ),
});

export interface SimpleTest extends SnapshotOut<typeof SimpleTestModel> {}
