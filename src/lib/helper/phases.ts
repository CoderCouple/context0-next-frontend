import { ExecutionPhase } from "@/types/workflow-type";

type Phase = Pick<ExecutionPhase, "creditsConsumed">;
export function GetPhasesTotalCost(phases: Phase[]) {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
}
