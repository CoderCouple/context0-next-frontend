"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Brain, Tag, Calendar, Hash, RefreshCw, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { format, startOfDay, endOfDay, isToday } from "date-fns";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListMemoriesAction } from "@/actions/memory/list-memories-action";
import { MemoryResponse } from "@/api/memory-api";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MemoriesPanel() {
  const [memories, setMemories] = useState<MemoryResponse[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<MemoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  const [selectedTime, setSelectedTime] = useState(100); // 0-100 percentage for timeline

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {
    filterMemories();
  }, [memories, searchQuery, selectedTags]);

  // Timeline calculations
  const { startDate, endDate, currentDate, timelineMemories } = useMemo(() => {
    if (memories.length === 0) {
      const now = new Date();
      return {
        startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        endDate: now,
        currentDate: now,
        timelineMemories: []
      };
    }

    const sortedMemories = [...memories].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    const start = new Date(sortedMemories[0].createdAt);
    const end = new Date(sortedMemories[sortedMemories.length - 1].createdAt);
    
    // Calculate current date based on slider
    const percentage = selectedTime / 100;
    const milliseconds = start.getTime() + (end.getTime() - start.getTime()) * percentage;
    const current = new Date(milliseconds);
    
    // Get memories for current day
    const dayStart = startOfDay(current);
    const dayEnd = endOfDay(current);
    const dayMemories = memories.filter(memory => {
      const memoryDate = new Date(memory.createdAt);
      return memoryDate >= dayStart && memoryDate <= dayEnd;
    });
    
    return {
      startDate: start,
      endDate: end,
      currentDate: current,
      timelineMemories: dayMemories
    };
  }, [memories, selectedTime]);

  const loadMemories = async () => {
    setIsLoading(true);
    try {
      const data = await ListMemoriesAction();
      setMemories(data);
    } catch (error) {
      console.error("Failed to load memories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMemories = useCallback(() => {
    let filtered = memories;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (memory) =>
          memory.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (memory.summary &&
            memory.summary.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((memory) =>
        selectedTags.some((tag) => memory.tags.includes(tag))
      );
    }

    setFilteredMemories(filtered);
  }, [memories, searchQuery, selectedTags]);

  const getAllTags = () => {
    const tagsSet = new Set<string>();
    memories.forEach((memory) => {
      memory.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedTime(Math.max(0, selectedTime - 10));
  };

  const handleNext = () => {
    setSelectedTime(Math.min(100, selectedTime + 10));
  };

  const formatDateLabel = (date: Date) => {
    if (!date || isNaN(date.getTime())) return "Invalid Date";
    if (isToday(date)) return "Today";
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="flex h-full flex-col">
      {/* View Mode Tabs */}
      <div className="border-b">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "timeline")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search and Filters */}
      <div className="border-b p-4 space-y-3">
        <Input
          placeholder="Search memories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        
        {getAllTags().length > 0 && (
          <div className="flex flex-wrap gap-2">
            {getAllTags().map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filteredMemories.length} of {memories.length} memories
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadMemories}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "list" ? (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {filteredMemories.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No memories found
                </p>
              </div>
            ) : (
              filteredMemories.map((memory) => (
                <Card key={memory.id} className="cursor-pointer hover:bg-accent/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium line-clamp-2">
                        {memory.summary || memory.input}
                      </CardTitle>
                      <Badge variant="outline" className="ml-2 shrink-0">
                        {Math.round(memory.confidence * 100)}%
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {formatDate(memory.createdAt)}
                        <span>•</span>
                        <Hash className="h-3 w-3" />
                        {memory.cid.slice(0, 8)}...
                      </div>
                    </CardDescription>
                  </CardHeader>
                  {memory.tags.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        {memory.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Timeline Controls */}
          <div className="border-b p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">{formatDateLabel(currentDate)}</h3>
              <span className="text-xs text-muted-foreground">
                {timelineMemories.length} memories
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                disabled={selectedTime === 0}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <Slider
                  value={[selectedTime]}
                  onValueChange={([value]) => setSelectedTime(value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={selectedTime === 100}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{startDate && format(startDate, "MMM d")}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {currentDate && format(currentDate, "h:mm a")}
              </span>
              <span>{endDate && format(endDate, "MMM d")}</span>
            </div>
          </div>

          {/* Timeline Memories */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {timelineMemories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No memories on this day
                  </p>
                </div>
              ) : (
                timelineMemories.map((memory) => (
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
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}