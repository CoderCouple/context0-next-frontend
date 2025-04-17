import { Suspense } from "react";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { waitFor } from "@/lib/utils";

function page() {
  return (
    <div className="m-6 flex h-full flex-1 flex-col p-4">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold"> Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
      </div>

      <div className="y-8 h-full">
        <Suspense fallback={<UserWorkflowSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

function UserWorkflowSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((index) => {
        return <Skeleton key={index} className="h-32 w-full" />;
      })}
    </div>
  );
}

async function UserWorkflows() {
  await waitFor(3000); // This will trigger Suspense to show the fallback
  const error = false;
  if (!error) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle> Error </AlertTitle>
        <AlertDescription className="text-md font-normal">
          Something went wrong. Please try again later!
        </AlertDescription>
      </Alert>
    );
  }
  return <div>Your workflows data is now available!</div>;
}

export default page;
