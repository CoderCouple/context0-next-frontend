"use client";

import { LucideIcon } from "lucide-react";

import { NodeType } from "../../core/types";
import { cn } from "@/lib/utils";

interface NodeHeaderProps {
  nodeType: NodeType;
  nodeId: string;
  label: string;
  icon?: LucideIcon;
}

function NodeHeader({ nodeType, nodeId, label, icon: Icon }: NodeHeaderProps) {
  // For most nodes, show icon only
  // For memory nodes, show both icon and truncated label
  const showLabel = nodeType === NodeType.MEMORY || 
                    nodeType === NodeType.TAG ||
                    nodeType === NodeType.TEMPORAL;
  
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-2 text-center">
      {Icon && (
        <Icon 
          className={cn(
            "shrink-0",
            nodeType === NodeType.MEMORY ? "h-8 w-8" : "h-6 w-6"
          )} 
        />
      )}
      
      {showLabel && (
        <p className={cn(
          "font-medium px-1",
          nodeType === NodeType.MEMORY ? "text-xs line-clamp-2" : "text-[10px]",
          nodeType === NodeType.TAG && "truncate max-w-[90px]"
        )}>
          {label}
        </p>
      )}
    </div>
  );
}

export default NodeHeader;