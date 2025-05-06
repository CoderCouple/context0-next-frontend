"use client";

import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CoinsIcon, XIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";

export default function TaskMenu() {
  const [hoveredTask, setHoveredTask] = useState<TaskType | null>(null);
  const task = hoveredTask ? TaskRegistry[hoveredTask as TaskType] : null;
  return (
    <aside className="h-screen w-[340px] min-w-[340px] max-w-[340px] border-separate overflow-auto border-r-2 p-2 px-4">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "triggers",
          "extraction",
          "interactions",
          "timing",
          "results",
          "storage",
        ]}
      >
        <AccordionItem value="triggers">
          <AccordionTrigger className="font-bold">Triggers</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn
              taskType={TaskType.LAUNCH_BROWSER}
              onHover={setHoveredTask}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="interactions">
          <AccordionTrigger className="font-bold">
            User interactions
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn
              taskType={TaskType.NAVIGATE_URL}
              onHover={setHoveredTask}
            />
            <TaskMenuBtn
              taskType={TaskType.FILL_INPUT}
              onHover={setHoveredTask}
            />
            <TaskMenuBtn
              taskType={TaskType.CLICK_ELEMENT}
              onHover={setHoveredTask}
            />
            <TaskMenuBtn
              taskType={TaskType.SCROLL_TO_ELEMENT}
              onHover={setHoveredTask}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn
              taskType={TaskType.PAGE_TO_HTML}
              onHover={setHoveredTask}
            />
            <TaskMenuBtn
              taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT}
              onHover={setHoveredTask}
            />
            <TaskMenuBtn
              taskType={TaskType.EXTRACT_DATA_WITH_AI}
              onHover={setHoveredTask}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="storage">
          <AccordionTrigger className="font-bold">
            Data storage
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn
              taskType={TaskType.READ_PROPERTY_FROM_JSON}
              onHover={setHoveredTask}
            />
            <TaskMenuBtn
              taskType={TaskType.ADD_PROPERTY_TO_JSON}
              onHover={setHoveredTask}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="timing">
          <AccordionTrigger className="font-bold">
            Timing controls
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn
              taskType={TaskType.WAIT_FOR_ELEMENT}
              onHover={setHoveredTask}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="results">
          <AccordionTrigger className="font-bold">
            Result delivery
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn
              taskType={TaskType.DELIVER_VIA_WEBHOOK}
              onHover={setHoveredTask}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <AnimatePresence>
        {(task?.subTasks ?? []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-[-280px] top-0 z-50 h-full w-[260px] rounded-md border bg-background p-4 shadow-xl"
            onMouseLeave={() => setHoveredTask(null)}
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                Choose Subtask
              </h4>
              <button onClick={() => setHoveredTask(null)}>
                <XIcon size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {(task?.subTasks ?? []).map((sub: TaskType) => {
                const subtask = TaskRegistry[sub as TaskType];
                return (
                  <Button
                    key={sub}
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/reactflow", sub);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                  >
                    <subtask.icon
                      size={14}
                      className="mr-2 text-muted-foreground"
                    />
                    {subtask.label}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

function TaskMenuBtn({
  taskType,
  onHover,
}: {
  taskType: TaskType;
  onHover: (t: TaskType | null) => void;
}) {
  const task = TaskRegistry[taskType];
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/reactflow", taskType);
    e.dataTransfer.effectAllowed = "move";
  };

  const showSubtasks = (task.subTasks ?? []).length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => showSubtasks && onHover(taskType)}
      onMouseLeave={() => onHover(null)}
    >
      <Button
        variant="secondary"
        className="flex !h-auto w-full flex-col items-start !justify-start gap-2 rounded-md px-4 py-3 text-left"
        draggable
        onDragStart={handleDragStart}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <task.icon size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {task.label}
            </span>
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-1.5 py-0.5 text-xs"
          >
            <CoinsIcon size={12} />
            {task.credits}
          </Badge>
        </div>
        {task.description && (
          <p className="text-xs leading-snug text-muted-foreground">
            {task.description}
          </p>
        )}
      </Button>

      {/* Render drawer panel here so it's in same DOM tree */}
      <AnimatePresence>
        {showSubtasks && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-[340px] top-0 z-50 h-full w-[260px] rounded-md border bg-background p-4 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                Choose Subtask
              </h4>
              <button onClick={() => onHover(null)}>
                <XIcon size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {task.subTasks!.map((sub: TaskType) => {
                const subtask = TaskRegistry[sub];
                return (
                  <Button
                    key={sub}
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/reactflow", sub);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                  >
                    <subtask.icon
                      size={14}
                      className="mr-2 text-muted-foreground"
                    />
                    {subtask.label}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
