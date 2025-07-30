import { z } from "zod";

export const CreateWorkflowSchema = z.object({
  name: z.string().min(8, "Name must be at least 8 characters"),
  description: z.string().max(80, "Description too long").optional(),
});

export const PositionSchema = z.object({ x: z.number(), y: z.number() });
export const NodeDataSchema = z.object({
  label: z.string(),
  input: z.record(z.any()),
  config: z.record(z.any()).optional(),
  depends_on: z.array(z.string()).optional(),
});

export const NodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: PositionSchema,
  data: NodeDataSchema,
});

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
});

export const MetadataSchema = z.object({
  trigger: z.string().optional(),
  created_by: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const WorkflowDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.number().optional(),
  metadata: MetadataSchema.optional(),
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});

export type CreateWorkflowInput = z.infer<typeof CreateWorkflowSchema>;
export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;
