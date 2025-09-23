export type UserTier = 'free' | 'paid';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: UserTier;
}

export interface PricingPlan {
  name:string;
  price: number;
  priceId: string; // Stripe Price ID
  generations: string;
  features: string[];
  isFeatured: boolean;
}