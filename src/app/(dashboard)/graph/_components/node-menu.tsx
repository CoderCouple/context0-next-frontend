"use client";

import React from "react";
import {
  Brain,
  User,
  MapPin,
  Calendar,
  Tag,
  Lightbulb,
  Building2,
  Server,
  Users,
  Hash,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NodeType } from "../core/types";
import { getNodeConfig } from "../core/node-registry";

interface NodeMenuItem {
  type: NodeType;
  label: string;
  icon: React.FC<{ className?: string }>;
  category: string;
}

const nodeMenuItems = {
  primary: [
    { type: NodeType.MEMORY, label: "Memory", icon: Brain, category: "primary" },
  ],
  entities: [
    { type: NodeType.PERSON, label: "Person", icon: User, category: "entities" },
    { type: NodeType.LOCATION, label: "Location", icon: MapPin, category: "entities" },
    { type: NodeType.ORGANIZATION, label: "Organization", icon: Building2, category: "entities" },
    { type: NodeType.ENTITY, label: "Generic Entity", icon: Hash, category: "entities" },
  ],
  metadata: [
    { type: NodeType.TAG, label: "Tag", icon: Tag, category: "metadata" },
    { type: NodeType.TEMPORAL, label: "Date/Time", icon: Calendar, category: "metadata" },
    { type: NodeType.CONCEPT, label: "Concept", icon: Lightbulb, category: "metadata" },
  ],
  system: [
    { type: NodeType.SESSION, label: "Session", icon: Users, category: "system" },
    { type: NodeType.USER, label: "User", icon: User, category: "system" },
    { type: NodeType.SYSTEM, label: "System", icon: Server, category: "system" },
  ],
};

export default function NodeMenu() {
  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    // Create a temporary node data for drag
    const nodeData = {
      type: nodeType,
      label: `New ${nodeType}`,
      id: `temp_${nodeType}_${Date.now()}`,
    };
    
    e.dataTransfer.setData("application/reactflow", JSON.stringify(nodeData));
    e.dataTransfer.effectAllowed = "move";
  };

  const NodeMenuButton = ({ item }: { item: NodeMenuItem }) => {
    const nodeConfig = getNodeConfig(item.type);
    const Icon = item.icon;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 cursor-move"
        draggable
        onDragStart={(e) => handleDragStart(e, item.type)}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: nodeConfig.defaultStyle.color?.background,
          }}
        >
          <Icon className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm">{item.label}</span>
      </Button>
    );
  };

  return (
    <aside className="h-full w-[280px] min-w-[280px] max-w-[280px] border-separate overflow-auto border-r-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">Node Library</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag nodes to add them to the graph
        </p>
        
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["primary", "entities", "metadata"]}
        >
          <AccordionItem value="primary">
            <AccordionTrigger className="text-sm font-medium">
              Primary Nodes
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              {nodeMenuItems.primary.map((item) => (
                <NodeMenuButton key={item.type} item={item} />
              ))}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="entities">
            <AccordionTrigger className="text-sm font-medium">
              Entities
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              {nodeMenuItems.entities.map((item) => (
                <NodeMenuButton key={item.type} item={item} />
              ))}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="metadata">
            <AccordionTrigger className="text-sm font-medium">
              Metadata
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              {nodeMenuItems.metadata.map((item) => (
                <NodeMenuButton key={item.type} item={item} />
              ))}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="system">
            <AccordionTrigger className="text-sm font-medium">
              System
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              {nodeMenuItems.system.map((item) => (
                <NodeMenuButton key={item.type} item={item} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-6 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Double-click nodes to center view</li>
            <li>• Drag nodes to reposition</li>
            <li>• Click edges to delete them</li>
            <li>• Use search to filter nodes</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}