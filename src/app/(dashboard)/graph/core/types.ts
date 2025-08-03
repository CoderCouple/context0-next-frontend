import { Node, Edge } from "@xyflow/react";
import { LucideIcon } from "lucide-react";

// Database-agnostic graph data types
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata?: GraphMetadata;
}

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, any>;
  style?: NodeStyle;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  properties?: Record<string, any>;
  style?: EdgeStyle;
}

export interface GraphMetadata {
  totalNodes: number;
  totalEdges: number;
  nodeTypes: Record<NodeType, number>;
  edgeTypes: Record<EdgeType, number>;
  timestamp?: string;
}

// Node types enum - extensible for any graph database
export enum NodeType {
  MEMORY = "memory",
  ENTITY = "entity",
  PERSON = "person",
  LOCATION = "location",
  CONCEPT = "concept",
  TEMPORAL = "temporal",
  TAG = "tag",
  SESSION = "session",
  USER = "user",
  ORGANIZATION = "organization",
  SYSTEM = "system",
  CUSTOM = "custom"
}

// Edge types enum - database agnostic relationships
export enum EdgeType {
  HAS_MEMORY = "has_memory",
  CONTAINS = "contains",
  RELATES_TO = "relates_to",
  SIMILAR_TO = "similar_to",
  TEMPORAL_LINK = "temporal_link",
  TAGGED_WITH = "tagged_with",
  BELONGS_TO = "belongs_to",
  MENTIONS = "mentions",
  HAPPENED_AT = "happened_at",
  CREATED_BY = "created_by",
  CUSTOM = "custom"
}

// Node style configuration
export interface NodeStyle {
  shape?: "circle" | "rectangle" | "diamond" | "hexagon" | "ellipse";
  size?: { width: number; height: number } | number;
  color?: { background: string; border: string; text?: string };
  icon?: LucideIcon | string;
  fontSize?: number;
  fontWeight?: number;
}

// Edge style configuration
export interface EdgeStyle {
  type?: "straight" | "bezier" | "step" | "smoothstep";
  style?: "solid" | "dashed" | "dotted";
  color?: string;
  width?: number;
  animated?: boolean;
  markerEnd?: boolean;
}

// Layout types
export type LayoutType = "force" | "hierarchical" | "radial" | "timeline" | "grid" | "custom";

// Graph configuration
export interface GraphConfig {
  layout: LayoutType;
  nodeStyles: Record<NodeType, NodeStyleConfig>;
  edgeStyles: Record<EdgeType, EdgeStyleConfig>;
  features: GraphFeatures;
  performance?: PerformanceConfig;
}

export interface NodeStyleConfig extends NodeStyle {
  renderer?: CustomNodeRenderer;
  interactive?: boolean;
  showLabel?: boolean;
}

export interface EdgeStyleConfig extends EdgeStyle {
  renderer?: CustomEdgeRenderer;
  showLabel?: boolean;
}

export interface GraphFeatures {
  search?: boolean;
  filters?: boolean;
  clustering?: boolean;
  export?: boolean;
  analysis?: boolean;
  minimap?: boolean;
  controls?: boolean;
  legend?: boolean;
}

export interface PerformanceConfig {
  enableVirtualization?: boolean;
  nodeRenderLimit?: number;
  edgeRenderLimit?: number;
  clusterThreshold?: number;
}

// Custom renderer types
export type CustomNodeRenderer = (node: GraphNode) => React.ReactNode;
export type CustomEdgeRenderer = (edge: GraphEdge) => React.ReactNode;

// ReactFlow integration types
export type AppNode = Node<AppNodeData>;

export interface AppNodeData {
  nodeType: NodeType;
  graphNode: GraphNode;
  label: string;
  [key: string]: any;
}

export type AppEdge = Edge<AppEdgeData>;

export interface AppEdgeData {
  edgeType: EdgeType;
  graphEdge: GraphEdge;
  label?: string;
  showLabel?: boolean;
  [key: string]: any;
}

// Filter types
export interface GraphFilters {
  nodeTypes?: NodeType[];
  edgeTypes?: EdgeType[];
  searchQuery?: string;
  dateRange?: { start: Date; end: Date };
  properties?: Record<string, any>;
}

// Layout algorithm interface
export interface LayoutAlgorithm {
  name: string;
  calculate(nodes: GraphNode[], edges: GraphEdge[]): NodePosition[];
}

export interface NodePosition {
  id: string;
  x: number;
  y: number;
}

// Plugin system types
export interface GraphPlugin {
  id: string;
  name: string;
  version: string;
  nodeTypes?: Record<string, NodeTypeDefinition>;
  edgeTypes?: Record<string, EdgeTypeDefinition>;
  layouts?: Record<string, LayoutAlgorithm>;
  transformers?: DataTransformer[];
  panels?: PanelDefinition[];
}

export interface NodeTypeDefinition {
  type: string;
  label: string;
  icon?: LucideIcon;
  defaultStyle: NodeStyleConfig;
  renderer?: CustomNodeRenderer;
}

export interface EdgeTypeDefinition {
  type: string;
  label: string;
  defaultStyle: EdgeStyleConfig;
  renderer?: CustomEdgeRenderer;
}

export interface DataTransformer {
  name: string;
  transform(data: GraphData): GraphData;
}

export interface PanelDefinition {
  id: string;
  title: string;
  icon?: LucideIcon;
  component: React.ComponentType<any>;
  position: "left" | "right" | "top" | "bottom";
}

// Event types
export interface GraphEvents {
  onNodeClick?: (node: GraphNode) => void;
  onNodeDoubleClick?: (node: GraphNode) => void;
  onNodeHover?: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
  onEdgeDoubleClick?: (edge: GraphEdge) => void;
  onBackgroundClick?: () => void;
  onSelectionChange?: (nodes: GraphNode[], edges: GraphEdge[]) => void;
}

// Export types
export interface ExportOptions {
  format: "json" | "image" | "svg" | "csv";
  includeStyles?: boolean;
  includeMetadata?: boolean;
}