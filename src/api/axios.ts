"use client;";

// lib/axios.ts
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Retry setup
axiosRetry(axiosClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError): boolean =>
    axiosRetry.isNetworkError(error) || (error.response?.status ?? 0) >= 500,
});

export default axiosClient;
