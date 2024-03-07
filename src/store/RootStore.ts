import { Instance, onSnapshot, SnapshotOut, types } from 'mobx-state-tree';
// import STORAGE from '../services/storage';
import { FrontPageStore } from './FrontPageStore';
import { SettingsStore } from './SettingsStore';
import { NavigationStore } from './NavigationStore';
import { ContentPageStore } from './ContentPageStore';
import { AuthStore } from './AuthStore';
import { AppointmentsStore } from './AppointmentsStore';
import { EventsStore } from './EventsStore';
import { TestsStore } from './TestsStore';
import { GoalsStore } from './GoalsStore';
import { RulerStore } from './RulerStore';
import { UserInterestsStore } from './UserInterestsStore';

const RootStoreModel = types.model({
  auth: types.optional(AuthStore, { state: 'IDLE' }),
  ruler: types.optional(RulerStore, { open: false, paletteOpen: false }),
  settings: types.optional(SettingsStore, {
    state: 'NOT_FETCHED',
  }),
  navigation: types.optional(NavigationStore, {
    state: 'NOT_FETCHED',
  }),
  frontPage: types.optional(FrontPageStore, {
    state: 'NOT_FETCHED',
  }),
  contentPages: types.optional(ContentPageStore, {
    state: 'IDLE',
    feedbackState: 'IDLE',
  }),
  appointments: types.optional(AppointmentsStore, {
    appointmentsState: 'NOT_FETCHED',
    appointmentState: 'IDLE',
    userAppointmentsState: 'NOT_FETCHED',
  }),
  events: types.optional(EventsStore, {
    state: 'NOT_FETCHED',
  }),
  tests: types.optional(TestsStore, {
    categoriesState: 'NOT_FETCHED',
    exercisesState: 'NOT_FETCHED',
    testState: 'IDLE',
    testOutcomeState: 'IDLE',
    testsSummaryState: 'IDLE',
    feedbackState: 'IDLE',
  }),
  goals: types.optional(GoalsStore, {
    state: 'NOT_FETCHED',
    goalState: 'IDLE',
  }),
  userInterests: types.optional(UserInterestsStore, {
    state: 'NOT_FETCHED',
    userTagsState: 'IDLE',
  }),
});

export interface RootStore extends Instance<typeof RootStoreModel> {}

export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

// const storageState = STORAGE.read({ key: 'ROOT_STATE' });

// Get initial state from local storage (or initialize empty state)
// export const rootStore = RootStoreModel.create(RootStoreModel.is(storageState) ? storageState : {});
export const rootStore = RootStoreModel.create({});

// Update state in local storage on every snapshot
onSnapshot(rootStore, snapshot => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Snapshot:', snapshot);
  }
  // STORAGE.write({ key: 'ROOT_STATE', value: snapshot });
});
