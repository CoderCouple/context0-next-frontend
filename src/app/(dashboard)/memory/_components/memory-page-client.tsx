"use client";

import { useState } from "react";
import { Plus, Search, Grid, List, Clock } from "lucide-react";

import { MemoryResponse } from "@/api/memory-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemoryDetailPanel from "@/components/memory-detail-panel";

import MemoryList from "./memory-list";
import MemoryFlowGraph from "./memory-flow-graph";
import MemoryTimelineView from "./memory-timeline-view";
import CreateMemoryDialog from "./create-memory-dialog";

// Map MemoryResponse to the format expected by MemoryDetailPanel
interface Memory {
  id: string;
  cid: string;
  input: string;
  summary?: string;
  tags: string[];
  scope: string;
  memory_type: string;
  confidence: number;
  created_at: string;
  updated_at?: string;
  last_accessed?: string;
  access_count: number;
  is_deleted: boolean;
  meta: Record<string, any>;
  category?: string;
  emotion?: string;
  emotion_intensity?: string;
}

function mapMemoryResponseToMemory(response: MemoryResponse): Memory {
  return {
    id: response.id,
    cid: response.cid,
    input: response.input,
    summary: response.summary,
    tags: response.tags || [],
    scope: response.scope,
    memory_type: response.memoryType,
    confidence: response.confidence,
    created_at: response.createdAt,
    updated_at: response.updatedAt,
    last_accessed: response.lastAccessed,
    access_count: response.accessCount,
    is_deleted: response.isDeleted,
    meta: response.meta || {},
    // These might not exist in MemoryResponse but are optional
    category: undefined,
    emotion: undefined,
    emotion_intensity: undefined,
  };
}

interface MemoryPageClientProps {
  initialMemories: MemoryResponse[];
  view: string;
  searchQuery: string;
}

export default function MemoryPageClient({ 
  initialMemories, 
  view, 
  searchQuery: initialSearchQuery 
}: MemoryPageClientProps) {
  console.log("MemoryPageClient: Rendering with", initialMemories.length, "memories");
  
  const [memories] = useState(initialMemories);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  const handleMemoryClick = (memory: MemoryResponse) => {
    console.log("Memory clicked:", memory);
    const mappedMemory = mapMemoryResponseToMemory(memory);
    console.log("Mapped memory:", mappedMemory);
    setSelectedMemory(mappedMemory);
    setDetailPanelOpen(true);
  };

  // Filter memories based on search query
  const filteredMemories = searchQuery
    ? memories.filter((memory) =>
        memory.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (memory.summary && memory.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        memory.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : memories;

  return (
    <div className="h-[calc(100vh-6rem)] p-6">
      {/* Main Content */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col gap-4 pb-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Memory</h1>
              <p className="text-muted-foreground">
                View and manage your memories
              </p>
            </div>
            <CreateMemoryDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Memory
              </Button>
            </CreateMemoryDialog>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col min-h-0">
          <Tabs defaultValue={view} className="flex flex-1 flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="graph" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Graph View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="flex-1 mt-6 min-h-0">
              <div className="h-full overflow-auto">
                <MemoryList memories={filteredMemories} onMemoryClick={handleMemoryClick} />
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="flex-1 mt-6 min-h-0">
              <div className="h-full">
                <MemoryTimelineView memories={memories} onMemoryClick={handleMemoryClick} />
              </div>
            </TabsContent>

            <TabsContent value="graph" className="flex-1 mt-6 min-h-0">
              <div className="h-full">
                <MemoryFlowGraph memories={memories} onMemoryClick={handleMemoryClick} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <MemoryDetailPanel
        memory={selectedMemory}
        open={detailPanelOpen}
        onClose={() => setDetailPanelOpen(false)}
      />
    </div>
  );
}