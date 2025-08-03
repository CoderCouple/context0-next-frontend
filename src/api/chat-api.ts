import axiosClient from "@/api/axios";
import { AppError } from "@/lib/errors";
import { BaseResponse } from "@/types/index.d";
import { 
  ChatSession, 
  ChatSessionResponse, 
  CreateSessionRequest, 
  SendMessageRequest, 
  SendMessageResponse,
  ExtractMemoriesRequest,
  ExtractMemoriesResponse 
} from "@/types/chat";

// Re-export types from chat for backwards compatibility
export type { 
  CreateSessionRequest, 
  SendMessageRequest, 
  ExtractMemoriesRequest 
};

export interface QuestionRequest {
  question: string;
  user_id: string;
  session_id?: string;
  max_memories?: number;
  memory_types?: string[];
  include_meta_memories?: boolean;
  search_depth?: "semantic" | "hybrid" | "comprehensive";
}

export interface ConversationRequest {
  messages: Array<{ role: string; content: string }>;
  user_id: string;
  session_id?: string;
  max_memories?: number;
  conversation_context_window?: number;
}

export interface MemoryContext {
  memoryId: string;
  content: string;
  summary?: string;
  memoryType: string;
  relevanceScore: number;
  createdAt: string;
  tags: string[];
  source: string;
}

export interface QuestionResponse {
  question: string;
  answer: string;
  confidence: number;
  memories_found: number;
  memories_used: number;
  memory_contexts: MemoryContext[];
  search_strategy: string;
  processing_time_ms: number;
  suggestions: string[];
  metadata?: Record<string, any>;
}

export interface ConversationResponse {
  response: string;
  confidence: number;
  context_memories: MemoryContext[];
  conversation_context: Array<{ role: string; content: string }>;
  follow_up_suggestions: string[];
  processing_time_ms: number;
}

/**
 * Ask a question about memories
 */
export async function askQuestionApi(data: QuestionRequest, token: string) {
  try {
    const response = await axiosClient.post<BaseResponse<QuestionResponse>>(
      "/ask",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response as unknown as BaseResponse<QuestionResponse>;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Q&A API error: ${err.response.data?.message || err.message}`,
        "QA_API_ERROR"
      );
    }

    throw new AppError("Ask question failed", "API_FAILED");
  }
}

/**
 * Have a conversation with memory-based context
 */
export async function conversationApi(data: ConversationRequest, token: string) {
  try {
    const response = await axiosClient.post<BaseResponse<ConversationResponse>>(
      "/conversation",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response as unknown as BaseResponse<ConversationResponse>;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Conversation API error: ${err.response.data?.message || err.message}`,
        "CONVERSATION_API_ERROR"
      );
    }

    throw new AppError("Conversation failed", "API_FAILED");
  }
}

/**
 * Get Q&A statistics for a user
 */
export async function getQAStatsApi(userId: string, token: string) {
  try {
    const response = await axiosClient.get<BaseResponse<any>>(
      "/stats",
      {
        params: { user_id: userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response as unknown as BaseResponse<any>;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Q&A Stats API error: ${err.response.data?.message || err.message}`,
        "QA_STATS_ERROR"
      );
    }

    throw new AppError("Get Q&A stats failed", "API_FAILED");
  }
}

/**
 * Create a new chat session
 */
export async function createChatSessionApi(data: CreateSessionRequest, userId: string, token: string) {
  try {
    const response = await axiosClient.post<BaseResponse<ChatSession>>(
      "/chat/sessions",
      {
        ...data,
        user_id: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // The interceptor returns the data directly, not response.data
    return response as unknown as BaseResponse<ChatSession>;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Create chat session error: ${err.response.data?.message || err.response.data?.detail || err.message}`,
        "CREATE_CHAT_SESSION_ERROR"
      );
    }

    throw new AppError("Create chat session failed", "API_FAILED");
  }
}

/**
 * Get all chat sessions for a user
 */
export async function getChatSessionsApi(userId: string, token: string) {
  try {
    const response = await axiosClient.get<BaseResponse<ChatSession[]>>(
      "/chat/sessions",
      {
        params: { user_id: userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response as unknown as BaseResponse<ChatSession[]>;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Get chat sessions error: ${err.response.data?.message || err.response.data?.detail || err.message}`,
        "GET_CHAT_SESSIONS_ERROR"
      );
    }

    throw new AppError("Get chat sessions failed", "API_FAILED");
  }
}

/**
 * Get a specific chat session with messages
 */
export async function getChatSessionApi(sessionId: string, token: string) {
  try {
    const response = await axiosClient.get<BaseResponse<ChatSessionResponse>>(
      `/chat/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response as unknown as BaseResponse<ChatSessionResponse>;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Get chat session error: ${err.response.data?.message || err.response.data?.detail || err.message}`,
        "GET_CHAT_SESSION_ERROR"
      );
    }

    throw new AppError("Get chat session failed", "API_FAILED");
  }
}

/**
 * Send a message to a chat session
 */
export async function sendChatMessageApi(data: SendMessageRequest, token: string) {
  try {
    const response = await axiosClient.post<BaseResponse<SendMessageResponse>>(
      `/chat/sessions/${data.sessionId}/messages`,
      {
        content: data.message,
        extract_memories: true,
        use_memory_context: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response as unknown as BaseResponse<SendMessageResponse>;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Send message error: ${err.response.data?.message || err.response.data?.detail || err.message}`,
        "SEND_MESSAGE_ERROR"
      );
    }

    throw new AppError("Send message failed", "API_FAILED");
  }
}

/**
 * Delete a chat session
 */
export async function deleteChatSessionApi(sessionId: string, token: string) {
  try {
    const response = await axiosClient.delete<BaseResponse<void>>(
      `/chat/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response as unknown as BaseResponse<void>;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Delete chat session error: ${err.response.data?.message || err.response.data?.detail || err.message}`,
        "DELETE_CHAT_SESSION_ERROR"
      );
    }

    throw new AppError("Delete chat session failed", "API_FAILED");
  }
}

/**
 * Extract memories from a chat session
 */
export async function extractMemoriesFromChatApi(data: ExtractMemoriesRequest, token: string) {
  try {
    const response = await axiosClient.post<BaseResponse<ExtractMemoriesResponse>>(
      `/chat/sessions/${data.sessionId}/extract-memories`,
      {
        message_ids: data.messageIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response as unknown as BaseResponse<ExtractMemoriesResponse>;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Extract memories error: ${err.response.data?.message || err.response.data?.detail || err.message}`,
        "EXTRACT_MEMORIES_ERROR"
      );
    }

    throw new AppError("Extract memories failed", "API_FAILED");
  }
}

/**
 * Delete all chat sessions for a user (bulk delete)
 * @param hardDelete - If true, permanently deletes sessions. If false, soft deletes (default)
 */
export async function deleteAllChatSessionsApi(token: string, hardDelete: boolean = false) {
  try {
    const response = await axiosClient.delete<BaseResponse<{ deletedCount: number; deletedMessages?: number }>>(
      "/chat/sessions",
      {
        params: hardDelete ? { hard_delete: true } : undefined,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response as unknown as BaseResponse<{ deletedCount: number; deletedMessages?: number }>;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Delete all sessions error: ${err.response.data?.message || err.response.data?.detail || err.message}`,
        "DELETE_ALL_SESSIONS_ERROR"
      );
    }

    throw new AppError("Delete all sessions failed", "API_FAILED");
  }
}