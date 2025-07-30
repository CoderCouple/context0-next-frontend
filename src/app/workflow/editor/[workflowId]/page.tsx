import { auth } from "@clerk/nextjs/server";

import { GetWorkflowByIdAction } from "@/actions/workflow/get-workflow-by-id-action";

import Editor from "../../_components/editor";
import ErrorFallback from "../../_components/error-fallback";

async function page({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = await params;
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) return <div>unauthenticated</div>;

  //waitFor(5000);

  const {
    success,
    data: workflow,
    message,
  } = await GetWorkflowByIdAction(workflowId);

  if (!success || !workflow) {
    return <ErrorFallback title="Workflow not found" message={message} />;
  }

  //return <pre>{JSON.stringify(workflow, null, 2)}</pre>;
  return <Editor workflow={workflow} />;
}

export default page;
