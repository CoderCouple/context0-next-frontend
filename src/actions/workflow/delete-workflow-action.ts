"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { deleteWorkflowApi } from "@/api/workflow-api";
import { DeleteWorkflowRequest } from "@/types/workflow-type";

export async function DeleteWorkflowAction(
  deleteWorkflowRequest: DeleteWorkflowRequest
) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return {
      success: false,
      message: "Unauthenticated",
    };
  }

  try {
    const baseResponse = await deleteWorkflowApi(token, deleteWorkflowRequest);
    const workflow = baseResponse.result;
    console.log("[DELETE WORKFLOW]", workflow); // 🛠 dem
    revalidatePath("/workflow");
    return {
      success: true,
      data: workflow,
    };
  } catch (err: any) {
    console.error("[DELETE WORKFLOW ERROR]", err); // 🛠
    revalidatePath("/workflow");
    return {
      success: false,
      message: err.customMessage || "Unexpected error",
    };
  }
}
