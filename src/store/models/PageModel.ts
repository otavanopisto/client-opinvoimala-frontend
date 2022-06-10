import { SnapshotOut, types } from 'mobx-state-tree';
import { CardModel } from './CardModel';
import { LinkListModel } from './LinkListModel';
import { FeedbackModel } from './FeedbackModel';

export const PageModel = types.model({
  id: types.identifierNumber,
  title: types.maybeNull(types.string),
  slug: types.maybeNull(types.string),
  lead: types.maybeNull(types.string),
  content: types.maybeNull(types.string),
  cards: types.maybeNull(types.array(CardModel)),
  linkList: types.maybeNull(LinkListModel),
  feedback: types.maybeNull(FeedbackModel),
});

export interface Page extends SnapshotOut<typeof PageModel> {}
