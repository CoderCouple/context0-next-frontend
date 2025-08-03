"use client";

import { useState, useEffect } from "react";
import { Settings, Plus, X, Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { LLMPreset } from "@/types/llm-preset";
import {
  getLLMPresetsAction,
  createLLMPresetAction,
  updateLLMPresetAction,
} from "@/actions/llm-preset/llm-preset-actions";

const models = [
  { provider: "OpenAI", value: "gpt-4", label: "GPT-4" },
  { provider: "OpenAI", value: "gpt-4o", label: "GPT-4 Optimized" },
  { provider: "OpenAI", value: "gpt-4o-mini", label: "GPT-4 Optimized Mini" },
  { provider: "OpenAI", value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { provider: "Anthropic", value: "claude-3-opus", label: "Claude 3 Opus" },
  { provider: "Anthropic", value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
  { provider: "Anthropic", value: "claude-3-haiku", label: "Claude 3 Haiku" },
  { provider: "Google", value: "gemini-pro", label: "Gemini Pro" },
  { provider: "Google", value: "gemini-pro-vision", label: "Gemini Pro Vision" },
];

interface Category {
  name: string;
  description: string;
}

interface PresetConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preset?: LLMPreset | null;
  onSave?: (preset: LLMPreset) => void;
}

export default function PresetConfigurationDialog({
  open,
  onOpenChange,
  preset,
  onSave,
}: PresetConfigurationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [presets, setPresets] = useState<LLMPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  
  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Category>({ name: "", description: "" });
  const [includesPrompt, setIncludesPrompt] = useState("");
  const [excludesPrompt, setExcludesPrompt] = useState("");
  const [forceAddOnly, setForceAddOnly] = useState(false);
  const [rerankingEnabled, setRerankingEnabled] = useState(true);
  const [memoryUpdates, setMemoryUpdates] = useState(true);
  const [temperature, setTemperature] = useState([0.1]);
  const [threshold, setThreshold] = useState([0.3]);
  const [maxTokens, setMaxTokens] = useState([2048]);
  const [topK, setTopK] = useState([10]);
  const [topP, setTopP] = useState([1.0]);

  useEffect(() => {
    if (open) {
      fetchPresets();
      if (preset) {
        loadPreset(preset);
      }
    }
  }, [open, preset]);

  const fetchPresets = async () => {
    try {
      const result = await getLLMPresetsAction();
      if (result.success && result.data) {
        setPresets(result.data.presets || []);
      }
    } catch (error) {
      console.error("Failed to fetch presets:", error);
    }
  };

  const loadPreset = (preset: LLMPreset) => {
    setSelectedPresetId(preset.id);
    setName(preset.name);
    setDescription(preset.description);
    setModel(preset.model);
    setSystemPrompt(preset.system_prompt);
    setTemperature([preset.temperature]);
    setMaxTokens([preset.max_tokens]);
    setForceAddOnly(preset.force_add_only);
    setRerankingEnabled(preset.reranking_enabled);
    setMemoryUpdates(preset.extract_memories);
    setThreshold([preset.memory_threshold]);
    // TODO: Load other fields as needed
  };

  const handlePresetSelect = (presetId: string) => {
    const selected = presets.find(p => p.id === presetId);
    if (selected) {
      loadPreset(selected);
    }
  };

  const addCategory = () => {
    if (newCategory.name && newCategory.description) {
      setCategories([...categories, newCategory]);
      setNewCategory({ name: "", description: "" });
    }
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name) {
      toast.error("Please enter a preset name");
      return;
    }

    setLoading(true);
    try {
      const modelInfo = models.find(m => m.value === model);
      const provider = modelInfo?.provider.toLowerCase() || "openai";

      const presetData: Partial<LLMPreset> = {
        name,
        description,
        provider,
        model,
        system_prompt: systemPrompt,
        temperature: temperature[0],
        max_tokens: maxTokens[0],
        force_add_only: forceAddOnly,
        reranking_enabled: rerankingEnabled,
        extract_memories: memoryUpdates,
        use_memory_context: memoryUpdates,
        memory_threshold: threshold[0],
        rerank_threshold: threshold[0],
        categories: categories.map(c => c.name),
        memory_extraction_types: memoryUpdates ? ["semantic_memory", "episodic_memory"] : [],
        conversation_history_limit: 10,
        include_timestamps: false,
        is_active: true,
      };

      let result;
      if (selectedPresetId && preset) {
        result = await updateLLMPresetAction(selectedPresetId, presetData);
      } else {
        result = await createLLMPresetAction(presetData);
      }

      if (result.success) {
        toast.success(selectedPresetId ? "Preset updated" : "Preset created");
        if (result.data && onSave) {
          onSave(result.data as LLMPreset);
        }
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to save preset");
      }
    } catch (error) {
      toast.error("Failed to save preset");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setModel("gpt-4o-mini");
    setSystemPrompt("");
    setCustomInstructions("");
    setCategories([]);
    setNewCategory({ name: "", description: "" });
    setIncludesPrompt("");
    setExcludesPrompt("");
    setForceAddOnly(false);
    setRerankingEnabled(true);
    setMemoryUpdates(true);
    setTemperature([0.1]);
    setThreshold([0.3]);
    setMaxTokens([2048]);
    setTopK([10]);
    setTopP([1.0]);
    setSelectedPresetId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preset Configuration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Select a preset
            </Label>
            <Select value={selectedPresetId} onValueChange={handlePresetSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Create new preset</SelectItem>
                {presets.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preset Name & Description (for new/editing) */}
          {(!selectedPresetId || selectedPresetId === "new") && (
            <>
              <div className="space-y-2">
                <Label>Preset Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter preset name"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter preset description"
                />
              </div>
            </>
          )}

          {/* Model Selection */}
          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.provider}: {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              System prompt
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The system prompt that guides the AI's behavior</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter system prompt"
              rows={3}
            />
          </div>

          {/* Custom Instructions */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Custom instructions
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Additional instructions for memory extraction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Enter custom instructions"
              rows={3}
            />
          </div>

          {/* Custom Categories */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Custom categories
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Categories for organizing memories</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="space-y-2">
              {categories.map((cat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex-1">
                    {cat.name}: {cat.description}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCategory(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="space-y-2">
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Category name"
                />
                <Input
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Category description"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addCategory}
                  disabled={!newCategory.name || !newCategory.description}
                  className="w-full"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>

          {/* Includes Prompt */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Includes prompt
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Keywords to include in memory extraction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              value={includesPrompt}
              onChange={(e) => setIncludesPrompt(e.target.value)}
              placeholder="Enter includes prompt"
            />
          </div>

          {/* Excludes Prompt */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Excludes prompt
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Keywords to exclude from memory extraction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              value={excludesPrompt}
              onChange={(e) => setExcludesPrompt(e.target.value)}
              placeholder="Enter excludes prompt"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Force add only
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Only add new memories, don't update existing ones</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Switch
                checked={forceAddOnly}
                onCheckedChange={setForceAddOnly}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Reranking
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enable memory reranking for better relevance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Switch
                checked={rerankingEnabled}
                onCheckedChange={setRerankingEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Memory Updates
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enable memory extraction and updates</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Switch
                checked={memoryUpdates}
                onCheckedChange={setMemoryUpdates}
              />
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  Temperature
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Controls randomness in AI responses (0-2)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm text-muted-foreground">{temperature[0].toFixed(2)}</span>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                min={0}
                max={2}
                step={0.01}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  Threshold
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Minimum relevance score for memories (0-1)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm text-muted-foreground">{threshold[0].toFixed(2)}</span>
              </div>
              <Slider
                value={threshold}
                onValueChange={setThreshold}
                min={0}
                max={1}
                step={0.01}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  Max tokens
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Maximum response length in tokens</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm text-muted-foreground">{maxTokens[0]}</span>
              </div>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                min={100}
                max={4096}
                step={10}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  Top K
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of top memories to consider</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm text-muted-foreground">{topK[0]}</span>
              </div>
              <Slider
                value={topK}
                onValueChange={setTopK}
                min={1}
                max={50}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  Top P
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nucleus sampling threshold (0-1)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm text-muted-foreground">{topP[0].toFixed(2)}</span>
              </div>
              <Slider
                value={topP}
                onValueChange={setTopP}
                min={0}
                max={1}
                step={0.01}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2">
          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Preset"}
          </Button>
          <Button variant="outline" onClick={handleReset} className="w-full">
            Reset Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}