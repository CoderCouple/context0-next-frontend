import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getSessionsAction, 
  getSessionAction, 
  createSessionAction, 
  sendMessageAction, 
  deleteSessionAction,
  extractMemoriesAction 
} from "@/actions/chat";
import { CreateSessionRequest, SendMessageRequest, ExtractMemoriesRequest } from "@/types/chat";
import { toast } from "sonner";

export function useChatSessions() {
  return useQuery({
    queryKey: ["chat-sessions"],
    queryFn: getSessionsAction,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useChatSession(sessionId: string) {
  return useQuery({
    queryKey: ["chat-session", sessionId],
    queryFn: () => getSessionAction(sessionId),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateChatSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSessionRequest) => createSessionAction(data),
    onSuccess: (result) => {
      if (result.success && result.data) {
        // Optimistically update the sessions list
        queryClient.setQueryData(["chat-sessions"], (oldData: any) => {
          if (oldData?.success && oldData.data) {
            return {
              ...oldData,
              data: [result.data, ...oldData.data]
            };
          }
          return oldData;
        });
        
        // Then invalidate to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
        toast.success("Chat session created");
      } else {
        toast.error(result.message || "Failed to create session");
      }
    },
    onError: (error) => {
      toast.error("Failed to create chat session");
      console.error("Create session error:", error);
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SendMessageRequest) => sendMessageAction(data),
    onSuccess: (result, variables) => {
      if (result.success) {
        // Invalidate the specific session to refresh messages
        queryClient.invalidateQueries({ queryKey: ["chat-session", variables.sessionId] });
        // Also invalidate sessions list to update last message
        queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
      } else {
        toast.error(result.message || "Failed to send message");
      }
    },
    onError: (error) => {
      toast.error("Failed to send message");
      console.error("Send message error:", error);
    },
  });
}

export function useDeleteChatSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => deleteSessionAction(sessionId),
    onSuccess: (result, sessionId) => {
      if (result.success) {
        // Force refetch of chat sessions immediately
        queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
        queryClient.refetchQueries({ queryKey: ["chat-sessions"] });
        // Remove the specific session from cache
        queryClient.removeQueries({ queryKey: ["chat-session", sessionId] });
        toast.success("Chat session deleted");
      } else {
        toast.error(result.message || "Failed to delete session");
      }
    },
    onError: (error) => {
      toast.error("Failed to delete chat session");
      console.error("Delete session error:", error);
    },
  });
}

export function useExtractMemories() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ExtractMemoriesRequest) => extractMemoriesAction(data),
    onSuccess: (result) => {
      if (result.success && result.data) {
        toast.success(`Extracted ${result.data.memoriesCreated} memories`);
        // Invalidate memories query to show new memories
        queryClient.invalidateQueries({ queryKey: ["memories"] });
      } else {
        toast.error(result.message || "Failed to extract memories");
      }
    },
    onError: (error) => {
      toast.error("Failed to extract memories");
      console.error("Extract memories error:", error);
    },
  });
}