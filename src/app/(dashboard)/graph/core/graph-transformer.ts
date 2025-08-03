import { MemoryResponse } from "@/api/memory-api";
import { GraphData, GraphNode, GraphEdge, NodeType, EdgeType, AppNode, AppEdge } from "./types";
import { NodeFactory } from "./node-factory";
import { EdgeFactory } from "./edge-factory";

// Transform backend data to database-agnostic graph format
export class GraphTransformer {
  // Transform memories from API to graph data
  static memoriesToGraphData(memories: MemoryResponse[]): GraphData {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const nodeMap = new Map<string, GraphNode>();
    
    // Create the central user node
    const userNode: GraphNode = {
      id: "user_central",
      type: NodeType.USER,
      label: "Me",
      properties: {
        isCurrentUser: true,
        memoryCount: memories.length,
      },
    };
    nodes.push(userNode);
    nodeMap.set(userNode.id, userNode);
    
    // Process each memory
    memories.forEach((memory) => {
      // Create memory node
      const memoryNode: GraphNode = {
        id: memory.id,
        type: NodeType.MEMORY,
        label: memory.summary || `${memory.input.substring(0, 50)  }...`,
        properties: {
          input: memory.input,
          summary: memory.summary,
          confidence: memory.confidence,
          accessCount: memory.accessCount,
          createdAt: memory.createdAt,
          scope: memory.scope,
          memoryType: memory.memoryType,
          category: memory.category,
          emotion: memory.emotion,
          emotionIntensity: memory.emotionIntensity,
        },
      };
      nodes.push(memoryNode);
      nodeMap.set(memory.id, memoryNode);
      
      // Connect user to memory with "has memory" edge
      edges.push({
        id: `edge_user_${memory.id}`,
        source: userNode.id,
        target: memory.id,
        type: EdgeType.HAS_MEMORY,
        label: "has memory",
      });
      
      // Extract entities from metadata
      if (memory.meta?.entities && Array.isArray(memory.meta.entities)) {
        memory.meta.entities.forEach((entity: any, index: number) => {
          const entityId = `entity_${memory.id}_${index}`;
          const entityNode: GraphNode = {
            id: entityId,
            type: this.getEntityNodeType(entity.type),
            label: entity.name || entity.value || "Unknown Entity",
            properties: {
              entityType: entity.type,
              confidence: entity.confidence || 0.8,
              source: "extracted",
            },
          };
          
          if (!nodeMap.has(entityId)) {
            nodes.push(entityNode);
            nodeMap.set(entityId, entityNode);
          }
          
          edges.push({
            id: `edge_${memory.id}_${entityId}`,
            source: memory.id,
            target: entityId,
            type: EdgeType.CONTAINS,
            properties: {
              confidence: entity.confidence || 0.8,
            },
          });
        });
      }
      
      // Extract locations
      if (memory.meta?.locations && Array.isArray(memory.meta.locations)) {
        memory.meta.locations.forEach((location: any, index: number) => {
          const locationId = `location_${location.name || index}_${memory.id}`;
          if (!nodeMap.has(locationId)) {
            const locationNode: GraphNode = {
              id: locationId,
              type: NodeType.LOCATION,
              label: location.name || location.value || "Unknown Location",
              properties: {
                coordinates: location.coordinates,
                locationType: location.type,
              },
            };
            nodes.push(locationNode);
            nodeMap.set(locationId, locationNode);
          }
          
          edges.push({
            id: `edge_${memory.id}_${locationId}`,
            source: memory.id,
            target: locationId,
            type: EdgeType.HAPPENED_AT,
          });
        });
      }
      
      // Create tag nodes
      memory.tags.forEach((tag, tagIndex) => {
        const tagId = `tag_${tag}`;
        if (!nodeMap.has(tagId)) {
          const tagNode: GraphNode = {
            id: tagId,
            type: NodeType.TAG,
            label: `#${tag}`,
            properties: {
              tag: tag,
            },
          };
          nodes.push(tagNode);
          nodeMap.set(tagId, tagNode);
        }
        
        edges.push({
          id: `edge_${memory.id}_${tagId}_${tagIndex}`,
          source: memory.id,
          target: tagId,
          type: EdgeType.TAGGED_WITH,
        });
      });
      
      // Extract temporal information
      const date = new Date(memory.createdAt);
      const dateId = `date_${date.toISOString().split("T")[0]}`;
      if (!nodeMap.has(dateId)) {
        const dateNode: GraphNode = {
          id: dateId,
          type: NodeType.TEMPORAL,
          label: date.toLocaleDateString(),
          properties: {
            date: date.toISOString(),
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
          },
        };
        nodes.push(dateNode);
        nodeMap.set(dateId, dateNode);
      }
      
      edges.push({
        id: `edge_${memory.id}_${dateId}`,
        source: memory.id,
        target: dateId,
        type: EdgeType.TEMPORAL_LINK,
        label: "created on",
      });
      
      // Extract concepts from category
      if (memory.category) {
        const conceptId = `concept_${memory.category}`;
        if (!nodeMap.has(conceptId)) {
          const conceptNode: GraphNode = {
            id: conceptId,
            type: NodeType.CONCEPT,
            label: memory.category,
            properties: {
              category: memory.category,
              type: "category",
            },
          };
          nodes.push(conceptNode);
          nodeMap.set(conceptId, conceptNode);
        }
        
        edges.push({
          id: `edge_${memory.id}_${conceptId}`,
          source: memory.id,
          target: conceptId,
          type: EdgeType.RELATES_TO,
        });
      }
    });
    
    // Create relationships between memories with common entities
    this.createMemoryRelationships(memories, nodes, edges);
    
    // Generate metadata
    const metadata = this.generateMetadata(nodes, edges);
    
    return { nodes, edges, metadata };
  }
  
