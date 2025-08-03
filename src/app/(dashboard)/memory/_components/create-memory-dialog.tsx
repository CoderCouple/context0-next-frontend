"use client";

import { useState, useCallback } from "react";
// import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateMemory } from "@/hooks/use-memories";
import { toast } from "sonner";

const createMemorySchema = z.object({
  text: z.string().min(1, "Memory content is required").max(50000, "Content too long"),
  memory_type: z.string().optional(),
  tags: z.string().optional(),
  scope: z.string().optional(),
  category: z.string().optional(),
  emotion: z.string().optional(),
  emotion_intensity: z.string().optional(),
});

type CreateMemoryForm = z.infer<typeof createMemorySchema>;

const memoryTypes = [
  { value: "semantic_memory", label: "Semantic Memory" },
  { value: "episodic_memory", label: "Episodic Memory" },
  { value: "procedural_memory", label: "Procedural Memory" },
  { value: "declarative_memory", label: "Declarative Memory" },
  { value: "working_memory", label: "Working Memory" },
  { value: "emotional_memory", label: "Emotional Memory" },
  { value: "meta_memory", label: "Meta Memory" },
];

const emotions = [
  { value: "joy", label: "Joy" },
  { value: "sadness", label: "Sadness" },
  { value: "anger", label: "Anger" },
  { value: "fear", label: "Fear" },
  { value: "surprise", label: "Surprise" },
  { value: "disgust", label: "Disgust" },
  { value: "neutral", label: "Neutral" },
];

const emotionIntensities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

interface CreateMemoryDialogProps {
  children: React.ReactNode;
}

export default function CreateMemoryDialog({ children }: CreateMemoryDialogProps) {
  const [open, setOpen] = useState(false);
  const createMemory = useCreateMemory();

  const form = useForm<CreateMemoryForm>({
    resolver: zodResolver(createMemorySchema),
    defaultValues: {
      text: "",
      memory_type: "",
      tags: "",
      scope: "",
      category: "",
      emotion: "",
      emotion_intensity: "",
    },
  });

  const onSubmit = useCallback(
    (data: CreateMemoryForm) => {
      const tags = data.tags
        ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        : [];

      // Filter out empty strings
      const cleanData = {
        session_id: "web_session", // Default session ID for web interface
        text: data.text,
        ...(data.memory_type && { memory_type: data.memory_type }),
        ...(tags.length > 0 && { tags }),
        ...(data.scope && { scope: data.scope }),
        ...(data.category && { category: data.category }),
        ...(data.emotion && { emotion: data.emotion }),
        ...(data.emotion_intensity && { emotion_intensity: data.emotion_intensity }),
      };

      toast.loading("Creating memory...", { id: "create-memory" });
      
      createMemory.mutate(cleanData, {
        onSuccess: (result) => {
          if (result.success) {
            form.reset();
            setOpen(false);
            toast.dismiss("create-memory");
          }
        },
      });
    },
    [createMemory, form]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Memory</DialogTitle>
          <DialogDescription>
            Add a new memory to your knowledge base. The system will automatically classify
            and process it for better search and retrieval.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memory Content *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your memory content here..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what you want to remember. This could be facts, experiences, 
                    procedures, or any other information.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="memory_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memory Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Auto-detect" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {memoryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Leave empty for automatic classification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., work, personal, project_name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional namespace for organizing memories
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., knowledge, experience, idea"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional category for this memory
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emotion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emotion</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select emotion (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {emotions.map((emotion) => (
                          <SelectItem key={emotion.value} value={emotion.value}>
                            {emotion.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Emotional context of the memory
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("emotion") && form.watch("emotion") !== "neutral" && (
              <FormField
                control={form.control}
                name="emotion_intensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emotion Intensity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {emotionIntensities.map((intensity) => (
                          <SelectItem key={intensity.value} value={intensity.value}>
                            {intensity.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How strong is the emotional context?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="tag1, tag2, tag3"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated tags for better organization and search
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createMemory.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMemory.isPending}>
                {createMemory.isPending ? "Creating..." : "Create Memory"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}