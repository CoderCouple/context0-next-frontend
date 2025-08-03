"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useMemories } from "@/hooks/use-memories";
import { Skeleton } from "@/components/ui/skeleton";
import { EdgeType } from "./_components/../core/types";

import MemoryGraph from "./_components/memory-graph";
import NodeDetailsPanel from "./_components/node-details-panel";
import GraphLayout from "./_components/graph-layout";

export default function GraphPage() {
  const { data: memories, isLoading, error } = useMemories();
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<"force" | "hierarchical" | "radial">("force");
  const [showTagEdges, setShowTagEdges] = useState(true);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-3.5rem)]">
        <GraphLayout showNodeMenu={true}>
          <div className="relative h-full w-full overflow-hidden">
            <Skeleton className="absolute inset-0" />
          </div>
        </GraphLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-3.5rem)]">
        <GraphLayout showNodeMenu={true}>
          <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Failed to load memories. Please try again.
                </p>
              </CardContent>
            </Card>
          </div>
        </GraphLayout>
      </div>
    );
  }

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <GraphLayout showNodeMenu={true}>
        <div className="relative h-full w-full overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <Card className="w-[300px]">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search nodes..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="h-full w-full">
          <MemoryGraph
            memories={memories || []}
            onNodeClick={handleNodeClick}
            searchQuery={searchQuery}
            layout={layout}
            onLayoutChange={setLayout}
            showTagEdges={showTagEdges}
            onToggleTagEdges={() => setShowTagEdges(!showTagEdges)}
            filters={{
              edgeTypes: showTagEdges ? undefined : [EdgeType.CONTAINS, EdgeType.HAS_MEMORY, EdgeType.RELATES_TO, EdgeType.SIMILAR_TO, EdgeType.TEMPORAL_LINK, EdgeType.HAPPENED_AT]
            }}
          />
        </div>

        {selectedNode && (
          <NodeDetailsPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </GraphLayout>
    </div>
  );
}