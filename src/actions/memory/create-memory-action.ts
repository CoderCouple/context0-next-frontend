"use server";

import { auth } from "@clerk/nextjs/server";
import { createMemoryApi, CreateMemoryRequest } from "@/api/memory-api";
import { revalidatePath } from "next/cache";

export async function CreateMemoryAction(data: Omit<CreateMemoryRequest, "user_id">) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("CreateMemoryAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    const requestData: CreateMemoryRequest = {
      ...data,
      user_id: userId,
    };
    
    const response = await createMemoryApi(requestData, token);
    
    // Revalidate the memory page to show the new memory
    revalidatePath("/memory");
    
    return {
      success: true,
      data: response.data?.result,
    };
  } catch (error: any) {
    console.error("CreateMemoryAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to create memory",
    };
  }
}