import { Instance, types, SnapshotOut, SnapshotIn } from 'mobx-state-tree';
import { SpecialistModel } from './SpecialistModel';

export enum AppointmentStatus {
  available = 'available',
  booked = 'booked',
  cancelled = 'cancelled',
  hidden = 'hidden',
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
});

export interface IAppointmentModel extends Instance<typeof AppointmentModel> {}
export interface Appointment extends SnapshotOut<typeof AppointmentModel> {}
export interface AppointmentIn extends SnapshotIn<typeof AppointmentModel> {}
