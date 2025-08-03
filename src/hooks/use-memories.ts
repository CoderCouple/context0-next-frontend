"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ListMemoriesAction } from "@/actions/memory/list-memories-action";
import { CreateMemoryAction } from "@/actions/memory/create-memory-action";
import { DeleteMemoryAction } from "@/actions/memory/delete-memory-action";
import { CreateMemoryRequest } from "@/api/memory-api";

export function useMemories() {
  return useQuery({
    queryKey: ["memories"],
    queryFn: ListMemoriesAction,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CreateMemoryRequest, "user_id">) => 
      CreateMemoryAction(data),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate and refetch memories
        queryClient.invalidateQueries({ queryKey: ["memories"] });
        toast.success("Memory created successfully");
      } else {
        toast.error(result.message || "Failed to create memory");
      }
    },
    onError: (error) => {
      toast.error("Failed to create memory");
      console.error("Create memory error:", error);
    },
  });
}

export function useDeleteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memoryId: string) => DeleteMemoryAction(memoryId),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate and refetch memories
        queryClient.invalidateQueries({ queryKey: ["memories"] });
        toast.success("Memory deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete memory");
      }
    },
    onError: (error) => {
      toast.error("Failed to delete memory");
      console.error("Delete memory error:", error);
    },
  });
}