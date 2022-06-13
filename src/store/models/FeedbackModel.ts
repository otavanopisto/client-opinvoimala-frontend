import { SnapshotOut, types } from 'mobx-state-tree';

export const FeedbackModel = types.model({
  showFeedback: types.boolean,
  title: types.maybeNull(types.string),
  likes: types.maybeNull(types.number),
  dislikes: types.maybeNull(types.number),
});

export interface Feedback extends SnapshotOut<typeof FeedbackModel> {}
