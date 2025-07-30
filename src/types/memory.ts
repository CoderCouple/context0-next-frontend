
export interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export interface Graph {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface Memory {
  id: string;
  cid: string;
  input: string;
  summary?: string;
  tags: string[];
  scope: string;
  memory_type: string;
  confidence: number;
  created_at: string;
  updated_at?: string;
  last_accessed?: string;
  access_count: number;
  is_deleted: boolean;
  meta: Record<string, any>;
  graph?: Graph;
}

export interface GraphNode {
  id: string;
  group: string;
  label?: string;
  size?: number;
}
