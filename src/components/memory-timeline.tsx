"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { format, startOfDay, endOfDay, isToday, isYesterday, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface Memory {
  id: string;
  created_at: string;
  input: string;
  summary?: string;
  confidence: number;
}

interface MemoryTimelineProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  selectedMemoryId?: string;
}

type TimeScale = "hour" | "day" | "week" | "month";

export default function MemoryTimeline({ 
  memories, 
  onSelectMemory, 
  selectedMemoryId 
}: MemoryTimelineProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeScale, setTimeScale] = useState<TimeScale>("day");
  const [selectedTime, setSelectedTime] = useState(100); // 0-100 percentage
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Sort memories by date
  const sortedMemories = useMemo(() => 
    [...memories].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ), [memories]
  );

  // Get date range
  const { startDate, endDate, totalDays } = useMemo(() => {
    const oldestMemory = sortedMemories[sortedMemories.length - 1];
    const newestMemory = sortedMemories[0];
    
    const now = new Date();
    const start = oldestMemory ? new Date(oldestMemory.created_at) : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago if no memories
    const end = newestMemory ? new Date(newestMemory.created_at) : now;
    const days = Math.max(differenceInDays(end, start), 1);
    
    return { startDate: start, endDate: end, totalDays: days };
  }, [sortedMemories]);

  // Convert slider value to date
  useEffect(() => {
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setCurrentDate(new Date());
      return;
    }
    
    const percentage = selectedTime / 100;
    const milliseconds = startDate.getTime() + (endDate.getTime() - startDate.getTime()) * percentage;
    setCurrentDate(new Date(milliseconds));
  }, [selectedTime, startDate, endDate]);

  // Group memories by time period
  const periodicMemories = useMemo(() => {
    if (!currentDate || isNaN(currentDate.getTime())) return [];
    
    const start = startOfDay(currentDate);
    const end = endOfDay(currentDate);
    
    return sortedMemories.filter(memory => {
      const memoryDate = new Date(memory.created_at);
      return memoryDate >= start && memoryDate <= end;
    });
  }, [currentDate, sortedMemories]);

  const formatDateLabel = (date: Date) => {
    if (!date || isNaN(date.getTime())) return "Invalid Date";
    
    try {
      if (isToday(date)) return "Today";
      if (isYesterday(date)) return "Yesterday";
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return date.toLocaleDateString();
    }
  };

  const handlePrevious = () => {
    setSelectedTime(Math.max(0, selectedTime - 10));
  };

  const handleNext = () => {
    setSelectedTime(Math.min(100, selectedTime + 10));
  };

  const handleJumpToToday = () => {
    setSelectedTime(100);
    setCurrentDate(new Date());
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isNaN(date.getTime())) {
      // Calculate the percentage position for the selected date
      const dateTime = date.getTime();
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      const percentage = ((dateTime - startTime) / (endTime - startTime)) * 100;
      setSelectedTime(Math.max(0, Math.min(100, percentage)));
      setCurrentDate(date);
      setDatePickerOpen(false);
    }
  };

  // periodicMemories is now computed above with useMemo

  return (
    <div className="flex flex-col h-full">
      {/* Timeline Controls */}
      <div className="border-b p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{formatDateLabel(currentDate)}</h3>
          <div className="flex items-center gap-2">
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  title="Select date"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={currentDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => 
                    date > new Date() || date < startDate
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleJumpToToday}
                    disabled={selectedTime === 100}
                  >
                    Today
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Jump to Today</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Select value={timeScale} onValueChange={(value) => setTimeScale(value as TimeScale)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Hour</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Time Slider */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={selectedTime === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <Slider
                value={[selectedTime]}
                onValueChange={([value]) => setSelectedTime(value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={selectedTime === 100}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Time markers */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{startDate && !isNaN(startDate.getTime()) ? format(startDate, "MMM d") : ""}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {currentDate && !isNaN(currentDate.getTime()) ? format(currentDate, "h:mm a") : ""}
            </span>
            <span>{endDate && !isNaN(endDate.getTime()) ? format(endDate, "MMM d") : ""}</span>
          </div>
        </div>

        {/* Memory count for period */}
        <div className="text-sm text-muted-foreground">
          {periodicMemories.length} memories on this day
        </div>
      </div>

      {/* Memory List for Selected Time */}
      <div className="flex-1 overflow-y-auto p-4">
        {periodicMemories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Brain className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg font-medium">No memories on this day</p>
          </div>
        ) : (
          <div className="space-y-2">
            {periodicMemories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => onSelectMemory(memory)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors",
                  "hover:bg-accent/50",
                  selectedMemoryId === memory.id && "bg-accent border-accent-foreground/20"
                )}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm line-clamp-2 flex-1">
                    {memory.summary || memory.input}
                  </p>
                  <span className="text-xs text-muted-foreground ml-2">
                    {(() => {
                      try {
                        const date = new Date(memory.created_at);
                        return !isNaN(date.getTime()) ? format(date, "h:mm a") : "";
                      } catch {
                        return "";
                      }
                    })()}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Confidence: {Math.round(memory.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visual Timeline Bar */}
      <div className="border-t p-4">
        <div className="relative h-2 bg-muted rounded-full overflow-hidden" ref={timelineRef}>
          {/* Memory density visualization */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 100 }, (_, i) => {
              const rangeStart = startDate.getTime() + (totalDays * 24 * 60 * 60 * 1000 * i / 100);
              const rangeEnd = startDate.getTime() + (totalDays * 24 * 60 * 60 * 1000 * (i + 1) / 100);
              
              const count = sortedMemories.filter(m => {
                const time = new Date(m.created_at).getTime();
                return time >= rangeStart && time < rangeEnd;
              }).length;

              const opacity = Math.min(count * 0.2, 1);
              
              return (
                <div
                  key={i}
                  className="flex-1 h-full"
                  style={{
                    backgroundColor: `hsl(var(--primary) / ${opacity})`,
                  }}
                />
              );
            })}
          </div>
          
          {/* Current position indicator */}
          <div
            className="absolute top-0 w-1 h-full bg-primary"
            style={{ left: `${selectedTime}%` }}
          />
        </div>
      </div>
    </div>
  );
}