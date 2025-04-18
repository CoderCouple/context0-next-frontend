"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schema/workflow-schema";
import { createWorkflowUseCase } from "@/use-case/workflow";

export async function createWorkflowAction(form: createWorkflowSchemaType) {
  const parsed = createWorkflowSchema.safeParse(form);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const result = await createWorkflowUseCase(userId, {
    ...parsed.data,
    description: parsed.data.description || "", // Ensure description is never undefined
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  // ✅ Revalidate after mutation
  revalidatePath("/workflow");

  // ✅ Redirect to the editor
  // redirect(`/workflow/editor/${result.id}`);
}
