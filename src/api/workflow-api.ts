"use client;";

// api/workflow-api.ts
import axiosClient from "@/api/axios";
import { AppError } from "@/lib/errors";
import {
  CreateWorkflowResponse,
  GetWorkflowsResponse,
} from "@/types/workflow-type";

// GET /api/v1/workflows
// Authorization: Bearer <JWT>
// This should internally filter by userId based on the JWT and return, no need to explicitly pass userId.
export async function getWorkflowsApi(
  token: string
): Promise<GetWorkflowsResponse> {
  try {
    const response = await axiosClient.get<unknown, GetWorkflowsResponse>(
      "/workflow",
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    // console.log("[AXIOS URL]:", response.config.baseURL, response.config.url);
    // console.log("[AXIOS DATA]:", response.data);

    return response;
  } catch (err: any) {
    //console.error("[AXIOS ERROR]:", err);
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Python API error: ${err.response.data?.message || err.message}`,
        "PYTHON_API_ERROR"
      );
    }
  }
  return {
    result: [],
    status_code: 500,
    message: "Get workflows failed",
    success: false,
  };
}

export async function createWorkflowApi(
  token: string,
  input: { name: string; description?: string }
): Promise<CreateWorkflowResponse> {
  try {
    const response = await axiosClient.post<unknown, CreateWorkflowResponse>(
      "/workflow", // url : API endpoint
      { ...input }, // 1st : Request body (JSON payload)
      {
        // 2nd : Headers, options, etc.
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    console.log("[AXIOS RESPONSE]:", response);
    return response;
  } catch (err: any) {
    console.error("[AXIOS ERROR]:", err);
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);
    if (err.response) {
      throw new AppError(
        `Python API error: ${err.response.data?.message || err.message}`,
        "PYTHON_API_ERROR"
      );
    }
    throw new AppError("Create workflow failed", "API_FAILED");
  }
}
