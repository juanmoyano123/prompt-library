import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle, XCircle, Eye, EyeOff, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import { getApiKey, saveApiKey, validateApiKey, removeApiKey, CLAUDE_MODELS, ClaudeModel } from '@/utils/claudeAPI';
import { toast } from 'sonner';

interface ApiSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiSettings({ open, onOpenChange }: ApiSettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    const existingKey = getApiKey();
    if (existingKey) {
      setApiKey(existingKey);
      setHasExistingKey(true);
      setIsValid(true); // Assume valid if already saved
    }
  }, []);

  const handleValidate = async () => {
    if (!apiKey) return;

    setIsValidating(true);
    try {
      const valid = await validateApiKey(apiKey);
      setIsValid(valid);
      if (valid) {
        saveApiKey(apiKey);
        setHasExistingKey(true);
        toast.success('API Key Validated!', {
          description: 'Your Claude API key has been saved successfully.',
        });
      } else {
        toast.error('Invalid API Key', {
          description: 'The API key could not be validated. Please check and try again.',
        });
      }
    } catch (error) {
      setIsValid(false);
      toast.error('Validation Error', {
        description: 'Failed to validate API key. Please check your connection.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    removeApiKey();
    setApiKey('');
    setIsValid(null);
    setHasExistingKey(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Claude API Settings
          </DialogTitle>
          <DialogDescription>
            Configure your Claude API key to enable AI-powered prompt optimization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Security Warning */}
          <div className="rounded-lg border p-3 bg-muted/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Security Notice</p>
                <p className="text-muted-foreground">
                  Your API key will be stored in your browser's local storage. This is suitable for personal use but <strong>not recommended for public applications</strong>.
                  Anyone with access to your browser can potentially view this key.
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-lg border p-3 bg-muted/50">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="flex items-center gap-1 flex-wrap">
                  Get your API key from the
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Anthropic Console
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                <p className="mt-2">
                  <strong>Cost estimates:</strong> Haiku (~$0.001/1K tokens), Sonnet (~$0.003/1K tokens), Opus (~$0.015/1K tokens)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setIsValid(null);
                  }}
                  placeholder="sk-ant-api..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Status indicator */}
            {isValid !== null && (
              <div className="flex items-center gap-2">
                {isValid ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">Valid API key</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500">Invalid API key</span>
                  </>
                )}
              </div>
            )}
          </div>

          {hasExistingKey && (
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
                <span className="text-sm text-muted-foreground">
                  API key configured
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleValidate}
            disabled={!apiKey || isValidating}
          >
            {isValidating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Validating...
              </>
            ) : (
              'Save & Validate'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}