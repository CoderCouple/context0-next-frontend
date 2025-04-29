export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  definition: string | null;
  execution_plan: string | null;
  cron: string | null;
  status: WorkflowStatus;
  credits_cost: string | null;
  last_run_at: string | null;
  last_run_id: string | null;
  last_run_status: string | null;
  next_run_at: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// ✅ When you GET workflows

export type GetWorkflowsResponse = {
  result: Workflow[]; // 👈 inside result
  status_code: number;
  message: string;
  success: boolean;
};

// ✅ When you CREATE a workflow
export type CreateWorkflowRequest = {
  name: string;
  description?: string; // make description optional here (backend allows it)
};

// ✅ After axios interceptor, you get Workflow directly
export type CreateWorkflowResponse = {
  result: Workflow;
  status_code: number;
  message: string;
  success: boolean;
};
