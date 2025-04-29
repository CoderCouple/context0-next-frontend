"use client;";

// lib/axios.ts
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { toast } from "sonner";

import { BaseResponse } from "@/types";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Retry setup
axiosRetry(axiosClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError): boolean =>
    axiosRetry.isNetworkError(error) || (error.response?.status ?? 0) >= 500,
});

// Global response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    const data: BaseResponse<any> = response.data;

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

    return response.data;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const serverMessage = (error.response?.data as any)?.message;

    if (serverMessage) {
      (error as any).customMessage = serverMessage;
    }

    // 🛑 If 401 Unauthorized, redirect to login
    if (status === 401) {
      // Optionally clear user session here if you store tokens in localStorage or cookies
      localStorage.removeItem("token");
      toast.error("Session expired. Please log in again.");

      if (typeof window !== "undefined") {
        window.location.href = "/sign-in"; // full page reload to login
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
