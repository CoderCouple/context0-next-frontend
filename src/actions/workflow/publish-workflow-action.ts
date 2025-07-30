"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { publishWorkflowApi } from "@/api/workflow-api";

export async function PublishWorkflowAction({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    throw new Error("Unauthenticated");
  }

  const response = await publishWorkflowApi(id, flowDefinition, token);

  if (!response.success) {
    throw new Error(response.message || "Failed to publish workflow");
  }

  revalidatePath(`/workflow/editor/${id}`);
}
