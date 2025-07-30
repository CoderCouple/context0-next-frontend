"use client";

import { useState, useEffect } from "react";
import { X, Brain, Tag, Zap, Clock, Heart, Folder, Gauge } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  // Additional fields from your backend
  category?: string;
  emotion?: string;
  emotion_intensity?: string;
}

interface MemoryDetailPanelProps {
  memory: Memory | null;
  open: boolean;
  onClose: () => void;
}

const getMemoryTypeIcon = (type: string) => {
  switch (type) {
    case "semantic_memory":
      return <Brain className="h-4 w-4" />;
    case "episodic_memory":
      return <Clock className="h-4 w-4" />;
    case "emotional_memory":
      return <Heart className="h-4 w-4" />;
    default:
      return <Folder className="h-4 w-4" />;
  }
};

const getEmotionColor = (emotion?: string) => {
  if (!emotion) return "default";
  
  const emotionColors: Record<string, string> = {
    joy: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    sadness: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    anger: "bg-red-500/10 text-red-700 border-red-500/20",
    fear: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    surprise: "bg-pink-500/10 text-pink-700 border-pink-500/20",
    disgust: "bg-green-500/10 text-green-700 border-green-500/20",
    neutral: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  };
  
  return emotionColors[emotion.toLowerCase()] || "default";
};

export default function MemoryDetailPanel({ memory, open, onClose }: MemoryDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (open && memory) {
      // Reset to overview tab when opening with new memory
      setActiveTab("overview");
    }
  }, [open, memory?.id, memory]);

  console.log("MemoryDetailPanel - memory:", memory);
  console.log("MemoryDetailPanel - open:", open);

  if (!memory) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp");
    } catch {
      return dateString;
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-[500px] sm:max-w-[500px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              {getMemoryTypeIcon(memory.memory_type)}
              Memory Detail
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-200px)] mt-6">
            <TabsContent value="overview" className="space-y-4">
              {/* Content Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {memory.input}
                  </p>
                </CardContent>
              </Card>

              {/* Summary Section */}
              {memory.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {memory.summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Tags Section */}
              {memory.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {memory.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Emotion Section */}
              {(memory.emotion || memory.category) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Context</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {memory.emotion && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Emotion</span>
                        <Badge 
                          variant="outline" 
                          className={cn("capitalize", getEmotionColor(memory.emotion))}
                        >
                          <Heart className="mr-1 h-3 w-3" />
                          {memory.emotion}
                          {memory.emotion_intensity && (
                            <span className="ml-1 text-xs">
                              ({memory.emotion_intensity})
                            </span>
                          )}
                        </Badge>
                      </div>
                    )}
                    {memory.category && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <Badge variant="outline">
                          <Folder className="mr-1 h-3 w-3" />
                          {memory.category}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Gauge className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Confidence</span>
                    </div>
                    <p className="text-2xl font-semibold">
                      {Math.round(memory.confidence * 100)}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Zap className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Access Count</span>
                    </div>
                    <p className="text-2xl font-semibold">
                      {memory.access_count}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Dates Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {formatDate(memory.created_at)}
                    </p>
                  </div>
                  {memory.updated_at && memory.updated_at !== memory.created_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">
                        {formatDate(memory.updated_at)}
                      </p>
                    </div>
                  )}
                  {memory.last_accessed && (
                    <div>
                      <p className="text-sm text-muted-foreground">Last Accessed</p>
                      <p className="text-sm font-medium">
                        {formatDate(memory.last_accessed)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Custom Metadata */}
              {Object.keys(memory.meta || {}).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Custom Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(memory.meta, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Technical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Memory ID</p>
                      <p className="font-mono text-xs">{memory.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CID</p>
                      <p className="font-mono text-xs">{memory.cid}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <Badge variant="outline" className="text-xs">
                        {memory.memory_type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Scope</p>
                      <p className="text-xs">{memory.scope || "default"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Raw Data</p>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(memory, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}