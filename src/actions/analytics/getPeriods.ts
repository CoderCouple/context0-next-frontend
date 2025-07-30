"use server";

import { auth } from "@clerk/nextjs/server";
import { getPeriodsApi } from "@/api/analytics-api";

export async function GetPeriods() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("GetPeriods: User not authenticated");
    return []; // Return empty array instead of error object
  }

  try {
    const response = await getPeriodsApi(token);
    return Array.isArray(response.result) ? response.result : [];
  } catch (error) {
    console.error("GetPeriods: API call failed", error);
    return []; // Return empty array on error
  }
}
