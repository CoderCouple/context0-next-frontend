"use client;";

// api/workflow-api.ts
import axiosClient from "@/api/axios";
import { AppError } from "@/lib/errors";
import {
  CreateWorkflowResponse,
  GetWorkflowsResponse,
  Workflow,
} from "@/types/workflow-type";

// GET /api/v1/workflows
// Authorization: Bearer <JWT>
// This should internally filter by userId based on the JWT and return, no need to explicitly pass userId.
export async function getWorkflows(token: string): Promise<Workflow[]> {
  console.log("getWorkflows", token);
  try {
    const response = await axiosClient.get<GetWorkflowsResponse>("/workflow", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    console.log("[AXIOS URL]:", response.config.baseURL, response.config.url);
    console.log("[AXIOS DATA]:", response.data);

    return response.data.items;
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

    return [];
  }
}

export async function createWorkflowApi(
  userId: string,
  input: { name: string; description?: string }
): Promise<CreateWorkflowResponse> {
  try {
    const response = await axiosClient.post<CreateWorkflowResponse>(
      "/workflow/create",
      { userId, ...input }
    );
    return response.data;
  } catch (err: any) {
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
