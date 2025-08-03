"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { createWorkflowApi } from "@/api/workflow-api";
import {
  CreateWorkflowInput,
  CreateWorkflowSchema,
} from "@/schema/workflow-schema";
import { ActionResponse } from "@/types";
import { Workflow } from "@/types/workflow-type";

// ✅

export async function CreateWorkflowAction(
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

  const { success, data, error } = CreateWorkflowSchema.safeParse(form);
  if (!success) {
    return {
      success: false,
      message: error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  try {
    const baseResponse = await createWorkflowApi(token, data);
    const workflow = baseResponse.result;
    revalidatePath("/workflow");
    return {
      success: true,
      data: workflow,
    };
  } catch (err: any) {
    console.error("[CREATE WORKFLOW ERROR]", err); // 🛠
    revalidatePath("/workflow");
    return {
      success: false,
      message: err.customMessage || "Unexpected error",
    };
  }
}
