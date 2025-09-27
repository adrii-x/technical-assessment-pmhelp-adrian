import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getAvailableSubscriptions() {
    return this.prisma.subscription.findMany({
      orderBy: { priceCents: 'asc' },
    });
  }

  async getUserSubscription(userId: number) {
    const activeSubscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        active: true,
        expiresAt: { gte: new Date() },
      },
      include: { subscription: true },
    });

    if (!activeSubscription) {
      // Return default free subscription if no active subscription
      const freeSubscription = await this.prisma.subscription.findUnique({
        where: { tier: 'FREE' },
      });

      return {
        subscription: freeSubscription,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      };
    }

    return activeSubscription;
  }

  async upgradeSubscription(userId: number, dto: UpgradeSubscriptionDto) {
    // Find the target subscription
    const targetSubscription = await this.prisma.subscription.findUnique({
      where: { tier: dto.tier },
    });

    if (!targetSubscription) {
      throw new NotFoundException('Subscription plan not found');
    }

    // Deactivate current subscription
    await this.prisma.userSubscription.updateMany({
      where: { userId, active: true },
      data: { active: false },
    });

    // Create new subscription
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + targetSubscription.durationDays);

    const newSubscription = await this.prisma.userSubscription.create({
      data: {
        userId,
        subscriptionId: targetSubscription.id,
        startedAt: new Date(),
        expiresAt: endDate,
        active: true,
      },
      include: { subscription: true },
    });

    return {
      message: `Successfully upgraded to ${targetSubscription.tier} plan`,
      subscription: newSubscription,
    };
  }

  async cancelSubscription(userId: number) {
    const activeSubscription = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        active: true,
        expiresAt: { gte: new Date() },
      },
      include: { subscription: true },
    });

    if (!activeSubscription) {
      throw new BadRequestException('No active subscription to cancel');
    }

    // Don't allow canceling free subscription
    if (activeSubscription.subscription.tier === 'FREE') {
      throw new BadRequestException('Cannot cancel free subscription');
    }

    await this.prisma.userSubscription.update({
      where: { id: activeSubscription.id },
      data: {
        active: false,
        expiresAt: new Date(), // End subscription immediately
      },
    });

    // Automatically assign free subscription
    const freeSubscription = await this.prisma.subscription.findUnique({
      where: { tier: 'FREE' },
    });

    if (freeSubscription) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + freeSubscription.durationDays);

      await this.prisma.userSubscription.create({
        data: {
          userId,
          subscriptionId: freeSubscription.id,
          startedAt: new Date(),
          expiresAt: endDate,
          active: true,
        },
      });
    }

    return { message: 'Subscription cancelled successfully' };
  }

  async getSubscriptionUsage(userId: number) {
    const currentSubscription = await this.getUserSubscription(userId);

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

    const limit =
      currentSubscription.subscription?.allowedAppointmentsPerMonth || 2;

    return {
      subscription: currentSubscription,
      usage: {
        appointmentsUsed: appointmentsThisMonth,
        appointmentsLimit: limit === -1 ? 'Unlimited' : limit,
        remainingAppointments:
          limit === -1
            ? 'Unlimited'
            : Math.max(0, limit - appointmentsThisMonth),
      },
    };
  }
}
