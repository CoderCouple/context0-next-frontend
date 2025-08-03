/* eslint-disable @typescript-eslint/no-unused-vars */
import { Edge as ReactFlowEdge, MarkerType } from "@xyflow/react";
import { GraphEdge, AppEdge, AppEdgeData, EdgeType } from "./types";
import { getEdgeConfig, getEdgeStyle } from "./edge-registry";

// Factory to create ReactFlow edges from graph edges
export class EdgeFactory {
  static create(
    graphEdge: GraphEdge,
    theme: "light" | "dark" = "light"
  ): AppEdge {
    const edgeConfig = getEdgeConfig(graphEdge.type);
    const edgeStyle = getEdgeStyle(graphEdge.type, theme);
    
    const appEdge: AppEdge = {
      id: graphEdge.id,
      source: graphEdge.source,
      target: graphEdge.target,
      type: "MemoryGraphEdge", // Single edge component type
      style: edgeStyle,
      animated: edgeConfig.defaultStyle.animated,
      markerEnd: edgeConfig.defaultStyle.markerEnd
        ? {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: edgeStyle.stroke,
          }
        : undefined,
      data: {
        edgeType: graphEdge.type,
        graphEdge: graphEdge,
        label: graphEdge.label || edgeConfig.label,
        showLabel: edgeConfig.defaultStyle.showLabel,
        ...(graphEdge.properties || {}),
      } as AppEdgeData,
    };
    
    return appEdge;
  }
  
  static createBatch(
    graphEdges: GraphEdge[],
    theme: "light" | "dark" = "light"
  ): AppEdge[] {
    return graphEdges.map(edge => this.create(edge, theme));
  }
  
  // Create a relationship edge
  static createRelationship(
    id: string,
    sourceId: string,
    targetId: string,
    type: EdgeType,
    label?: string,
    properties?: Record<string, any>
  ): AppEdge {
    const graphEdge: GraphEdge = {
      id,
      source: sourceId,
      target: targetId,
      type,
      label,
      properties,
    };
    
    return this.create(graphEdge);
  }
  
  // Create a "contains" relationship
  static createContainsEdge(
    sourceId: string,
    targetId: string,
    properties?: Record<string, any>
  ): AppEdge {
    return this.createRelationship(
      `edge_${sourceId}_contains_${targetId}`,
      sourceId,
      targetId,
      EdgeType.CONTAINS,
      "contains",
      properties
    );
  }
  
  // Create a "relates to" relationship
  static createRelatesToEdge(
    sourceId: string,
    targetId: string,
    strength?: number
  ): AppEdge {
    return this.createRelationship(
      `edge_${sourceId}_relates_${targetId}`,
      sourceId,
      targetId,
      EdgeType.RELATES_TO,
      "relates to",
      { strength }
    );
  }
  
  // Create a temporal link
  static createTemporalLink(
    earlierId: string,
    laterId: string,
    timeDiff?: string
  ): AppEdge {
    return this.createRelationship(
      `edge_${earlierId}_before_${laterId}`,
      earlierId,
      laterId,
      EdgeType.TEMPORAL_LINK,
      timeDiff || "before",
      { temporal: true, timeDiff }
    );
  }
  
  // Update edge data
  static updateEdgeData(edge: AppEdge, updates: Partial<AppEdgeData>): AppEdge {
    return {
      ...edge,
      data: {
        ...edge.data,
        ...updates,
      } as AppEdgeData,
    };
  }
  
  // Check if edge exists between nodes
  static edgeExists(
    edges: AppEdge[],
    sourceId: string,
    targetId: string,
    edgeType?: EdgeType
  ): boolean {
    return edges.some(edge => {
      const matchesNodes = 
        (edge.source === sourceId && edge.target === targetId) ||
        (edge.source === targetId && edge.target === sourceId);
      
      if (!matchesNodes) return false;
      
      if (edgeType && edge.data?.edgeType) {
        return edge.data.edgeType === edgeType;
      }
      
      return true;
    });
  }
  
  // Filter edges by type
  static filterByType(edges: AppEdge[], edgeType: EdgeType): AppEdge[] {
    return edges.filter(edge => edge.data?.edgeType === edgeType);
  }
  
  // Get edges connected to a node
  static getConnectedEdges(edges: AppEdge[], nodeId: string): AppEdge[] {
    return edges.filter(edge => 
      edge.source === nodeId || edge.target === nodeId
    );
  }
  
  // Clone an edge
  static clone(edge: AppEdge, newId?: string): AppEdge {
    return {
      ...edge,
      id: newId || `${edge.id}_clone_${Date.now()}`,
      selected: false,
    };
  }
}