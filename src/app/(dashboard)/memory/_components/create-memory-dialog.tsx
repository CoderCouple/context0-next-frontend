"use client";

import { useState } from "react";
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
import { CreateMemoryAction } from "@/actions/memory/create-memory-action";
import { toast } from "sonner";

const createMemorySchema = z.object({
  text: z.string().min(1, "Memory content is required").max(50000, "Content too long"),
  memory_type: z.string().optional(),
  tags: z.string().optional(),
  scope: z.string().optional(),
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

interface CreateMemoryDialogProps {
  children: React.ReactNode;
}

export default function CreateMemoryDialog({ children }: CreateMemoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateMemoryForm>({
    resolver: zodResolver(createMemorySchema),
    defaultValues: {
      text: "",
      memory_type: "",
      tags: "",
      scope: "",
    },
  });

  const onSubmit = async (data: CreateMemoryForm) => {
    setIsSubmitting(true);

    try {
      const tags = data.tags
        ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        : [];

      const result = await CreateMemoryAction({
        session_id: "web_session", // Default session ID for web interface
        text: data.text,
        memory_type: data.memory_type || undefined,
        tags,
        scope: data.scope || undefined,
      });

      if (result.success) {
        toast.success("Memory created successfully");
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to create memory");
      }
    } catch (error) {
      toast.error("Failed to create memory");
      console.error("Create memory error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Memory"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}