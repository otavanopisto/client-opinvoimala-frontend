import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  applySnapshot,
} from 'mobx-state-tree';
import adminApi from '../../services/api/ApiAdmin';
import { byStartTime } from '../../utils/sort';
import { Appointment, AppointmentModel, AppointmentStatus } from '../models';

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const AppointmentStates = [
  'IDLE' as const,
  'PROCESSING' as const,
  'ERROR' as const,
];

export const AdminAppointmentsStore = types
  .model({
    state: types.enumeration('State', States),
    appointmentState: types.enumeration('State', AppointmentStates),
    data: types.array(AppointmentModel),
  })
  .views(self => ({
    get appointments() {
      const appointments = getSnapshot(self.data);
      return [...appointments].sort(byStartTime);
    },
  }))
  .actions(self => {
    let initialState = {};

    const fetchAppointments = flow(function* (
      params: API.GetAppointments = {}
    ) {
      self.state = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetAppointments> =
        yield adminApi.getAppointments(params);

      if (response.kind === 'ok') {
        self.data = cast(response.data);
        self.state = 'FETCHED';
      } else {
        self.state = 'ERROR';
      }
    });

    const setStatus = (
      appointment: Appointment,
      status: AppointmentStatus
    ) => ({
      ...appointment,
      status,
    });

    const cancelAppointment = flow(function* (params: API.CancelAppointment) {
      self.appointmentState = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.CancelAppointment> =
        yield adminApi.cancelAppointment(params);

      if (response.kind === 'ok' && response.data.ok) {
        const appointments = getSnapshot(self.data);
        const updatedAppointments = appointments.map(appointment =>
          appointment.id === params.id
            ? setStatus(appointment, AppointmentStatus.cancelled)
            : appointment
        );
        self.data = cast(updatedAppointments);
        self.appointmentState = 'IDLE';
      } else {
        self.appointmentState = 'ERROR';
      }
    });

    const createAppointment = flow(function* (
      params: API.Admin.CreateAppointment
    ) {
      self.appointmentState = 'PROCESSING';

      const response: API.GeneralResponse<API.Admin.RES.CreateAppointment> =
        yield adminApi.createAppointment(params);

      if (response.kind === 'ok') {
        fetchAppointments();
        self.appointmentState = 'IDLE';
        return { success: true };
      } else {
        self.appointmentState = 'ERROR';
        return { success: false };
      }
    });

    const editAppointment = flow(function* (params: API.Admin.EditAppointment) {
      self.appointmentState = 'PROCESSING';

      const response: API.GeneralResponse<API.Admin.RES.EditAppointment> =
        yield adminApi.editAppointment(params);

      if (response.kind === 'ok') {
        fetchAppointments();
        self.appointmentState = 'IDLE';
        return { success: true };
      } else {
        self.appointmentState = 'ERROR';
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
      fetchAppointments,
      cancelAppointment,
      createAppointment,
      editAppointment,
    };
  });

export interface IAdminAppointmentsStore
  extends Instance<typeof AdminAppointmentsStore> {}
