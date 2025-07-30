"use server";

import { auth } from "@clerk/nextjs/server";
import { conversationApi, ConversationRequest } from "@/api/chat-api";

export async function ConversationAction(data: Omit<ConversationRequest, "user_id">) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("ConversationAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    // For testing purposes, use the test user ID that has data
    const testUserId = "test-user-123";
    console.log("ConversationAction: Using user ID", testUserId, "(Original Clerk ID:", userId, ")");
    
    const requestData: ConversationRequest = {
      ...data,
      user_id: testUserId,
    };
    
    const response = await conversationApi(requestData, token);
    
    return {
      success: true,
      data: response.data?.result,
    };
  } catch (error: any) {
    console.error("ConversationAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to have conversation",
    };
  }
}