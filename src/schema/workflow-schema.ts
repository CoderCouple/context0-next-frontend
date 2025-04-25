import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().min(8, "Name must be at least 8 characters"),
  description: z.string().max(80, "Description too long").optional(),
});

export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
