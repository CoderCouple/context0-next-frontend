"use server";

import { auth } from "@clerk/nextjs/server";
import { getAvailableCreditsApi } from "@/api/billing-api";

export async function GetAvailableCredits() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("unauthenticated");
  }

  const response = await getAvailableCreditsApi(token);
  return response.result?.credits ?? -1;
}
