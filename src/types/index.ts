export interface PromptVersion {
  id: string;
  content: string;
  timestamp: Date;
  type: 'manual' | 'optimized';
}

export interface PromptMetadata {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  usageCount: number;
  versions: PromptVersion[];
  metadata: PromptMetadata;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  promptIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
}