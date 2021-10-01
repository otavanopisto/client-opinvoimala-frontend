import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  SnapshotOut,
  SnapshotIn,
} from 'mobx-state-tree';
import api from '../services/api/Api';
import { ImageModel } from './models';

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const SettingsModel = types.model({
  appName: types.string,
  logo: ImageModel,
  phone: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
});

export interface ISettingsModel extends Instance<typeof SettingsModel> {}
export interface Settings extends SnapshotOut<typeof SettingsModel> {}
export interface SettingsIn extends SnapshotIn<typeof SettingsModel> {}

export const SettingsStore = types
  .model({
    state: types.enumeration('State', States),

    data: types.maybe(SettingsModel),
  })
  .views(self => ({
    get settings() {
      return self.data ? getSnapshot(self.data) : undefined;
    },
  }))
  .actions(self => {
    const fetchSettings = flow(function* (params: API.GetSettings) {
      self.state = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetSettings> =
        yield api.getSettings(params);

      if (response.kind === 'ok') {
        self.data = cast(response.data);
        self.state = 'FETCHED';
      } else {
        self.state = 'ERROR';
      }
    });

    return {
      fetchSettings,
    };
  });

export interface ISettingsStore extends Instance<typeof SettingsStore> {}