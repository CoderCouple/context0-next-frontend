import { console } from "inspector";

import { AppError } from "@/lib/errors";

import { getWorkflowForUser } from "../db/workflow";

export async function getWorkflowForUserUseCase(
  authenticatedUserId: string,
  newGroup: { name: string; description: string }
) {
  try {
    return await getWorkflowForUser({ userId: authenticatedUserId });
  } catch (err) {
    // Optional: add context or rewrap
    if (err instanceof AppError) throw err;
    console.log(newGroup);

    // Unexpected error: wrap in AppError with context
    throw new AppError("Failed to retrieve workflows", "WORKFLOW_FETCH_FAILED");
  }
}
