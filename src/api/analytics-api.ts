import { AppError } from "@/lib/errors";
import { Period } from "@/types/analytics";
import { BaseResponse } from "@/types";

import axiosClient from "./axios";

// Analytics response types
export interface CreditUsageStats {
  date: string;
  success: number;
  failed: number;
}

export interface StatsCardValues {
  workflowExecutions: number;
  creditsConsumed: number;
  phaseExecutions: number;
}

export interface WorkflowExecutionStats {
  date: string;
  success: number;
  failed: number;
}

export type GetCreditUsageResponse = BaseResponse<CreditUsageStats[]>;
export type GetStatsCardsResponse = BaseResponse<StatsCardValues>;
export type GetWorkflowExecutionStatsResponse = BaseResponse<WorkflowExecutionStats[]>;
export type GetPeriodsResponse = BaseResponse<Period[]>;

export async function getCreditUsageInPeriodApi(
  period: Period,
  token: string
): Promise<GetCreditUsageResponse> {
  try {
    const response = await axiosClient.get<unknown, GetCreditUsageResponse>(
      "/analytics/credit-usage",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: period.year,
          month: period.month,
        },
      }
    );

    return response;
  } catch (err: any) {
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Analytics API error: ${err.response.data?.message || err.message}`,
        "ANALYTICS_API_ERROR"
      );
    }

    throw new AppError("Get credit usage failed", "API_FAILED");
  }
}

export async function getStatsCardsValuesApi(
  period: Period,
  token: string
): Promise<GetStatsCardsResponse> {
  try {
    const response = await axiosClient.get<unknown, GetStatsCardsResponse>(
      "/analytics/stats-cards",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: period.year,
          month: period.month,
        },
      }
    );

    return response;
  } catch (err: any) {
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Analytics API error: ${err.response.data?.message || err.message}`,
        "ANALYTICS_API_ERROR"
      );
    }

    throw new AppError("Get stats cards failed", "API_FAILED");
  }
}

export async function getWorkflowExecutionStatsApi(
  period: Period,
  token: string
): Promise<GetWorkflowExecutionStatsResponse> {
  try {
    const response = await axiosClient.get<unknown, GetWorkflowExecutionStatsResponse>(
      "/analytics/workflow-execution-stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          year: period.year,
          month: period.month,
        },
      }
    );

    return response;
  } catch (err: any) {
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Analytics API error: ${err.response.data?.message || err.message}`,
        "ANALYTICS_API_ERROR"
      );
    }

    throw new AppError("Get workflow execution stats failed", "API_FAILED");
  }
}

export async function getPeriodsApi(
  token: string
): Promise<GetPeriodsResponse> {
  try {
    const response = await axiosClient.get<unknown, GetPeriodsResponse>(
      "/analytics/periods",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (err: any) {
    const url = err.config?.baseURL + err.config?.url;
    if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

    if (err.response) {
      throw new AppError(
        `Analytics API error: ${err.response.data?.message || err.message}`,
        "ANALYTICS_API_ERROR"
      );
    }

    throw new AppError("Get periods failed", "API_FAILED");
  }
}