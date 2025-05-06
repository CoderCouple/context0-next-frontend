"use client";

import { useState } from "react";

import { ReactFlowProvider } from "@xyflow/react";

import { FlowValidationContextProvider } from "@/components/context/flow-validation-context";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Workflow, WorkflowStatus } from "@/types/workflow-type";

import FlowEditor from "./flow-editor";
import JSONEditor from "./json-editor";
import TaskMenu from "./task-menu";
import Topbar from "./topbar/topbar";

function Editor({ workflow }: { workflow: Workflow }) {
  const [view, setView] = useState<"editor" | "json" | "both">("editor");

  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <Topbar
            title="Workflow editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
            currentView={view}
            setView={setView}
          />

          <section className="flex h-full overflow-hidden">
            <TaskMenu />

            {view === "editor" && <FlowEditor workflow={workflow} />}
            {view === "json" && <JSONEditor data={workflow} />}

            {view === "both" && (
              <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full"
              >
                <ResizablePanel
                  defaultSize={60}
                  minSize={30}
                  className="overflow-auto border-r-2"
                >
                  <FlowEditor workflow={workflow} />
                </ResizablePanel>

                <ResizableHandle className="w-2 cursor-col-resize bg-border hover:bg-primary/20" />

                <ResizablePanel
                  defaultSize={40}
                  minSize={20}
                  className="overflow-auto"
                >
                  <JSONEditor data={workflow} />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}

export default Editor;
