"use client";

import { useState, useEffect, useMemo } from "react";
// import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from "lucide-react";
// import { format, isToday } from "date-fns";
import ChatInterface from "./_components/chat-interface";
import ChatHistory from "./_components/chat-history";
import MemoriesPanel from "./_components/memories-panel-playground";
import LLMPresetSettings from "./_components/llm-preset-settings";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
// import { Slider } from "@/components/ui/slider";
import { useChatStore } from "@/store/chat-store";
import { LLMPreset } from "@/types/llm-preset";

export default function PlaygroundPage() {
  const { currentSessionId, setCurrentSessionId, extractedMemories } = useChatStore();
  const [selectedPreset, setSelectedPreset] = useState<LLMPreset | null>(null);
  
  // Debug available via window.debugChatSession()



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
        <div className="flex items-center gap-2">
          <LLMPresetSettings onPresetChange={setSelectedPreset} />
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
                <ChatHistory 
                  onSessionSelect={setCurrentSessionId}
                  selectedSessionId={currentSessionId || undefined}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Center Panel - Chat Interface */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <ChatInterface />
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
                  <h2 className="font-semibold text-sm">Extracted Memories ({extractedMemories.length})</h2>
                </div>
                <MemoriesPanel memories={extractedMemories} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

      </div>
    </div>
  );
}