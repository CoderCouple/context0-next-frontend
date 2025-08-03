import { axiosClient } from "./axios";
import { BaseResponse } from "@/types/api";
import { LLMPreset, LLMPresetResponse } from "@/types/llm-preset";

export async function getLLMPresetsApi(token: string): Promise<BaseResponse<LLMPresetResponse>> {
  try {
    const response = await axiosClient.get<BaseResponse<LLMPresetResponse>>(
      "/llm/presets",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response as unknown as BaseResponse<LLMPresetResponse>;
  } catch (err: any) {
    const error = err?.response?.data || {
      success: false,
      status: err?.response?.status || 500,
      message: err?.message || "Failed to fetch LLM presets",
    };
    return error;
  }
}

export async function setDefaultLLMPresetApi(
  token: string,
  presetId: string
): Promise<BaseResponse<{ preset_id: string }>> {
  try {
    const response = await axiosClient.post<BaseResponse<{ preset_id: string }>>(
      `/llm/presets/default`,
      { preset_id: presetId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response as unknown as BaseResponse<{ preset_id: string }>;
  } catch (err: any) {
    const error = err?.response?.data || {
      success: false,
      status: err?.response?.status || 500,
      message: err?.message || "Failed to set default preset",
    };
    return error;
  }
}

export async function createLLMPresetApi(
  token: string,
  preset: Partial<LLMPreset>
): Promise<BaseResponse<LLMPreset>> {
  try {
    const response = await axiosClient.post<BaseResponse<LLMPreset>>(
      "/llm/presets",
      preset,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response as unknown as BaseResponse<LLMPreset>;
  } catch (err: any) {
    const error = err?.response?.data || {
      success: false,
      status: err?.response?.status || 500,
      message: err?.message || "Failed to create LLM preset",
    };
    return error;
  }
}

export async function updateLLMPresetApi(
  token: string,
  presetId: string,
  updates: Partial<LLMPreset>
): Promise<BaseResponse<LLMPreset>> {
  try {
    const response = await axiosClient.put<BaseResponse<LLMPreset>>(
      `/llm/presets/${presetId}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response as unknown as BaseResponse<LLMPreset>;
  } catch (err: any) {
    const error = err?.response?.data || {
      success: false,
      status: err?.response?.status || 500,
      message: err?.message || "Failed to update LLM preset",
    };
    return error;
  }
}

export async function deleteLLMPresetApi(
  token: string,
  presetId: string
): Promise<BaseResponse<{ message: string }>> {
  try {
    const response = await axiosClient.delete<BaseResponse<{ message: string }>>(
      `/llm/presets/${presetId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response as unknown as BaseResponse<{ message: string }>;
  } catch (err: any) {
    const error = err?.response?.data || {
      success: false,
      status: err?.response?.status || 500,
      message: err?.message || "Failed to delete LLM preset",
    };
    return error;
  }
}