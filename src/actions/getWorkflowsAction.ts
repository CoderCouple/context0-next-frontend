"use server";

import { auth } from "@clerk/nextjs/server";

import { getWorkflowsApi } from "@/api/workflow-api";

export async function getWorkflowsAction() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  const workflow = await getWorkflowsApi();

  //revalidatePath("/workflow");

  return workflow;
}
