import axiosClient from "@/api/axios";
import { AppError } from "@/lib/errors";

export interface MemoryResponse {
  id: string;
  cid: string;
  input: string;
  summary?: string;
  tags: string[];
  scope: string;
  memoryType: string;
  confidence: number;
  createdAt: string;
  updatedAt?: string;
  lastAccessed?: string;
  accessCount: number;
  isDeleted: boolean;
  meta: Record<string, any>;
}

export interface CreateMemoryRequest {
  user_id: string;
  session_id: string;
  text: string;
  memory_type?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  scope?: string;
}

export interface UpdateMemoryRequest {
  text?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  scope?: string;
}

/**
 * Get all memories for the authenticated user
 */
export async function listMemoriesApi(userId: string, token: string) {
  try {
    const response = await axiosClient.get<{ result: MemoryResponse[] }>(
      "/memories",
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
        `Memory API error: ${err.response.data?.message || err.message}`,
        "MEMORY_API_ERROR"
      );
    }

    throw new AppError("List memories failed", "API_FAILED");
  }
}

/**
 * Get a specific memory by ID
 */
export async function getMemoryApi(memoryId: string, userId: string, token: string) {
  try {
    const response = await axiosClient.get<{ result: MemoryResponse }>(
      `/memories/${memoryId}`,
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
        `Memory API error: ${err.response.data?.message || err.message}`,
        "MEMORY_API_ERROR"
      );
    }

    throw new AppError("Get memory failed", "API_FAILED");
  }
}

/**
 * Create a new memory
 */
export async function createMemoryApi(data: CreateMemoryRequest, token: string) {
  try {
    const response = await axiosClient.post<{ result: any }>(
      "/memories",
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
        `Memory API error: ${err.response.data?.message || err.message}`,
        "MEMORY_API_ERROR"
      );
    }

    throw new AppError("Create memory failed", "API_FAILED");
  }
}

/**
 * Update an existing memory
 */
export async function updateMemoryApi(
  memoryId: string,
  data: UpdateMemoryRequest,
  token: string
) {
  try {
    const response = await axiosClient.put<{ result: any }>(
      `/memories/${memoryId}`,
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
        `Memory API error: ${err.response.data?.message || err.message}`,
        "MEMORY_API_ERROR"
      );
    }

    throw new AppError("Update memory failed", "API_FAILED");
  }
}

/**
 * Delete a memory
 */
export async function deleteMemoryApi(memoryId: string, userId: string, token: string) {
  try {
    const response = await axiosClient.delete(`/memories/${memoryId}`, {
      params: { user_id: userId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (err: any) {
    const url = err.config?.baseURL && err.config?.url 
      ? err.config.baseURL + err.config.url 
      : null;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Memory API error: ${err.response.data?.message || err.message}`,
        "MEMORY_API_ERROR"
      );
    }

    throw new AppError("Delete memory failed", "API_FAILED");
  }
}

/**
 * Search memories
 */
export async function searchMemoriesApi(query: string, userId: string, token: string) {
  try {
    const response = await axiosClient.post<{ result: any }>(
      "/memories/search",
      {
        user_id: userId,
        query: query,
      },
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
        `Memory search API error: ${err.response.data?.message || err.message}`,
        "MEMORY_SEARCH_ERROR"
      );
    }

    throw new AppError("Search memories failed", "API_FAILED");
  }
}