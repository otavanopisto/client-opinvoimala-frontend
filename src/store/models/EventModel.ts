import { SnapshotOut, types } from 'mobx-state-tree';
import { ImageModel } from './ImageModel';
import { LinkModel } from './LinkModel';

export const EventModel = types.model({
  id: types.identifierNumber,
  date: types.string,
  duration: types.maybeNull(types.number),
  repeat: types.enumeration(['none', 'weekly', 'daily']),
  repeatUntil: types.maybeNull(types.string),
  title: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  image: types.maybeNull(ImageModel),
  links: types.array(LinkModel),
  link: types.maybeNull(types.string),
});

export interface Event extends SnapshotOut<typeof EventModel> {}
