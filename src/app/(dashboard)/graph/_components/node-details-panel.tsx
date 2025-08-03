"use client";

import { X, Brain, Tag, MapPin, Calendar, Lightbulb, User, Building2, Hash, Server, Users } from "lucide-react";
import { NodeType } from "../core/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NodeDetailsPanelProps {
  node: any;
  onClose: () => void;
}

export default function NodeDetailsPanel({ node, onClose }: NodeDetailsPanelProps) {
  if (!node) return null;

  const getNodeIcon = (type: string) => {
    switch (type) {
      case NodeType.MEMORY:
      case "memory":
        return <Brain className="h-5 w-5" />;
      case NodeType.TAG:
      case "tag":
        return <Tag className="h-5 w-5" />;
      case NodeType.LOCATION:
      case "location":
        return <MapPin className="h-5 w-5" />;
      case NodeType.TEMPORAL:
      case "temporal":
        return <Calendar className="h-5 w-5" />;
      case NodeType.CONCEPT:
      case "concept":
        return <Lightbulb className="h-5 w-5" />;
      case NodeType.PERSON:
      case "person":
        return <User className="h-5 w-5" />;
      case NodeType.USER:
      case "user":
        return <Users className="h-5 w-5" />;
      case NodeType.ORGANIZATION:
      case "organization":
        return <Building2 className="h-5 w-5" />;
      case NodeType.ENTITY:
      case "entity":
        return <Hash className="h-5 w-5" />;
      case NodeType.SYSTEM:
      case "system":
        return <Server className="h-5 w-5" />;
      default:
        return <Hash className="h-5 w-5" />;
    }
  };

  const nodeType = node.type || node.label || "Unknown";
  const properties = node.properties || {};

  // Format date string
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  // Format property key
  const formatPropertyKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <Card className="absolute right-4 top-4 bottom-4 z-20 w-[400px] shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {getNodeIcon(nodeType)}
          <CardTitle className="text-lg">{node.label || nodeType}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-semibold mb-1">Type</h4>
                <Badge variant="default">{nodeType}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">ID</h4>
                <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                  {node.id}
                </code>
              </div>
            </div>

            <Separator />

            {/* Memory Node Details */}
            {(nodeType === NodeType.MEMORY || nodeType === "memory") && (
              <>
                {properties.summary && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {properties.summary}
                    </p>
                  </div>
                )}
                
                {properties.input && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Content</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {properties.input}
                    </p>
                  </div>
                )}

                {(properties.category || properties.emotion || properties.memoryType || properties.scope) && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3">
                      {properties.category && (
                        <div>
                          <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Category</h4>
                          <Badge>{properties.category}</Badge>
                        </div>
                      )}
                      
                      {properties.emotion && (
                        <div>
                          <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Emotion</h4>
                          <Badge variant="outline">
                            {properties.emotion}
                            {properties.emotionIntensity && ` (${properties.emotionIntensity})`}
                          </Badge>
                        </div>
                      )}

                      {properties.memoryType && (
                        <div>
                          <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Memory Type</h4>
                          <Badge variant="secondary">{properties.memoryType}</Badge>
                        </div>
                      )}

                      {properties.scope && (
                        <div>
                          <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Scope</h4>
                          <Badge variant="secondary">{properties.scope}</Badge>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {(properties.confidence !== undefined || properties.accessCount !== undefined) && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3">
                      {properties.confidence !== undefined && (
                        <div>
                          <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Confidence</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2 transition-all"
                                style={{ width: `${Math.round(properties.confidence * 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{Math.round(properties.confidence * 100)}%</span>
                          </div>
                        </div>
                      )}
                      
                      {properties.accessCount !== undefined && (
                        <div>
                          <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Access Count</h4>
                          <Badge variant="secondary">{properties.accessCount} views</Badge>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {properties.createdAt && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Created</h4>
                      <p className="text-sm">{formatDate(properties.createdAt)}</p>
                    </div>
                  </>
                )}
              </>
            )}

            {/* User Node Details */}
            {(nodeType === NodeType.USER || nodeType === "user") && (
              <>
                {properties.memoryCount !== undefined && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Total Memories</h4>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {properties.memoryCount} memories
                    </Badge>
                  </div>
                )}
                {properties.isCurrentUser && (
                  <Badge variant="default">Current User</Badge>
                )}
              </>
            )}

            {/* Tag Node Details */}
            {(nodeType === NodeType.TAG || nodeType === "tag") && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Tag</h4>
                <Badge variant="secondary" className="text-base">
                  #{properties.tag || node.label}
                </Badge>
              </div>
            )}

            {/* Location Node Details */}
            {(nodeType === NodeType.LOCATION || nodeType === "location") && (
              <>
                {properties.coordinates && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Coordinates</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {properties.coordinates.lat}, {properties.coordinates.lng}
                    </p>
                  </div>
                )}
                {properties.locationType && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Location Type</h4>
                    <Badge>{properties.locationType}</Badge>
                  </div>
                )}
              </>
            )}

            {/* Temporal Node Details */}
            {(nodeType === NodeType.TEMPORAL || nodeType === "temporal") && (
              <div className="grid grid-cols-3 gap-2">
                {properties.year && (
                  <div>
                    <h5 className="text-xs font-semibold mb-1">Year</h5>
                    <Badge variant="outline">{properties.year}</Badge>
                  </div>
                )}
                {properties.month && (
                  <div>
                    <h5 className="text-xs font-semibold mb-1">Month</h5>
                    <Badge variant="outline">{properties.month}</Badge>
                  </div>
                )}
                {properties.day && (
                  <div>
                    <h5 className="text-xs font-semibold mb-1">Day</h5>
                    <Badge variant="outline">{properties.day}</Badge>
                  </div>
                )}
              </div>
            )}

            {/* Entity Node Details */}
            {(nodeType === NodeType.ENTITY || nodeType === "entity" || 
              nodeType === NodeType.PERSON || nodeType === "person" ||
              nodeType === NodeType.ORGANIZATION || nodeType === "organization") && (
              <>
                {properties.entityType && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Entity Type</h4>
                    <Badge>{properties.entityType}</Badge>
                  </div>
                )}
                {properties.confidence && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Extraction Confidence</h4>
                    <Badge variant="outline">
                      {Math.round(properties.confidence * 100)}%
                    </Badge>
                  </div>
                )}
              </>
            )}

            {/* All Other Properties */}
            <Separator />
            <div>
              <h4 className="text-sm font-semibold mb-2">Additional Properties</h4>
              <div className="space-y-2">
                {Object.entries(properties)
                  .filter(([key]) => {
                    // Skip already displayed properties
                    const skipKeys = [
                      "input", "summary", "category", "emotion", "emotionIntensity", 
                      "confidence", "accessCount", "memoryCount", "tag", "createdAt",
                      "memoryType", "scope", "coordinates", "locationType", "year",
                      "month", "day", "entityType", "isCurrentUser"
                    ];
                    return !skipKeys.includes(key);
                  })
                  .map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium text-muted-foreground">
                        {formatPropertyKey(key)}:
                      </span>{" "}
                      <span className="text-foreground">
                        {typeof value === "object" 
                          ? <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
                          : String(value)
                        }
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}