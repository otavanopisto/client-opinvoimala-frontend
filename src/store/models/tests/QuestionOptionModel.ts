import { SnapshotOut, types } from 'mobx-state-tree';

export const PointOptionModel = types.model({
  id: types.identifierNumber,
  label: types.string,
  points: types.number,
  isTriggerOption: types.maybeNull(types.boolean),
});

export interface PointOption extends SnapshotOut<typeof PointOptionModel> {}

export const SuitabilityOptionModel = types.model({
  id: types.identifierNumber,
  label: types.string,
  outcomeValue: types.string,
  isTriggerOption: types.maybeNull(types.boolean),
});

export interface SuitabilityOption
  extends SnapshotOut<typeof SuitabilityOptionModel> {}
