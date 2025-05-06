"use server";

import { auth } from "@clerk/nextjs/server";

import { getWorkflowByIdApi } from "@/api/workflow-api";

export async function GetWorkflowByIdAction(workflowId: string) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return { success: false, message: "Unauthenticated" };
  }

  try {
    const baseResponse = await getWorkflowByIdApi(token, workflowId);
    const workflow = baseResponse.result;
    return { success: true, data: workflow };
  } catch (err: any) {
    return {
      success: false,
      message: err.customMessage || "Unexpected error",
    };
  }
}
