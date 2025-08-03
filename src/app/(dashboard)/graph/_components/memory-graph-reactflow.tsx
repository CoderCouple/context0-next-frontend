"use client";

import { useCallback, useEffect, useState } from "react";
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
  Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { Brain, Tag, Calendar, MapPin, User, Lightbulb } from "lucide-react";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MemoryResponse } from "@/api/memory-api";
import { cn } from "@/lib/utils";

interface MemoryGraphReactFlowProps {
  memories: MemoryResponse[];
  onNodeClick?: (node: any) => void;
  searchQuery?: string;
  layout?: "force" | "hierarchical" | "radial";
}

// Neo4j-style Memory Node
const MemoryNode = ({ data, selected }: NodeProps) => {
  const memory = data.memory as MemoryResponse;
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={cn(
      "relative rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-all cursor-pointer",
      "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      selected && "ring-4 ring-blue-400 ring-offset-2 ring-offset-background",
      resolvedTheme === "dark" ? "shadow-blue-900/50" : "shadow-blue-500/30"
    )}>
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      
      <div className="flex flex-col items-center text-white">
        <Brain className="h-8 w-8 mb-1" />
        <span className="text-xs font-medium text-center px-2 line-clamp-1">
          {data.label}
        </span>
      </div>
      
      {memory.confidence && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <Badge variant="secondary" className="text-xs">
            {Math.round(memory.confidence * 100)}%
          </Badge>
        </div>
      )}
    </div>
  );
};

// Neo4j-style Entity Node
const EntityNode = ({ data, selected }: NodeProps) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={cn(
      "relative rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all cursor-pointer",
      "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      selected && "ring-4 ring-green-400 ring-offset-2 ring-offset-background",
      resolvedTheme === "dark" ? "shadow-green-900/50" : "shadow-green-500/30"
    )}>
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      
      <div className="flex flex-col items-center text-white">
        <User className="h-6 w-6" />
      </div>
      
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-medium">{data.label}</span>
      </div>
    </div>
  );
};

// Neo4j-style Tag Node
const TagNode = ({ data, selected }: NodeProps) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={cn(
      "relative rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all cursor-pointer",
      "bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
      selected && "ring-4 ring-gray-400 ring-offset-2 ring-offset-background",
      resolvedTheme === "dark" ? "shadow-gray-900/50" : "shadow-gray-500/30"
    )}>
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      
      <Tag className="h-5 w-5 text-white" />
      
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <Badge variant="secondary" className="text-xs">
          {data.label}
        </Badge>
      </div>
    </div>
  );
};

// Neo4j-style Location Node
const LocationNode = ({ data, selected }: NodeProps) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={cn(
      "relative rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all cursor-pointer",
      "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      selected && "ring-4 ring-orange-400 ring-offset-2 ring-offset-background",
      resolvedTheme === "dark" ? "shadow-orange-900/50" : "shadow-orange-500/30"
    )}>
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      
      <MapPin className="h-6 w-6 text-white" />
      
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-medium">{data.label}</span>
      </div>
    </div>
  );
};

// Neo4j-style Date Node
const DateNode = ({ data, selected }: NodeProps) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={cn(
      "relative rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all cursor-pointer",
      "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      selected && "ring-4 ring-red-400 ring-offset-2 ring-offset-background",
      resolvedTheme === "dark" ? "shadow-red-900/50" : "shadow-red-500/30"
    )}>
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      
      <Calendar className="h-5 w-5 text-white" />
      
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-medium">{data.label}</span>
      </div>
    </div>
  );
};

// Neo4j-style Concept Node
const ConceptNode = ({ data, selected }: NodeProps) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className={cn(
      "relative rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all cursor-pointer",
      "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      selected && "ring-4 ring-purple-400 ring-offset-2 ring-offset-background",
      resolvedTheme === "dark" ? "shadow-purple-900/50" : "shadow-purple-500/30"
    )}>
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      
      <Lightbulb className="h-5 w-5 text-white" />
      
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-medium">{data.label}</span>
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
  markerEnd,
}: EdgeProps) => {
  const { resolvedTheme } = useTheme();
  const [edgePath, labelX, labelY] = getBezierPath({
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
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          strokeDasharray: data?.dashed ? "5,5" : 0,
          animation: data?.animated ? "dashdraw 0.5s linear infinite" : undefined,
        }}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <text
          x={labelX}
          y={labelY}
          className="fill-current text-xs"
          textAnchor="middle"
          dy={-10}
          style={{ fontSize: 10, fill: resolvedTheme === "dark" ? "#9ca3af" : "#6b7280" }}
        >
          {data.label}
        </text>
      )}
    </>
  );
};

