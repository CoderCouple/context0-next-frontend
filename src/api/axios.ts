"use client";

// lib/axios.ts
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { toast } from "sonner";

import { BaseResponse } from "@/types";
import { env } from "@/env/client";

const axiosClient = axios.create({
  baseURL: `${env.NEXT_PUBLIC_PYTHON_BACKEND_HOST || "http://127.0.0.1:8000"}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Retry setup
axiosRetry(axiosClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError): boolean =>
    axiosRetry.isNetworkError(error) || (error.response?.status ?? 0) >= 500,
});

// 🔁 Request Interceptor: camelCase ➝ snake_case
axiosClient.interceptors.request.use((config) => {
  if (config.data && typeof config.data === "object") {
    config.data = snakecaseKeys(config.data, { deep: true });
  }

  if (config.params && typeof config.params === "object") {
    config.params = snakecaseKeys(config.params, { deep: true });
  }

  //console.log("[REQUEST]", config); // 🛠 dem
  return config;
});

// Global response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // ✅ Transform snake_case ➝ camelCase
    const camelData = camelcaseKeys(response.data, { deep: true });

    const data: BaseResponse<any> = camelData;
    console.log("[RESPONSE data]", data); // 🛠 dem
    console.log("[RESPONSE camelData]", camelData); // 🛠 dem

    if (!data.success) {
      const error = new AxiosError(
        data.message || "Unknown API error",
        undefined,
        response.config,
        response.request,
        response
      );
      (error as any).customMessage = data.message || "Unknown API error";
      return Promise.reject(error);
    }

    return camelData; // ✅ FIXED: Return camelCase payload
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const serverMessage = (error.response?.data as any)?.message;

    if (serverMessage) {
      (error as any).customMessage = serverMessage;
    }

    // 🛑 If 401 Unauthorized, redirect to login
    if (status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please log in again.");

      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
