export const AppointmentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  reason?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}
