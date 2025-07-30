"use server";

import { auth } from "@clerk/nextjs/server";

import { getWorkflowPhaseDetailsApi } from "@/api/workflow-api";

export async function GetWorkflowPhaseDetailsAction(phaseId: string) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("Unauthenticated");
  }

  const response = await getWorkflowPhaseDetailsApi(phaseId, userId, token);
  return response.result;
}
