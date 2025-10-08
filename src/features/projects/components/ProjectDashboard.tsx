import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { usePromptStore } from '@/store/promptStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FolderOpen,
  FileText,
  TrendingUp,
  DollarSign,
  Settings,
  Download,
  Archive,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';

export function ProjectDashboard() {
  const { getActiveProject } = useProjectStore();
  const { prompts } = usePromptStore();
  const [showConsolidate, setShowConsolidate] = useState(false);

  const activeProject = getActiveProject();

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Project Selected</h3>
          <p className="text-muted-foreground">
            Select or create a project to get started
          </p>
        </div>
      </div>
    );
  }

  // Get project prompts
  const projectPrompts = prompts.filter((p) =>
    activeProject.promptIds.includes(p.id)
  );

  // Calculate statistics
  const totalExecutions = projectPrompts.reduce(
    (sum, p) => sum + (p.executionHistory?.length || 0),
    0
  );

  const totalCost = projectPrompts.reduce(
    (sum, p) =>
      sum +
      (p.executionHistory?.reduce(
        (execSum, exec) => execSum + exec.estimatedCost,
        0
      ) || 0),
    0
  );

  const totalTokens = projectPrompts.reduce(
    (sum, p) =>
      sum +
      (p.executionHistory?.reduce(
        (execSum, exec) => execSum + exec.tokensUsed,
        0
      ) || 0),
    0
  );

  const favoritePrompts = projectPrompts.filter((p) => p.isFavorite).length;

  return (
    <div className="p-6 space-y-6">
      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">{activeProject.name}</h1>
          </div>
          {activeProject.description && (
            <p className="text-muted-foreground">{activeProject.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created {format(new Date(activeProject.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{activeProject.promptIds.length} prompts</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Consolidate
          </Button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Total Prompts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeProject.promptIds.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {favoritePrompts} marked as favorite
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalExecutions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalTokens.toLocaleString()} tokens used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalCost.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalExecutions > 0
                ? `$${(totalCost / totalExecutions).toFixed(4)} avg per execution`
                : 'No executions yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Archive className="w-4 h-4" />
              Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold truncate">
              {activeProject.settings.defaultModel}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeProject.settings.defaultTokenLimit} tokens limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Settings Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
          <CardDescription>Default settings for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Default Model
              </div>
              <Badge variant="secondary">{activeProject.settings.defaultModel}</Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Token Limit
              </div>
              <div className="text-sm font-semibold">
                {activeProject.settings.defaultTokenLimit.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Temperature
              </div>
              <div className="text-sm font-semibold">
                {activeProject.settings.temperature || 0.7}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Cost per Token
              </div>
              <div className="text-sm font-semibold">
                ${activeProject.settings.estimatedCostPerToken}
              </div>
            </div>
            {activeProject.settings.tags.length > 0 && (
              <div className="col-span-2">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Project Tags
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeProject.settings.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {projectPrompts.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              This project doesn't have any prompts yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create prompts and assign them to this project to start tracking your AI workflows.
            </p>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Create First Prompt
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
