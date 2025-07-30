"use client";

import { useState } from "react";
import { MessageSquare, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

// Mock data - replace with actual API calls
const mockSessions: ChatSession[] = [
  {
    id: "1",
    title: "Memory Integration Test",
    lastMessage: "How does Context0 integrate with my memories?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    messageCount: 5,
  },
  {
    id: "2",
    title: "API Questions",
    lastMessage: "Can you explain the memory API?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messageCount: 8,
  },
  {
    id: "3",
    title: "Getting Started",
    lastMessage: "What is Context0?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messageCount: 3,
  },
];

interface ChatHistoryProps {
  currentDate?: Date;
}

export default function ChatHistory({ }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const handleNewChat = () => {
    // TODO: Implement new chat creation
    console.log("Create new chat");
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (selectedSession === sessionId) {
      setSelectedSession(null);
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <Button onClick={handleNewChat} className="w-full" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 pb-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "group relative cursor-pointer rounded-lg p-3 hover:bg-accent",
                selectedSession === session.id && "bg-accent"
              )}
              onClick={() => setSelectedSession(session.id)}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="truncate text-sm font-medium">
                      {session.title}
                    </h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(session.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete chat</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.lastMessage}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatTimestamp(session.timestamp)}</span>
                    <span>•</span>
                    <span>{session.messageCount} messages</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}