"use server";

import { auth } from "@clerk/nextjs/server";

import { getWorkflows } from "@/api/workflow-api";

export async function getWorkflowsAction() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("Unauthenticated");
  }

  console.log("userId", userId);
  console.log("token", token);
  const workflows = await getWorkflows(token);
  return workflows;
}
