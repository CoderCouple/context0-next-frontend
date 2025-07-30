"use client";

import { useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  EdgeTypes,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position,
  NodeProps,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import "reactflow/dist/style.css";
import { Brain, Tag, Calendar, Zap } from "lucide-react";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MemoryResponse } from "@/api/memory-api";

interface MemoryFlowGraphProps {
  memories: MemoryResponse[];
  onMemoryClick?: (memory: MemoryResponse) => void;
}

// Custom Memory Node Component
const MemoryNode = ({ data }: NodeProps) => {
  const memory = data.memory as MemoryResponse;
  const date = new Date(memory.createdAt);
  
  return (
    <Card className="min-w-[280px] max-w-[350px] p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2">
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <Brain className="h-5 w-5 text-primary shrink-0" />
          <Badge variant="outline" className="text-xs">
            {Math.round(memory.confidence * 100)}%
          </Badge>
        </div>
        
        <div>
          <p className="text-sm font-medium line-clamp-2">
            {memory.summary || memory.input}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{date.toLocaleDateString()}</span>
          <span>•</span>
          <Zap className="h-3 w-3" />
          <span>{memory.accessCount}</span>
        </div>
        
        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {memory.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {memory.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{memory.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// Custom Tag Node Component
const TagNode = ({ data }: NodeProps) => {
  return (
    <div className="px-4 py-2 bg-secondary rounded-full border-2 border-secondary-foreground/20 shadow-md">
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-secondary-foreground border-2 border-background"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-secondary-foreground border-2 border-background"
      />
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-secondary-foreground" />
        <span className="text-sm font-medium">{data.label}</span>
      </div>
    </div>
  );
};

// Custom Edge Component
const CustomEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        className="react-flow__edge-path stroke-2"
        d={edgePath}
        style={{
          ...style,
          strokeDasharray: data?.dashed ? 5 : 0,
        }}
      />
    </>
  );
};

const nodeTypes: NodeTypes = {
  memory: MemoryNode,
  tag: TagNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export default function MemoryFlowGraph({ memories, onMemoryClick }: MemoryFlowGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (memories.length === 0) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const tagNodeMap = new Map<string, Node>();
    
    // Create memory nodes in a grid layout
    const columns = Math.ceil(Math.sqrt(memories.length));
    
    memories.forEach((memory, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      
      newNodes.push({
        id: memory.id,
        type: "memory",
        position: { x: col * 400, y: row * 250 },
        data: { memory, label: memory.summary || memory.input },
      });
      
      // Create tag nodes
      memory.tags?.forEach((tag) => {
        const tagNodeId = `tag_${tag}`;
        
        if (!tagNodeMap.has(tagNodeId)) {
          const tagNode: Node = {
            id: tagNodeId,
            type: "tag",
            position: { 
              x: columns * 400 + 200, 
              y: tagNodeMap.size * 80 
            },
            data: { label: `#${tag}` },
          };
          newNodes.push(tagNode);
          tagNodeMap.set(tagNodeId, tagNode);
        }
        
        // Link memory to tag
        newEdges.push({
          id: `${memory.id}-${tagNodeId}`,
          source: memory.id,
          target: tagNodeId,
          type: "custom",
          style: { stroke: resolvedTheme === "dark" ? "#64748b" : "#cbd5e1" },
          data: { dashed: true },
        });
      });
    });

    // Add connections between memories with shared tags
    memories.forEach((memory1, i) => {
      memories.slice(i + 1).forEach((memory2) => {
        if (memory1.tags && memory2.tags) {
          const commonTags = memory1.tags.filter(tag => memory2.tags.includes(tag));
          if (commonTags.length > 0) {
            newEdges.push({
              id: `${memory1.id}-${memory2.id}`,
              source: memory1.id,
              target: memory2.id,
              type: "custom",
              style: { 
                stroke: resolvedTheme === "dark" ? "#3b82f6" : "#2563eb",
                strokeWidth: Math.min(commonTags.length * 2, 4),
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: resolvedTheme === "dark" ? "#3b82f6" : "#2563eb",
              },
            });
          }
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [memories, setNodes, setEdges, resolvedTheme]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (node.type === "memory" && node.data.memory) {
      onMemoryClick?.(node.data.memory);
    }
  }, [onMemoryClick]);

  if (memories.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Brain className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">
            No memories to visualize
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create some memories to see the knowledge graph.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color={resolvedTheme === "dark" ? "#374151" : "#e5e7eb"}
          />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}