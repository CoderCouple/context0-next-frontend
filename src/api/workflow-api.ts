import { auth } from "@clerk/nextjs/server";

import { env } from "@/env/server";
import { AppError } from "@/lib/errors";
import { GetWorkflowsRequest } from "@/types/workflow-request";

import { GetWorkflowsResponse } from "../types/workflow-response";

export async function getWorkflowsFromAPI(userId: string) {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new AppError("Unauthenticated", "UNAUTHENTICATED");
  }

  const requestBody: GetWorkflowsRequest = { userId };

  let response: Response;
  try {
    response = await fetch(`${env.PYTHON_BACKEND_HOST}/api/workflows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
  } catch {
    throw new AppError("Failed to reach Python API", "PYTHON_API_CALL_FAILED");
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new AppError(`Python API error: ${errorText}`, "PYTHON_API_ERROR");
  }

  let json: GetWorkflowsResponse;
  try {
    json = await response.json();
  } catch {
    throw new AppError(
      "Invalid JSON from Python API",
      "PYTHON_API_INVALID_JSON"
    );
  }

  return json.data;
}

export async function createWorkflowInAPI(
  userId: string,
  input: { name: string; description: string }
) {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new AppError("Unauthenticated", "UNAUTHENTICATED");
  }

  const response = await fetch(
    `${env.PYTHON_BACKEND_HOST}/api/workflows/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, ...input }),
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new AppError(`Python API error: ${text}`, "PYTHON_API_ERROR");
  }

  const json = await response.json();
  return json.data;
}
