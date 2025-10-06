import { useState } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { PromptGrid } from '@/components/prompts/PromptGrid';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Download, Upload, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { usePromptStore } from '@/store/promptStore';
import { ApiSettings } from '@/components/settings/ApiSettings';

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

function Header() {
  const { exportData, importData } = usePromptStore();
  const [showApiSettings, setShowApiSettings] = useState(false);

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
            </div>
            <div className="flex items-center gap-2">
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
  return (
    <ThemeProvider defaultTheme="dark" storageKey="prompt-library-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <PromptGrid />
        </main>
        <Toaster richColors position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}

export default App