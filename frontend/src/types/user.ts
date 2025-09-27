// user.ts — user-related DTOs and aggregates
import type { User } from './user.types';
import type { UserSubscription } from './user-suscription.types';

export interface UpdateUserSubscriptionRequest {
  tier: string;
  endDate: string;
}

export interface UserWithSubscription extends User {
  userSubscriptions: UserSubscription[];
  currentSubscription?: UserSubscription | null;
}

export interface UsersListResponse {
  users: Array<UserWithSubscription>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
