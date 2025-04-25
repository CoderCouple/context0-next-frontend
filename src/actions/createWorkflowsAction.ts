"use server";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { createWorkflowApi } from "@/api/workflow-api";
import { AppError } from "@/lib/errors";
import {
  CreateWorkflowInput,
  createWorkflowSchema,
} from "@/schema/workflow-schema";

export async function createWorkflowAction(form: CreateWorkflowInput) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const parsed = createWorkflowSchema.safeParse(form);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  const validatedInput = parsed.data;

  try {
    const workflow = await createWorkflowApi(userId, validatedInput);
    redirect(`/workflow/editor/${workflow.data.id}`);
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "Unexpected error" };
  }
}
