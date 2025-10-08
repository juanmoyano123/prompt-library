import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Cpu,
  DollarSign,
  Zap,
  Award,
  Info,
  ChevronRight,
} from 'lucide-react';
import { MODEL_CATALOG, ModelInfo, getProviders } from '@/data/modelCatalog';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  value?: string;
  onChange?: (modelId: string) => void;
  showComparison?: boolean;
}

export function ModelSelector({
  value,
  onChange,
  showComparison = true,
}: ModelSelectorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(value || '');

  const selectedModel = selectedModelId ? MODEL_CATALOG[selectedModelId] : null;
  const providers = getProviders();

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    onChange?.(modelId);
  };

  const getSpeedColor = (speed: ModelInfo['speed']) => {
    switch (speed) {
      case 'very-fast':
        return 'text-green-500';
      case 'fast':
        return 'text-blue-500';
      case 'medium':
        return 'text-yellow-500';
      case 'slow':
        return 'text-orange-500';
    }
  };

  const getQualityColor = (quality: ModelInfo['quality']) => {
    switch (quality) {
      case 'best':
        return 'text-purple-500';
      case 'excellent':
        return 'text-blue-500';
      case 'great':
        return 'text-green-500';
      case 'good':
        return 'text-gray-500';
    }
  };

  return (
    <>
      <div className="space-y-3">
        {/* Selected Model Display */}
        {selectedModel ? (
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold">{selectedModel.name}</h4>
                <p className="text-xs text-muted-foreground">by {selectedModel.provider}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(true)}
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Zap className={cn('w-3 h-3', getSpeedColor(selectedModel.speed))} />
                <span className="capitalize">{selectedModel.speed}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className={cn('w-3 h-3', getQualityColor(selectedModel.quality))} />
                <span className="capitalize">{selectedModel.quality}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>${selectedModel.costPer1kTokensInput}/1K tokens</span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>{(selectedModel.contextWindow / 1000).toFixed(0)}K context</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border rounded-lg border-dashed">
            <p className="text-sm text-muted-foreground text-center">
              No model selected
            </p>
          </div>
        )}

        {/* Quick Selection Buttons */}
        {showComparison && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowDetails(true)}
          >
            <Cpu className="w-4 h-4 mr-2" />
            Browse All Models
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        )}
      </div>

      {/* Model Selection Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select AI Model</DialogTitle>
            <DialogDescription>
              Choose the best model for your needs based on speed, quality, and cost
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {providers.map((provider) => {
              const providerModels = Object.values(MODEL_CATALOG).filter(
                (m) => m.provider === provider
              );

              return (
                <div key={provider} className="space-y-3">
                  <h3 className="font-semibold text-lg">{provider}</h3>

                  <div className="grid grid-cols-1 gap-3">
                    {providerModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          handleSelectModel(model.id);
                          setShowDetails(false);
                        }}
                        className={cn(
                          'p-4 border rounded-lg text-left transition-all hover:border-primary',
                          selectedModelId === model.id && 'border-primary bg-primary/5'
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{model.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {model.description}
                            </p>
                          </div>
                          {selectedModelId === model.id && (
                            <Badge variant="default">Selected</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
                          <div>
                            <div className="text-muted-foreground mb-1">Speed</div>
                            <div className={cn('font-semibold capitalize', getSpeedColor(model.speed))}>
                              {model.speed}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Quality</div>
                            <div className={cn('font-semibold capitalize', getQualityColor(model.quality))}>
                              {model.quality}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Input Cost</div>
                            <div className="font-semibold">
                              ${model.costPer1kTokensInput}/1K
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Context</div>
                            <div className="font-semibold">
                              {(model.contextWindow / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </div>

                        {model.bestFor.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {model.bestFor.map((use) => (
                              <Badge key={use} variant="secondary" className="text-xs">
                                {use}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
