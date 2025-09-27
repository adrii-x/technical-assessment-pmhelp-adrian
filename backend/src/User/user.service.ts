import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          userSubscriptions: {
            where: { active: true },
            include: { subscription: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map((user) => ({
        ...user,
        currentSubscription: user.userSubscriptions[0] || null,
        subscriptions: undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserSubscription(userId: number, dto: UpdateUserSubscriptionDto) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find target subscription
    const subscription = await this.prisma.subscription.findUnique({
      where: { tier: dto.tier },
    });
    if (!subscription) {
      throw new NotFoundException('Subscription tier not found');
    }

    // Deactivate current subscriptions
    await this.prisma.userSubscription.updateMany({
      where: { userId, active: true },
      data: { active: false },
    });

    // Create new subscription
    const newSubscription = await this.prisma.userSubscription.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        startedAt: new Date(),
        expiresAt: new Date(dto.endDate),
        active: true,
      },
      include: { subscription: true },
    });

    return {
      message: `User subscription updated to ${subscription.tier} plan`,
      subscription: newSubscription,
    };
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userSubscriptions: {
          where: { active: true },
          include: { subscription: true },
        },
        appointmentsAsPatient: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { doctor: { select: { name: true } } },
        },
        appointmentsAsDoctor: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { patient: { select: { name: true } } },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
