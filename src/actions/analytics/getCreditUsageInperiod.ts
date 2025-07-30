"use server";

import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";
import { getCreditUsageInPeriodApi } from "@/api/analytics-api";

export async function GetCreditUsageInPeriod(period: Period) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("GetCreditUsageInPeriod: User not authenticated");
    return []; // Return empty array instead of throwing error
  }

  try {
    const response = await getCreditUsageInPeriodApi(period, token);
    return Array.isArray(response.result) ? response.result : [];
  } catch (error) {
    console.error("GetCreditUsageInPeriod: API call failed", error);
    return []; // Return empty array on error
  }
}
