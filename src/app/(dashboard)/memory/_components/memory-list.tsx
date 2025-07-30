"use client";

import { useState } from "react";
import { MoreHorizontal, Calendar, Tag, Eye, Brain } from "lucide-react";
import { format, parseISO } from "date-fns";

import { MemoryResponse } from "@/api/memory-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteMemoryAction } from "@/actions/memory/delete-memory-action";
import { toast } from "sonner";

interface MemoryListProps {
  memories: MemoryResponse[];
  onMemoryClick?: (memory: any) => void;
}

export default function MemoryList({ memories, onMemoryClick }: MemoryListProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  
  console.log("MemoryList received memories:", memories);

  const handleDelete = async (memoryId: string) => {
    setDeletingIds(prev => new Set(prev).add(memoryId));
    
    try {
      const result = await DeleteMemoryAction(memoryId);
      if (result.success) {
        toast.success("Memory deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete memory");
      }
    } catch (error) {
      toast.error("Failed to delete memory");
      console.error("Delete memory error:", error);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(memoryId);
        return newSet;
      });
    }
  };

  if (memories.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="mx-auto max-w-md">
          <Brain className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">No memories yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first memory to get started with your personal knowledge base.
          </p>
        </div>
      </div>
    );
  }

  // Sort memories chronologically (newest first)
  const sortedMemories = [...memories].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedMemories.map((memory) => (
        <Card 
          key={memory.id} 
          className="transition-all hover:shadow-md cursor-pointer"
          onClick={() => onMemoryClick?.(memory)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="line-clamp-2 text-base">
                  {memory.summary || `${memory.input.substring(0, 100)}...`}
                </CardTitle>
                <CardDescription className="mt-1 flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(parseISO(memory.createdAt), "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {memory.accessCount} views
                  </span>
                </CardDescription>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    disabled={deletingIds.has(memory.id)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(memory.id)}
                    disabled={deletingIds.has(memory.id)}
                  >
                    {deletingIds.has(memory.id) ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="line-clamp-3 text-sm text-muted-foreground mb-3">
              {memory.input}
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {memory.memoryType.replace(/_/g, " ")}
              </Badge>
              
              <Badge variant="outline" className="text-xs">
                {Math.round(memory.confidence * 100)}% confidence
              </Badge>
              
              {memory.tags && memory.tags.length > 0 && (
                <>
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  {memory.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {memory.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{memory.tags.length - 3} more
                    </Badge>
                  )}
                </>
              )}
            </div>
            
            {memory.scope && (
              <div className="mt-2 text-xs text-muted-foreground">
                Scope: {memory.scope}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}