import axiosClient from "@/api/axios";
import { AppError } from "@/lib/errors";

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
    const response = await axiosClient.post<{ result: QuestionResponse }>(
      "/ask",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
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
    const response = await axiosClient.post<{ result: ConversationResponse }>(
      "/conversation",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
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
    const response = await axiosClient.get(
      "/stats",
      {
        params: { user_id: userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
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