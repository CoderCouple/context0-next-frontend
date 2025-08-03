"use client";

import { memo } from "react";
import { NodeProps, Handle, Position } from "@xyflow/react";
import { useTheme } from "next-themes";

import NodeCard from "./node-card";
import NodeHeader from "./node-header";
import NodeContent from "./node-content";
import { NodeRegistry } from "../../core/node-registry";
import { AppNodeData } from "../../core/types";

// Single node component that renders differently based on node type
const MemoryGraphNode = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const nodeConfig = NodeRegistry[nodeData.nodeType];
  const { resolvedTheme } = useTheme();
  
  const isDark = resolvedTheme === "dark";
  
  return (
    <NodeCard 
      nodeId={props.id} 
      isSelected={!!props.selected}
      nodeType={nodeData.nodeType}
      nodeConfig={nodeConfig}
    >
      {/* Invisible handles for connections */}
      <Handle
        type="source"
        position={Position.Right}
        className="opacity-0 w-2 h-2"
        style={{ background: "transparent" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="opacity-0 w-2 h-2"
        style={{ background: "transparent" }}
      />
      
      <NodeHeader 
        nodeType={nodeData.nodeType} 
        nodeId={props.id}
        label={nodeData.label}
        icon={nodeConfig.icon}
      />
      
      <NodeContent
        nodeType={nodeData.nodeType}
        graphNode={nodeData.graphNode}
        properties={nodeData.graphNode.properties}
      />
    </NodeCard>
  );
});

export default MemoryGraphNode;
MemoryGraphNode.displayName = "MemoryGraphNode";