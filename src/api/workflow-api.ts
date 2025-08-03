"use client;";

import axiosClient from "@/api/axios";
import { AppError } from "@/lib/errors";
import {
  BaseResponse,
  DeleteWorkflowRequest,
  GetWorkflowExecutionWithPhasesResponse,
  GetWorkflowExecutionsResponse,
  GetWorkflowPhaseDetailsResponse,
  GetWorkflowsResponse,
  UpdateWorkflowRequest,
  WorkflowExecutionResponse,
  WorkflowResponse,
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
    statusCode: 500,
    message: "Get workflows failed",
    success: false,
  };
}

export async function getWorkflowByIdApi(
  token: string,
  workflowId: string
): Promise<WorkflowResponse> {
  try {
    const response = await axiosClient.get<unknown, WorkflowResponse>(
      `/workflow/${workflowId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (err: any) {
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Python API error: ${err.response.data?.message || err.message}`,
        "PYTHON_API_ERROR"
      );
    }

    throw new AppError("Get workflow failed", "API_FAILED");
  }
}

export async function createWorkflowApi(
  token: string,
  input: { name: string; description?: string }
): Promise<WorkflowResponse> {
  try {
    const response = await axiosClient.post<unknown, WorkflowResponse>(
      "/workflow", // url : API endpoint
      { ...input }, // 1st : Request body (JSON payload)
      {
        // 2nd : Headers, options, etc.
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
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

export async function deleteWorkflowApi(
  token: string,
  input: DeleteWorkflowRequest
): Promise<WorkflowResponse> {
  try {
    const response = await axiosClient.delete<unknown, WorkflowResponse>(
      "/workflow",
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        data: {
          workflow_id: input.workflowId,
          is_soft_delete: input.isSoftDelete,
        },
      }
    );

    return response;
  } catch (err: any) {
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Python API error: ${err.response.data?.message || err.message}`,
        "PYTHON_API_ERROR"
      );
    }

    throw new AppError("Delete workflow failed", "API_FAILED");
  }
}

export async function updateWorkflowApi(
  token: string,
  input: UpdateWorkflowRequest
): Promise<WorkflowResponse> {
  try {
    const response = await axiosClient.put<
      UpdateWorkflowRequest,
      WorkflowResponse
    >(
      "/workflow", // url : API endpoint
      { ...input }, // 1st : Request body (JSON payload)
      {
        // 2nd : Headers, options, etc.
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
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

export async function executeWorkflowApi(
  workflowId: string,
  userId: string,
  token: string
): Promise<WorkflowExecutionResponse> {
  try {
    const response = await axiosClient.get<unknown, WorkflowExecutionResponse>(
      `/workflow/${workflowId}/execute`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return response;
  } catch (err: any) {
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
    result: {} as WorkflowExecutionResponse["result"],
    statusCode: 500,
    message: "Get workflow executions failed",
    success: false,
  };
}

export async function getWorkflowExecutionsApi(
  workflowId: string,
  userId: string,
  token: string
): Promise<GetWorkflowExecutionsResponse> {
  try {
    const response = await axiosClient.get<
      unknown,
      GetWorkflowExecutionsResponse
    >(`/workflow/${workflowId}/executions`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response;
  } catch (err: any) {
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
    statusCode: 500,
    message: "Get workflow executions failed",
    success: false,
  };
}

export async function getWorkflowExecutionWithPhasesApi(
  executionId: string,
  token: string
): Promise<GetWorkflowExecutionWithPhasesResponse> {
  try {
    const response = await axiosClient.get<
      unknown,
      GetWorkflowExecutionWithPhasesResponse
    >(`/execution/${executionId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response;
  } catch (err: any) {
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
    result: null,
    statusCode: 500,
    message: "Get execution with phases failed",
    success: false,
  };
}

export async function publishWorkflowApi(
  workflowId: string,
  flowDefinition: string,
  token: string
): Promise<BaseResponse> {
  try {
    const response = await axiosClient.post<unknown, BaseResponse>(
      `/workflow/${workflowId}/publish`,
      { definition: flowDefinition },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (err: any) {
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
    result: null,
    success: false,
    statusCode: 500,
    message: "Publish workflow failed",
  };
}

export async function unpublishWorkflowApi(
  workflowId: string,
  token: string
): Promise<BaseResponse> {
  try {
    const response = await axiosClient.post<unknown, BaseResponse>(
      `/workflow/${workflowId}/unpublish`,
      {},
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return response;
  } catch (err: any) {
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
    result: null,
    success: false,
    statusCode: 500,
    message: "Unpublish workflow failed",
  };
}

export async function getWorkflowPhaseDetailsApi(
  phaseId: string,
  userId: string,
  token: string
): Promise<GetWorkflowPhaseDetailsResponse> {
  try {
    const response = await axiosClient.get<
      unknown,
      GetWorkflowPhaseDetailsResponse
    >(`/phase/${phaseId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response;
  } catch (err: any) {
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
    result: null,
    statusCode: 500,
    message: "Get workflow phase details failed",
    success: false,
  };
}
