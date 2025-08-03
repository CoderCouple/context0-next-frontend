export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  messageCount: number;
  total_memories_extracted?: number;
}

export interface MemoryExtracted {
  id: string;
  content: string;
  memory_type: "semantic_memory" | "episodic_memory" | "procedural_memory" | "declarative_memory" | "emotional_memory" | "meta_memory" | "working_memory";
  tags: string[];
  confidence: number;
}

export interface ContextMemory {
  id: string;
  content: string;
  summary: string | null;
  memory_type: "semantic_memory" | "episodic_memory" | "procedural_memory" | "declarative_memory" | "emotional_memory" | "meta_memory" | "working_memory";
  score: number;
  tags: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  memories_extracted?: MemoryExtracted[] | null;
  context_used?: ContextMemory[] | null;
  metadata?: Record<string, any> | null;
}

export interface ChatSessionResponse {
  session: ChatSession;
  messages: ChatMessage[];
}

export interface CreateSessionRequest {
  title?: string;
  initialMessage?: string;
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
}

export interface SendMessageResponse {
  message: ChatMessage;
  assistantMessage: ChatMessage;
  memoriesExtracted?: string[];
}

export interface ExtractMemoriesRequest {
  sessionId: string;
  messageIds?: string[];
}

export interface ExtractMemoriesResponse {
  memoriesCreated: number;
  memories: Array<{
    id: string;
    content: string;
    tags: string[];
  }>;
}