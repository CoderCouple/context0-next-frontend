"use client";

import { useCallback } from "react";

import { useAuth } from "@clerk/nextjs";

import axiosClient from "@/api/axios";
import { AppError } from "@/lib/errors";
import { GetWorkflowsResponse, Workflow } from "@/types/workflow-type";

export function useGetWorkflowsApi(): () => Promise<Workflow[]> {
  const { getToken } = useAuth();

  const getWorkflows = useCallback(async (): Promise<Workflow[]> => {
    const token = await getToken({ template: "default" });

    try {
      const response = await axiosClient.get<GetWorkflowsResponse>(
        "/workflow",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("[AXIOS URL]:", response.config.baseURL, response.config.url);
      return response.data.items;
    } catch (err: any) {
      const url = err.config?.baseURL + err.config?.url;
      if (url) console.error(`[AXIOS FAILED URL]: ${url}`);

      if (err.response) {
        throw new AppError(
          `Python API error: ${err.response.data?.message || err.message}`,
          "PYTHON_API_ERROR"
        );
      }

      return [];
    }
  }, [getToken]);

  return getWorkflows;
}
