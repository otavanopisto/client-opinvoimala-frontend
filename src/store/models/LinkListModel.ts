import { SnapshotOut, types } from 'mobx-state-tree';
import { LinkModel } from './LinkModel';

export const LinkListModel = types.model({
  title: types.maybeNull(types.string),
  links: types.array(LinkModel),
});

export interface LinkList extends SnapshotOut<typeof LinkListModel> {}
