import { SnapshotOut, types } from 'mobx-state-tree';
import { LinkListModel } from './LinkListModel';

export const PageModel = types.model({
  id: types.identifierNumber,
  title: types.maybeNull(types.string),
  slug: types.maybeNull(types.string),
  lead: types.maybeNull(types.string),
  content: types.maybeNull(types.string),
  linkList: types.maybeNull(LinkListModel),
});

export interface Page extends SnapshotOut<typeof PageModel> {}
