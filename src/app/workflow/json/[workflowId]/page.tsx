import { auth } from "@clerk/nextjs/server";

import { GetWorkflowByIdAction } from "@/actions/workflow/get-workflow-by-id-action";

import Editor from "../../_components/editor";

async function page({ params }: { params: { workflowId: string } }) {
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
    return <div>Workflow not found: {message}</div>;
  }

  //return <pre>{JSON.stringify(workflow, null, 2)}</pre>;
  //return <JSONEditor data={{ hello: "world", nested: { a: 1 } }} />;
  return <Editor workflow={workflow} />;
}

export default page;
