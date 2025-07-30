import { AppError } from "@/lib/errors";
import { BaseResponse } from "@/types";
import { PackId, UserPurchase } from "@/types/billing";

import axiosClient from "./axios";

// Billing response types
export interface AvailableCreditsResponse {
  credits: number;
}

export interface PurchaseCreditsRequest {
  packId: PackId;
}

export interface SetupUserResponse {
  userId: string;
  credits: number;
}

export interface DownloadInvoiceResponse {
  invoiceUrl: string;
}

export type GetAvailableCreditsResponse = BaseResponse<AvailableCreditsResponse>;
export type GetUserPurchaseHistoryResponse = BaseResponse<UserPurchase[]>;
export type GetSetupUserResponse = BaseResponse<SetupUserResponse>;
export type GetDownloadInvoiceResponse = BaseResponse<DownloadInvoiceResponse>;

export async function getAvailableCreditsApi(
  token: string
): Promise<GetAvailableCreditsResponse> {
  try {
    const response = await axiosClient.get<unknown, GetAvailableCreditsResponse>(
      "/billing/credits",
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
        `Billing API error: ${err.response.data?.message || err.message}`,
        "BILLING_API_ERROR"
      );
    }

    throw new AppError("Get available credits failed", "API_FAILED");
  }
}

export async function purchaseCreditsApi(
  packId: PackId,
  token: string
): Promise<BaseResponse<{ checkoutUrl: string }>> {
  try {
    const response = await axiosClient.post<
      PurchaseCreditsRequest,
      BaseResponse<{ checkoutUrl: string }>
    >(
      "/billing/purchase",
      { packId },
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
        `Billing API error: ${err.response.data?.message || err.message}`,
        "BILLING_API_ERROR"
      );
    }

    throw new AppError("Purchase credits failed", "API_FAILED");
  }
}

export async function setupUserApi(
  token: string
): Promise<GetSetupUserResponse> {
  try {
    const response = await axiosClient.post<unknown, GetSetupUserResponse>(
      "/billing/setup",
      {},
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
        `Billing API error: ${err.response.data?.message || err.message}`,
        "BILLING_API_ERROR"
      );
    }

    throw new AppError("Setup user failed", "API_FAILED");
  }
}

export async function getUserPurchaseHistoryApi(
  token: string
): Promise<GetUserPurchaseHistoryResponse> {
  try {
    const response = await axiosClient.get<unknown, GetUserPurchaseHistoryResponse>(
      "/billing/purchases",
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
        `Billing API error: ${err.response.data?.message || err.message}`,
        "BILLING_API_ERROR"
      );
    }

    throw new AppError("Get purchase history failed", "API_FAILED");
  }
}

export async function downloadInvoiceApi(
  purchaseId: string,
  token: string
): Promise<GetDownloadInvoiceResponse> {
  try {
    const response = await axiosClient.get<unknown, GetDownloadInvoiceResponse>(
      `/billing/invoice/${purchaseId}`,
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
        `Billing API error: ${err.response.data?.message || err.message}`,
        "BILLING_API_ERROR"
      );
    }

    throw new AppError("Download invoice failed", "API_FAILED");
  }
}