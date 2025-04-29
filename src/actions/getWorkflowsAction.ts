"use server";

import { auth } from "@clerk/nextjs/server";

import { getWorkflowsApi } from "@/api/workflow-api";

export async function getWorkflowsAction() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("Unauthenticated");
  }

  const workflows = await getWorkflowsApi(token);
  return workflows.result;
}
