"use client";

import { useMemo } from "react";
import { Brain, Tag } from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemoryResponse } from "@/api/memory-api";

interface MemoriesPanelProps {
  currentDate?: Date;
  memories?: MemoryResponse[];
}

export default function MemoriesPanel({ currentDate, memories = [] }: MemoriesPanelProps) {
  // Filter memories based on current date
  const filteredMemories = useMemo(() => {
    if (!currentDate || isNaN(currentDate.getTime())) {
      return memories;
    }
    
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    
    return memories.filter(memory => {
      const memoryDate = new Date(memory.createdAt);
      return memoryDate >= dayStart && memoryDate <= dayEnd;
    });
  }, [memories, currentDate]);

  if (memories.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <Brain className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            No memories yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first memory to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {filteredMemories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No memories on {currentDate && format(currentDate, "MMMM d, yyyy")}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-3">
              {filteredMemories.length} memories{currentDate && ` on ${format(currentDate, "MMM d")}`}
            </p>
            {filteredMemories.map((memory) => (
              <Card key={memory.id} className="cursor-pointer hover:bg-accent/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {memory.summary || memory.input}
                    </CardTitle>
                    <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                      {format(new Date(memory.createdAt), "h:mm a")}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    <span className="text-muted-foreground">
                      Confidence: {Math.round(memory.confidence * 100)}%
                    </span>
                  </CardDescription>
                </CardHeader>
                {memory.tags.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {memory.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="mr-1 h-2 w-2" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </>
        )}
      </div>
    </ScrollArea>
  );
}