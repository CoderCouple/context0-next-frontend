"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  EdgeTypes,
  BackgroundVariant,
  useReactFlow,
  Connection,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";

import { MemoryResponse } from "@/api/memory-api";
import { GraphTransformer } from "../core/graph-transformer";
import { AppNode, AppEdge, GraphData, GraphNode, NodeType, EdgeType } from "../core/types";
import { EdgeFactory } from "../core/edge-factory";
import { NodeFactory } from "../core/node-factory";
import MemoryGraphNode from "./nodes/memory-graph-node";
import MemoryGraphEdge from "./edges/memory-graph-edge";
import GraphControls from "./graph-controls";

interface MemoryGraphProps {
  memories: MemoryResponse[];
  onNodeClick?: (node: any) => void;
  searchQuery?: string;
  layout?: "force" | "hierarchical" | "radial";
  onLayoutChange?: (layout: "force" | "hierarchical" | "radial") => void;
  showTagEdges?: boolean;
  onToggleTagEdges?: () => void;
  filters?: {
    nodeTypes?: NodeType[];
    edgeTypes?: EdgeType[];
    dateRange?: { start: Date; end: Date };
  };
}

// Register node and edge types
const nodeTypes: NodeTypes = {
  MemoryGraphNode: MemoryGraphNode,
};

const edgeTypes: EdgeTypes = {
  MemoryGraphEdge: MemoryGraphEdge,
};

