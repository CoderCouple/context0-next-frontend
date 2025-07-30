export enum PackId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  MEGA = "MEGA",
}

export interface CreditsPack {
  id: PackId;
  name: string;
  credits: number;
  price: number;
  priceId: string;
}

export const CreditsPack: CreditsPack[] = [
  {
    id: PackId.SMALL,
    name: "Small Pack",
    credits: 100,
    price: 9.99,
    priceId: "price_small_pack", // Replace with actual Stripe price ID
  },
  {
    id: PackId.MEDIUM,
    name: "Medium Pack",
    credits: 500,
    price: 39.99,
    priceId: "price_medium_pack", // Replace with actual Stripe price ID
  },
  {
    id: PackId.LARGE,
    name: "Large Pack",
    credits: 1000,
    price: 69.99,
    priceId: "price_large_pack", // Replace with actual Stripe price ID
  },
  {
    id: PackId.MEGA,
    name: "Mega Pack",
    credits: 5000,
    price: 299.99,
    priceId: "price_mega_pack", // Replace with actual Stripe price ID
  },
];

export function getCreditsPack(packId: PackId): CreditsPack | undefined {
  return CreditsPack.find((pack) => pack.id === packId);
}

export interface UserBalance {
  userId: string;
  credits: number;
}

export interface UserPurchase {
  id: string;
  userId: string;
  stripeId: string;
  packId: PackId;
  credits: number;
  amount: number;
  currency: string;
  date: Date;
}