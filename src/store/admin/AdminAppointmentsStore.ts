import { DateTime } from 'luxon';
import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  applySnapshot,
} from 'mobx-state-tree';
import adminApi from '../../services/api/ApiAdmin';
import {
  formatDateTime,
  localizedDate,
  mergeDateAndTime,
} from '../../utils/date';
import { byStartTime } from '../../utils/sort';
import {
  Appointment,
  AppointmentModel,
  AppointmentStatus,
  RepeatRule,
} from '../models';

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

    getBookedAppointments() {
      const appointments = getSnapshot(self.data);
      return appointments.filter(
        ({ status }) => status === AppointmentStatus.booked
      );
    },

    getBookedAppointmentsInGroup(group: number) {
      const appointments = getSnapshot(self.data);
      return appointments.filter(
        ({ status, repeatGroup }) =>
          status === AppointmentStatus.booked && repeatGroup === group
      );
    },

    getOverlappingAppointments(
      isoStartDate: string,
      isoEndDate: string,
      repeatRule?: RepeatRule,
      isoRepeatUntil?: string,
      repeatGroup?: number | null
    ) {
      const appointments = getSnapshot(self.data);

      const start = localizedDate(isoStartDate);
      const end = localizedDate(isoEndDate);
      const repeatUntil = isoRepeatUntil
        ? localizedDate(isoRepeatUntil).endOf('day')
        : end.endOf('day');

      // Get start & end times for first appointment in a group
      const firstAppointmentTimes = (repeatGroup?: number | null) => {
        const group = appointments.filter(a => a.repeatGroup === repeatGroup);
        if (group.length) {
          const firstInGroup = group.sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
          )[0];
          return {
            start: mergeDateAndTime(localizedDate(firstInGroup.startTime), end),
            end: mergeDateAndTime(localizedDate(firstInGroup.endTime), end),
          };
        }
        return { start, end };
      };

      // Find all appointments that overlap with given start/end time
      const searchOverlappingTimes = (start: DateTime, end: DateTime) => {
        const list: string[] = [];
        appointments.forEach(appointment => {
          if (appointment.repeatGroup !== repeatGroup) {
            const startTime = localizedDate(appointment.startTime);
            const endTime = localizedDate(appointment.endTime);
            const startOverlaps = start >= startTime && start < endTime;
            const endOverlaps = end <= endTime && end > startTime;
            if (startOverlaps || endOverlaps) {
              const startString = formatDateTime(appointment.startTime);
              const endString = formatDateTime(appointment.endTime, {
                format: 'T',
              });
              const text = `${startString}\u2013${endString} (ID: ${appointment.id})`;
              list.push(text);
            }
          }
        });
        return list;
      };

      let overlapList: string[] = [];

      if (repeatRule === RepeatRule.once) {
        overlapList = searchOverlappingTimes(start, end);
      } else {
        let currentDate = firstAppointmentTimes(repeatGroup).start;
        let currentEndDate = firstAppointmentTimes(repeatGroup).end;
        while (currentDate <= repeatUntil) {
          overlapList = [
            ...overlapList,
            ...searchOverlappingTimes(currentDate, currentEndDate),
          ];
          switch (repeatRule) {
            case RepeatRule.daily:
              currentDate = currentDate.plus({ days: 1 });
              currentEndDate = mergeDateAndTime(currentDate, end);
              break;
            case RepeatRule.weekly:
              currentDate = currentDate.plus({ weeks: 1 });
              currentEndDate = mergeDateAndTime(currentDate, end);
              break;
            default:
              currentDate = repeatUntil;
          }
        }
      }

      return overlapList;
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
        const updatedAppointments = response.data;
        const updatedData = getSnapshot(self.data).map(appointment => {
          const updatedAppointment = updatedAppointments.find(
            ({ id }) => id === appointment.id
          );
          return updatedAppointment ?? appointment;
        });
        self.data = cast(updatedData);
        self.appointmentState = 'IDLE';
        return { success: true };
      } else {
        self.appointmentState = 'ERROR';
        return { success: false };
      }
    });

    const deleteAppointment = flow(function* (
      params: API.Admin.DeleteAppointment
    ) {
      self.appointmentState = 'PROCESSING';

      const response: API.GeneralResponse<API.Admin.RES.DeleteAppointment> =
        yield adminApi.deleteAppointment(params);

      if (response.kind === 'ok') {
        // Remaining appointments (in a same goup with the ones just deleted)
        // are sometimes updated as well (until date). Fetch all appointments to get up-to-date data.
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
      deleteAppointment,
    };
  });

export interface IAdminAppointmentsStore
  extends Instance<typeof AdminAppointmentsStore> {}
