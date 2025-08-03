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

  try {
    const response = await listMemoriesApi(userId, token);
    
    // The axios interceptor returns the data directly
    const memories = response.result || [];
    return Array.isArray(memories) ? memories : [];
  } catch (error) {
    console.error("ListMemoriesAction: API call failed", error);
    return [];
  }
}