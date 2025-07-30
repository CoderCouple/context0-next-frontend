// stores/useWorkflowStore.ts
import { Edge, Node, Viewport } from "@xyflow/react";
import { create } from "zustand";

type WorkflowState = {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewport: (viewport: Viewport) => void;
  reset: () => void;
  load: (definition: {
    nodes: Node[];
    edges: Edge[];
    viewport?: Viewport;
  }) => void;
};

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setViewport: (viewport) => set({ viewport }),
  reset: () =>
    set({
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    }),
  load: ({ nodes, edges, viewport }) =>
    set({
      nodes,
      edges,
      viewport: viewport || { x: 0, y: 0, zoom: 1 },
    }),
}));
