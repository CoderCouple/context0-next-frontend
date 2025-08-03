"use client";

import { ReactNode } from "react";
import { useReactFlow } from "@xyflow/react";

import { cn } from "@/lib/utils";
import { NodeType, NodeTypeDefinition } from "../../core/types";

interface NodeCardProps {
  children: ReactNode;
  nodeId: string;
  isSelected: boolean;
  nodeType: NodeType;
  nodeConfig: NodeTypeDefinition;
}

function NodeCard({
  children,
  nodeId,
  isSelected,
  nodeType,
  nodeConfig,
}: NodeCardProps) {
  const { getNode, setCenter } = useReactFlow();
  const style = nodeConfig.defaultStyle;
  
  // Get shape classes
  const getShapeClasses = () => {
    switch (style.shape) {
      case "circle":
        return "rounded-full";
      case "rectangle":
        return "rounded-lg";
      case "diamond":
        return "transform rotate-45";
      case "hexagon":
        return "hexagon";
      case "ellipse":
        return "rounded-full";
      default:
        return "rounded-lg";
    }
  };
  
  // Handle double click to center
  const handleDoubleClick = () => {
    const node = getNode(nodeId);
    if (!node) return;
    
    const { position } = node;
    const width = node.width || 100;
    const height = node.height || 100;
    const x = position.x + width / 2;
    const y = position.y + height / 2;
    
    setCenter(x, y, {
      zoom: 1.5,
      duration: 500,
    });
  };
  
  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={cn(
        "relative flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
        "shadow-lg hover:shadow-xl",
        getShapeClasses(),
        isSelected && "ring-4 ring-offset-2 ring-offset-background",
        style.shape === "diamond" && "diamond-content"
      )}
      style={{
        backgroundColor: style.color?.background,
        borderColor: style.color?.border,
        borderWidth: "2px",
        borderStyle: "solid",
        width: typeof style.size === "number" ? style.size : style.size?.width,
        height: typeof style.size === "number" ? style.size : style.size?.height,
        color: style.color?.text || "#ffffff",
      }}
    >
      <div className={cn(
        "flex flex-col items-center justify-center w-full h-full",
        style.shape === "diamond" && "transform -rotate-45"
      )}>
        {children}
      </div>
    </div>
  );
}

export default NodeCard;