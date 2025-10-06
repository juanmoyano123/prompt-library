// Claude API integration for prompt optimization
// Note: This requires an API key to be configured

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Available Claude models
export const CLAUDE_MODELS = {
  haiku: 'claude-3-5-haiku-20241022',
  sonnet: 'claude-3-5-sonnet-20241022',
  opus: 'claude-3-opus-20240229',
} as const;

export type ClaudeModel = keyof typeof CLAUDE_MODELS;

export interface OptimizationConfig {
  apiKey: string;
  model?: ClaudeModel;
  maxTokens?: number;
  temperature?: number;
}

export async function optimizePrompt(
  prompt: string,
  config: OptimizationConfig
): Promise<string> {
  const {
    apiKey,
    model = 'sonnet',
    maxTokens = 2000,
    temperature = 0.7
  } = config;

  if (!apiKey) {
    throw new Error('Claude API key is required for optimization');
  }

  const modelName = CLAUDE_MODELS[model];

  const systemPrompt = `You are an expert prompt engineer specialized in optimizing AI prompts. Your task is to improve the given prompt to be more effective and produce better results.

When optimizing, focus on:
1. **Clarity & Specificity**: Make instructions crystal clear and unambiguous
2. **Context**: Add relevant background information and constraints
3. **Structure**: Organize the prompt logically with clear sections
4. **Output Format**: Specify exactly what format the response should take
5. **Examples**: Include relevant examples when helpful
6. **Edge Cases**: Address potential ambiguities or special cases
7. **Role Definition**: Clearly define the AI's role and expertise
8. **Success Criteria**: Define what makes a good response

Return ONLY the optimized prompt without any explanations, commentary, or meta-discussion about the optimization.`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true', // Enable CORS
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Optimize this prompt to make it more effective:\n\n${prompt}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from Claude API');
    }

    return data.content[0].text;
  } catch (error) {
    console.error('Error optimizing prompt:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach Claude API. Check your internet connection.');
    }

    throw error;
  }
}

// Function to validate API key
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true', // Enable CORS
      },
      body: JSON.stringify({
        model: CLAUDE_MODELS.haiku, // Use cheapest model for validation
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Hi',
          },
        ],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('API key validation error:', error);
    return false;
  }
}

// Store API key in localStorage (encrypted in production)
export function saveApiKey(apiKey: string): void {
  localStorage.setItem('claude-api-key', apiKey);
}

export function getApiKey(): string | null {
  return localStorage.getItem('claude-api-key');
}

export function removeApiKey(): void {
  localStorage.removeItem('claude-api-key');
}