import { GlobeIcon, LucideProps } from "lucide-react";

import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow-type";

export const LaunchBrowserHeadlessTask = {
  type: TaskType.LAUNCH_BROWSER_HEADLESS,
  label: "Launch broswer",
  icon: (props: LucideProps) => (
    <GlobeIcon style={{ color: "#ec4899" }} className="h-5 w-5" {...props} />
  ),
  isEntryPoint: true,
  credits: 5,
  description: "Launch a browser and navigate to a website",
  inputs: [
    {
      name: "Website Url",
      type: TaskParamType.STRING,
      helperText: "eg: https://www.google.com",
      required: true,
      hideHandle: true,
    },
  ] as const,
  outputs: [
    { name: "Web page", type: TaskParamType.BROWSER_INSTANCE },
  ] as const,
} satisfies WorkflowTask;
