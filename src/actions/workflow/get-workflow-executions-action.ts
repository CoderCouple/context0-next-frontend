"use server";

import { auth } from "@clerk/nextjs/server";

import { getWorkflowExecutionsApi } from "@/api/workflow-api";

export async function GetWorkflowExecutionsAction(workflowId: string) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("Unauthenticated");
  }

  const executions = await getWorkflowExecutionsApi(workflowId, userId, token);
  return executions.result;
}
