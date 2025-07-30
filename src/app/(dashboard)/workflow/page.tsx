import CreateWorkflowDialog from "./_components/create-workflow-dialog";
import UserWorkflows from "./_components/user-workflows";

export default function Page() {
  return (
    <div className="m-6 flex h-full flex-1 flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>

      <div className="h-full py-6">
        <UserWorkflows />
      </div>
    </div>
  );
}
