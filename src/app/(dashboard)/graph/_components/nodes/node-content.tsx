"use client";

import { Badge } from "@/components/ui/badge";
import { NodeType, GraphNode } from "../../core/types";

interface NodeContentProps {
  nodeType: NodeType;
  graphNode: GraphNode;
  properties: Record<string, any>;
}

function NodeContent({ nodeType, graphNode, properties }: NodeContentProps) {
  // Render different content based on node type
  switch (nodeType) {
    case NodeType.MEMORY:
      return (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
          {properties.confidence && (
            <Badge variant="secondary" className="text-[10px] px-1 py-0">
              {Math.round(properties.confidence * 100)}%
            </Badge>
          )}
          {properties.accessCount > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1 py-0">
              {properties.accessCount} views
            </Badge>
          )}
        </div>
      );
      
    case NodeType.PERSON:
    case NodeType.ENTITY:
    case NodeType.LOCATION:
    case NodeType.ORGANIZATION:
      return (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs font-medium bg-background/80 px-1 rounded">
            {graphNode.label}
          </span>
        </div>
      );
      
    case NodeType.CONCEPT:
      return (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
          <Badge variant="outline" className="text-[10px]">
            {graphNode.label}
          </Badge>
        </div>
      );
      
    case NodeType.TAG:
      // Tag shows its label in the header
      return null;
      
    case NodeType.TEMPORAL:
      // Date shows its label in the header
      return null;
      
    default:
      return null;
  }
}

export default NodeContent;