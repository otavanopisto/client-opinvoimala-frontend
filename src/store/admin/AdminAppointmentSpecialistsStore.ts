import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  applySnapshot,
} from 'mobx-state-tree';
import adminApi from '../../services/api/ApiAdmin';
import { SpecialistModel } from '../models';

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

export const AdminAppointmentSpecialistsStore = types
  .model({
    state: types.enumeration('State', States),
    data: types.array(SpecialistModel),
  })
  .views(self => ({
    get specialists() {
      return getSnapshot(self.data);
    },
  }))
  .actions(self => {
    let initialState = {};

    const fetchSpecialists = flow(function* (
      params: API.Admin.GetAppointmentSpecialists = {}
    ) {
      self.state = 'FETCHING';

      const response: API.GeneralResponse<API.Admin.RES.GetAppointmentSpecialists> =
        yield adminApi.getAppointmentSpecialists(params);

      if (response.kind === 'ok') {
        self.data = cast(response.data);
        self.state = 'FETCHED';
      } else {
        self.state = 'ERROR';
      }
    });

    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      reset: () => {
        applySnapshot(self, initialState);
      },
      fetchSpecialists,
    };
  });

export interface IAdminAppointmentSpecialistsStore
  extends Instance<typeof AdminAppointmentSpecialistsStore> {}
