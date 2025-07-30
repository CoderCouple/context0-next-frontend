"use server";

import { auth } from "@clerk/nextjs/server";
import { deleteMemoryApi } from "@/api/memory-api";
import { revalidatePath } from "next/cache";

export async function DeleteMemoryAction(memoryId: string) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("DeleteMemoryAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    await deleteMemoryApi(memoryId, userId, token);
    
    // Revalidate the memory page to remove the deleted memory
    revalidatePath("/memory");
    
    return {
      success: true,
      message: "Memory deleted successfully",
    };
  } catch (error: any) {
    console.error("DeleteMemoryAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to delete memory",
    };
  }
}