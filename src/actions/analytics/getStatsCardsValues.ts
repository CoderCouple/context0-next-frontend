"use server";

import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";
import { getStatsCardsValuesApi } from "@/api/analytics-api";

export async function GetStatsCardsValues(period: Period) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("GetStatsCardsValues: User not authenticated");
    return {
      workflowExecutions: 0,
      phaseExecutions: 0,
      creditsConsumed: 0,
    }; // Return default stats object
  }

  try {
    const response = await getStatsCardsValuesApi(period, token);
    return response.result || {
      workflowExecutions: 0,
      phaseExecutions: 0,
      creditsConsumed: 0,
    };
  } catch (error) {
    console.error("GetStatsCardsValues: API call failed", error);
    return {
      workflowExecutions: 0,
      phaseExecutions: 0,
      creditsConsumed: 0,
    }; // Return default stats object on error
  }
}
