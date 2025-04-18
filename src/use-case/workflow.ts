import { createWorkflowInAPI, getWorkflowsFromAPI } from "@/api/workflow-api";
import { AppError } from "@/lib/errors";

interface FilterParams {
  name: string;
  description: string;
}

export async function getWorkflowUseCase(
  authenticatedUserId: string,
  workflowFilters: FilterParams
) {
  try {
    return await getWorkflowsFromAPI(authenticatedUserId);
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error("Unexpected error with filter", workflowFilters, err);

    throw new AppError("Failed to retrieve workflows", "WORKFLOW_FETCH_FAILED");
  }
}

export async function createWorkflowUseCase(
  authenticatedUserId: string,
  workflowInput: FilterParams
) {
  try {
    return await createWorkflowInAPI(authenticatedUserId, workflowInput);
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error("Create workflow failed", workflowInput, err);

    throw new AppError("Failed to create workflow", "WORKFLOW_CREATE_FAILED");
  }
}
