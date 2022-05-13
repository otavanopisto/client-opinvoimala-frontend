import { Instance, types, SnapshotOut, SnapshotIn } from 'mobx-state-tree';
import { SpecialistModel } from './SpecialistModel';

export enum AppointmentStatus {
  available = 'available',
  booked = 'booked',
  cancelled = 'cancelled',
  hidden = 'hidden',
}

export enum RepeatRule {
  once = 'once',
  daily = 'daily',
  weekly = 'weekly',
}

export enum RepeatScope {
  none = 'none',
  following = 'following',
  all = 'all',
}

export const AppointmentModel = types.model({
  id: types.number,
  status: types.enumeration<AppointmentStatus>(
    'AppointmentStatus',
    Object.values(AppointmentStatus)
  ),
  startTime: types.string,
  endTime: types.string,
  meetingLink: types.string,
  appointmentSpecialist: types.maybeNull(SpecialistModel),

  repeatRule: types.maybeNull(
    types.enumeration<RepeatRule>('RepeatRule', Object.values(RepeatRule))
  ),
  repeatUntil: types.maybeNull(types.string),
  repeatGroup: types.maybeNull(types.number),
});

export interface IAppointmentModel extends Instance<typeof AppointmentModel> {}
export interface Appointment extends SnapshotOut<typeof AppointmentModel> {}
export interface AppointmentIn extends SnapshotIn<typeof AppointmentModel> {}
