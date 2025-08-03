"use client";

import { Brain, Clock, Tag, Hash, BarChart3, Calendar, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MemoryDetailPanelProps {
  memory: any | null;
  open: boolean;
  onClose: () => void;
}

export default function MemoryDetailPanel({ memory, open, onClose }: MemoryDetailPanelProps) {
  if (!memory) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Memory Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Content Section */}
          <div>
            <h3 className="text-sm font-medium mb-2">Content</h3>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {memory.content || memory.input || memory.summary || "No content available"}
            </p>
          </div>

          {/* Summary Section (if different from content) */}
          {memory.summary && memory.summary !== memory.content && (
            <div>
              <h3 className="text-sm font-medium mb-2">Summary</h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {memory.summary}
              </p>
            </div>
          )}

          <Separator />

          {/* Metadata Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Metadata</h3>
            
            {/* Memory Type */}
            <div className="flex items-center gap-2 text-sm">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="outline">
                {(memory.memory_type || memory.memoryType || "unknown").replace(/_/g, " ")}
              </Badge>
            </div>

            {/* Confidence Score */}
            {(memory.confidence !== undefined || memory.score !== undefined) && (
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-medium">
                  {((memory.confidence || memory.score || 0) * 100).toFixed(0)}%
                </span>
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span>{format(new Date(memory.created_at || memory.createdAt), "PPp")}</span>
            </div>

            {/* Last Accessed */}
            {memory.last_accessed && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last accessed:</span>
                <span>{format(new Date(memory.last_accessed), "PPp")}</span>
              </div>
            )}

            {/* Access Count */}
            {memory.access_count !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Access count:</span>
                <span className="font-medium">{memory.access_count}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Tags Section */}
          {memory.tags && memory.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Metadata */}
          {memory.meta && Object.keys(memory.meta).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-3">Additional Metadata</h3>
                <div className="space-y-2">
                  {Object.entries(memory.meta).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono text-xs">{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ID Section */}
          <Separator />
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">ID:</span> {memory.id}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}