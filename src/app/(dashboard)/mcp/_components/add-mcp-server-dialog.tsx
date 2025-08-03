"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2, PlusIcon, TerminalSquare } from "lucide-react";
import { useForm } from "react-hook-form";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddMCPServer, addMCPServerSchema } from "@/schema/mcp-schema";

export default function AddMCPServersDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<AddMCPServer>({
    resolver: zodResolver(addMCPServerSchema),
    defaultValues: {
      name: "",
      connectionType: "stdio",
      command: "",
      arguments: "",
      url: "",
    },
  });

  const onSubmit = (data: AddMCPServer) => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      form.reset();
      setOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon size={12} />
          Add MCP Server
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <PlusIcon size={20} />
            Add New Server
          </DialogTitle>
          <DialogDescription>
            Define and launch a new MCP-compatible server.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., api-service, data-processor"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="connectionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connection Type</FormLabel>
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        variant={
                          field.value === "stdio" ? "default" : "outline"
                        }
                        className="flex-1"
                        onClick={() => field.onChange("stdio")}
                      >
                        <TerminalSquare className="mr-2 h-4 w-4" />
                        Standard IO
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "sse" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => field.onChange("sse")}
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        SSE
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="command"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Command</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., python, node" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arguments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arguments</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., path/to/script.py" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "+ Add Server"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
