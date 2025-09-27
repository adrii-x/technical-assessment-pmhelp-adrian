// medicalRecord.ts
import type { User } from './user.types';

export interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number | null;
  recordType: string | null;
  notes: string | null;
  attachments: Record<string, unknown> | null;
  patient: Pick<User, 'id' | 'name' | 'email'>;
  doctor: Pick<User, 'id' | 'name' | 'email'> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordRequest {
  patientId: number;
  details: string;
  diagnosis?: string;
  treatment?: string;
}
