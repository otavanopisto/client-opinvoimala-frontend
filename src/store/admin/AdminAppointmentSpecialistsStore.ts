import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  applySnapshot,
} from 'mobx-state-tree';
import adminApi from '../../services/api/ApiAdmin';
import { Specialist, SpecialistModel } from '../models';

const sortSpecialists = (a: Specialist, b: Specialist) => {
  return a.name?.localeCompare(b.name ?? '') ?? 0;
};

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const ProcessStates = [
  'IDLE' as const,
  'PROCESSING' as const,
  'ERROR' as const,
];

export const AdminAppointmentSpecialistsStore = types
  .model({
    state: types.enumeration('State', States),
    processState: types.enumeration('State', ProcessStates),
    data: types.array(SpecialistModel),
  })
  .views(self => ({
    get specialists() {
      return getSnapshot(self.data);
    },

    get specialistOptions() {
      return this.specialists.map(({ id, role, name }) => ({
        id: id ?? -1,
        label: `${role} ${name}`,
      }));
    },

    getSpecialist(id?: number | null) {
      const specialists = getSnapshot(self.data);
      const specialist = specialists.find(options => options.id === id);
      return specialist ?? specialist?.[0];
    },

    getSpecialistOption(id?: number | null) {
      const specialists = getSnapshot(self.data);
      const specialist = specialists.find(specialist => specialist.id === id);
      return {
        id: specialist?.id ?? -1,
        label: specialist ? `${specialist.role ?? ''} ${specialist.name}` : '',
      };
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
        self.data = cast(response.data.sort(sortSpecialists));
        self.state = 'FETCHED';
      } else {
        self.state = 'ERROR';
      }
    });

    const createAppointmentSpecialist = flow(function* (
      params: API.Admin.CreateAppointmentSpecialist
    ) {
      self.processState = 'PROCESSING';

      const response: API.GeneralResponse<API.Admin.RES.CreateAppointmentSpecialist> =
        yield adminApi.createAppointmentSpecialist(params);

      if (response.kind === 'ok') {
        self.data = cast([...self.data, response.data].sort(sortSpecialists));
        self.processState = 'IDLE';
        return { success: true };
      } else {
        self.processState = 'ERROR';
        return { success: false };
      }
    });

    const editAppointmentSpecialist = flow(function* (
      params: API.Admin.EditAppointmentSpecialist
    ) {
      self.processState = 'PROCESSING';

      const response: API.GeneralResponse<API.Admin.RES.EditAppointmentSpecialist> =
        yield adminApi.editAppointmentSpecialist(params);

      if (response.kind === 'ok') {
        const updatedItem = response.data;
        const updatedData = self.data
          .map(item => {
            if (item.id === updatedItem.id) return updatedItem;
            return item;
          })
          .sort(sortSpecialists);
        self.data = cast(updatedData);
        self.processState = 'IDLE';
        return { success: true };
      } else {
        self.processState = 'ERROR';
        return { success: false };
      }
    });

    const deleteAppointmentSpecialist = flow(function* (
      params: API.Admin.DeleteAppointmentSpecialist
    ) {
      self.processState = 'PROCESSING';

      const response: API.GeneralResponse<API.Admin.RES.DeleteAppointmentSpecialist> =
        yield adminApi.deleteAppointmentSpecialist(params);

      if (response.kind === 'ok') {
        const cleanedData = self.data.filter(item => item.id !== params.id);
        self.data = cast(cleanedData);
        self.processState = 'IDLE';
        return { success: true };
      } else {
        self.processState = 'ERROR';
        return { success: false };
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
      createAppointmentSpecialist,
      editAppointmentSpecialist,
      deleteAppointmentSpecialist,
    };
  });

export interface IAdminAppointmentSpecialistsStore
  extends Instance<typeof AdminAppointmentSpecialistsStore> {}
