import { MemoryResponse } from "@/api/memory-api";

interface Neo4jNode {
  id: string;
  labels: string[];
  properties: Record<string, any>;
}

interface Neo4jRelationship {
  id: string;
  from: string;
  to: string;
  type: string;
  properties?: Record<string, any>;
}

interface Neo4jGraphData {
  nodes: Neo4jNode[];
  relationships: Neo4jRelationship[];
}

export function transformMemoriesToNeo4jData(memories: MemoryResponse[]): Neo4jGraphData {
  const nodes: Neo4jNode[] = [];
  const relationships: Neo4jRelationship[] = [];
  const nodeMap = new Map<string, Neo4jNode>();
  
  // Create memory nodes
  memories.forEach((memory) => {
    const memoryNode: Neo4jNode = {
      id: memory.id,
      labels: ["Memory"],
      properties: {
        label: memory.summary || `${memory.input.substring(0, 50)  }...`,
        summary: memory.summary,
        input: memory.input,
        confidence: memory.confidence,
        createdAt: memory.createdAt,
        accessCount: memory.accessCount,
        scope: memory.scope,
        memoryType: memory.memoryType,
        category: memory.category,
        emotion: memory.emotion,
        emotionIntensity: memory.emotionIntensity,
      },
    };
    nodes.push(memoryNode);
    nodeMap.set(memory.id, memoryNode);
    
    // Extract entities from metadata
    if (memory.meta?.entities) {
      memory.meta.entities.forEach((entity: any, index: number) => {
        const entityId = `entity_${memory.id}_${index}`;
        const entityNode: Neo4jNode = {
          id: entityId,
          labels: ["Entity"],
          properties: {
            label: entity.name || entity.value,
            type: entity.type || "Person",
            confidence: entity.confidence || 0.8,
          },
        };
        nodes.push(entityNode);
        nodeMap.set(entityId, entityNode);
        
        relationships.push({
          id: `rel_${memory.id}_${entityId}`,
          from: memory.id,
          to: entityId,
          type: "CONTAINS",
          properties: {
            confidence: entity.confidence || 0.8,
          },
        });
      });
    }
    
    // Extract locations
    if (memory.meta?.locations) {
      memory.meta.locations.forEach((location: any, index: number) => {
        const locationId = `location_${memory.id}_${index}`;
        const locationNode: Neo4jNode = {
          id: locationId,
          labels: ["Location"],
          properties: {
            label: location.name || location.value,
            coordinates: location.coordinates,
          },
        };
        nodes.push(locationNode);
        nodeMap.set(locationId, locationNode);
        
        relationships.push({
          id: `rel_${memory.id}_${locationId}`,
          from: memory.id,
          to: locationId,
          type: "HAPPENED_AT",
        });
      });
    }
    
    // Create tag nodes
    memory.tags.forEach((tag) => {
      const tagId = `tag_${tag}`;
      if (!nodeMap.has(tagId)) {
        const tagNode: Neo4jNode = {
          id: tagId,
          labels: ["Tag"],
          properties: {
            label: `#${tag}`,
            name: tag,
          },
        };
        nodes.push(tagNode);
        nodeMap.set(tagId, tagNode);
      }
      
      relationships.push({
        id: `rel_${memory.id}_${tagId}`,
        from: memory.id,
        to: tagId,
        type: "TAGGED_WITH",
      });
    });
    
    // Extract dates
    const date = new Date(memory.createdAt);
    const dateId = `date_${date.toISOString().split("T")[0]}`;
    if (!nodeMap.has(dateId)) {
      const dateNode: Neo4jNode = {
        id: dateId,
        labels: ["Date"],
        properties: {
          label: date.toLocaleDateString(),
          date: date.toISOString(),
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      };
      nodes.push(dateNode);
      nodeMap.set(dateId, dateNode);
    }
    
    relationships.push({
      id: `rel_${memory.id}_${dateId}`,
      from: memory.id,
      to: dateId,
      type: "HAPPENED_ON",
    });
    
    // Extract concepts from category
    if (memory.category) {
      const conceptId = `concept_${memory.category}`;
      if (!nodeMap.has(conceptId)) {
        const conceptNode: Neo4jNode = {
          id: conceptId,
          labels: ["Concept"],
          properties: {
            label: memory.category,
            type: "category",
          },
        };
        nodes.push(conceptNode);
        nodeMap.set(conceptId, conceptNode);
      }
      
      relationships.push({
        id: `rel_${memory.id}_${conceptId}`,
        from: memory.id,
        to: conceptId,
        type: "RELATES_TO",
      });
    }
  });
  
  // Create relationships between memories with common tags
  memories.forEach((memory1, i) => {
    memories.slice(i + 1).forEach((memory2) => {
      const commonTags = memory1.tags.filter(tag => memory2.tags.includes(tag));
      if (commonTags.length > 0) {
        relationships.push({
          id: `rel_memory_${memory1.id}_${memory2.id}`,
          from: memory1.id,
          to: memory2.id,
          type: "RELATES_TO",
          properties: {
            commonTags,
            strength: commonTags.length,
          },
        });
      }
    });
  });
  
  return { nodes, relationships };
}