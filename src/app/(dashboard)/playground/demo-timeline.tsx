"use client";

import { useState } from "react";
import MemoryTimeline from "@/components/memory-timeline";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Generate sample memories across different time periods
const generateSampleMemories = () => {
  const memories = [];
  const topics = [
    "Learning React hooks and state management",
    "Debugging TypeScript errors in Next.js",
    "Implementing authentication with Clerk",
    "Setting up Tailwind CSS configurations",
    "Working with Zustand for state management",
    "Creating responsive layouts with Grid",
    "Optimizing database queries with Drizzle",
    "Building real-time features with WebSockets",
    "Deploying applications to Vercel",
    "Writing unit tests with Jest",
    "Implementing dark mode toggle",
    "Creating custom React hooks",
    "Working with REST APIs",
    "Managing environment variables",
    "Setting up CI/CD pipelines"
  ];

  const tags = [
    ["react", "frontend"],
    ["typescript", "debugging"],
    ["authentication", "security"],
    ["css", "styling"],
    ["state-management"],
    ["layout", "responsive"],
    ["database", "optimization"],
    ["real-time", "websocket"],
    ["deployment", "devops"],
    ["testing", "jest"],
    ["ui", "dark-mode"],
    ["react", "hooks"],
    ["api", "backend"],
    ["configuration"],
    ["ci-cd", "automation"]
  ];

  // Generate memories for the past 30 days
  const now = new Date();
  
  topics.forEach((topic, index) => {
    // Random time in the past 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    
    const memoryDate = new Date(now);
    memoryDate.setDate(memoryDate.getDate() - daysAgo);
    memoryDate.setHours(memoryDate.getHours() - hoursAgo);
    memoryDate.setMinutes(memoryDate.getMinutes() - minutesAgo);

    memories.push({
      id: `memory-${index + 1}`,
      cid: `Qm${Math.random().toString(36).substring(2, 15)}`,
      input: topic,
      summary: `Key insights about ${topic.toLowerCase()}`,
      tags: tags[index],
      scope: "personal",
      memory_type: "knowledge",
      confidence: 0.7 + Math.random() * 0.3, // 70-100% confidence
      created_at: memoryDate.toISOString(),
      updated_at: memoryDate.toISOString(),
      access_count: Math.floor(Math.random() * 10) + 1,
      is_deleted: false,
      meta: {}
    });
  });

  // Add some memories for today at different times
  for (let i = 0; i < 5; i++) {
    const todayMemory = new Date();
    todayMemory.setHours(8 + i * 3); // 8am, 11am, 2pm, 5pm, 8pm
    todayMemory.setMinutes(Math.floor(Math.random() * 60));
    
    memories.push({
      id: `today-memory-${i + 1}`,
      cid: `Qm${Math.random().toString(36).substring(2, 15)}`,
      input: `Today's task #${i + 1}: Working on Context0 memory timeline`,
      summary: "Progress update on memory timeline feature",
      tags: ["today", "timeline", "development"],
      scope: "personal",
      memory_type: "task",
      confidence: 0.9 + Math.random() * 0.1,
      created_at: todayMemory.toISOString(),
      updated_at: todayMemory.toISOString(),
      access_count: 1,
      is_deleted: false,
      meta: { priority: "high" }
    });
  }

  // Sort by date (newest first)
  return memories.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export default function DemoTimeline() {
  const [sampleMemories] = useState(generateSampleMemories());
  const [selectedMemory, setSelectedMemory] = useState<any>(null);

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4 p-4">
      {/* Timeline Section */}
      <div className="flex-1 border rounded-lg overflow-hidden">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Memory Timeline Demo</h2>
          <p className="text-sm text-muted-foreground">
            Sample data showing {sampleMemories.length} memories over the past 30 days
          </p>
        </div>
        <div className="h-[calc(100%-80px)]">
          <MemoryTimeline
            memories={sampleMemories}
            onSelectMemory={setSelectedMemory}
            selectedMemoryId={selectedMemory?.id}
          />
        </div>
      </div>

      {/* Selected Memory Detail */}
      <div className="w-96">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Selected Memory</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMemory ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Content</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedMemory.input}
                  </p>
                </div>
                
                {selectedMemory.summary && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedMemory.summary}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-sm mb-1">Created</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedMemory.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedMemory.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="ml-2 font-medium">
                      {Math.round(selectedMemory.confidence * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Access Count:</span>
                    <span className="ml-2 font-medium">
                      {selectedMemory.access_count}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click on a memory in the timeline to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}