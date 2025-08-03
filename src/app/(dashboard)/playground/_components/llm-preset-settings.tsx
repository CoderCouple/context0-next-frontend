"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings, Plus, Loader2, Brain, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import PresetConfigurationDialog from "./preset-configuration-dialog";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LLMPreset } from "@/types/llm-preset";
import { getLLMPresetsAction, setDefaultLLMPresetAction } from "@/actions/llm-preset/llm-preset-actions";

const providerIcons: Record<string, React.ReactNode> = {
  openai: <Brain className="h-3 w-3" />,
  anthropic: <Sparkles className="h-3 w-3" />,
  google: <Zap className="h-3 w-3" />,
  gemini: <Zap className="h-3 w-3" />,
  claude: <Sparkles className="h-3 w-3" />,
};

const providerColors: Record<string, string> = {
  openai: "text-green-600",
  anthropic: "text-purple-600",
  google: "text-blue-600",
  gemini: "text-blue-600",
  claude: "text-purple-600",
};

interface LLMPresetSettingsProps {
  onPresetChange?: (preset: LLMPreset) => void;
}

export default function LLMPresetSettings({ onPresetChange }: LLMPresetSettingsProps) {
  const [presets, setPresets] = useState<LLMPreset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedPresetForEdit, setSelectedPresetForEdit] = useState<LLMPreset | null>(null);

  const fetchPresets = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getLLMPresetsAction();
      if (result.success && result.data) {
        const presetList = result.data.presets || [];
        setPresets(presetList);
        
        // Find the default preset
        const defaultPreset = presetList.find((p: LLMPreset) => p.is_default);
        if (defaultPreset) {
          setActivePresetId(defaultPreset.id);
          if (onPresetChange) {
            onPresetChange(defaultPreset);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch presets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const handlePresetChange = async (presetId: string) => {
    try {
      const result = await setDefaultLLMPresetAction(presetId);
      if (result.success) {
        setActivePresetId(presetId);
        const preset = presets.find(p => p.id === presetId);
        if (preset && onPresetChange) {
          onPresetChange(preset);
        }
        toast.success("LLM preset updated");
      } else {
        toast.error(result.error || "Failed to update preset");
      }
    } catch {
      toast.error("Failed to update preset");
    }
  };

  const getProviderDisplay = (provider: string) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  const getModelDisplay = (model: string) => {
    // Format model names nicely
    if (model.includes("gpt-4")) return "GPT-4";
    if (model.includes("gpt-3.5")) return "GPT-3.5";
    if (model.includes("claude-3")) return "Claude 3";
    if (model.includes("claude-2")) return "Claude 2";
    if (model.includes("gemini-pro")) return "Gemini Pro";
    if (model.includes("gemini")) return "Gemini";
    return model;
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Settings className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>LLM Presets</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => {
                setSelectedPresetForEdit(null);
                setConfigDialogOpen(true);
                setIsOpen(false);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              New
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {presets.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No presets available
            </div>
          ) : (
            <DropdownMenuRadioGroup value={activePresetId} onValueChange={handlePresetChange}>
              {presets.map((preset) => (
                <DropdownMenuRadioItem 
                  key={preset.id} 
                  value={preset.id}
                  className="flex items-start py-3"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`${providerColors[preset.provider] || "text-gray-600"}`}>
                        {providerIcons[preset.provider] || <Brain className="h-3 w-3" />}
                      </span>
                      <span className="font-medium">{preset.name}</span>
                      {preset.is_default && (
                        <Badge variant="secondary" className="text-xs h-5">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {preset.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Provider:</span>
                        {getProviderDisplay(preset.provider)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Model:</span>
                        {getModelDisplay(preset.model)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {preset.use_memory_context && (
                        <Badge variant="outline" className="text-xs h-5">
                          Memory Context
                        </Badge>
                      )}
                      {preset.extract_memories && (
                        <Badge variant="outline" className="text-xs h-5">
                          Extract Memories
                        </Badge>
                      )}
                      {preset.reranking_enabled && (
                        <Badge variant="outline" className="text-xs h-5">
                          Reranking
                        </Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-xs"
            onClick={() => {
              setSelectedPresetForEdit(null);
              setConfigDialogOpen(true);
              setIsOpen(false);
            }}
          >
            Manage presets...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Preset Configuration Dialog */}
      <PresetConfigurationDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        preset={selectedPresetForEdit}
        onSave={(preset) => {
          fetchPresets();
          if (onPresetChange) {
            onPresetChange(preset);
          }
        }}
      />
    </>
  );
}