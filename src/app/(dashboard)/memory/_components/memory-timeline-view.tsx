"use client";

import { MemoryResponse } from "@/api/memory-api";
import MemoryTimeline from "@/components/memory-timeline";

interface MemoryTimelineViewProps {
  memories: MemoryResponse[];
  onMemoryClick?: (memory: MemoryResponse) => void;
}

export default function MemoryTimelineView({ memories, onMemoryClick }: MemoryTimelineViewProps) {
  const handleSelectMemory = (memory: any) => {
    // The timeline component uses snake_case, need to find matching memory
    const matchingMemory = memories.find(m => m.id === memory.id);
    if (matchingMemory) {
      onMemoryClick?.(matchingMemory);
    }
  };

  // Convert MemoryResponse to the format expected by MemoryTimeline
  const timelineMemories = memories.map(m => ({
    id: m.id,
    created_at: m.createdAt,
    input: m.input,
    summary: m.summary,
    confidence: m.confidence,
  }));

  return (
    <MemoryTimeline
      memories={timelineMemories}
      onSelectMemory={handleSelectMemory}
    />
  );
}