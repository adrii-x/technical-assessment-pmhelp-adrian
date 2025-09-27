import type { Appointment, AppointmentStatus } from './appointment.types';

export interface PracticeAnalytics {
  totalUniquePatients: number;
  appointmentsThisMonth: number;
  appointmentsThisYear: number;
  recordsThisMonth: number;
  recentAppointments: Appointment[];
  monthlyStats: {
    month: string;
    appointments: number;
    records: number;
  };
}

export interface SystemAnalytics {
  userStats: Record<string, number>;
  appointmentStats: {
    thisMonth: number;
    total: number;
  };
  subscriptionStats: Array<{
    tier: string;
    priceCent: number | string;
    count: number;
  }>;
  recentActivity: Array<{
    id: number;
    patient: string;
    doctor: string;
    date: string;
    status: AppointmentStatus;
    createdAt: string;
  }>;
}
