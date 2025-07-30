"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Lightbulb, Clock, Target, Brain } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AskQuestionAction } from "@/actions/chat/ask-question-action";
import { ConversationAction } from "@/actions/chat/conversation-action";
import { toast } from "sonner";
import { MemoryContext } from "@/api/chat-api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  confidence?: number;
  contexts?: MemoryContext[];
  suggestions?: string[];
  processing_time?: number;
}

interface MemoryChatSidebarProps {
  className?: string;
}

export default function MemoryChatSidebar({ className }: MemoryChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Use conversation API if we have previous messages, otherwise use question API
      if (messages.length > 0) {
        const conversationMessages = [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

        const result = await ConversationAction({
          messages: conversationMessages,
          session_id: "memory_chat",
          max_memories: 10,
          conversation_context_window: 5,
        });

        if (result.success && result.data) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: result.data.response,
            timestamp: new Date(),
            confidence: result.data.confidence,
            contexts: result.data.context_memories,
            suggestions: result.data.follow_up_suggestions,
            processing_time: result.data.processing_time_ms,
          };

          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error(result.message || "Failed to get response");
        }
      } else {
        // First message - use question API
        const result = await AskQuestionAction({
          question: input.trim(),
          session_id: "memory_chat",
          max_memories: 10,
          search_depth: "comprehensive",
          include_meta_memories: true,
        });

        if (result.success && result.data) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: result.data.answer,
            timestamp: new Date(),
            confidence: result.data.confidence,
            contexts: result.data.memory_contexts,
            suggestions: result.data.suggestions,
            processing_time: result.data.processing_time_ms,
          };

          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error(result.message || "Failed to get response");
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(error.message || "Failed to send message");
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  return (
    <Card className={`flex h-full flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5" />
          Memory Chat
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about your memories or have a conversation with your knowledge base.
        </p>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col gap-0 p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bot className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Start a conversation with your memories!
                </p>
                <div className="space-y-2 text-xs">
                  <p className="font-medium">Try asking:</p>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-2 text-left justify-start text-xs"
                      onClick={() => handleSuggestionClick("What did I learn about TypeScript?")}
                    >
                      "What did I learn about TypeScript?"
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-2 text-left justify-start text-xs"
                      onClick={() => handleSuggestionClick("Show me my recent project notes")}
                    >
                      "Show me my recent project notes"
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`flex max-w-[80%] gap-2 ${
                    message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.role === "assistant"
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                    
                    {message.role === "assistant" && (
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          {message.confidence && (
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {Math.round(message.confidence * 100)}% confident
                            </span>
                          )}
                          {message.processing_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {message.processing_time}ms
                            </span>
                          )}
                        </div>
                        
                        {message.contexts && message.contexts.length > 0 && (
                          <div className="space-y-1">
                            <p className="font-medium">Based on {message.contexts.length} memories:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.contexts.slice(0, 3).map((context, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {context.memoryType.replace(/_/g, " ")}
                                </Badge>
                              ))}
                              {message.contexts.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{message.contexts.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="space-y-1">
                            <p className="flex items-center gap-1 font-medium">
                              <Lightbulb className="h-3 w-3" />
                              Suggestions:
                            </p>
                            <div className="space-y-1">
                              {message.suggestions.slice(0, 2).map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto justify-start p-1 text-xs hover:bg-muted/50"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="animate-pulse">Thinking...</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />
        
        <form onSubmit={handleSubmit} className="p-3">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your memories..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}