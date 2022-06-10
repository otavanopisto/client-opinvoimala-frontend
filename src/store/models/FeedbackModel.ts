import { SnapshotOut, types } from 'mobx-state-tree';

export const FeedbackModel = types.model({
  show_feedback: types.boolean,
  title: types.maybeNull(types.string),
  likes: types.maybeNull(types.number),
  dislikes: types.maybeNull(types.number),
});

export interface Feedback extends SnapshotOut<typeof FeedbackModel> {}
