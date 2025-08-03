"use client";

import { useState } from "react";

import { format } from "date-fns";
import { Brain } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import MemoryDetailPanel from "./memory-detail-panel";

interface MemoriesPanelProps {
  memories?: any[]; // Changed from MemoryResponse[] to any[] for extracted memories
}

export default function MemoriesPanel({ memories = [] }: MemoriesPanelProps) {
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  
  // Rendering memories panel

  const handleMemoryClick = (memory: any) => {
    setSelectedMemory(memory);
    setDetailPanelOpen(true);
  };

  if (memories.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <Brain className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            No memories extracted yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Memories will appear here as they are extracted from your
            conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="space-y-3 p-4">
          <>
            <p className="mb-3 text-xs text-muted-foreground">
              {memories.length} extracted{" "}
              {memories.length === 1 ? "memory" : "memories"}
            </p>
            {memories.map((memory, index) => (
              <Card
                key={memory.id || `memory-${index}`}
                className="cursor-pointer p-3 transition-colors hover:bg-accent/50"
                onClick={() => handleMemoryClick(memory)}
              >
                <div className="space-y-2">
                  {/* Main memory content with icon */}
                  <div className="flex items-start gap-2">
                    <Brain className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <p className="line-clamp-2 flex-1 text-sm">
                      {memory.input || memory.content || "No content"}
                    </p>
                  </div>

                  {/* Time and confidence in one line */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{format(new Date(memory.createdAt), "h:mm a")}</span>
                    <span>
                      {Math.round(memory.confidence * 100)}% confidence
                    </span>
                  </div>

                  {/* Memory type and tags */}
                  <div className="flex flex-wrap items-center gap-1">
                    {memory.memoryType && (
                      <Badge variant="outline" className="h-5 text-xs">
                        {memory.memoryType.replace(/_/g, " ")}
                      </Badge>
                    )}
                    {memory.tags && memory.tags.length > 0 && (
                      <>
                        {memory.tags
                          .slice(0, 2)
                          .map((tag: string, index: number) => (
                            <Badge
                              key={`${memory.id}-${tag}-${index}`}
                              variant="secondary"
                              className="h-5 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        {memory.tags.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{memory.tags.length - 2} more
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </>
        </div>
      </ScrollArea>

      {/* Memory Detail Panel */}
      <MemoryDetailPanel
        memory={selectedMemory}
        open={detailPanelOpen}
        onClose={() => {
          setDetailPanelOpen(false);
          setSelectedMemory(null);
        }}
      />
    </>
  );
}
