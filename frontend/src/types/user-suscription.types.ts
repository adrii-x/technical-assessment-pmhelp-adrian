// user-subscription.types.ts
export interface UserSubscription {
  id: number;
  userId: number;
  subscriptionId: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}
