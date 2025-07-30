"use server";

import { auth } from "@clerk/nextjs/server";
import { askQuestionApi, QuestionRequest } from "@/api/chat-api";

export async function AskQuestionAction(data: Omit<QuestionRequest, "user_id">) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("AskQuestionAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    // For testing purposes, use the test user ID that has data
    const testUserId = "test-user-123";
    console.log("AskQuestionAction: Using user ID", testUserId, "(Original Clerk ID:", userId, ")");
    
    const requestData: QuestionRequest = {
      ...data,
      user_id: testUserId,
    };
    
    const response = await askQuestionApi(requestData, token);
    
    return {
      success: true,
      data: response.data?.result,
    };
  } catch (error: any) {
    console.error("AskQuestionAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to ask question",
    };
  }
}