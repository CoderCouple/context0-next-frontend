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

export interface GetWorkflowsResponse {
  items: Workflow[];
}

export interface CreateWorkflowRequest {
  name: string;
  description: string;
}

export interface CreateWorkflowResponse {
  data: Workflow;
}
