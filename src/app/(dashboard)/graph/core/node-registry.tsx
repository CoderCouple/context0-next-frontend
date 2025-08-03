import {
  Brain,
  User,
  MapPin,
  Calendar,
  Tag,
  Lightbulb,
  Building2,
  Server,
  Users,
  Hash,
  LucideIcon,
} from "lucide-react";

import { NodeType, NodeTypeDefinition } from "./types";

// Registry of all node types with their configurations
export const NodeRegistry: Record<NodeType, NodeTypeDefinition> = {
  [NodeType.MEMORY]: {
    type: NodeType.MEMORY,
    label: "Memory",
    icon: Brain,
    defaultStyle: {
      shape: "circle",
      size: 80,
      color: {
        background: "#3b82f6",
        border: "#2563eb",
        text: "#ffffff",
      },
      fontSize: 12,
      fontWeight: 600,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.PERSON]: {
    type: NodeType.PERSON,
    label: "Person",
    icon: User,
    defaultStyle: {
      shape: "circle",
      size: 60,
      color: {
        background: "#10b981",
        border: "#059669",
        text: "#ffffff",
      },
      fontSize: 11,
      fontWeight: 500,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.ENTITY]: {
    type: NodeType.ENTITY,
    label: "Entity",
    icon: Hash,
    defaultStyle: {
      shape: "diamond",
      size: 60,
      color: {
        background: "#8b5cf6",
        border: "#7c3aed",
        text: "#ffffff",
      },
      fontSize: 11,
      fontWeight: 500,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.LOCATION]: {
    type: NodeType.LOCATION,
    label: "Location",
    icon: MapPin,
    defaultStyle: {
      shape: "circle",
      size: 60,
      color: {
        background: "#f59e0b",
        border: "#d97706",
        text: "#ffffff",
      },
      fontSize: 11,
      fontWeight: 500,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.TEMPORAL]: {
    type: NodeType.TEMPORAL,
    label: "Date/Time",
    icon: Calendar,
    defaultStyle: {
      shape: "rectangle",
      size: { width: 100, height: 40 },
      color: {
        background: "#ef4444",
        border: "#dc2626",
        text: "#ffffff",
      },
      fontSize: 10,
      fontWeight: 500,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.CONCEPT]: {
    type: NodeType.CONCEPT,
    label: "Concept",
    icon: Lightbulb,
    defaultStyle: {
      shape: "hexagon",
      size: 55,
      color: {
        background: "#a855f7",
        border: "#9333ea",
        text: "#ffffff",
      },
      fontSize: 11,
      fontWeight: 500,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.TAG]: {
    type: NodeType.TAG,
    label: "Tag",
    icon: Tag,
    defaultStyle: {
      shape: "ellipse",
      size: { width: 100, height: 40 },
      color: {
        background: "#6b7280",
        border: "#4b5563",
        text: "#ffffff",
      },
      fontSize: 10,
      fontWeight: 400,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.ORGANIZATION]: {
    type: NodeType.ORGANIZATION,
    label: "Organization",
    icon: Building2,
    defaultStyle: {
      shape: "rectangle",
      size: 65,
      color: {
        background: "#14b8a6",
        border: "#0d9488",
        text: "#ffffff",
      },
      fontSize: 11,
      fontWeight: 500,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.SYSTEM]: {
    type: NodeType.SYSTEM,
    label: "System",
    icon: Server,
    defaultStyle: {
      shape: "rectangle",
      size: 60,
      color: {
        background: "#64748b",
        border: "#475569",
        text: "#ffffff",
      },
      fontSize: 11,
      fontWeight: 500,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.SESSION]: {
    type: NodeType.SESSION,
    label: "Session",
    icon: Users,
    defaultStyle: {
      shape: "ellipse",
      size: { width: 90, height: 50 },
      color: {
        background: "#0ea5e9",
        border: "#0284c7",
        text: "#ffffff",
      },
      fontSize: 11,
      fontWeight: 500,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.USER]: {
    type: NodeType.USER,
    label: "User",
    icon: User,
    defaultStyle: {
      shape: "circle",
      size: 70,
      color: {
        background: "#6366f1",
        border: "#4f46e5",
        text: "#ffffff",
      },
      fontSize: 12,
      fontWeight: 600,
      interactive: true,
      showLabel: true,
    },
  },
  [NodeType.CUSTOM]: {
    type: NodeType.CUSTOM,
    label: "Custom",
    icon: Hash,
    defaultStyle: {
      shape: "rectangle",
      size: 60,
      color: {
        background: "#9ca3af",
        border: "#6b7280",
        text: "#ffffff",
      },
      fontSize: 11,
      fontWeight: 500,
      interactive: true,
      showLabel: true,
    },
  },
};

// Helper function to get node configuration
export function getNodeConfig(nodeType: NodeType): NodeTypeDefinition {
  return NodeRegistry[nodeType] || NodeRegistry[NodeType.CUSTOM];
}

// Helper function to get all available node types
export function getAvailableNodeTypes(): NodeType[] {
  return Object.keys(NodeRegistry) as NodeType[];
}

// Helper function to get node icon
export function getNodeIcon(nodeType: NodeType): LucideIcon {
  const config = getNodeConfig(nodeType);
  return config.icon || Hash;
}