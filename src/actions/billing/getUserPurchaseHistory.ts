"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserPurchaseHistoryApi } from "@/api/billing-api";

export async function GetUserPurchaseHistory() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("unauthenticated");
  }

  const response = await getUserPurchaseHistoryApi(token);
  return response.result;
}
