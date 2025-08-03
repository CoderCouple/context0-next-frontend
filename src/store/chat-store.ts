import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChatMessage, ChatSession } from '@/types/chat';

interface ChatState {
  // Sessions
  sessions: ChatSession[];
  currentSessionId: string | null;
  
  // Messages
  messages: Record<string, ChatMessage[]>; // sessionId -> messages
  streamingMessage: ChatMessage | null;
  isStreaming: boolean;
  
  // Extracted memories for current session
  extractedMemories: any[]; // Array of memories extracted in current session
  
  // UI State
  welcomeShownSessions: Set<string>;
  expandedMemories: Set<string>;
  
  // Actions
  setSessions: (sessions: ChatSession[]) => void;
  setCurrentSessionId: (sessionId: string | null) => void;
  
  // Message actions
  setMessages: (sessionId: string, messages: ChatMessage[]) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  setStreamingMessage: (message: ChatMessage | null | ((prev: ChatMessage | null) => ChatMessage | null)) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  
  // UI actions
  markWelcomeShown: (sessionId: string) => void;
  toggleMemoryExpanded: (messageId: string) => void;
  
  // Memory actions
  addExtractedMemory: (memory: any) => void;
  clearExtractedMemories: () => void;
  
  // Helpers
  getCurrentMessages: () => ChatMessage[];
  clearSessionMessages: (sessionId: string) => void;
  clearAllSessions: () => void;
}

const createWelcomeMessage = (sessionId: string): ChatMessage => ({
  id: `welcome-${sessionId}`,
  role: 'assistant',
  content: `Hello! I'm your AI assistant powered by Context0 memories. 
I can help you with questions while utilizing your stored memories for more personalized and contextual responses.

What would you like to know?`,
  timestamp: new Date(Date.now() - 1000).toISOString(),
});

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      // Initial state
      sessions: [],
      currentSessionId: null,
      messages: {},
      streamingMessage: null,
      isStreaming: false,
      extractedMemories: [],
      welcomeShownSessions: new Set(),
      expandedMemories: new Set(),
      
      // Session actions
      setSessions: (sessions) => set({ sessions }),
      
      setCurrentSessionId: (sessionId) => {
        const state = get();
        
        // Setting current session ID
        
        // Clear extracted memories when switching sessions
        if (sessionId !== state.currentSessionId) {
          set({ extractedMemories: [] });
        }
        
        // Always set the current session ID
        set({ currentSessionId: sessionId });
        
        // Don't add welcome message here - let it be added when messages are set
        // This prevents the welcome message from blocking actual messages from loading
      },
      
      // Message actions
      setMessages: (sessionId, messages) => {
        const state = get();
        
        // Setting messages for session
        
        // Filter out any existing welcome messages from server to avoid duplicates
        const filteredMessages = messages.filter(m => !m.id?.startsWith('welcome-'));
        
        // If no messages from server, add a welcome message
        const allMessages = filteredMessages.length === 0
          ? [createWelcomeMessage(sessionId)]
          : filteredMessages;
          
        // Mark welcome as shown if we added it
        if (filteredMessages.length === 0) {
          set({ welcomeShownSessions: new Set([...state.welcomeShownSessions, sessionId]) });
        }
        
        // Update session with correct message count
        const updatedSessions = state.sessions.map(session => {
          if (session.id === sessionId) {
            return {
              ...session,
              messageCount: filteredMessages.length
            };
          }
          return session;
        });
          
        set({
          messages: {
            ...state.messages,
            [sessionId]: allMessages
          },
          sessions: updatedSessions
        });
      },
      
      addMessage: (sessionId, message) => {
        const state = get();
        const currentMessages = state.messages[sessionId] || [];
        
        // Check if message already exists to avoid duplicates
        const exists = currentMessages.some(m => m.id === message.id);
        if (exists) return;
        
        // Update messages
        const newMessages = [...currentMessages, message];
        
        // Update session with new message count and last message
        const updatedSessions = state.sessions.map(session => {
          if (session.id === sessionId) {
            // Count total memories extracted if this message has any
            let totalMemoriesExtracted = session.total_memories_extracted || 0;
            if (message.memories_extracted && message.memories_extracted.length > 0) {
              totalMemoriesExtracted += message.memories_extracted.length;
            }
            
            return {
              ...session,
              messageCount: newMessages.filter(m => !m.id?.startsWith('welcome-')).length,
              lastMessage: message.role === 'assistant' ? message.content : session.lastMessage,
              total_memories_extracted: totalMemoriesExtracted
            };
          }
          return session;
        });
        
        set({
          messages: {
            ...state.messages,
            [sessionId]: newMessages
          },
          sessions: updatedSessions
        });
      },
      
      updateMessage: (sessionId, messageId, updates) => {
        const state = get();
        const currentMessages = state.messages[sessionId] || [];
        
        set({
          messages: {
            ...state.messages,
            [sessionId]: currentMessages.map(msg => 
              msg.id === messageId ? { ...msg, ...updates } : msg
            )
          }
        });
      },
      
      setStreamingMessage: (message) => {
        if (typeof message === 'function') {
          set((state) => ({ streamingMessage: message(state.streamingMessage) }));
        } else {
          set({ streamingMessage: message });
        }
      },
      setIsStreaming: (isStreaming) => set({ isStreaming }),
      
      // UI actions
      markWelcomeShown: (sessionId) => {
        const state = get();
        set({
          welcomeShownSessions: new Set([...state.welcomeShownSessions, sessionId])
        });
      },
      
      toggleMemoryExpanded: (messageId) => {
        const state = get();
        const newSet = new Set(state.expandedMemories);
        
        if (newSet.has(messageId)) {
          newSet.delete(messageId);
        } else {
          newSet.add(messageId);
        }
        
        set({ expandedMemories: newSet });
      },
      
      // Memory actions
      addExtractedMemory: (memory) => {
        const state = get();
        const newMemories = [...state.extractedMemories, memory];
        set({ extractedMemories: newMemories });
      },
      
      clearExtractedMemories: () => {
        // Clearing extracted memories
        set({ extractedMemories: [] });
      },
      
      // Helpers
      getCurrentMessages: () => {
        const state = get();
        if (!state.currentSessionId) return [];
        
        return state.messages[state.currentSessionId] || [];
      },
      
      clearSessionMessages: (sessionId) => {
        const state = get();
        const newMessages = { ...state.messages };
        delete newMessages[sessionId];
        
        set({ messages: newMessages });
      },
      
      clearAllSessions: () => {
        set({ 
          sessions: [],
          currentSessionId: null,
          messages: {},
          streamingMessage: null,
          isStreaming: false,
          extractedMemories: [],
          welcomeShownSessions: new Set(),
          expandedMemories: new Set()
        });
      }
    }),
    {
      name: 'chat-store',
    }
  )
);