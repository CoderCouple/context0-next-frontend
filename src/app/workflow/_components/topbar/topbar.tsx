"use client";

import { useRouter } from "next/navigation";

import { ChevronLeftIcon } from "lucide-react";

import NavigationTabs from "@/app/workflow/_components/topbar/NavigationTabs";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
  isPublished?: boolean;
  currentView: "editor" | "json" | "both";
  setView: (view: "editor" | "json" | "both") => void;
}

export default function Topbar({
  title,
  subtitle,
  workflowId,
  // hideButtons = false,
  // isPublished = false,
  currentView,
  setView,
}: Props) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 flex h-[60px] w-full border-separate justify-between border-b-2 bg-background p-2">
      <div className="flex flex-1 gap-1">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="truncate text-ellipsis font-bold">{title}</p>
          {subtitle && (
            <p className="truncate text-ellipsis text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs currentView={currentView} setView={setView} />
      <div className="flex flex-1 justify-end gap-1">
        {/* {hideButtons === false && (
          <>
            <ExecuteBtn workflowId={workflowId} />
            {isPublished && <UnpublishBtn workflowId={workflowId} />}
            {!isPublished && (
              <>
                <SaveBtn workflowId={workflowId} />
                <PublishBtn workflowId={workflowId} />
              </>
            )}
          </>
        )} */}
      </div>
    </header>
  );
}
