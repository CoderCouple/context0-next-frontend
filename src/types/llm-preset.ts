export interface LLMPreset {
  id: string;
  user_id: string;
  name: string;
  description: string;
  provider: string;
  model: string;
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  use_memory_context: boolean;
  extract_memories: boolean;
  memory_threshold: number;
  force_add_only: boolean;
  memory_extraction_types: string[];
  reranking_enabled: boolean;
  rerank_threshold: number;
  categories: string[];
  conversation_history_limit: number;
  include_timestamps: boolean;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface LLMPresetResponse {
  presets: LLMPreset[];
}