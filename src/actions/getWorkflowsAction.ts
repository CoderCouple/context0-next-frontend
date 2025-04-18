"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { getWorkflowUseCase } from "@/use-case/workflow";

export async function getWorkflowsAction() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  // Empty filter passed for now — can be customized later
  const workflow = await getWorkflowUseCase(userId, {
    name: "",
    description: "",
  });

  // Invalidate the page that lists workflows
  revalidatePath("/workflow");

  return workflow;
}
