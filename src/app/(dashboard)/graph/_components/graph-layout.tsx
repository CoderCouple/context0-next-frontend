"use client";

import { ReactNode } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import NodeMenu from "./node-menu";

interface GraphLayoutProps {
  children: ReactNode;
  showNodeMenu?: boolean;
}

export default function GraphLayout({ children, showNodeMenu = true }: GraphLayoutProps) {
  return (
    <ReactFlowProvider>
      <div className="flex h-full w-full overflow-hidden">
        {showNodeMenu && <NodeMenu />}
        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>
      </div>
    </ReactFlowProvider>
  );
}