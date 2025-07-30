"use server";

import { PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { purchaseCreditsApi } from "@/api/billing-api";

export async function PurchaseCredits(packId: PackId) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("unauthenticated");
  }

  const response = await purchaseCreditsApi(packId, token);
  
  if (!response.result?.checkoutUrl) {
    throw new Error("Cannot create checkout session");
  }

  redirect(response.result.checkoutUrl);
}
