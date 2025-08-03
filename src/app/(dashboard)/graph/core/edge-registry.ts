import { EdgeType, EdgeTypeDefinition } from "./types";

// Registry of all edge types with their configurations
export const EdgeRegistry: Record<EdgeType, EdgeTypeDefinition> = {
  [EdgeType.HAS_MEMORY]: {
    type: EdgeType.HAS_MEMORY,
    label: "has memory",
    defaultStyle: {
      type: "bezier",
      style: "solid",
      color: "#3b82f6",
      width: 3,
      animated: false,
      markerEnd: true,
      showLabel: true,
    },
  },
  [EdgeType.CONTAINS]: {
    type: EdgeType.CONTAINS,
    label: "Contains",
    defaultStyle: {
      type: "bezier",
      style: "solid",
      color: "#3b82f6",
      width: 2,
      animated: false,
      markerEnd: true,
      showLabel: true,
    },
  },
  [EdgeType.RELATES_TO]: {
    type: EdgeType.RELATES_TO,
    label: "Relates To",
    defaultStyle: {
      type: "bezier",
      style: "dashed",
      color: "#10b981",
      width: 1.5,
      animated: false,
      markerEnd: true,
      showLabel: true,
    },
  },
  [EdgeType.SIMILAR_TO]: {
    type: EdgeType.SIMILAR_TO,
    label: "Similar To",
    defaultStyle: {
      type: "straight",
      style: "dotted",
      color: "#8b5cf6",
      width: 1.5,
      animated: true,
      markerEnd: false,
      showLabel: true,
    },
  },
  [EdgeType.TEMPORAL_LINK]: {
    type: EdgeType.TEMPORAL_LINK,
    label: "Temporal Link",
    defaultStyle: {
      type: "step",
      style: "solid",
      color: "#ef4444",
      width: 2,
      animated: true,
      markerEnd: true,
      showLabel: true,
    },
  },
  [EdgeType.TAGGED_WITH]: {
    type: EdgeType.TAGGED_WITH,
    label: "Tagged With",
    defaultStyle: {
      type: "bezier",
      style: "dashed",
      color: "#6b7280",
      width: 1,
      animated: false,
      markerEnd: true,
      showLabel: false,
    },
  },
  [EdgeType.BELONGS_TO]: {
    type: EdgeType.BELONGS_TO,
    label: "Belongs To",
    defaultStyle: {
      type: "bezier",
      style: "solid",
      color: "#0ea5e9",
      width: 2,
      animated: false,
      markerEnd: true,
      showLabel: true,
    },
  },
  [EdgeType.MENTIONS]: {
    type: EdgeType.MENTIONS,
    label: "Mentions",
    defaultStyle: {
      type: "bezier",
      style: "solid",
      color: "#10b981",
      width: 1.5,
      animated: false,
      markerEnd: true,
      showLabel: true,
    },
  },
  [EdgeType.HAPPENED_AT]: {
    type: EdgeType.HAPPENED_AT,
    label: "Happened At",
    defaultStyle: {
      type: "smoothstep",
      style: "solid",
      color: "#f59e0b",
      width: 1.5,
      animated: false,
      markerEnd: true,
      showLabel: true,
    },
  },
  [EdgeType.CREATED_BY]: {
    type: EdgeType.CREATED_BY,
    label: "Created By",
    defaultStyle: {
      type: "bezier",
      style: "solid",
      color: "#6366f1",
      width: 2,
      animated: false,
      markerEnd: true,
      showLabel: true,
    },
  },
  [EdgeType.CUSTOM]: {
    type: EdgeType.CUSTOM,
    label: "Custom",
    defaultStyle: {
      type: "bezier",
      style: "solid",
      color: "#9ca3af",
      width: 1.5,
      animated: false,
      markerEnd: true,
      showLabel: true,
    },
  },
};

// Helper function to get edge configuration
export function getEdgeConfig(edgeType: EdgeType): EdgeTypeDefinition {
  return EdgeRegistry[edgeType] || EdgeRegistry[EdgeType.CUSTOM];
}

// Helper function to get all available edge types
export function getAvailableEdgeTypes(): EdgeType[] {
  return Object.keys(EdgeRegistry) as EdgeType[];
}

// Helper function to get edge style for ReactFlow
export function getEdgeStyle(edgeType: EdgeType, theme?: "light" | "dark") {
  const config = getEdgeConfig(edgeType);
  const style = config.defaultStyle;
  
  // Adjust colors for dark theme if needed
  const color = theme === "dark" ? style.color : style.color;
  
  return {
    stroke: color,
    strokeWidth: style.width,
    strokeDasharray: style.style === "dashed" ? "5,5" : style.style === "dotted" ? "2,2" : undefined,
    animated: style.animated,
  };
}