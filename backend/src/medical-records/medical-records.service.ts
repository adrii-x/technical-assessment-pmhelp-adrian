import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMedicalRecordDto, doctorId: number) {
    // Verify patient exists
    const patient = await this.prisma.user.findUnique({
      where: { id: dto.patientId, role: UserRole.PATIENT },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.medicalRecord.create({
      data: {
        patientId: dto.patientId,
        doctorId,
        recordType: dto.details,
        notes: dto.diagnosis,
        attachments: dto.treatment,
      },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findMyRecords(patientId: number) {
    return this.prisma.medicalRecord.findMany({
      where: { patientId },
      include: {
        doctor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPatientRecords(
    patientId: number,
    doctorId: number,
    userRole: UserRole,
  ) {
    // Only doctors and admins can access patient records
    if (userRole === UserRole.PATIENT) {
      throw new ForbiddenException(
        "Patients cannot access other patients' records",
      );
    }

    // Verify patient exists
    const patient = await this.prisma.user.findUnique({
      where: { id: patientId, role: UserRole.PATIENT },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const where =
      userRole === UserRole.DOCTOR
        ? { patientId, doctorId } // Doctors can only see records they created
        : { patientId }; // Admins can see all records

    return this.prisma.medicalRecord.findMany({
      where,
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(userId: number, role: UserRole) {
    if (role === UserRole.PATIENT) {
      return this.findMyRecords(userId);
    }

    const where = role === UserRole.DOCTOR ? { doctorId: userId } : {}; // Admin sees all

    return this.prisma.medicalRecord.findMany({
      where,
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
