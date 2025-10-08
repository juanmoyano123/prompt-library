import { useState } from 'react';
import { useProjectStore } from '@/features/projects/store/projectStore';
import { usePromptStore } from '@/store/promptStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  FileJson,
  FileText,
  Archive,
  Table,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { consolidateProject } from '../utils/consolidate';
import { exportAsJSON, exportPromptsAsJSON } from '../utils/exporters/jsonExporter';
import { exportAsMarkdown, exportAsReadme } from '../utils/exporters/markdownExporter';
import { exportAsZip, exportExecutionHistoryCSV } from '../utils/exporters/zipExporter';
import { ConsolidationResult } from '@/types';

interface ConsolidateButtonProps {
  projectId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

export function ConsolidateButton({
  projectId,
  variant = 'default',
  size = 'default',
  showLabel = true,
}: ConsolidateButtonProps) {
  const { getActiveProject, getProjectById } = useProjectStore();
  const { prompts } = usePromptStore();
  const [showDialog, setShowDialog] = useState(false);
  const [consolidationResult, setConsolidationResult] = useState<ConsolidationResult | null>(null);
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleConsolidate = () => {
    setIsConsolidating(true);

    // Simular un pequeño delay para mostrar el loading
    setTimeout(() => {
      const project = projectId ? getProjectById(projectId) : getActiveProject();

      if (!project) {
        toast.error('No project selected');
        setIsConsolidating(false);
        return;
      }

      const result = consolidateProject(project, prompts);
      setConsolidationResult(result);
      setIsConsolidating(false);
      setShowDialog(true);

      toast.success('Project Consolidated!', {
        description: `${result.statistics.totalPrompts} prompts analyzed`,
      });
    }, 500);
  };

  const handleExport = async (type: 'json' | 'markdown' | 'zip' | 'csv' | 'readme' | 'prompts-only') => {
    if (!consolidationResult) return;

    setIsExporting(true);

    try {
      switch (type) {
        case 'json':
          exportAsJSON(consolidationResult);
          break;
        case 'prompts-only':
          exportPromptsAsJSON(consolidationResult);
          break;
        case 'markdown':
          exportAsMarkdown(consolidationResult);
          break;
        case 'readme':
          exportAsReadme(consolidationResult);
          break;
        case 'zip':
          await exportAsZip(consolidationResult);
          break;
        case 'csv':
          exportExecutionHistoryCSV(consolidationResult);
          break;
      }

      toast.success('Export Complete!', {
        description: `Project exported as ${type.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export Failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleConsolidate}
        disabled={isConsolidating}
      >
        {isConsolidating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Consolidating...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            {showLabel && 'Consolidate Project'}
          </>
        )}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Project Consolidated
            </DialogTitle>
            <DialogDescription>
              Your project has been analyzed and is ready to export
            </DialogDescription>
          </DialogHeader>

          {consolidationResult && (
            <div className="space-y-4 py-4">
              {/* Statistics Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{consolidationResult.statistics.totalPrompts}</div>
                  <div className="text-xs text-muted-foreground">Prompts</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{consolidationResult.statistics.totalExecutions}</div>
                  <div className="text-xs text-muted-foreground">Executions</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {consolidationResult.statistics.totalTokensUsed.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Tokens</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    ${consolidationResult.statistics.totalCost.toFixed(4)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Cost</div>
                </div>
              </div>

              {/* Export Options */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Choose Export Format:</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => handleExport('zip')}
                    disabled={isExporting}
                  >
                    <Archive className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold">Complete Archive (ZIP)</div>
                      <div className="text-xs text-muted-foreground">
                        All files, reports, and data
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => handleExport('json')}
                    disabled={isExporting}
                  >
                    <FileJson className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold">Full Data (JSON)</div>
                      <div className="text-xs text-muted-foreground">
                        Complete project data
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => handleExport('markdown')}
                    disabled={isExporting}
                  >
                    <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold">Detailed Report (MD)</div>
                      <div className="text-xs text-muted-foreground">
                        Full analysis report
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => handleExport('readme')}
                    disabled={isExporting}
                  >
                    <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold">README.md</div>
                      <div className="text-xs text-muted-foreground">
                        Project documentation
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                  >
                    <Table className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold">Execution History (CSV)</div>
                      <div className="text-xs text-muted-foreground">
                        For Excel analysis
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => handleExport('prompts-only')}
                    disabled={isExporting}
                  >
                    <FileJson className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold">Prompts Only (JSON)</div>
                      <div className="text-xs text-muted-foreground">
                        For sharing/importing
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Most Used Prompt Info */}
              {consolidationResult.statistics.mostUsedPrompt && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-1">Most Used Prompt</div>
                  <div className="font-semibold">
                    {consolidationResult.statistics.mostUsedPrompt.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Used {consolidationResult.statistics.mostUsedPrompt.usageCount} times
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={isExporting}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
