import { LucideProps } from "lucide-react";

import { AppNode } from "./app-node";
import { TaskParam, TaskType } from "./task";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
  description?: string;
  subTasks?: TaskType[];
};

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  CRON = "CRON",
}

export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string;
  definition: string | null;
  executionPlan: string | null;
  cron: string | null;
  status: WorkflowStatus;
  creditsCost: string | null;
  lastRunAt: string | null;
  lastRunId: string | null;
  lastRunStatus: string | null;
  nextRunAt: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

// ✅ When you GET workflows
export type GetWorkflowsResponse = {
  result: Workflow[];
  statusCode: number;
  message: string;
  success: boolean;
};

// ✅ When you CREATE a workflow
export type CreateWorkflowRequest = {
  name: string;
  description?: string;
};

// ✅ When you get the response of CREATE a workflow
export type WorkflowResponse = {
  result: Workflow;
  statusCode: number;
  message: string;
  success: boolean;
};

export type DeleteWorkflowRequest = {
  workflowId: string;
  isSoftDelete: boolean;
};
