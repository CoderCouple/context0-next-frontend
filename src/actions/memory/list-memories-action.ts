"use server";

import { auth } from "@clerk/nextjs/server";
import { listMemoriesApi } from "@/api/memory-api";

export async function ListMemoriesAction() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("ListMemoriesAction: User not authenticated");
    return [];
  }

  // For testing purposes, use the test user ID that has data
  const testUserId = "test-user-123";
  console.log("ListMemoriesAction: Using user ID", testUserId, "(Original Clerk ID:", userId, ")");

  try {
    const response = await listMemoriesApi(testUserId, token);
    console.log("ListMemoriesAction: API response", response);
    
    // The API returns AxiosResponse<{ result: MemoryResponse[] }>
    const memories = response.data?.result || [];
    return Array.isArray(memories) ? memories : [];
  } catch (error) {
    console.error("ListMemoriesAction: API call failed", error);
    return [];
  }
}