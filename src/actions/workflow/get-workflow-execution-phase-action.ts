"use server";

import { auth } from "@clerk/nextjs/server";

import { getWorkflowExecutionWithPhasesApi } from "@/api/workflow-api";

export async function GetWorkflowExecutionWithPhasesAction(
  executionId: string
) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("Unauthenticated");
  }

  const response = await getWorkflowExecutionWithPhasesApi(executionId, token);
  return response.result;
}
