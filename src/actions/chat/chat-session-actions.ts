"use server";

import { auth } from "@clerk/nextjs/server";
import { 
  createChatSessionApi, 
  getChatSessionsApi, 
  getChatSessionApi,
  sendChatMessageApi,
  deleteChatSessionApi,
  extractMemoriesFromChatApi,
  CreateSessionRequest,
  SendMessageRequest,
  ExtractMemoriesRequest
} from "@/api/chat-api";

export async function createSessionAction(data: CreateSessionRequest) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("createSessionAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    const response = await createChatSessionApi(data, userId, token);
    
    // The API might return either result or the data directly
    const sessionData = response.result || response;
    
    // Transform sessionId to id if needed
    if (sessionData && !sessionData.id && sessionData.sessionId) {
      sessionData.id = sessionData.sessionId;
    }
    
    return {
      success: true,
      data: sessionData,
    };
  } catch (error: any) {
    console.error("createSessionAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to create chat session",
    };
  }
}

export async function getSessionsAction() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("getSessionsAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    const response = await getChatSessionsApi(userId, token);
    
    return {
      success: true,
      data: response.result,
    };
  } catch (error: any) {
    console.error("getSessionsAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to get chat sessions",
    };
  }
}

export async function getSessionAction(sessionId: string) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("getSessionAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    console.log("getSessionAction: Fetching session", sessionId);
    const response = await getChatSessionApi(sessionId, token);
    console.log("getSessionAction: API response", response);
    
    return {
      success: true,
      data: response.result,
    };
  } catch (error: any) {
    console.error("getSessionAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to get chat session",
    };
  }
}

export async function sendMessageAction(data: SendMessageRequest) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("sendMessageAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    const response = await sendChatMessageApi(data, token);
    
    return {
      success: true,
      data: response.result,
    };
  } catch (error: any) {
    console.error("sendMessageAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to send message",
    };
  }
}

export async function deleteSessionAction(sessionId: string) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("deleteSessionAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    await deleteChatSessionApi(sessionId, token);
    
    return {
      success: true,
      message: "Chat session deleted successfully",
    };
  } catch (error: any) {
    console.error("deleteSessionAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to delete chat session",
    };
  }
}

export async function extractMemoriesAction(data: ExtractMemoriesRequest) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("extractMemoriesAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    const response = await extractMemoriesFromChatApi(data, token);
    
    return {
      success: true,
      data: response.result,
    };
  } catch (error: any) {
    console.error("extractMemoriesAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to extract memories",
    };
  }
}

export async function deleteAllSessionsAction(hardDelete: boolean = false) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    console.error("deleteAllSessionsAction: User not authenticated");
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    const { deleteAllChatSessionsApi } = await import("@/api/chat-api");
    const response = await deleteAllChatSessionsApi(token, hardDelete);
    
    return {
      success: true,
      data: response.result,
    };
  } catch (error: any) {
    console.error("deleteAllSessionsAction: API call failed", error);
    return {
      success: false,
      message: error.message || "Failed to delete all sessions",
    };
  }
}