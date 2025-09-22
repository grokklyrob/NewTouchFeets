
export type UserTier = 'free' | 'paid';

export interface PricingPlan {
  name: string;
  price: number;
  generations: string;
  features: string[];
  isFeatured: boolean;
}
