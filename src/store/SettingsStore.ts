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
import { ImageModel, LinkModel, TagModel } from './models';

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const SettingsModel = types.model({
  appName: types.string,
  organisation: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  logo: types.maybeNull(ImageModel),
  phone: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  socialMedia: types.array(
    types.model({
      id: types.number,
      platform: types.maybeNull(types.string),
      label: types.maybeNull(types.string),
      url: types.maybeNull(types.string),
    })
  ),
  links: types.array(LinkModel),
  logos: types.array(ImageModel),
  scripts: types.maybeNull(
    types.model({
      cookiebotDomainGroupId: types.maybeNull(types.string),
      googleAnalyticsMeasurementId: types.maybeNull(types.string),
      giosgCompanyId: types.maybeNull(types.string),
    })
  ),
  maintenance: types.maybeNull(
    types.model({
      maintenance: types.maybeNull(types.boolean),
      domain: types.maybeNull(types.string),
      reason: types.maybeNull(types.string),
    })
  ),
  tags: types.array(TagModel),
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

    get isCookiebotActivated() {
      return self.data?.scripts?.cookiebotDomainGroupId
        ? !!self.data.scripts.cookiebotDomainGroupId
        : false;
    },

    get maintenance() {
      const { maintenance } = this.settings ?? {};
      const { domain, reason } = maintenance ?? {};

      const maintenanceModeOn = !!maintenance?.maintenance;
      const inMaintenanceDomain = domain
        ? window.location.hostname.includes(domain.toLowerCase())
        : true;

      if (maintenanceModeOn && inMaintenanceDomain) {
        return { domain, reason };
      }
      return undefined;
    },

    get tags() {
      const settings = self.data ? getSnapshot(self.data) : undefined;
      return settings?.tags ?? [];
    },
  }))
  .actions(self => {
    const fetchSettings = flow(function* (params: API.GetSettings = {}) {
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
