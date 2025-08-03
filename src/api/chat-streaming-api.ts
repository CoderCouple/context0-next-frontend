import { env } from "@/env/client";
import { ChatMessage } from "@/types/chat";

export interface StreamingChatResponse {
  type: 'start' | 'content' | 'message_complete' | 'done' | 'error' | 'memory_extracted' | 'user_message' | 'assistant_message';
  content?: string;
  message?: ChatMessage;
  error?: string;
  memoryId?: string;
  session_id?: string;
  code?: number;
  summary?: any;
}

export async function sendChatMessageStreaming(
  sessionId: string, 
  message: string, 
  token: string,
  onMessage: (response: StreamingChatResponse) => void,
  onError?: (error: Error) => void
): Promise<void> {
  const baseUrl = env.NEXT_PUBLIC_PYTHON_BACKEND_HOST || "http://127.0.0.1:8000";
  const url = `${baseUrl}/api/v1/chat/sessions/${sessionId}/messages/stream`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        content: message,
        extract_memories: true,
        use_memory_context: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]' || data === '') {
            continue;
          }

          try {
            const parsed = JSON.parse(data) as StreamingChatResponse;
            onMessage(parsed);
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    onError?.(error as Error);
    throw error;
  }
}