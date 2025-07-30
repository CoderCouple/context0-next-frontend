"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { unpublishWorkflowApi } from "@/api/workflow-api";

export async function UnpublishWorkflowAction(id: string) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("Unauthenticated");
  }

  const response = await unpublishWorkflowApi(id, token);

  if (!response.success) {
    throw new Error(response.message || "Failed to unpublish workflow");
  }

  revalidatePath(`/workflow/editor/${id}`);
}
