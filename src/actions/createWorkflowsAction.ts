"use server";

import { auth } from "@clerk/nextjs/server";

import { createWorkflowApi } from "@/api/workflow-api";
import {
  CreateWorkflowInput,
  createWorkflowSchema,
} from "@/schema/workflow-schema";
import { ActionResponse } from "@/types";
import { Workflow } from "@/types/workflow-type";

// ✅

export async function createWorkflowAction(
  form: CreateWorkflowInput
): Promise<ActionResponse<Workflow>> {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return {
      success: false,
      message: "Unauthenticated",
    };
  }

  const { success, data, error } = createWorkflowSchema.safeParse(form);
  if (!success) {
    return {
      success: false,
      message: error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  try {
    const baseResponse = await createWorkflowApi(token, data);
    const workflow = baseResponse.result;
    console.log("[CREATE WORKFLOW]", workflow); // 🛠 dem
    return {
      success: true,
      data: workflow,
    };
  } catch (err: any) {
    console.error("[CREATE WORKFLOW ERROR]", err); // 🛠
    return {
      success: false,
      message: err.customMessage || "Unexpected error",
    };
  }
}
