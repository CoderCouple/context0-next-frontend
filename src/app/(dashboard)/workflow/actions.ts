"use server";

import { revalidatePath } from "next/cache";

import { Workflow } from "@/db/schema/workflow";
import { getWorkflowForUserUseCase } from "@/features/dashboard/workflow/use-case/workflow";
import { handleServerError } from "@/lib/error-handler";
import { rateLimitByKey } from "@/lib/limiter";
import { authenticatedAction } from "@/lib/safe-actions";
import { ActionResponse } from "@/types";

import { schema } from "./validation";

export const getUserWorkflowAction = authenticatedAction
  .createServerAction()
  .input(schema)
  .handler(
    async ({
      input: { name, description },
      ctx: { userId },
    }): Promise<ActionResponse<Workflow[] | null>> => {
      try {
        await rateLimitByKey({ key: `${userId}-get-user-workflow` });
        const data = await getWorkflowForUserUseCase(userId, {
          name,
          description,
        });
        revalidatePath("/workflow");
        return { success: true, data };
      } catch (err) {
        return handleServerError(err);
      }
    }
  );
