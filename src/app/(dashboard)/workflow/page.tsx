import { Suspense } from "react";

import { AlertCircle, InboxIcon } from "lucide-react";

import { getWorkflowsAction } from "@/actions/getWorkflowsAction";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";

function page() {
  return (
    <div className="mt-4 flex h-full flex-1 flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

async function UserWorkflows() {
  const workflows = await getWorkflowsAction();

  if (!workflows) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first workflow" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <div
          key={workflow.id}
          className="rounded-lg border bg-card p-4 shadow-sm transition hover:shadow-md"
        >
          <h3 className="text-xl font-semibold">{workflow.name}</h3>
          <p className="text-sm text-muted-foreground">
            {workflow.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function UserWorkflowSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6].map((index) => {
        return <Skeleton key={index} className="h-32 w-full" />;
      })}
    </div>
  );
}

export default page;
