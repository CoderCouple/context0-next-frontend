"use client";

import { useCallback } from "react";

import { useAuth } from "@clerk/nextjs";

import { Workflow } from "@/types/workflow-type";

import { getWorkflows } from "./workflow-api";

export function getWorkflowsApi() {
  const { getToken } = useAuth();

  return useCallback(async (): Promise<Workflow[]> => {
    const token = await getToken({ template: "default" });

    if (!token) {
      return [];
    }

    return getWorkflows(token);
  }, [getToken]);
}
