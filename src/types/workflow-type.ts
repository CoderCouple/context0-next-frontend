import { Edge, Node, ReactFlowJsonObject } from "@xyflow/react";
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

export type UpdateWorkflowRequest = {
  workflowId: string | null | undefined;
  userId?: string | null | undefined;
  name?: string | null | undefined;
  description?: string | null | undefined;
  definition?: ReactFlowJsonObject<Node, Edge> | null | undefined;
  executionPlan?: string | null | undefined;
  cron?: string | null | undefined;
  status?: WorkflowStatus | null | undefined;
  creditsCost?: string | null | undefined;
  lastRunAt?: string | null | undefined;
  lastRunId?: string | null | undefined;
  lastRunStatus?: string | null | undefined;
  nextRunAt?: string | null | undefined;
  createdBy?: string | null | undefined;
  updatedBy?: string | null | undefined;
  createdAt?: string | null | undefined;
  updatedAt?: string | null | undefined;
  isDeleted?: boolean | null | undefined;
};

export type FlowDefinition = {
  nodes: Node[];
  edges: Edge[];
  viewport?: { x: number; y: number; zoom: number };
};

export interface WorkflowExecution {
  id: string; // e.g., 'execution_<uuid>'
  workflowId: string;
  userId: string;
  trigger: WorkflowExecutionTrigger; // default: 'MANUAL'
  status: WorkflowExecutionStatus; // default: 'PENDING'
  creditsConsumed: string | null; // numeric in DB
  createdAt: string; // ISO timestamp
  startedAt: string | null;
  completedAt: string | null;
  createdBy: string;
  updatedBy: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface ExecutionPhase {
  id: string; // e.g. 'phase_<uuid>'
  userId: string;
  workflowExecutionId: string;
  status: ExecutionPhaseStatus; // default: 'CREATED'
  number: number; // sequence number of this phase
  node: string | null;
  name: string | null;
  startedAt: string | null;
  completedAt: string | null;
  inputs: string | null; // raw text or JSON string
  outputs: string | null;
  creditsConsumed: number | null;
  createdBy: string;
  updatedBy: string;
  updatedAt: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface WorkflowExecutionResponse {
  result: WorkflowExecution;
  statusCode: number;
  message: string;
  success: boolean;
}

export interface GetWorkflowExecutionsResponse {
  result: WorkflowExecution[];
  statusCode: number;
  message: string;
  success: boolean;
}

export interface GetWorkflowExecutionWithPhasesResponse {
  result: WorkflowExecutionWithPhases | null;
  statusCode: number;
  message: string;
  success: boolean;
}

export interface WorkflowExecutionWithPhases {
  id: string;
  userId: string;
  workflowId: string;
  trigger: string;
  status: string;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  creditsConsumed: string | null;
  phases: ExecutionPhase[];
}

export interface ExecutionLog {
  id: string; // e.g., "execlog_<uuid>"
  executionPhaseId: string;
  logLevel: string; // e.g., "INFO", "WARN", "ERROR"
  message: string;
  timestamp: string; // ISO 8601 timestamp
  createdBy: string;
  updatedBy: string;
  updatedAt: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface BaseResponse {
  result: any;
  success: boolean;
  statusCode: number;
  message: string;
}

export interface GetWorkflowPhaseDetailsResponse {
  result: WorkflowPhaseWithLogs | null;
  success: boolean;
  statusCode: number;
  message: string;
}

export interface WorkflowPhaseWithLogs {
  id: string;
  status: string;
  node: string;
  name: string;
  number: number;
  creditsConsumed: string | null;
  startedAt: string | null;
  completedAt: string | null;
  inputs: string | null;
  outputs: string | null;
  logs: ExecutionLog[];
}

export interface ExecutionLog {
  id: string;
  message: string;
  logLevel: string;
  timestamp: string;
}
