// File: _components/user-workflows.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, InboxIcon } from "lucide-react";

import { GetWorkflowsAction } from "@/actions/workflow/get-workflows-action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Workflow } from "@/types/workflow-type";

import CreateWorkflowDialog from "./create-workflow-dialog";
import WorkflowCard from "./workflow-card";

// File: _components/user-workflows.tsx

export default function UserWorkflows() {
  const {
    data: workflows,
    isLoading,
    isError,
  } = useQuery<Workflow[]>({
    queryKey: ["get-workflows"],
    queryFn: GetWorkflowsAction,
  });

  if (isLoading) {
    return <UserWorkflowSkeleton />;
  }

  if (isError || !workflows) {
    return (
      <Alert variant="destructive">
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
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}

function UserWorkflowSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
  );
}
