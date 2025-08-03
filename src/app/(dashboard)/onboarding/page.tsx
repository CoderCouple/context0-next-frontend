"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, ChevronRight } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const onboardingSteps = [
  {
    id: "get-started",
    title: "Get Started",
    description: "Understand how Context0's memory API works",
  },
  {
    id: "authentication",
    title: "Authentication",
    description: "Learn how authentication works with your account",
  },
  {
    id: "create-memory",
    title: "Create Memory",
    description: "Store your first memory with Context0",
  },
  {
    id: "enhance-context",
    title: "Enhance with Context",
    description: "Add categories, emotions, and tags to your memories",
  },
  {
    id: "search-retrieve",
    title: "Search & Retrieve",
    description: "Find and access your memories instantly",
  },
];

const codeExamples = {
  "get-started": {
    language: "javascript",
    code: `// Using Context0's memory API
const response = await fetch('/api/memories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    text: "Your memory content here",
    category: "personal",
    emotion: "neutral"
  })
});

const memory = await response.json();`,
  },
  "authentication": {
    language: "javascript",
    code: `// Context0 uses Clerk for authentication
// Your API calls are automatically authenticated
import { useAuth } from '@clerk/nextjs';

const { userId, getToken } = useAuth();
const token = await getToken();

// Token is automatically included in server actions`,
  },
  "create-memory": {
    language: "javascript",
    code: `// Create your first memory
const memory = {
  text: "I love Italian food, especially pizza",
  category: "preferences",
  emotion: "joy",
  emotion_intensity: "high",
  tags: ["food", "italian", "favorites"]
};

// Using the Context0 UI
// Click "Create Memory" button and fill the form`,
  },
  "enhance-context": {
    language: "javascript",
    code: `// Add rich context to memories
const contextualMemory = {
  text: "Meeting with Sarah about the new AI project",
  category: "work",
  tags: ["meetings", "project-alpha", "ai"],
  emotion: "excited",
  emotion_intensity: "medium",
  scope: "professional"
};

// Categories: work, personal, learning, ideas
// Emotions: joy, sadness, anger, fear, surprise, disgust, neutral`,
  },
  "search-retrieve": {
    language: "javascript",
    code: `// Search through your memories
const searchResults = await fetch('/api/memories/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "What did I discuss with Sarah?",
    filters: { 
      category: "work",
      emotion: "excited" 
    }
  })
});

// Natural language search understands context`,
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    Prism.highlightAll();
  }, [currentStep]);

  const handleCopy = async () => {
    const code = codeExamples[onboardingSteps[currentStep].id as keyof typeof codeExamples].code;
    await navigator.clipboard.writeText(code);
    setCopiedStep(onboardingSteps[currentStep].id);
    toast.success("Code copied to clipboard!");
    
    setTimeout(() => {
      setCopiedStep(null);
    }, 2000);
  };

  const handleNext = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding complete, redirect to memory page
      toast.success("Memory system setup complete! Start creating memories.");
      router.push("/memory");
    }
  };

  const handleStepClick = (index: number) => {
    if (index <= currentStep || completedSteps.has(index)) {
      setCurrentStep(index);
    }
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const currentStepData = onboardingSteps[currentStep];
  const currentCode = codeExamples[currentStepData.id as keyof typeof codeExamples];

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Set up your Memory System</h1>
          <p className="text-muted-foreground">
            Follow these steps to start building your personal knowledge base with Context0
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {onboardingSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  "hover:text-primary",
                  index === currentStep && "text-primary",
                  index < currentStep || completedSteps.has(index)
                    ? "text-foreground cursor-pointer"
                    : "text-muted-foreground cursor-not-allowed"
                )}
                disabled={index > currentStep && !completedSteps.has(index)}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    index === currentStep && "border-primary bg-primary text-primary-foreground",
                    (index < currentStep || completedSteps.has(index)) && "border-primary bg-primary text-primary-foreground",
                    index > currentStep && !completedSteps.has(index) && "border-muted-foreground"
                  )}
                >
                  {index < currentStep || completedSteps.has(index) ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{currentStepData.title}</h2>
            <p className="text-muted-foreground">{currentStepData.description}</p>
          </div>

          {/* Code Example */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-sm font-medium capitalize">
                    {currentCode.language}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8"
                >
                  {copiedStep === currentStepData.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-muted/20">
                <pre className="text-sm overflow-x-auto">
                  <code className="language-javascript">{currentCode.code}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Additional Instructions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">What's next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {currentStep === 0 && (
                  <>
                    <li>• Context0 provides a powerful memory API</li>
                    <li>• Store any text-based information</li>
                    <li>• Memories are automatically indexed for search</li>
                  </>
                )}
                {currentStep === 1 && (
                  <>
                    <li>• Your account is secured with Clerk authentication</li>
                    <li>• All API calls are automatically authenticated</li>
                    <li>• Your memories are private and secure</li>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <li>• Navigate to the Memory page</li>
                    <li>• Click the "Create Memory" button</li>
                    <li>• Enter your memory content in the dialog</li>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <li>• Add categories like "work", "personal", "learning"</li>
                    <li>• Select emotions to capture your feelings</li>
                    <li>• Use tags for flexible organization</li>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <li>• Use natural language to search memories</li>
                    <li>• Filter by category, emotion, or tags</li>
                    <li>• View your memory timeline and connections</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => router.push("/memory")}
          >
            Skip Onboarding
          </Button>
          
          <Button
            onClick={handleNext}
            size="lg"
            className="min-w-[120px]"
          >
            {currentStep === onboardingSteps.length - 1 ? "Complete" : "Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}