"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { AppEdgeData } from "../../core/types";
import { getEdgeConfig } from "../../core/edge-registry";

export default function MemoryGraphEdge(props: EdgeProps) {
  const { setEdges } = useReactFlow();
  const edgeData = props.data as AppEdgeData;
  const edgeConfig = getEdgeConfig(edgeData.edgeType);
  
  // Get path based on edge type
  const getPath = () => {
    const pathProps = {
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      targetX: props.targetX,
      targetY: props.targetY,
      sourcePosition: props.sourcePosition,
      targetPosition: props.targetPosition,
    };
    
    switch (edgeConfig.defaultStyle.type) {
      case "straight":
        return getStraightPath(pathProps);
      case "step":
      case "smoothstep":
        return getSmoothStepPath({
          ...pathProps,
          borderRadius: 10,
        });
      case "bezier":
      default:
        return getBezierPath(pathProps);
    }
  };
  
  const [edgePath, labelX, labelY] = getPath();
  
  const handleDelete = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
  };
  
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      
      {edgeData.showLabel && edgeData.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
              fontSize: "10px",
              fontWeight: 500,
            }}
            className="px-2 py-0.5 bg-background/80 rounded border text-foreground/70"
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-4 h-4 rounded-full hover:bg-destructive hover:text-destructive-foreground opacity-0 hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}