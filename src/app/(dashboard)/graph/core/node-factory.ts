/* eslint-disable @typescript-eslint/no-unused-vars */
import { Node as ReactFlowNode } from "@xyflow/react";
import { GraphNode, AppNode, AppNodeData, NodeType } from "./types";
import { getNodeConfig } from "./node-registry";

// Factory to create ReactFlow nodes from graph nodes
export class NodeFactory {
  static create(graphNode: GraphNode, position?: { x: number; y: number }): AppNode {
    const nodeConfig = getNodeConfig(graphNode.type);
    const nodeStyle = nodeConfig.defaultStyle;
    
    // Calculate dimensions based on shape and size
    const dimensions = this.calculateDimensions(nodeStyle.shape, nodeStyle.size);
    
    const appNode: AppNode = {
      id: graphNode.id,
      type: "MemoryGraphNode", // Single node component type
      position: position || { x: 0, y: 0 },
      data: {
        nodeType: graphNode.type,
        graphNode: graphNode,
        label: graphNode.label,
        ...graphNode.properties,
      },
      style: {
        width: dimensions.width,
        height: dimensions.height,
      },
      draggable: true,
    };
    
    return appNode;
  }
  
  static createBatch(graphNodes: GraphNode[], layout?: "grid" | "circular" | "random"): AppNode[] {
    return graphNodes.map((node, index) => {
      const position = this.calculatePosition(index, graphNodes.length, layout);
      return this.create(node, position);
    });
  }
  
  private static calculateDimensions(
    shape?: string,
    size?: { width: number; height: number } | number
  ): { width: number; height: number } {
    if (typeof size === "object" && size !== null) {
      return size;
    }
    
    const sizeValue = typeof size === "number" ? size : 60;
    
    // Return dimensions based on shape
    switch (shape) {
      case "rectangle":
        return { width: sizeValue * 1.5, height: sizeValue };
      case "ellipse":
        return { width: sizeValue * 1.4, height: sizeValue * 0.8 };
      case "diamond":
      case "hexagon":
      case "circle":
      default:
        return { width: sizeValue, height: sizeValue };
    }
  }
  
  private static calculatePosition(
    index: number,
    total: number,
    layout?: "grid" | "circular" | "random"
  ): { x: number; y: number } {
    const centerX = 400;
    const centerY = 300;
    const radius = 250;
    
    switch (layout) {
      case "circular": {
        const angle = (index / total) * 2 * Math.PI;
        return {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        };
      }
      
      case "grid": {
        const cols = Math.ceil(Math.sqrt(total));
        const row = Math.floor(index / cols);
        const col = index % cols;
        return {
          x: 100 + col * 150,
          y: 100 + row * 150,
        };
      }
      
      case "random":
      default:
        return {
          x: Math.random() * 800 + 100,
          y: Math.random() * 600 + 100,
        };
    }
  }
  
  // Create a memory node with special styling
  static createMemoryNode(
    id: string,
    label: string,
    properties: Record<string, any> = {},
    position?: { x: number; y: number }
  ): AppNode {
    const graphNode: GraphNode = {
      id,
      type: NodeType.MEMORY,
      label,
      properties: {
        ...properties,
        isMemory: true,
      },
    };
    
    return this.create(graphNode, position);
  }
  
  // Create an entity node
  static createEntityNode(
    id: string,
    label: string,
    entityType: "person" | "location" | "organization" | "concept",
    properties: Record<string, any> = {},
    position?: { x: number; y: number }
  ): AppNode {
    const nodeTypeMap = {
      person: NodeType.PERSON,
      location: NodeType.LOCATION,
      organization: NodeType.ORGANIZATION,
      concept: NodeType.CONCEPT,
    };
    
    const graphNode: GraphNode = {
      id,
      type: nodeTypeMap[entityType],
      label,
      properties,
    };
    
    return this.create(graphNode, position);
  }
  
  // Update node data
  static updateNodeData(node: AppNode, updates: Partial<AppNodeData>): AppNode {
    return {
      ...node,
      data: {
        ...node.data,
        ...updates,
      },
    };
  }
  
  // Clone a node
  static clone(node: AppNode, newId?: string, offset?: { x: number; y: number }): AppNode {
    const clonedNode: AppNode = {
      ...node,
      id: newId || `${node.id}_clone_${Date.now()}`,
      position: {
        x: node.position.x + (offset?.x || 50),
        y: node.position.y + (offset?.y || 50),
      },
      selected: false,
    };
    
    return clonedNode;
  }
}