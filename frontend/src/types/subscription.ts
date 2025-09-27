export interface Subscription {
  id: number;
  tier: string;
  allowedAppointmentsPerMonth: number | null;
  priceCents: number;
  durationDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  id: number;
  userId: number;
  subscriptionId: number;
  startedAt: string;
  expiresAt: string | null;
  active: boolean;
  subscription: Subscription;
  createdAt: string;
  updatedAt: string;
}

export interface UpgradeSubscriptionRequest {
  tier: string;
}

export interface SubscriptionUsage {
  subscription: UserSubscription;
  usage: {
    appointmentsUsed: number;
    appointmentsLimit: number | string;
    remainingAppointments: number | string;
  };
}
