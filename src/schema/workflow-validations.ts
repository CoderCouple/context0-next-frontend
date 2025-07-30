import Ajv from "ajv";
import { toast } from "sonner";

import jsonSchema from "@/schema/workflow-definition.json";

import { WorkflowDefinitionSchema } from "./workflow-schema";

const ajv = new Ajv({ allErrors: true });
const validateAjv = ajv.compile(jsonSchema);

export function validateWorkflowWithAjvAndZod(definition: any) {
  const zodResult = WorkflowDefinitionSchema.safeParse(definition);
  const ajvValid = validateAjv(definition);

  const errors = {
    zod: zodResult.success ? [] : zodResult.error.errors,
    ajv: ajvValid ? [] : validateAjv.errors || [],
  };

  if (zodResult.success && ajvValid) {
    return { valid: true, errors: { zod: [], ajv: [] } };
  }

  toast.error("⚠️ Workflow has validation issues");
  console.warn("Zod Errors:", errors.zod);
  console.warn("AJV Errors:", errors.ajv);

  return { valid: false, errors };
}