const nodeTypes: NodeTypes = {
  memory: MemoryNode,
  entity: EntityNode,
  tag: TagNode,
  location: LocationNode,
  date: DateNode,
  concept: ConceptNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export default function MemoryGraphReactFlow({ 
  memories, 
  onNodeClick,
  searchQuery = "",
  layout = "force"
}: MemoryGraphReactFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { resolvedTheme } = useTheme();
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (memories.length === 0) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const nodeMap = new Map<string, Node>();
    
    // Create memory nodes
    memories.forEach((memory, index) => {
      const memoryNode: Node = {
        id: memory.id,
        type: "memory",
        position: { x: 0, y: 0 }, // Will be updated by layout
        data: { 
          memory, 
          label: memory.summary || memory.input.substring(0, 30) + "..."
        },
      };
      newNodes.push(memoryNode);
      nodeMap.set(memory.id, memoryNode);
      
      // Extract entities
      if (memory.meta?.entities) {
        memory.meta.entities.forEach((entity: any, entityIndex: number) => {
          const entityId = `entity_${memory.id}_${entityIndex}`;
          const entityNode: Node = {
            id: entityId,
            type: "entity",
            position: { x: 0, y: 0 },
            data: { 
              label: entity.name || entity.value,
              type: entity.type || "Person"
            },
          };
          newNodes.push(entityNode);
          nodeMap.set(entityId, entityNode);
          
          newEdges.push({
            id: `edge_${memory.id}_${entityId}`,
            source: memory.id,
            target: entityId,
            type: "custom",
            style: { 
              stroke: resolvedTheme === "dark" ? "#10b981" : "#059669",
              strokeWidth: 2,
            },
            data: { 
              label: "CONTAINS",
              animated: true
            },
          });
        });
      }
      
      // Create tag nodes
      memory.tags.forEach((tag, tagIndex) => {
        const tagId = `tag_${tag}`;
        if (!nodeMap.has(tagId)) {
          const tagNode: Node = {
            id: tagId,
            type: "tag",
            position: { x: 0, y: 0 },
            data: { label: `#${tag}` },
          };
          newNodes.push(tagNode);
          nodeMap.set(tagId, tagNode);
        }
        
        newEdges.push({
          id: `edge_${memory.id}_${tagId}_${tagIndex}`,
          source: memory.id,
          target: tagId,
          type: "custom",
          style: { 
            stroke: resolvedTheme === "dark" ? "#6b7280" : "#4b5563",
            strokeWidth: 1,
          },
          data: { 
            label: "TAGGED",
            dashed: true
          },
        });
      });
      
      // Extract dates
      const date = new Date(memory.createdAt);
      const dateId = `date_${date.toISOString().split('T')[0]}`;
      if (!nodeMap.has(dateId)) {
        const dateNode: Node = {
          id: dateId,
          type: "date",
          position: { x: 0, y: 0 },
          data: { label: date.toLocaleDateString() },
        };
        newNodes.push(dateNode);
        nodeMap.set(dateId, dateNode);
      }
      
      newEdges.push({
        id: `edge_${memory.id}_${dateId}_${index}`,
        source: memory.id,
        target: dateId,
        type: "custom",
        style: { 
          stroke: resolvedTheme === "dark" ? "#ef4444" : "#dc2626",
          strokeWidth: 1.5,
        },
        data: { label: "CREATED" },
      });
      
      // Extract concepts from category
      if (memory.category) {
        const conceptId = `concept_${memory.category}`;
        if (!nodeMap.has(conceptId)) {
          const conceptNode: Node = {
            id: conceptId,
            type: "concept",
            position: { x: 0, y: 0 },
            data: { label: memory.category },
          };
          newNodes.push(conceptNode);
          nodeMap.set(conceptId, conceptNode);
        }
        
        newEdges.push({
          id: `edge_${memory.id}_${conceptId}_${index}`,
          source: memory.id,
          target: conceptId,
          type: "custom",
          style: { 
            stroke: resolvedTheme === "dark" ? "#8b5cf6" : "#7c3aed",
            strokeWidth: 1.5,
          },
          data: { label: "CATEGORY" },
        });
      }
    });
    
    // Apply layout
    applyLayout(newNodes, newEdges, layout);
    
    setNodes(newNodes);
    setEdges(newEdges);
    
    setTimeout(() => fitView({ padding: 0.2 }), 100);
  }, [memories, setNodes, setEdges, resolvedTheme, layout, fitView]);

  const applyLayout = (nodes: Node[], edges: Edge[], layoutType: string) => {
    switch (layoutType) {
      case "hierarchical":
        applyHierarchicalLayout(nodes, edges);
        break;
      case "radial":
        applyRadialLayout(nodes, edges);
        break;
      default:
        applyForceLayout(nodes, edges);
    }
  };

  const applyForceLayout = (nodes: Node[], edges: Edge[]) => {
    // Simple force-directed layout
    const centerX = 400;
    const centerY = 300;
    const radius = 300;
    
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      node.position = {
        x: centerX + Math.cos(angle) * radius * (node.type === "memory" ? 1 : 0.7),
        y: centerY + Math.sin(angle) * radius * (node.type === "memory" ? 1 : 0.7),
      };
    });
  };

  const applyHierarchicalLayout = (nodes: Node[], edges: Edge[]) => {
    // Group nodes by type
    const memoryNodes = nodes.filter(n => n.type === "memory");
    const otherNodes = nodes.filter(n => n.type !== "memory");
    
    // Arrange memory nodes at the top
    memoryNodes.forEach((node, index) => {
      node.position = {
        x: 100 + index * 200,
        y: 100,
      };
    });
    
    // Arrange other nodes below
    otherNodes.forEach((node, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      node.position = {
        x: 100 + col * 150,
        y: 300 + row * 150,
      };
    });
  };

  const applyRadialLayout = (nodes: Node[], edges: Edge[]) => {
    // Memory nodes in center, others in rings
    const centerX = 400;
    const centerY = 300;
    
    const memoryNodes = nodes.filter(n => n.type === "memory");
    const otherNodes = nodes.filter(n => n.type !== "memory");
    
    // Memory nodes in inner circle
    memoryNodes.forEach((node, index) => {
      const angle = (index / memoryNodes.length) * 2 * Math.PI;
      node.position = {
        x: centerX + Math.cos(angle) * 150,
        y: centerY + Math.sin(angle) * 150,
      };
    });
    
    // Other nodes in outer circle
    otherNodes.forEach((node, index) => {
      const angle = (index / otherNodes.length) * 2 * Math.PI;
      node.position = {
        x: centerX + Math.cos(angle) * 300,
        y: centerY + Math.sin(angle) * 300,
      };
    });
  };

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (onNodeClick && node.type === "memory") {
      onNodeClick(node.data.memory);
    }
  }, [onNodeClick]);

  useEffect(() => {
    // Highlight nodes based on search query
    if (searchQuery) {
      setNodes((nds) =>
        nds.map((node) => {
          const matches = node.data.label?.toLowerCase().includes(searchQuery.toLowerCase());
          return {
            ...node,
            style: {
              ...node.style,
              opacity: matches ? 1 : 0.3,
            },
          };
        })
      );
    } else {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            opacity: 1,
          },
        }))
      );
    }
  }, [searchQuery, setNodes]);

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
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      minZoom={0.1}
      maxZoom={2}
      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      className="neo4j-graph"
    >
      <style jsx global>{`
        @keyframes dashdraw {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
      <Background 
        variant={BackgroundVariant.Dots} 
        gap={30} 
        size={1}
        color={resolvedTheme === "dark" ? "#1e293b" : "#e2e8f0"}
      />
      <Controls />
    </ReactFlow>
  );
}