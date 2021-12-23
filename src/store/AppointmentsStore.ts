import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  SnapshotOut,
  SnapshotIn,
  applySnapshot,
} from 'mobx-state-tree';
import api from '../services/api/Api';
import { ANALYTICS_EVENT, sendAnalyticsEvent } from '../utils/analytics';
import { isFutureDate, isPastDate } from '../utils/date';
import { byStartTime } from '../utils/sort';

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

const AppointmentStates = [
  'IDLE' as const,
  'CANCELLING' as const,
  'BOOKING' as const,
  'ERROR' as const,
];

const SpecialistModel = types.model({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  role: types.maybeNull(types.string),
  roleId: types.maybeNull(types.number),
});
export interface Specialist extends SnapshotOut<typeof SpecialistModel> {}

const AppointmentModel = types.model({
  id: types.number,
  status: types.enumeration(['available', 'booked', 'cancelled', 'hidden']),
  startTime: types.string,
  endTime: types.string,
  meetingLink: types.string,
  appointmentSpecialist: types.maybeNull(SpecialistModel),
});
export interface IAppointmentModel extends Instance<typeof AppointmentModel> {}
export interface Appointment extends SnapshotOut<typeof AppointmentModel> {}
export interface AppointmentIn extends SnapshotIn<typeof AppointmentModel> {}

export const AppointmentsStore = types
  .model({
    appointmentsState: types.enumeration('State', States),
    appointmentState: types.enumeration('State', AppointmentStates),
    appointments: types.optional(types.array(AppointmentModel), []),

    userAppointmentsState: types.enumeration('State', States),
    userAppointments: types.optional(types.array(AppointmentModel), []),
  })
  .views(self => ({
    get allAppointments() {
      const appointments = getSnapshot(self.appointments);
      // Consider only appointments that have specialist and role set
      return [...appointments]
        .filter(({ appointmentSpecialist }) => !!appointmentSpecialist?.roleId)
        .sort(byStartTime);
    },

    get allUserAppointments() {
      const appointments = getSnapshot(self.userAppointments);
      return [...appointments].sort(byStartTime);
    },

    get upcomingAppointments() {
      return this.allUserAppointments.filter(({ endTime }) =>
        isFutureDate(endTime)
      );
    },

    get pastAppointments() {
      return this.allUserAppointments
        .filter(({ endTime }) => isPastDate(endTime))
        .reverse();
    },

    get roles() {
      const roles = this.allAppointments
        .map(({ appointmentSpecialist }) => ({
          id: appointmentSpecialist?.roleId ?? -1,
          role: appointmentSpecialist?.role ?? '',
        }))
        .filter(({ id, role }) => !!id && role?.length)
        .sort((a, b) => a.role.localeCompare(b.role));

      const uniqueRoles = new Map(roles.map(item => [item.id, item])).values();
      return Array.from(uniqueRoles);
    },

    appointmentsByRole(roleId?: number) {
      if (!roleId) return [];
      const appointments = getSnapshot(self.appointments);

      const roleMatch = ({ appointmentSpecialist }: Appointment) =>
        appointmentSpecialist?.roleId === roleId;

      return appointments.filter(roleMatch).sort(byStartTime);
    },
  }))
  .actions(self => {
    let initialState = {};

    const fetchAppointments = flow(function* (
      params: API.GetAppointments = {}
    ) {
      self.appointmentsState = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetAppointments> =
        yield api.getAppointments(params);

      if (response.kind === 'ok') {
        self.appointments = cast(response.data);
        self.appointmentsState = 'FETCHED';
      } else {
        self.appointmentsState = 'ERROR';
      }
    });

    const fetchUserAppointments = flow(function* (
      params: API.GetUserAppointments = {}
    ) {
      self.userAppointmentsState = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetUserAppointments> =
        yield api.getUserAppointments(params);

      if (response.kind === 'ok') {
        self.userAppointments = cast(response.data);
        self.userAppointmentsState = 'FETCHED';
      } else {
        self.userAppointmentsState = 'ERROR';
      }
    });

    const cancelAppointment = flow(function* (params: API.CancelAppointment) {
      self.appointmentState = 'CANCELLING';

      const response: API.GeneralResponse<API.RES.CancelAppointment> =
        yield api.cancelAppointment(params);

      if (response.kind === 'ok') {
        sendAnalyticsEvent(ANALYTICS_EVENT.APPOINTMENT_CANCELLED);
        const data = getSnapshot(self.userAppointments);

        self.userAppointments = cast(
          data?.filter(({ id }) => id !== params.id)
        );

        self.appointmentState = 'IDLE';
        return { success: true };
      } else {
        self.appointmentState = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const makeAppointment = flow(function* (params: API.MakeAppointment) {
      self.appointmentState = 'BOOKING';

      const response: API.GeneralResponse<API.RES.MakeAppointment> =
        yield api.makeAppointment(params);

      if (response.kind === 'ok') {
        sendAnalyticsEvent(ANALYTICS_EVENT.APPOINTMENT_BOOKED);

        // Update user appointments
        self.userAppointments = cast([
          ...self.userAppointments,
          response.data.data,
        ]);

        // Remove appointment from available appointments
        self.appointments = cast(
          self.appointments.filter(({ id }) => id !== params.id)
        );

        self.appointmentState = 'IDLE';
        return { success: true };
      } else {
        self.appointmentState = 'ERROR';
        return { success: false, error: response.data };
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
      fetchUserAppointments,
      cancelAppointment,
      makeAppointment,
    };
  });

export interface IAppointmentsStore
  extends Instance<typeof AppointmentsStore> {}
