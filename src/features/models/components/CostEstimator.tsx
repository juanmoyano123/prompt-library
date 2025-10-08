import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { MODEL_CATALOG, calculateCost } from '@/data/modelCatalog';

interface CostEstimatorProps {
  modelId: string;
  defaultInputTokens?: number;
  defaultOutputTokens?: number;
}

export function CostEstimator({
  modelId,
  defaultInputTokens = 1000,
  defaultOutputTokens = 500,
}: CostEstimatorProps) {
  const [inputTokens, setInputTokens] = useState(defaultInputTokens);
  const [outputTokens, setOutputTokens] = useState(defaultOutputTokens);
  const [executions, setExecutions] = useState(1);

  const model = MODEL_CATALOG[modelId];

  if (!model) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a model to see cost estimates
        </CardContent>
      </Card>
    );
  }

  const costPerExecution = calculateCost(modelId, inputTokens, outputTokens);
  const totalCost = costPerExecution * executions;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Cost Estimator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model Info */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium mb-1">{model.name}</div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>Input: ${model.costPer1kTokensInput}/1K</span>
            <span>Output: ${model.costPer1kTokensOutput}/1K</span>
          </div>
        </div>

        {/* Token Inputs */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Input Tokens
            </label>
            <Input
              type="number"
              value={inputTokens}
              onChange={(e) => setInputTokens(parseInt(e.target.value) || 0)}
              min={0}
              className="text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Output Tokens (estimated)
            </label>
            <Input
              type="number"
              value={outputTokens}
              onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
              min={0}
              className="text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Number of Executions
            </label>
            <Input
              type="number"
              value={executions}
              onChange={(e) => setExecutions(parseInt(e.target.value) || 1)}
              min={1}
              className="text-sm"
            />
          </div>
        </div>

        {/* Cost Display */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cost per Execution:</span>
            <Badge variant="secondary">
              <DollarSign className="w-3 h-3 mr-1" />
              {costPerExecution.toFixed(6)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Total Cost:</span>
            <div className="text-2xl font-bold text-primary">
              ${totalCost.toFixed(4)}
            </div>
          </div>

          {executions > 1 && (
            <div className="text-xs text-muted-foreground text-center pt-2">
              {executions} executions × ${costPerExecution.toFixed(6)} each
            </div>
          )}
        </div>

        {/* Usage Tips */}
        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
            💡 Cost Optimization Tip
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            {totalCost < 0.01
              ? 'This is a very cost-effective operation!'
              : totalCost < 0.10
              ? 'Consider batching similar prompts to optimize API calls.'
              : 'For high-volume use, consider switching to a faster/cheaper model for simple tasks.'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
