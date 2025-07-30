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
    id: "create-workflow",
    title: "Create Workflow",
    description: "Get started by creating your first workflow automation",
  },
  {
    id: "connect-services",
    title: "Connect Services",
    description: "Connect your favorite apps and services",
  },
  {
    id: "add-nodes",
    title: "Add Nodes",
    description: "Build your workflow with drag-and-drop nodes",
  },
  {
    id: "test-workflow",
    title: "Test Workflow",
    description: "Run and test your workflow automation",
  },
  {
    id: "go-live",
    title: "Go Live",
    description: "Publish your workflow and start automating",
  },
];

const codeExamples = {
  "create-workflow": {
    language: "javascript",
    code: `// Create your first workflow
const workflow = await context0.workflows.create({
  name: "My First Workflow",
  description: "Automate daily tasks",
  trigger: "schedule"
});`,
  },
  "connect-services": {
    language: "javascript",
    code: `// Connect to external services
await context0.connections.add({
  service: "slack",
  credentials: {
    token: process.env.SLACK_TOKEN
  }
});`,
  },
  "add-nodes": {
    language: "javascript",
    code: `// Add nodes to your workflow
workflow.addNode({
  type: "action",
  service: "slack",
  action: "send_message",
  params: {
    channel: "#general",
    message: "Hello from Context0!"
  }
});`,
  },
  "test-workflow": {
    language: "javascript",
    code: `// Test your workflow
const result = await workflow.test({
  input: { message: "Test message" }
});

console.log("Test result:", result);`,
  },
  "go-live": {
    language: "javascript",
    code: `// Publish and activate your workflow
await workflow.publish();
await workflow.activate();

console.log("Workflow is now live!");`,
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
      // Onboarding complete, redirect to dashboard
      toast.success("Onboarding complete! Welcome to Context0.");
      router.push("/dashboard");
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
          <h1 className="text-3xl font-bold mb-2">Let's set things up</h1>
          <p className="text-muted-foreground">
            Follow these steps to get started with Context0
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
                    <li>• Navigate to the Workflow page</li>
                    <li>• Click "Create Workflow" button</li>
                    <li>• Give your workflow a name and description</li>
                  </>
                )}
                {currentStep === 1 && (
                  <>
                    <li>• Go to the Credentials page</li>
                    <li>• Add your service API keys</li>
                    <li>• Test the connection to ensure it works</li>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <li>• Open the workflow editor</li>
                    <li>• Drag nodes from the sidebar</li>
                    <li>• Connect nodes to create your flow</li>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <li>• Click the "Test" button in the editor</li>
                    <li>• Review the execution logs</li>
                    <li>• Fix any errors if needed</li>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <li>• Click "Publish" to make your workflow live</li>
                    <li>• Monitor executions in the dashboard</li>
                    <li>• Set up notifications for failures</li>
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
            onClick={() => router.push("/dashboard")}
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