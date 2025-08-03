"use client";

import { Settings2, ZoomIn, ZoomOut, Maximize2, Home, Tag } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GraphControlsProps {
  layout: "force" | "hierarchical" | "radial";
  onLayoutChange: (layout: "force" | "hierarchical" | "radial") => void;
  showTagEdges?: boolean;
  onToggleTagEdges?: () => void;
}

export default function GraphControls({ layout, onLayoutChange, showTagEdges = true, onToggleTagEdges }: GraphControlsProps) {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();
  
  const handleZoomIn = () => {
    zoomIn({ duration: 200 });
  };
  
  const handleZoomOut = () => {
    zoomOut({ duration: 200 });
  };
  
  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 400 });
  };
  
  const handleResetView = () => {
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 400 });
  };
  return (
    <Card>
      <CardContent className="flex gap-1 p-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Zoom In"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Zoom Out"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Fit to Screen"
          onClick={handleFitView}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Reset View"
          onClick={handleResetView}
        >
          <Home className="h-4 w-4" />
        </Button>
        
        <div className="mx-1 w-px bg-border" />
        
        <Button
          variant={showTagEdges ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          title="Toggle Tag Edges"
          onClick={onToggleTagEdges}
        >
          <Tag className="h-4 w-4" />
        </Button>
        
        <div className="mx-1 w-px bg-border" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Layout Settings"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Graph Layout</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onLayoutChange("force")}
              className={layout === "force" ? "bg-accent" : ""}
            >
              Force-Directed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onLayoutChange("hierarchical")}
              className={layout === "hierarchical" ? "bg-accent" : ""}
            >
              Hierarchical
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onLayoutChange("radial")}
              className={layout === "radial" ? "bg-accent" : ""}
            >
              Radial
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}