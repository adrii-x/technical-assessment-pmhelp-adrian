// src/appointments/appointments.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  // Check if user can book appointment based on subscription
  async canUserBookAppointment(
    userId: number,
  ): Promise<{ canBook: boolean; message?: string }> {
    // Get user's active subscription - using correct field names from your schema
    const activeSubscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        active: true,
        expiresAt: { gte: new Date() },
      },
      include: { subscription: true },
    });

    if (!activeSubscription) {
      return { canBook: false, message: 'No active subscription found' };
    }

    // Count appointments this month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    );
    const appointmentsThisMonth = await this.prisma.appointment.count({
      where: {
        patientId: userId,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const limit = activeSubscription.subscription.allowedAppointmentsPerMonth;

    if (limit === null || limit === -1) {
      return { canBook: true };
    }

    if (appointmentsThisMonth >= limit) {
      return {
        canBook: false,
        message: `Monthly appointment limit reached (${limit}/${limit}). Upgrade subscription for more appointments.`,
      };
    }

    return { canBook: true };
  }

  async create(dto: CreateAppointmentDto, patientId: number) {
    // Check subscription limits
    const canBook = await this.canUserBookAppointment(patientId);
    if (!canBook.canBook) {
      throw new ForbiddenException(canBook.message);
    }

    // Verify availability slot exists and is not booked
    const availability = await this.prisma.availabilitySlot.findUnique({
      where: { id: dto.availabilityId },
    });

    if (!availability) {
      throw new NotFoundException('Availability slot not found');
    }

    if (availability.isBooked) {
      throw new BadRequestException('This time slot is already booked');
    }

    // Verify doctor exists
    const doctor = await this.prisma.user.findUnique({
      where: { id: dto.doctorId, role: UserRole.DOCTOR },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Create appointment and mark slot as booked
    const appointment = await this.prisma.appointment.create({
      data: {
        patientId,
        doctorId: dto.doctorId,
        availabilityId: dto.availabilityId,
        date: new Date(dto.date),
        reason: dto.reason,
        status: 'PENDING',
      },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, email: true } },
        availability: true,
      },
    });

    // Mark availability slot as booked
    await this.prisma.availabilitySlot.update({
      where: { id: dto.availabilityId },
      data: { isBooked: true },
    });

    return appointment;
  }

  async findAllForUser(userId: number, role: UserRole) {
    const where =
      role === UserRole.PATIENT ? { patientId: userId } : { doctorId: userId };

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, email: true } },
        availability: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findMyAppointments(patientId: number) {
    return this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: { select: { id: true, name: true, email: true } },
        availability: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async updateStatus(
    appointmentId: number,
    dto: UpdateAppointmentDto,
    userId: number,
    role: UserRole,
  ) {
    // Find appointment
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Check permissions
    if (role === UserRole.PATIENT && appointment.patientId !== userId) {
      throw new ForbiddenException(
        "Cannot modify other patient's appointments",
      );
    }

    if (role === UserRole.DOCTOR && appointment.doctorId !== userId) {
      throw new ForbiddenException("Cannot modify other doctor's appointments");
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: dto,
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, email: true } },
        availability: true,
      },
    });
  }
}
