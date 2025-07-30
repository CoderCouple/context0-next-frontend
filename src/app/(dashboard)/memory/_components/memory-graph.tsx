"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";

import { MemoryResponse } from "@/api/memory-api";

interface MemoryGraphProps {
  memories: MemoryResponse[];
}

interface GraphNode {
  id: string;
  group: string;
  label: string;
  size: number;
  memory?: MemoryResponse;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
}

interface Graph {
  nodes: GraphNode[];
  links: GraphLink[];
}

export default function MemoryGraph({ memories }: MemoryGraphProps) {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [data, setData] = useState<Graph>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  useEffect(() => {
    if (memories.length === 0) {
      setData({ nodes: [], links: [] });
      return;
    }

    // Convert memories to graph data
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    
    // Add memory nodes
    memories.forEach((memory) => {
      nodes.push({
        id: memory.id,
        group: memory.memoryType,
        label: memory.summary || `${memory.input.substring(0, 50)}...`,
        size: Math.min(memory.accessCount + 3, 12),
        memory: memory,
      });
      
      // Add tag nodes and links
      if (memory.tags && memory.tags.length > 0) {
        memory.tags.forEach((tag) => {
          const tagNodeId = `tag_${tag}`;
          
          // Add tag node if it doesn't exist
          if (!nodes.find(n => n.id === tagNodeId)) {
            nodes.push({
              id: tagNodeId,
              group: "tag",
              label: `#${tag}`,
              size: 4,
            });
          }
          
          // Link memory to tag
          links.push({
            source: memory.id,
            target: tagNodeId,
            label: "tagged",
          });
        });
      }
      
      // Add memory type nodes
      const typeNodeId = `type_${memory.memoryType}`;
      if (!nodes.find(n => n.id === typeNodeId)) {
        nodes.push({
          id: typeNodeId,
          group: "memory_type",
          label: memory.memoryType.replace(/_/g, " "),
          size: 6,
        });
      }
      
      links.push({
        source: memory.id,
        target: typeNodeId,
        label: "type",
      });
    });

    // Add connections between memories with similar tags
    memories.forEach((memory1, i) => {
      memories.slice(i + 1).forEach((memory2) => {
        if (memory1.tags && memory2.tags) {
          const commonTags = memory1.tags.filter(tag => memory2.tags.includes(tag));
          if (commonTags.length > 0) {
            links.push({
              source: memory1.id,
              target: memory2.id,
              label: `${commonTags.length} shared tag${commonTags.length > 1 ? "s" : ""}`,
            });
          }
        }
      });
    });

    setData({ nodes, links });
  }, [memories]);

  if (memories.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">No memories to visualize</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create some memories to see them in the 3D graph view.
          </p>
        </div>
      </div>
    );
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse">Loading graph...</div>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";
  const backgroundColor = isDark ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)";
  const linkColor = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";

  return (
    <div ref={containerRef} className="h-full w-full rounded-lg overflow-hidden relative">
      <div className="absolute inset-0">
        <ForceGraph3D
          ref={fgRef}
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}
          nodeAutoColorBy="group"
          nodeLabel={(node: any) => node.label}
          linkLabel="label"
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleWidth={1.5}
          nodeThreeObjectExtend={true}
          nodeThreeObject={(node: any) => {
            const sprite = new SpriteText(node.label);
            sprite.color = getNodeColor(node.group, isDark);
            sprite.textHeight = Math.max(node.size || 5, 5);
            sprite.backgroundColor = isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)";
            sprite.padding = 2;
            sprite.borderRadius = 4;
            return sprite;
          }}
          nodeVal={(node: any) => node.size || 5}
          onNodeClick={(node: any) => {
            if (node.memory) {
              // Show memory details in console for now - could open modal/sidebar later
              console.log("Memory clicked:", {
                id: node.memory.id,
                content: node.memory.input,
                summary: node.memory.summary,
                tags: node.memory.tags,
                type: node.memory.memoryType,
                created: node.memory.createdAt,
              });
            } else {
              console.log("Node clicked:", node);
            }
          }}
          backgroundColor={backgroundColor}
          linkColor={() => linkColor}
          linkWidth={2}
          linkOpacity={0.6}
          linkCurvature={0.2}
        />
      </div>
    </div>
  );
}

function getNodeColor(group: string, isDark: boolean): string {
  const lightColors: Record<string, string> = {
    semantic_memory: "#2563eb",
    episodic_memory: "#059669", 
    procedural_memory: "#d97706",
    declarative_memory: "#dc2626",
    working_memory: "#7c3aed",
    emotional_memory: "#db2777",
    meta_memory: "#4b5563",
    tag: "#0d9488",
    memory_type: "#ea580c",
  };
  
  const darkColors: Record<string, string> = {
    semantic_memory: "#60a5fa",
    episodic_memory: "#34d399", 
    procedural_memory: "#fbbf24",
    declarative_memory: "#f87171",
    working_memory: "#a78bfa",
    emotional_memory: "#f472b6",
    meta_memory: "#9ca3af",
    tag: "#2dd4bf",
    memory_type: "#fb923c",
  };
  
  const colors = isDark ? darkColors : lightColors;
  return colors[group] || (isDark ? "#9ca3af" : "#4b5563");
}