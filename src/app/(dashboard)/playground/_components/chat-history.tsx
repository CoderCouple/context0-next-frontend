"use client";

import { MessageSquare, Trash2, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChatSessions, useCreateChatSession, useDeleteChatSession } from "@/hooks/use-chat";
import { ChatSession } from "@/types/chat";
import { useChatStore } from "@/store/chat-store";
import { deleteAllSessionsAction } from "@/actions/chat/chat-session-actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatHistoryProps {
  onSessionSelect?: (sessionId: string) => void;
  selectedSessionId?: string;
}

export default function ChatHistory({ onSessionSelect, selectedSessionId }: ChatHistoryProps) {
  const { data: sessionsData, isLoading, refetch: refetchSessions } = useChatSessions();
  const createSessionMutation = useCreateChatSession();
  const deleteSessionMutation = useDeleteChatSession();
  const { setSessions, clearSessionMessages, clearAllSessions } = useChatStore();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const sessions = sessionsData?.success && sessionsData.data ? sessionsData.data : [];
  
  // Sync sessions with store
  useEffect(() => {
    if (sessionsData?.success && sessionsData.data) {
      setSessions(sessionsData.data);
    }
  }, [sessionsData, setSessions]);

  const handleNewChat = async () => {
    try {
      const result = await createSessionMutation.mutateAsync({
        title: "New Chat",
      });
      
      if (result.success && result.data) {
        // Immediately select the new chat
        onSessionSelect?.(result.data.id);
      }
    } catch (error) {
      // Error is already handled by the mutation
      console.error("Failed to create chat:", error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSessionMutation.mutateAsync(sessionId);
      clearSessionMessages(sessionId);
      if (selectedSessionId === sessionId) {
        onSessionSelect?.("");
      }
    } catch (error) {
      // Error is already handled by the mutation
      console.error("Failed to delete chat:", error);
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      const result = await deleteAllSessionsAction(false); // Always soft delete
      
      if (result.success) {
        // Clear the local store
        clearAllSessions();
        
        // Reset the selected session
        onSessionSelect?.("");
        
        // Refetch sessions to ensure consistency
        await refetchSessions();
        
        const deletedCount = result.data?.deletedCount || 0;
        toast.success(`Cleared ${deletedCount} chat sessions`);
      } else {
        toast.error(result.message || "Failed to clear chat sessions");
      }
    } catch (error) {
      console.error("Failed to clear all sessions:", error);
      toast.error("Failed to clear chat sessions");
    } finally {
      setIsClearing(false);
      setShowClearDialog(false);
    }
  };

  const formatTimestamp = (dateStr: string) => {
    if (!dateStr) return "Unknown";
    
    const date = new Date(dateStr);
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateStr);
      return "Invalid date";
    }
    
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    // Within 5 minutes
    if (minutes < 5) return "now";
    
    // Check if same day
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      if (hours === 0) return `${minutes} min ago`;
      if (hours === 1) return "1 hour ago";
      return `${hours} hours ago`;
    }
    
    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isYesterday) return "yesterday";
    
    // For dates within this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    
    // For older dates, show full date
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="p-4 space-y-2">
          <Button 
            onClick={handleNewChat} 
            className="w-full" 
            size="sm"
            disabled={createSessionMutation.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            {createSessionMutation.isPending ? "Creating..." : "New Chat"}
          </Button>
          
          {sessions.length > 0 && (
            <Button
              onClick={() => setShowClearDialog(true)}
              className="w-full"
              size="sm"
              variant="outline"
              disabled={isClearing}
            >
              <Trash className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

      <ScrollArea className="flex-1">
        <div className="px-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading chats...</div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No chats yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create a new chat to get started</p>
            </div>
          ) : (
            <div className="space-y-2 pb-4 pr-2">
            {sessions.map((session: ChatSession, index: number) => (
              <div
                key={`${session.id}-${index}`}
                className={cn(
                  "group relative cursor-pointer rounded-lg p-3 hover:bg-accent overflow-hidden",
                  selectedSessionId === session.id && "bg-accent"
                )}
                onClick={() => onSessionSelect?.(session.id)}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="truncate text-sm font-medium flex-1">
                        {session.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 hover:bg-destructive/20 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {session.lastMessage && (
                      <p className="text-xs text-muted-foreground">
                        {session.lastMessage.length > 20 
                          ? `${session.lastMessage.substring(0, 20)  }...` 
                          : session.lastMessage}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTimestamp(session.createdAt || session.updatedAt)}</span>
                      <span>•</span>
                      <span>{session.messageCount} messages</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </ScrollArea>
    </div>

    <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear All Chat Sessions</AlertDialogTitle>
          <AlertDialogDescription>
            This will clear all your chat sessions. The chats will be removed from your view but can be recovered if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClearAll}
            disabled={isClearing}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isClearing ? "Clearing..." : "Clear All"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}