// Catálogo de modelos de IA con precios y características
// Precios actualizados a enero 2025

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  costPer1kTokensInput: number;
  costPer1kTokensOutput: number;
  maxTokens: number;
  contextWindow: number;
  capabilities: string[];
  speed: 'very-fast' | 'fast' | 'medium' | 'slow';
  quality: 'good' | 'great' | 'excellent' | 'best';
  bestFor: string[];
  description: string;
}

export const MODEL_CATALOG: Record<string, ModelInfo> = {
  // Anthropic Claude Models
  'claude-3-5-sonnet-20241022': {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    costPer1kTokensInput: 0.003,
    costPer1kTokensOutput: 0.015,
    maxTokens: 8192,
    contextWindow: 200000,
    capabilities: ['reasoning', 'coding', 'analysis', 'writing', 'vision'],
    speed: 'fast',
    quality: 'excellent',
    bestFor: ['Complex reasoning', 'Code generation', 'Analysis', 'General use'],
    description: 'Balanced model with excellent performance across all tasks'
  },
  'claude-3-5-haiku-20241022': {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    costPer1kTokensInput: 0.001,
    costPer1kTokensOutput: 0.005,
    maxTokens: 8192,
    contextWindow: 200000,
    capabilities: ['reasoning', 'coding', 'writing', 'vision'],
    speed: 'very-fast',
    quality: 'great',
    bestFor: ['Quick tasks', 'High volume', 'Cost-sensitive', 'Real-time'],
    description: 'Fast and affordable model for everyday tasks'
  },
  'claude-3-opus-20240229': {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    costPer1kTokensInput: 0.015,
    costPer1kTokensOutput: 0.075,
    maxTokens: 4096,
    contextWindow: 200000,
    capabilities: ['reasoning', 'coding', 'analysis', 'writing', 'vision', 'complex-tasks'],
    speed: 'slow',
    quality: 'best',
    bestFor: ['Complex reasoning', 'Research', 'Critical tasks', 'Highest quality'],
    description: 'Most capable model for complex and nuanced tasks'
  },

  // OpenAI GPT Models
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    costPer1kTokensInput: 0.01,
    costPer1kTokensOutput: 0.03,
    maxTokens: 4096,
    contextWindow: 128000,
    capabilities: ['reasoning', 'coding', 'analysis', 'writing', 'vision'],
    speed: 'medium',
    quality: 'excellent',
    bestFor: ['Complex tasks', 'Long context', 'Multimodal'],
    description: 'Latest GPT-4 with vision and extended context'
  },
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    costPer1kTokensInput: 0.03,
    costPer1kTokensOutput: 0.06,
    maxTokens: 8192,
    contextWindow: 8192,
    capabilities: ['reasoning', 'coding', 'analysis', 'writing'],
    speed: 'slow',
    quality: 'excellent',
    bestFor: ['Complex reasoning', 'Highest accuracy'],
    description: 'Original GPT-4 model with proven reliability'
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    costPer1kTokensInput: 0.0005,
    costPer1kTokensOutput: 0.0015,
    maxTokens: 4096,
    contextWindow: 16385,
    capabilities: ['writing', 'coding', 'analysis'],
    speed: 'very-fast',
    quality: 'good',
    bestFor: ['Quick tasks', 'High volume', 'Cost-sensitive'],
    description: 'Fast and affordable for simple tasks'
  },

  // Google Gemini Models
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    costPer1kTokensInput: 0.00125,
    costPer1kTokensOutput: 0.005,
    maxTokens: 8192,
    contextWindow: 2000000,
    capabilities: ['reasoning', 'coding', 'analysis', 'writing', 'vision', 'audio'],
    speed: 'medium',
    quality: 'excellent',
    bestFor: ['Long context', 'Multimodal', 'Document analysis'],
    description: 'Massive context window for large documents'
  },
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    costPer1kTokensInput: 0.000075,
    costPer1kTokensOutput: 0.0003,
    maxTokens: 8192,
    contextWindow: 1000000,
    capabilities: ['reasoning', 'coding', 'writing', 'vision'],
    speed: 'very-fast',
    quality: 'great',
    bestFor: ['High volume', 'Real-time', 'Cost-sensitive'],
    description: 'Ultra-fast and affordable with large context'
  },

  // Mistral Models
  'mistral-large': {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    costPer1kTokensInput: 0.004,
    costPer1kTokensOutput: 0.012,
    maxTokens: 8192,
    contextWindow: 128000,
    capabilities: ['reasoning', 'coding', 'writing', 'multilingual'],
    speed: 'fast',
    quality: 'excellent',
    bestFor: ['Multilingual', 'Coding', 'European languages'],
    description: 'Strong multilingual capabilities'
  },
  'mistral-medium': {
    id: 'mistral-medium',
    name: 'Mistral Medium',
    provider: 'Mistral AI',
    costPer1kTokensInput: 0.0027,
    costPer1kTokensOutput: 0.0081,
    maxTokens: 8192,
    contextWindow: 32000,
    capabilities: ['reasoning', 'coding', 'writing'],
    speed: 'fast',
    quality: 'great',
    bestFor: ['Balanced performance', 'General use'],
    description: 'Balanced performance and cost'
  }
};