  // Transform graph data to ReactFlow format
  static toReactFlowFormat(
    graphData: GraphData,
    theme: "light" | "dark" = "light"
  ): { nodes: AppNode[]; edges: AppEdge[] } {
    const nodes = NodeFactory.createBatch(graphData.nodes, "circular");
    const edges = EdgeFactory.createBatch(graphData.edges, theme);
    
    return { nodes, edges };
  }
  
  // Helper to determine entity node type
  private static getEntityNodeType(entityType?: string): NodeType {
    const typeMap: Record<string, NodeType> = {
      person: NodeType.PERSON,
      organization: NodeType.ORGANIZATION,
      location: NodeType.LOCATION,
      system: NodeType.SYSTEM,
      concept: NodeType.CONCEPT,
    };
    
    return typeMap[entityType?.toLowerCase() || ""] || NodeType.ENTITY;
  }
  
  // Create relationships between memories
  private static createMemoryRelationships(
    memories: MemoryResponse[],
    nodes: GraphNode[],
    edges: GraphEdge[]
  ): void {
    // In a user-centric model, memories connect to the user, not to each other
    // We can still create relationships between entities mentioned in different memories
    
    // Create temporal relationships
    const sortedMemories = [...memories].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    for (let i = 0; i < sortedMemories.length - 1; i++) {
      const current = sortedMemories[i];
      const next = sortedMemories[i + 1];
      
      const timeDiff = new Date(next.createdAt).getTime() - new Date(current.createdAt).getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) { // Link memories within a week
        edges.push({
          id: `edge_temporal_${current.id}_${next.id}`,
          source: current.id,
          target: next.id,
          type: EdgeType.TEMPORAL_LINK,
          label: daysDiff === 0 ? "same day" : `${daysDiff} days later`,
          properties: {
            timeDiff: daysDiff,
            chronological: true,
          },
        });
      }
    }
  }
  
  // Generate graph metadata
  private static generateMetadata(nodes: GraphNode[], edges: GraphEdge[]) {
    const nodeTypes = nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {} as Record<NodeType, number>);
    
    const edgeTypes = edges.reduce((acc, edge) => {
      acc[edge.type] = (acc[edge.type] || 0) + 1;
      return acc;
    }, {} as Record<EdgeType, number>);
    
    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodeTypes,
      edgeTypes,
      timestamp: new Date().toISOString(),
    };
  }
  
  // Apply filters to graph data
  static applyFilters(
    graphData: GraphData,
    filters: {
      nodeTypes?: NodeType[];
      edgeTypes?: EdgeType[];
      searchQuery?: string;
      dateRange?: { start: Date; end: Date };
    }
  ): GraphData {
    let { nodes, edges } = graphData;
    
    // Filter nodes by type
    if (filters.nodeTypes && filters.nodeTypes.length > 0) {
      nodes = nodes.filter(node => filters.nodeTypes!.includes(node.type));
    }
    
    // Filter nodes by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      nodes = nodes.filter(node => 
        node.label.toLowerCase().includes(query) ||
        JSON.stringify(node.properties).toLowerCase().includes(query)
      );
    }
    
    // Filter by date range (for memory nodes)
    if (filters.dateRange) {
      nodes = nodes.filter(node => {
        if (node.type !== NodeType.MEMORY) return true;
        
        const nodeDate = new Date(node.properties.createdAt);
        return nodeDate >= filters.dateRange!.start && 
               nodeDate <= filters.dateRange!.end;
      });
    }
    
    // Keep only edges where both nodes exist
    const nodeIds = new Set(nodes.map(n => n.id));
    edges = edges.filter(edge => 
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );
    
    // Filter edges by type
    if (filters.edgeTypes && filters.edgeTypes.length > 0) {
      edges = edges.filter(edge => filters.edgeTypes!.includes(edge.type));
    }
    
    return {
      nodes,
      edges,
      metadata: this.generateMetadata(nodes, edges),
    };
  }
}