function MemoryGraphInner({
  memories,
  onNodeClick,
  searchQuery = "",
  layout = "force",
  onLayoutChange,
  showTagEdges = true,
  onToggleTagEdges,
  filters = {},
}: MemoryGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const { resolvedTheme } = useTheme();
  const { fitView, screenToFlowPosition } = useReactFlow();

  // Transform memories to graph data
  useEffect(() => {
    if (memories.length === 0) {
      setGraphData(null);
      setNodes([]);
      setEdges([]);
      return;
    }

    // Transform memories to graph format
    let data = GraphTransformer.memoriesToGraphData(memories);
    
    // Apply filters
    if (filters || searchQuery) {
      data = GraphTransformer.applyFilters(data, {
        ...filters,
        searchQuery,
      });
    }
    
    setGraphData(data);
    
    // Convert to ReactFlow format
    const { nodes: flowNodes, edges: flowEdges } = GraphTransformer.toReactFlowFormat(
      data,
      resolvedTheme as "light" | "dark"
    );
    
    // Apply layout and create new node objects
    const layoutedNodes = applyLayout(flowNodes, layout);
    
    setNodes(layoutedNodes);
    setEdges(flowEdges);
    
    setTimeout(() => fitView({ padding: 0.2, maxZoom: 1.5 }), 100);
  }, [memories, searchQuery, filters?.nodeTypes?.join(","), filters?.edgeTypes?.join(","), filters?.dateRange?.start, filters?.dateRange?.end, resolvedTheme, layout]);

  // Apply layout algorithms
  const applyLayout = (nodes: AppNode[], layoutType: string): AppNode[] => {
    switch (layoutType) {
      case "hierarchical":
        return applyHierarchicalLayout(nodes);
      case "radial":
        return applyRadialLayout(nodes);
      default:
        return applyForceLayout(nodes);
    }
  };

  const applyForceLayout = (nodes: AppNode[]): AppNode[] => {
    const centerX = 600;
    const centerY = 400;
    
    // Create new nodes array with updated positions
    return nodes.map((node, index) => {
      // User node at center
      if (node.data.nodeType === NodeType.USER) {
        return {
          ...node,
          position: { x: centerX, y: centerY },
        };
      }
      // Memory nodes in inner circle around user
      else if (node.data.nodeType === NodeType.MEMORY) {
        const memoryNodes = nodes.filter(n => n.data.nodeType === NodeType.MEMORY);
        const memoryIndex = memoryNodes.indexOf(node);
        const angle = (memoryIndex / memoryNodes.length) * 2 * Math.PI;
        const radius = 200;
        
        return {
          ...node,
          position: {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
          },
        };
      }
      // Other entities in outer circles
      else {
        const otherNodes = nodes.filter(n => n.data.nodeType !== NodeType.MEMORY && n.data.nodeType !== NodeType.USER);
        const otherIndex = otherNodes.indexOf(node);
        const angle = (otherIndex / otherNodes.length) * 2 * Math.PI;
        const radius = 400;
        
        return {
          ...node,
          position: {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
          },
        };
      }
    });
  };

  const applyHierarchicalLayout = (nodes: AppNode[]): AppNode[] => {
    const layers: { [key: string]: AppNode[] } = {
      user: nodes.filter(n => n.data.nodeType === NodeType.USER),
      memory: nodes.filter(n => n.data.nodeType === NodeType.MEMORY),
      entity: nodes.filter(n => [NodeType.PERSON, NodeType.ENTITY, NodeType.ORGANIZATION].includes(n.data.nodeType)),
      concept: nodes.filter(n => [NodeType.CONCEPT, NodeType.TAG].includes(n.data.nodeType)),
      temporal: nodes.filter(n => n.data.nodeType === NodeType.TEMPORAL),
    };
    
    const positionMap = new Map<string, { x: number; y: number }>();
    
    let yOffset = 100;
    Object.entries(layers).forEach(([layer, layerNodes]) => {
      const xSpacing = 150;
      const startX = 100;
      
      layerNodes.forEach((node, index) => {
        positionMap.set(node.id, {
          x: startX + index * xSpacing,
          y: yOffset,
        });
      });
      
      yOffset += 200;
    });
    
    return nodes.map(node => ({
      ...node,
      position: positionMap.get(node.id) || node.position,
    }));
  };

  const applyRadialLayout = (nodes: AppNode[]): AppNode[] => {
    const centerX = 600;
    const centerY = 400;
    
    // Create position map for all nodes
    const positionMap = new Map<string, { x: number; y: number }>();
    
    // User node at center
    const userNode = nodes.find(n => n.data.nodeType === NodeType.USER);
    if (userNode) {
      positionMap.set(userNode.id, { x: centerX, y: centerY });
    }
    
    // Memory nodes in inner circle
    const memoryNodes = nodes.filter(n => n.data.nodeType === NodeType.MEMORY);
    const otherNodes = nodes.filter(n => n.data.nodeType !== NodeType.MEMORY && n.data.nodeType !== NodeType.USER);
    
    // Arrange memory nodes in inner circle
    memoryNodes.forEach((node, index) => {
      const angle = (index / memoryNodes.length) * 2 * Math.PI;
      const radius = 150;
      positionMap.set(node.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    });
    
    // Group other nodes by type and arrange in rings
    const nodesByType = otherNodes.reduce((acc, node) => {
      const type = node.data.nodeType;
      if (!acc[type]) acc[type] = [];
      acc[type].push(node);
      return acc;
    }, {} as Record<NodeType, AppNode[]>);
    
    let ringRadius = 300;
    Object.entries(nodesByType).forEach(([type, typeNodes]) => {
      typeNodes.forEach((node, index) => {
        const angle = (index / typeNodes.length) * 2 * Math.PI;
        positionMap.set(node.id, {
          x: centerX + Math.cos(angle) * ringRadius,
          y: centerY + Math.sin(angle) * ringRadius,
        });
      });
      ringRadius += 150;
    });
    
    // Return new nodes array with updated positions
    return nodes.map(node => ({
      ...node,
      position: positionMap.get(node.id) || node.position,
    }));
  };

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: AppNode) => {
    if (onNodeClick && node.data?.graphNode) {
      onNodeClick(node.data.graphNode);
    } else if (onNodeClick) {
      // Fallback: construct a basic graph node from available data
      onNodeClick({
        id: node.id,
        type: node.data?.nodeType || NodeType.CUSTOM,
        label: node.data?.label || node.id,
        properties: node.data || {}
      });
    }
  }, [onNodeClick]);

  const onConnect = useCallback(
    (connection: Connection) => {
      // Create a new edge when user connects nodes
      const newEdge = EdgeFactory.createRelationship(
        `manual_edge_${Date.now()}`,
        connection.source!,
        connection.target!,
        EdgeType.RELATES_TO,
        "manually connected"
      );
      
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const isValidConnection = useCallback(
    (connection: Connection | AppEdge) => {
      // Don't allow self-connections
      if (connection.source === connection.target) return false;
      
      // Check if edge already exists
      const exists = edges.some(edge => 
        (edge.source === connection.source && edge.target === connection.target) ||
        (edge.source === connection.target && edge.target === connection.source)
      );
      
      return !exists;
    },
    [edges]
  );

  // Handle drag over for drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop to add new nodes
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const nodeDataStr = event.dataTransfer.getData("application/reactflow");
      if (!nodeDataStr) return;
      
      try {
        const nodeData = JSON.parse(nodeDataStr);
        
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        
        // Create a new graph node
        const graphNode: GraphNode = {
          id: nodeData.id || `${nodeData.type}_${Date.now()}`,
          type: nodeData.type,
          label: nodeData.label,
          properties: {},
        };
        
        // Create ReactFlow node
        const newNode = NodeFactory.create(graphNode, position);
        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error("Failed to create node from drop:", error);
      }
    },
    [screenToFlowPosition, setNodes]
  );

  if (!graphData || memories.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-muted-foreground">
            No memories to visualize
          </p>
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
      onConnect={onConnect}
      isValidConnection={isValidConnection}
      onDragOver={onDragOver}
      onDrop={onDrop}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      minZoom={0.1}
      maxZoom={2}
      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
    >
      <style jsx global>{`
        .hexagon {
          clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
        }
        
        .diamond-content {
          overflow: visible;
        }
      `}</style>
      <Background 
        variant={BackgroundVariant.Dots} 
        gap={30} 
        size={1}
        color={resolvedTheme === "dark" ? "#1e293b" : "#e2e8f0"}
      />
      <Controls />
      
      {/* Custom controls positioned on the right */}
      <div className="absolute top-4 right-4 z-10">
        <GraphControls 
          layout={layout}
          onLayoutChange={onLayoutChange!}
          showTagEdges={showTagEdges}
          onToggleTagEdges={onToggleTagEdges}
        />
      </div>
    </ReactFlow>
  );
}

export default function MemoryGraph(props: MemoryGraphProps) {
  return <MemoryGraphInner {...props} />;
}