// Función para calcular costo estimado
export function calculateCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number = 0
): number {
  const model = MODEL_CATALOG[modelId];
  if (!model) return 0;

  const inputCost = (inputTokens / 1000) * model.costPer1kTokensInput;
  const outputCost = (outputTokens / 1000) * model.costPer1kTokensOutput;

  return inputCost + outputCost;
}

// Función para obtener modelos por proveedor
export function getModelsByProvider(provider: string): ModelInfo[] {
  return Object.values(MODEL_CATALOG).filter(
    model => model.provider === provider
  );
}

// Función para obtener proveedores únicos
export function getProviders(): string[] {
  const providers = new Set(
    Object.values(MODEL_CATALOG).map(model => model.provider)
  );
  return Array.from(providers).sort();
}

// Función para comparar costos
export function compareCosts(
  modelIds: string[],
  estimatedInputTokens: number,
  estimatedOutputTokens: number = 0
): Record<string, number> {
  const costs: Record<string, number> = {};

  modelIds.forEach(modelId => {
    costs[modelId] = calculateCost(modelId, estimatedInputTokens, estimatedOutputTokens);
  });

  return costs;
}

// Función para recomendar modelo basado en criterios
export function recommendModel(criteria: {
  maxCost?: number;
  minSpeed?: 'very-fast' | 'fast' | 'medium' | 'slow';
  minQuality?: 'good' | 'great' | 'excellent' | 'best';
  capabilities?: string[];
}): ModelInfo[] {
  let models = Object.values(MODEL_CATALOG);

  if (criteria.capabilities) {
    models = models.filter(model =>
      criteria.capabilities!.every(cap =>
        model.capabilities.includes(cap)
      )
    );
  }

  const speedOrder = { 'very-fast': 0, 'fast': 1, 'medium': 2, 'slow': 3 };
  const qualityOrder = { 'good': 0, 'great': 1, 'excellent': 2, 'best': 3 };

  if (criteria.minSpeed) {
    const minSpeedLevel = speedOrder[criteria.minSpeed];
    models = models.filter(
      model => speedOrder[model.speed] <= minSpeedLevel
    );
  }

  if (criteria.minQuality) {
    const minQualityLevel = qualityOrder[criteria.minQuality];
    models = models.filter(
      model => qualityOrder[model.quality] >= minQualityLevel
    );
  }

  // Ordenar por costo
  return models.sort(
    (a, b) => a.costPer1kTokensInput - b.costPer1kTokensInput
  );
}

// Modelos por defecto recomendados
export const DEFAULT_MODELS = {
  FAST_AND_CHEAP: 'claude-3-5-haiku-20241022',
  BALANCED: 'claude-3-5-sonnet-20241022',
  BEST_QUALITY: 'claude-3-opus-20240229',
  LONG_CONTEXT: 'gemini-1.5-pro',
};
