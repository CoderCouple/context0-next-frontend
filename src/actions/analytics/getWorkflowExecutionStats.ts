"use server";

import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";
import { getWorkflowExecutionStatsApi } from "@/api/analytics-api";

export async function GetWorkflowExecutionStats(period: Period) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("GetWorkflowExecutionStats: User not authenticated");
    return []; // Return empty array instead of throwing error
  }

  try {
    const response = await getWorkflowExecutionStatsApi(period, token);
    return Array.isArray(response.result) ? response.result : [];
  } catch (error) {
    console.error("GetWorkflowExecutionStats: API call failed", error);
    return []; // Return empty array on error
  }
}
