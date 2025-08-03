"use client";

import { ReactFlowProvider } from "@xyflow/react";
import GraphControls from "./graph-controls";

interface GraphControlsWrapperProps {
  layout: "force" | "hierarchical" | "radial";
  onLayoutChange: (layout: "force" | "hierarchical" | "radial") => void;
  showTagEdges?: boolean;
  onToggleTagEdges?: () => void;
}

export default function GraphControlsWrapper(props: GraphControlsWrapperProps) {
  return <GraphControls {...props} />;
}