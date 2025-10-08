import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/projectStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FolderOpen,
  FolderPlus,
  Settings,
  Trash2,
  ChevronRight,
  Archive,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProjectSidebarProps {
  collapsed?: boolean;
}

export function ProjectSidebar({ collapsed = false }: ProjectSidebarProps) {
  const {
    projects,
    activeProjectId,
    setActiveProject,
    createProject,
    deleteProject,
  } = useProjectStore();

  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Project name is required');
      return;
    }

    const projectId = createProject(newProjectName, newProjectDescription);
    setNewProjectName('');
    setNewProjectDescription('');
    setShowNewProjectDialog(false);

    toast.success('Project Created!', {
      description: `"${newProjectName}" has been created.`,
    });
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    if (projects.length === 1) {
      toast.error('Cannot delete the last project');
      return;
    }

    if (confirm(`Are you sure you want to delete "${projectName}"? This will not delete the prompts.`)) {
      deleteProject(projectId);
      toast.success('Project Deleted', {
        description: `"${projectName}" has been removed.`,
      });
    }
  };

  if (collapsed) {
    return (
      <div className="w-16 border-r bg-background flex flex-col items-center py-4 gap-2">
        {projects.map((project) => (
          <Button
            key={project.id}
            variant={activeProjectId === project.id ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setActiveProject(project.id)}
            title={project.name}
          >
            <FolderOpen className="w-5 h-5" />
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNewProjectDialog(true)}
          title="New Project"
        >
          <FolderPlus className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="w-64 border-r bg-background flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Projects</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNewProjectDialog(true)}
            >
              <FolderPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-2">
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mb-1"
              >
                <div
                  className={cn(
                    'group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors',
                    activeProjectId === project.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                  onClick={() => setActiveProject(project.id)}
                >
                  <FolderOpen className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-sm">
                      {project.name}
                    </div>
                    <div className="text-xs opacity-70 truncate">
                      {project.stats.totalPrompts} prompts
                    </div>
                  </div>

                  {projects.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity',
                        activeProjectId === project.id
                          ? 'text-primary-foreground hover:bg-primary-foreground/20'
                          : ''
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id, project.name);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t bg-muted/30">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Total Projects:</span>
              <span className="font-semibold">{projects.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Prompts:</span>
              <span className="font-semibold">
                {projects.reduce((sum, p) => sum + p.stats.totalPrompts, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Organize your prompts into projects for better management.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., Marketing Campaign, Code Helpers, etc."
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Input
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="What is this project about?"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
