"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Brain, Contrast, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChatMessage, ContextMemory } from "@/types/chat";
import { useChatSession } from "@/hooks/use-chat";
import { sendChatMessageStreaming, StreamingChatResponse } from "@/api/chat-streaming-api";
import { useAuth, useUser } from "@clerk/nextjs";
import { MarkdownRenderer } from "./markdown-renderer";
import Image from "next/image";
import { useChatStore } from "@/store/chat-store";
import MemoryDetailPanel from "./memory-detail-panel";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { getToken } = useAuth();
  const { user } = useUser();
  
  // Zustand store
  const {
    currentSessionId,
    getCurrentMessages,
    setMessages,
    addMessage,
    streamingMessage,
    setStreamingMessage,
    isStreaming,
    setIsStreaming,
    addExtractedMemory,
    clearExtractedMemories
  } = useChatStore();
  
  const { data: sessionData, isLoading: isLoadingSession, error: sessionError, refetch } = useChatSession(currentSessionId || "");
  
  const messages = getCurrentMessages();
  
  // Debug info available via window.debugChatSession()
  
  // Show error toast if session loading fails
  useEffect(() => {
    if (sessionError) {
      toast.error("Failed to load chat session. Please try again.");
    }
  }, [sessionError]);
  
  // Force refetch when session changes
  useEffect(() => {
    if (currentSessionId) {
      // Refetching session data
      refetch();
    }
  }, [currentSessionId, refetch]);
  
  // Debug button to check current state
  useEffect(() => {
    // Add a global function for debugging
    (window as any).debugChatSession = () => {
      console.log("=== DEBUG CHAT SESSION ===");
      console.log("Current session ID:", currentSessionId);
      console.log("Session data:", sessionData);
      console.log("Total messages:", messages.length);
      
      // Show each message with its type and memories
      messages.forEach((msg, index) => {
        console.log(`\n--- Message ${index + 1} ---`);
        console.log("Role:", msg.role);
        console.log("Content:", `${msg.content.substring(0, 50)  }...`);
        console.log("Has memoriesExtracted:", !!(msg as any).memoriesExtracted);
        console.log("Has contextUsed:", !!(msg as any).contextUsed);
        
        if (msg.role === "assistant") {
          console.log("Full assistant message:");
          console.log(JSON.stringify(msg, null, 2));
        }
      });
      
      console.log("\n--- Store State ---");
      console.log("Extracted memories in store:", useChatStore.getState().extractedMemories);
    };
  }, [currentSessionId, sessionData, messages]);
  
  // Sync messages when session changes or data loads
  useEffect(() => {
    // Syncing messages for session
    if (!currentSessionId) return;
    
    // When session data loads, sync the messages
    if (sessionData?.success && sessionData.data) {
      // The API returns {session, messages} structure
      const messages = sessionData.data.messages || [];
      // Loading messages for session
      setMessages(currentSessionId, messages);
      
      // Clear existing extracted memories first when switching sessions
      clearExtractedMemories();
      
      // Extract memories from all messages in this session
      let totalExtractedMemories = 0;
      messages.forEach((message: ChatMessage) => {
        // Checking message for extracted memories
        
        // Check for extracted memories at the message level (handle both snake_case and camelCase)
        const extractedMemories = (message as any).memoriesExtracted || message.memories_extracted;
        if (extractedMemories && extractedMemories.length > 0) {
          // Found extracted memories
          totalExtractedMemories += extractedMemories.length;
          
          extractedMemories.forEach((memoryData: any) => {
            // Adding extracted memory to store
            addExtractedMemory({
              id: memoryData.id,
              input: memoryData.content,
              createdAt: new Date().toISOString(), // Use current time as extracted memories don't have timestamps
              confidence: memoryData.confidence,
              tags: memoryData.tags,
              memoryType: memoryData.memory_type || memoryData.memoryType
            });
          });
        }
      });
      
      // Processed extracted memories
      
      // If session shows memories were extracted but not in messages, show a placeholder
      const sessionMemoriesExtracted = (sessionData.data.session as any).totalMemoriesExtracted || sessionData.data.session.total_memories_extracted || 0;
      if (totalExtractedMemories === 0 && sessionMemoriesExtracted > 0) {
        // Adding placeholder for extracted memories
        // Add placeholder memories
        for (let i = 0; i < sessionMemoriesExtracted; i++) {
          addExtractedMemory({
            id: `placeholder-${sessionData.data.session.id}-${i}`,
            input: "Memory extracted (details not available in message data)",
            createdAt: new Date().toISOString(),
            confidence: 1.0,
            tags: ["extracted"],
            memoryType: "unknown"
          });
        }
      }
      
      // Updated store with extracted memories
    }
  }, [currentSessionId, sessionData, setMessages, addExtractedMemory, clearExtractedMemories]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Initial fetch when session changes is handled by React Query's enabled option
  // No need to manually refetch as it causes UI flickering

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    // If no session, we need to create one first
    if (!currentSessionId) {
      toast.error("Please start a new chat session");
      return;
    }

    const userInput = input.trim();
    setInput("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date().toISOString(),
    };

    // Add user message to store
    if (currentSessionId) {
      addMessage(currentSessionId, userMessage);
    }
    
    // Initialize streaming message
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      metadata: {},
    };
    
    setStreamingMessage(assistantMessage);
    setIsStreaming(true);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token");
      }

      await sendChatMessageStreaming(
        currentSessionId,
        userInput,
        token,
        (response: StreamingChatResponse) => {
          console.log("Streaming response:", response);
          
          // Check if this response contains extracted memories in summary field
          if (response.summary?.memories_extracted && response.summary.memories_extracted.length > 0) {
            console.log("Found memories in summary:", response.summary.memories_extracted);
            response.summary.memories_extracted.forEach((memoryData: any) => {
              addExtractedMemory({
                id: memoryData.id || `extracted-${Date.now()}-${Math.random()}`,
                input: memoryData.summary || memoryData.content || "Unknown memory",
                createdAt: memoryData.created_at || new Date().toISOString(),
                confidence: memoryData.confidence || 1.0,
                tags: memoryData.tags || [],
                memoryType: memoryData.memory_type || "EPISODIC"
              });
            });
          }
          
          switch (response.type) {
            case "start":
              // Stream started
              break;
              
            case "user_message":
              // Handle user message with context memories
              if ((response as any).message?.context_used) {
                console.log("Context memories used:", (response as any).message.context_used);
                // Store context memories to be added to the assistant message
                assistantMessage.metadata = {
                  ...assistantMessage.metadata,
                  context_used: (response as any).message.context_used
                };
              }
              break;
              
            case "content":
              setStreamingMessage((prev) => 
                prev ? { 
                  ...prev, 
                  content: prev.content + (response.content || ""),
                  metadata: assistantMessage.metadata // Preserve metadata
                } : assistantMessage
              );
              break;
            
            case "assistant_message":
              console.log("Assistant message event:", response);
              if ((response as any).message && currentSessionId) {
                const assistantMsg = (response as any).message;
                // Create final message with proper structure
                const finalMessage: ChatMessage = {
                  id: assistantMsg.id || Date.now().toString(),
                  role: "assistant",
                  content: assistantMsg.content,
                  timestamp: assistantMsg.timestamp || new Date().toISOString(),
                  memories_extracted: assistantMsg.memories_extracted || assistantMsg.memoriesExtracted || null,
                  context_used: assistantMsg.context_used || assistantMsg.contextUsed || null,
                  metadata: assistantMsg.metadata || null,
                  // Also preserve camelCase versions
                  memoriesExtracted: assistantMsg.memoriesExtracted || assistantMsg.memories_extracted || null,
                  contextUsed: assistantMsg.contextUsed || assistantMsg.context_used || null
                } as any;
                
                console.log("Final assistant message:", finalMessage);
                addMessage(currentSessionId, finalMessage);
                setStreamingMessage(null);
                setIsStreaming(false);
                
                // Process extracted memories
                if (assistantMsg.memories_extracted && assistantMsg.memories_extracted.length > 0) {
                  console.log("Processing extracted memories:", assistantMsg.memories_extracted);
                  assistantMsg.memories_extracted.forEach((memoryData: any) => {
                    addExtractedMemory({
                      id: memoryData.id,
                      input: memoryData.content,
                      createdAt: new Date().toISOString(),
                      confidence: memoryData.confidence,
                      tags: memoryData.tags,
                      memoryType: memoryData.memory_type
                    });
                  });
                }
              }
              break;
              
            case "message_complete":
              console.log("Message complete event:", response);
              if (response.message && currentSessionId) {
                console.log("Message metadata:", response.message.metadata);
                addMessage(currentSessionId, response.message);
                setStreamingMessage(null);
                
                // Check if message includes extracted memories (try both field names)
                const extractedMemories = response.message.metadata?.memories_extracted || response.message.metadata?.memoriesExtracted;
                if (extractedMemories && extractedMemories.length > 0) {
                  console.log("Memories extracted from message_complete:", extractedMemories);
                  // Add each extracted memory
                  extractedMemories.forEach((memoryData: any) => {
                    console.log("Memory data from message_complete:", memoryData);
                    addExtractedMemory({
                      id: memoryData.id || `extracted-${Date.now()}-${Math.random()}`,
                      input: memoryData.content || memoryData.input || memoryData.text || memoryData.summary || "Unknown memory",
                      createdAt: memoryData.created_at || memoryData.createdAt || new Date().toISOString(),
                      confidence: memoryData.confidence || 1.0,
                      tags: memoryData.tags || [],
                      memoryType: memoryData.memory_type || memoryData.memoryType || "EPISODIC"
                    });
                  });
                }
              }
              break;
              
            case "done":
              // Stream completed
              // Only add streaming message if it has content and wasn't already handled by message_complete
              const currentStreamingMessage = useChatStore.getState().streamingMessage;
              if (currentStreamingMessage && currentStreamingMessage.content && currentSessionId) {
                // Check if this message was already added (by message_complete event)
                const existingMessages = getCurrentMessages();
                const alreadyAdded = existingMessages.some(m => 
                  m.timestamp === currentStreamingMessage.timestamp && 
                  m.role === currentStreamingMessage.role
                );
                
                if (!alreadyAdded) {
                  addMessage(currentSessionId, currentStreamingMessage);
                }
              }
              setStreamingMessage(null);
              setIsStreaming(false);
              break;
            
            case "memory_extracted":
              console.log("Memory extracted event:", response);
              if (response.memoryId || (response as any).memory) {
                toast.success("Memory extracted from conversation");
                // Check if response includes full memory data
                if ((response as any).memory) {
                  const memoryData = (response as any).memory;
                  console.log("Memory data from event:", memoryData);
                  addExtractedMemory({
                    id: memoryData.id || response.memoryId || `extracted-${Date.now()}`,
                    input: memoryData.content || memoryData.input || memoryData.text || "Unknown content",
                    createdAt: memoryData.createdAt || new Date().toISOString(),
                    confidence: memoryData.confidence || 1.0,
                    tags: memoryData.tags || ["extracted"],
                    memoryType: memoryData.memory_type || memoryData.memoryType || "EPISODIC"
                  });
                } else if (response.memoryId) {
                  // Only have memoryId, add placeholder
                  addExtractedMemory({
                    id: response.memoryId,
                    input: `Memory extracted (ID: ${response.memoryId})`,
                    createdAt: new Date().toISOString(),
                    confidence: 1.0,
                    tags: ["extracted"],
                    memoryType: "EPISODIC"
                  });
                }
              }
              break;
            
            case "error":
              const errorMessage = response.error || "An error occurred";
              
              // Backend bug workaround: ignore memory types sent as errors
              const memoryTypes = ["EPISODIC", "SEMANTIC", "PROCEDURAL", "WORKING", "DECLARATIVE"];
              if (typeof errorMessage === "string" && memoryTypes.includes(errorMessage.toUpperCase())) {
                console.warn("Backend bug: memory type sent as error event, ignoring:", errorMessage);
                // Continue processing, don't treat as error
                // But check if we need to finalize the message
                const currentStream = useChatStore.getState().streamingMessage;
                if (currentStream && currentStream.content && currentSessionId) {
                  addMessage(currentSessionId, currentStream);
                }
                setStreamingMessage(null);
                setIsStreaming(false);
                break;
              }
              
              console.error("Streaming error event:", errorMessage);
              toast.error(errorMessage);
              // Save any partial message without the error suffix
              const errorStreamingMessage = useChatStore.getState().streamingMessage;
              if (errorStreamingMessage && currentSessionId) {
                addMessage(currentSessionId, errorStreamingMessage);
              }
              setStreamingMessage(null);
              setIsStreaming(false);
              break;
          }
        },
        (error) => {
          console.error("Streaming error:", error);
          toast.error("Failed to send message");
          // Save any partial message without error suffix
          const streamingMsg = useChatStore.getState().streamingMessage;
          if (streamingMsg && streamingMsg.content && currentSessionId) {
            addMessage(currentSessionId, streamingMsg);
          }
          setStreamingMessage(null);
          setIsStreaming(false);
        }
      );
      
      // Backend should send assistant_message event, but add fallback just in case
      setTimeout(() => {
        const remainingStreamingMessage = useChatStore.getState().streamingMessage;
        if (remainingStreamingMessage && remainingStreamingMessage.content && currentSessionId) {
          console.warn("Streaming ended without assistant_message event, using fallback");
          addMessage(currentSessionId, remainingStreamingMessage);
          setStreamingMessage(null);
          setIsStreaming(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message");
      setStreamingMessage(null);
      setIsStreaming(false);
    } finally {
      // Ensure streaming is stopped
      if (useChatStore.getState().isStreaming) {
        console.log("Ensuring streaming state is cleared");
        setIsStreaming(false);
        setStreamingMessage(null);
      }
      // Refocus the input after sending
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {!currentSessionId ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-3">
                  <Contrast
                    size={40}
                    style={{ transform: "scaleX(-1)" }}
                    className="stroke-white"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-semibold">Welcome to Context0 Chat</h3>
              <p className="text-base text-muted-foreground">
                Create a new chat session or select an existing one to begin
              </p>
            </div>
          </div>
        ) : (messages.length === 0 || (messages.length === 1 && messages[0].id?.startsWith("welcome-"))) && !isLoadingSession ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Start a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Type a message below to begin
              </p>
            </div>
          </div>
        ) : isLoadingSession ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : sessionError ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-red-500">
                <p className="text-lg font-semibold">Failed to load messages</p>
                <p className="text-sm">The backend returned an error. Please check the backend logs.</p>
              </div>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={cn(
                    "flex gap-3",
                    message.role === "user" && "justify-end"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
                        <Contrast
                          size={16}
                          style={{ transform: "scaleX(-1)" }}
                          className="stroke-white"
                        />
                      </div>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.role === "user"
                        ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                        : "bg-muted"
                    )}
                  >
                    <MarkdownRenderer content={message.content} />
                    <p className="mt-1 text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      {user?.imageUrl ? (
                        <Image 
                          src={user.imageUrl} 
                          alt={user.firstName || "User"} 
                          width={32} 
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <AvatarFallback>
                          {user?.firstName?.[0] || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                </div>
                
                {/* Show relevant memories for AI responses */}
                {message.role === "assistant" && (() => {
                  // Context memories are now at message level (handle both snake_case and camelCase)
                  const contextMemories = (message as any).contextUsed || message.context_used || [];
                  if (!contextMemories || contextMemories.length === 0) return null;
                  
                  console.log("Displaying context memories:", contextMemories);
                  
                  return (
                    <div className="ml-11 mt-2">
                      <div className="flex flex-wrap gap-2">
                        {contextMemories.map((memory: ContextMemory) => {
                        const content = memory.content || memory.summary || "Memory";
                        const score = memory.score;
                        
                        return (
                          <div
                            key={memory.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-xs cursor-pointer hover:bg-muted/70 transition-colors"
                            title={`Type: ${(memory.memory_type || "unknown").replace(/_/g, " ")}\nRelevance: ${(score * 100).toFixed(0)}%`}
                            onClick={() => {
                              setSelectedMemory(memory);
                              setDetailPanelOpen(true);
                            }}
                          >
                            <Brain className="h-3 w-3 text-muted-foreground" />
                            <span className="max-w-[200px] truncate">{content}</span>
                            <span className="text-muted-foreground font-medium">
                              {(score * 100).toFixed(0)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  );
                })()}
                
                {/* Show extracted memories indicator */}
                {(() => {
                  const memoriesExtracted = (message as any).memoriesExtracted || message.memories_extracted;
                  if (memoriesExtracted && memoriesExtracted.length > 0) {
                    return (
                      <div className="ml-11 mt-2">
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <Sparkles className="h-3 w-3" />
                          <span>{memoriesExtracted.length} {memoriesExtracted.length === 1 ? "memory" : "memories"} extracted</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            ))}
            {streamingMessage && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
                    <Contrast
                      size={16}
                      style={{ transform: "scaleX(-1)" }}
                      className="stroke-white"
                    />
                  </div>
                </Avatar>
                <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
                  {streamingMessage.content ? (
                    <MarkdownRenderer content={streamingMessage.content} />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      {currentSessionId && (
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="min-h-[60px] max-h-[200px] resize-none pr-12"
              disabled={isStreaming}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-2 right-2"
              disabled={!input.trim() || isStreaming}
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
      )}
      
      {/* Memory Detail Panel */}
      <MemoryDetailPanel 
        memory={selectedMemory}
        open={detailPanelOpen}
        onClose={() => {
          setDetailPanelOpen(false);
          setSelectedMemory(null);
        }}
      />
    </div>
  );
}