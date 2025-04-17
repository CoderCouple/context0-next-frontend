import db from "@/db";
import { AppError } from "@/lib/errors";

export async function getWorkflowForUser({ userId }: { userId: string }) {
  try {
    const result = await db.query.workflow.findMany({
      where: (workflow, { eq }) => eq(workflow.userId, userId),
      orderBy: (workflow, { desc }) => [desc(workflow.createdAt)],
    });

    return result;
  } catch (err) {
    console.log(err);
    throw new AppError("Failed to fetch workflows", "WORKFLOW_DB_ERROR");
  }
}
