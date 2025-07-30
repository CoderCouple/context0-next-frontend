"use server";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { executeWorkflowApi } from "@/api/workflow-api";
import { ActionResponse } from "@/types";
import { WorkflowExecutionResponse } from "@/types/workflow-type";

export async function ExecuteWorkflowAction({
  workflowId,
}: {
  workflowId: string;
}): Promise<ActionResponse<WorkflowExecutionResponse>> {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return {
      success: false,
      message: "Unauthenticated",
    };
  }

  try {
    console.log("[EXECUTE WORKFLOW REQUEST]", workflowId); // 🛠 dem
    const baseResponse = await executeWorkflowApi(workflowId, userId, token);
    const execution = baseResponse.result;
    console.log("[EXECUTE WORKFLOW]", execution); // 🛠 dem

    redirect(`/workflow/runs/${workflowId}/${execution.id}`);
  } catch (err: any) {
    console.error("[EXECUTE WORKFLOW ERROR]", err); // 🛠
    return {
      success: false,
      message: err.customMessage || "Unexpected error",
    };
  }
}
