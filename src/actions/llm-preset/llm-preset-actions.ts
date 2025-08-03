"use server";

import { auth } from "@clerk/nextjs/server";
import { 
  getLLMPresetsApi, 
  setDefaultLLMPresetApi,
  createLLMPresetApi,
  updateLLMPresetApi,
  deleteLLMPresetApi
} from "@/api/llm-preset-api";
import { LLMPreset } from "@/types/llm-preset";

export async function getLLMPresetsAction() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return { success: false, error: "Unauthorized" };
  }

  const response = await getLLMPresetsApi(token);
  
  if (response.success) {
    return { success: true, data: response.result };
  }
  
  return { success: false, error: response.message };
}

export async function setDefaultLLMPresetAction(presetId: string) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return { success: false, error: "Unauthorized" };
  }

  const response = await setDefaultLLMPresetApi(token, presetId);
  
  if (response.success) {
    return { success: true, data: response.result };
  }
  
  return { success: false, error: response.message };
}

export async function createLLMPresetAction(preset: Partial<LLMPreset>) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return { success: false, error: "Unauthorized" };
  }

  const response = await createLLMPresetApi(token, preset);
  
  if (response.success) {
    return { success: true, data: response.result };
  }
  
  return { success: false, error: response.message };
}

export async function updateLLMPresetAction(presetId: string, updates: Partial<LLMPreset>) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return { success: false, error: "Unauthorized" };
  }

  const response = await updateLLMPresetApi(token, presetId, updates);
  
  if (response.success) {
    return { success: true, data: response.result };
  }
  
  return { success: false, error: response.message };
}

export async function deleteLLMPresetAction(presetId: string) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });

  if (!userId || !token) {
    return { success: false, error: "Unauthorized" };
  }

  const response = await deleteLLMPresetApi(token, presetId);
  
  if (response.success) {
    return { success: true, data: response.result };
  }
  
  return { success: false, error: response.message };
}