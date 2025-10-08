import { useState } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { PromptGrid } from '@/components/prompts/PromptGrid';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Download, Upload, Settings, LayoutDashboard, FileText, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { usePromptStore } from '@/store/promptStore';
import { useProjectStore } from '@/features/projects/store/projectStore';
import { ApiSettings } from '@/components/settings/ApiSettings';
import { ProjectSidebar } from '@/features/projects/components/ProjectSidebar';
import { ProjectDashboard } from '@/features/projects/components/ProjectDashboard';
import { ConsolidateButton } from '@/features/consolidation/components/ConsolidateButton';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

type ViewMode = 'prompts' | 'dashboard';

function Header({ viewMode, setViewMode }: { viewMode: ViewMode; setViewMode: (mode: ViewMode) => void }) {
  const { exportData, importData } = usePromptStore();
  const { getActiveProject } = useProjectStore();
  const [showApiSettings, setShowApiSettings] = useState(false);

  const activeProject = getActiveProject();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-library-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          importData(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <>
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold tracking-tight">
                Prompt Library
              </h1>
              {activeProject && (
                <Badge variant="secondary">
                  {activeProject.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('dashboard')}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={viewMode === 'prompts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('prompts')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Prompts
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <ConsolidateButton variant="ghost" size="sm" />
              <Button variant="ghost" size="icon" onClick={handleImport}>
                <Upload className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleExport}>
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowApiSettings(true)}>
                <Settings className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <ApiSettings open={showApiSettings} onOpenChange={setShowApiSettings} />
    </>
  );
}

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('prompts');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="prompt-library-theme">
      <div className="min-h-screen bg-background flex flex-col">
        <Header viewMode={viewMode} setViewMode={setViewMode} />

        <div className="flex flex-1 overflow-hidden">
          {/* Project Sidebar */}
          <ProjectSidebar collapsed={sidebarCollapsed} />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'dashboard' ? (
              <ProjectDashboard />
            ) : (
              <main className="container mx-auto px-4 py-6">
                <PromptGrid />
              </main>
            )}
          </div>
        </div>

        <Toaster richColors position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}

export default App