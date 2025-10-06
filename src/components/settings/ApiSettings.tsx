import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Info, ExternalLink, Code } from 'lucide-react';
import { isApiKeyConfigured, validateApiKeyFormat, getApiKey } from '@/utils/claudeAPI';

interface ApiSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiSettings({ open, onOpenChange }: ApiSettingsProps) {
  const isConfigured = isApiKeyConfigured();
  const apiKey = getApiKey();
  const isValidFormat = apiKey ? validateApiKeyFormat(apiKey) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            API Configuration Status
          </DialogTitle>
          <DialogDescription>
            Your Claude API key is managed through environment variables
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Configuration Status */}
          <div className="rounded-lg border p-4 bg-muted/30">
            <div className="flex items-center gap-3 mb-3">
              {isConfigured ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold">API Key Configured</p>
                    <p className="text-sm text-muted-foreground">
                      {isValidFormat ? 'Valid format detected' : 'Format may be incorrect'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-semibold">API Key Not Configured</p>
                    <p className="text-sm text-muted-foreground">
                      Add your API key to .env.local file
                    </p>
                  </div>
                </>
              )}
            </div>

            {isConfigured && (
              <Badge variant="secondary" className="text-xs font-mono">
                Key: {apiKey?.slice(0, 15)}...{apiKey?.slice(-4)}
              </Badge>
            )}
          </div>

          {/* Setup Instructions */}
          <div className="rounded-lg border p-3 bg-muted/50">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">Setup Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Get your API key from the{' '}
                    <a
                      href="https://console.anthropic.com/settings/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Anthropic Console
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Open the <code className="text-xs bg-muted px-1 py-0.5 rounded">.env.local</code> file in your project root</li>
                  <li>Add: <code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_CLAUDE_API_KEY=your_key_here</code></li>
                  <li>Restart the development server: <code className="text-xs bg-muted px-1 py-0.5 rounded">npm run dev</code></li>
                </ol>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="rounded-lg border p-3 bg-muted/30">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Security</p>
                <p className="text-muted-foreground">
                  The <code className="text-xs bg-muted px-1 py-0.5 rounded">.env.local</code> file is ignored by Git and never committed to your repository.
                  Your API key stays private and secure.
                </p>
              </div>
            </div>
          </div>

          {/* Model Info */}
          <div className="rounded-lg border p-3 bg-muted/50">
            <div className="text-sm space-y-2">
              <p className="font-semibold">Available Models:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Haiku:</strong> ~$0.001/1K tokens (fast & cheap)</li>
                <li><strong>Sonnet:</strong> ~$0.003/1K tokens (balanced, default)</li>
                <li><strong>Opus:</strong> ~$0.015/1K tokens (most capable)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}