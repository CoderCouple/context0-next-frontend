import { z } from "zod";

import { connectionTypes } from "@/types/mcp-type";

export const addMCPServerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  connectionType: z.enum(connectionTypes, {
    required_error: "Connection Type must be selected",
  }),
  command: z
    .string()
    .optional()
    .refine((val) => !val || val.length > 0, {
      message: "Command must not be empty if provided",
    }),
  arguments: z.string().optional(),
  url: z.string().url("Invalid URL").optional(),
});

export type AddMCPServer = z.infer<typeof addMCPServerSchema>;
