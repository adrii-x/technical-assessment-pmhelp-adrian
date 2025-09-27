import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getPracticeAnalytics(doctorId: number) {
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
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    // Total patients seen (unique patients)
    const uniquePatients = await this.prisma.appointment.findMany({
      where: { doctorId, status: 'COMPLETED' },
      select: { patientId: true },
      distinct: ['patientId'],
    });

    // Total appointments this month
    const appointmentsThisMonth = await this.prisma.appointment.count({
      where: {
        doctorId,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    // Total appointments this year
    const appointmentsThisYear = await this.prisma.appointment.count({
      where: {
        doctorId,
        createdAt: { gte: startOfYear },
      },
    });

    // Recent appointments
    const recentAppointments = await this.prisma.appointment.findMany({
      where: { doctorId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: { select: { id: true, name: true, email: true } },
      },
    });

    // Medical records created this month
    const recordsThisMonth = await this.prisma.medicalRecord.count({
      where: {
        doctorId,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    return {
      totalUniquePatients: uniquePatients.length,
      appointmentsThisMonth,
      appointmentsThisYear,
      recordsThisMonth,
      recentAppointments,
      monthlyStats: {
        month: new Date().toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        }),
        appointments: appointmentsThisMonth,
        records: recordsThisMonth,
      },
    };
  }

  async getSystemAnalytics() {
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

    // Total users by role
    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    // Total appointments this month
    const appointmentsThisMonth = await this.prisma.appointment.count({
      where: {
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    // Total appointments overall
    const totalAppointments = await this.prisma.appointment.count();

    // Active subscriptions by tier
    const subscriptionStats = await this.prisma.userSubscription.groupBy({
      by: ['subscriptionId'],
      where: {
        active: true,
        expiresAt: { gte: new Date() },
      },
      _count: { subscriptionId: true },
    });

    // Get subscription details
    const subscriptions = await this.prisma.subscription.findMany();
    const subscriptionStatsWithDetails = subscriptionStats.map((stat) => {
      const subscription = subscriptions.find(
        (s) => s.id === stat.subscriptionId,
      );
      return {
        tier: subscription?.tier || 'Unknown',
        priceCent: subscription?.priceCents || 'Unknown',
        count: stat._count.subscriptionId,
      };
    });

    // Recent activity
    const recentAppointments = await this.prisma.appointment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: { select: { name: true } },
        doctor: { select: { name: true } },
      },
    });

    return {
      userStats: usersByRole.reduce(
        (acc, curr) => {
          acc[curr.role.toLowerCase()] = curr._count.role;
          return acc;
        },
        {} as Record<string, number>,
      ),
      appointmentStats: {
        thisMonth: appointmentsThisMonth,
        total: totalAppointments,
      },
      subscriptionStats: subscriptionStatsWithDetails,
      recentActivity: recentAppointments.map((apt) => ({
        id: apt.id,
        patient: apt.patient.name,
        doctor: apt.doctor.name,
        date: apt.date,
        status: apt.status,
        createdAt: apt.createdAt,
      })),
    };
  }
}
