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

export interface ExecutionHistory {
  id: string;
  promptId: string;
  executedAt: Date;
  model: string;
  tokensUsed: number;
  estimatedCost: number;
  responseTime?: number;
  notes?: string;
}

export interface PerformanceMetrics {
  averageTokens: number;
  totalExecutions: number;
  totalCost: number;
  averageResponseTime: number;
  successRate: number;
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
  projectId?: string;
  executionHistory: ExecutionHistory[];
  performanceMetrics?: PerformanceMetrics;
  description?: string;
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

export interface ProjectSettings {
  defaultModel: string;
  defaultTokenLimit: number;
  estimatedCostPerToken: number;
  tags: string[];
  temperature?: number;
}

export interface ProjectStats {
  totalPrompts: number;
  totalExecutions: number;
  totalCost: number;
  averageCostPerExecution: number;
  lastExecuted?: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  promptIds: string[];
  createdAt: Date;
  updatedAt: Date;
  settings: ProjectSettings;
  stats: ProjectStats;
  color?: string;
  icon?: string;
}

export interface ConsolidationResult {
  project: Project;
  prompts: Prompt[];
  executionHistory: ExecutionHistory[];
  statistics: ProjectStatistics;
  generatedAt: Date;
}

export interface ProjectStatistics {
  totalPrompts: number;
  totalVersions: number;
  totalExecutions: number;
  totalTokensUsed: number;
  totalCost: number;
  mostUsedPrompt?: Prompt;
  mostExpensiveModel?: string;
  averageTokensPerExecution: number;
  executionsByModel: Record<string, number>;
  costByModel: Record<string, number>;
}