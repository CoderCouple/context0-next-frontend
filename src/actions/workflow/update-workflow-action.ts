"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { updateWorkflowApi } from "@/api/workflow-api";
import { ActionResponse } from "@/types";
import { UpdateWorkflowRequest, Workflow } from "@/types/workflow-type";

export async function UpdateWorkflowAction(
  updateWorkflowRequest: UpdateWorkflowRequest
): Promise<ActionResponse<Workflow>> {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return {
      success: false,
      message: "Unauthenticated",
    };
  }

  try {
    const baseResponse = await updateWorkflowApi(token, updateWorkflowRequest);
    const workflow = baseResponse.result;
    revalidatePath("/workflow");
    return {
      success: true,
      data: workflow,
    };
  } catch (err: any) {
    console.error("[UPDATE WORKFLOW ERROR]", err); // 🛠
    revalidatePath("/workflow");
    return {
      success: false,
      message: err.customMessage || "Unexpected error",
    };
  }
}
