"use client";

import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

import { ExecuteWorkflowAction } from "@/actions/workflow/execute-workflow-action";
import { Button } from "@/components/ui/button";

export default function ExecuteBtn({ workflowId }: { workflowId: string }) {
  //  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: ExecuteWorkflowAction,
    onSuccess: () => {
      toast.success("Execution started", { id: "flow-execution" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "flow-execution" });
    },
  });
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        mutation.mutate({
          workflowId: workflowId,
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
}
