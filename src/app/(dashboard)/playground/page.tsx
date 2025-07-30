"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from "lucide-react";
import { format, isToday } from "date-fns";
import ChatInterface from "./_components/chat-interface";
import ChatHistory from "./_components/chat-history";
import MemoriesPanel from "./_components/memories-panel-simple";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ListMemoriesAction } from "@/actions/memory/list-memories-action";
import { MemoryResponse } from "@/api/memory-api";

export default function PlaygroundPage() {
  const [memories, setMemories] = useState<MemoryResponse[]>([]);
  const [selectedTime, setSelectedTime] = useState(100);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    loadMemories();
  }, []);

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

  // Get date range from memories
  const { startDate, endDate } = useMemo(() => {
    if (memories.length === 0) {
      const now = new Date();
      return {
        startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        endDate: now
      };
    }
    const sortedMemories = [...memories].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return {
      startDate: new Date(sortedMemories[0].createdAt),
      endDate: new Date(sortedMemories[sortedMemories.length - 1].createdAt)
    };
  }, [memories]);

  // Update current date based on slider
  useEffect(() => {
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setCurrentDate(new Date());
      return;
    }
    
    const percentage = selectedTime / 100;
    const milliseconds = startDate.getTime() + (endDate.getTime() - startDate.getTime()) * percentage;
    setCurrentDate(new Date(milliseconds));
  }, [selectedTime, startDate, endDate]);

  const handlePrevious = () => {
    setSelectedTime(Math.max(0, selectedTime - 10));
  };

  const handleNext = () => {
    setSelectedTime(Math.min(100, selectedTime + 10));
  };

  const handleJumpToToday = () => {
    setSelectedTime(100);
  };

  const formatDateLabel = (date: Date) => {
    if (!date || isNaN(date.getTime())) return "Invalid Date";
    if (isToday(date)) return "Today";
    return format(date, "MMMM d, yyyy");
  };
  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-2xl font-bold">Playground</h1>
          <p className="text-sm text-muted-foreground">
            Test Context0 memory with an AI assistant
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Panels */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Chat History */}
            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={30}
            >
              <div className="flex h-full flex-col">
                <div className="border-b p-4">
                  <h2 className="font-semibold">Chat History</h2>
                </div>
                <ChatHistory currentDate={currentDate} />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Center Panel - Chat Interface */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <ChatInterface currentDate={currentDate} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Memories */}
            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={30}
            >
              <div className="flex h-full flex-col">
                <div className="border-b p-4">
                  <h2 className="font-semibold">Memories</h2>
                </div>
                <MemoriesPanel currentDate={currentDate} memories={memories} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Timeline Controls at Bottom */}
        <div className="border-t bg-background">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{formatDateLabel(currentDate)}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleJumpToToday}
                  disabled={selectedTime === 100}
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Today
                </Button>
              </div>
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
              <span>{startDate && !isNaN(startDate.getTime()) ? format(startDate, "MMM d, yyyy") : ""}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {currentDate && !isNaN(currentDate.getTime()) ? format(currentDate, "h:mm a") : ""}
              </span>
              <span>{endDate && !isNaN(endDate.getTime()) ? format(endDate, "MMM d, yyyy") : ""}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}