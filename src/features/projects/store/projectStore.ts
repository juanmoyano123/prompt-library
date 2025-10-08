import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, ProjectSettings, ProjectStats } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_MODELS } from '@/data/modelCatalog';

interface ProjectStore {
  projects: Project[];
  activeProjectId: string | null;

  // Actions
  createProject: (name: string, description?: string) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  getActiveProject: () => Project | null;

  // Project settings
  updateProjectSettings: (id: string, settings: Partial<ProjectSettings>) => void;

  // Project stats (auto-calculated)
  recalculateProjectStats: (id: string) => void;

  // Prompts management within projects
  addPromptToProject: (projectId: string, promptId: string) => void;
  removePromptFromProject: (projectId: string, promptId: string) => void;

  // Utils
  getProjectById: (id: string) => Project | undefined;
  getProjectPrompts: (projectId: string) => string[];
}

const createDefaultProject = (name: string = 'Default Project', description: string = 'Main project'): Project => ({
  id: uuidv4(),
  name,
  description,
  promptIds: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  settings: {
    defaultModel: DEFAULT_MODELS.BALANCED,
    defaultTokenLimit: 4096,
    estimatedCostPerToken: 0.003,
    tags: [],
    temperature: 0.7,
  },
  stats: {
    totalPrompts: 0,
    totalExecutions: 0,
    totalCost: 0,
    averageCostPerExecution: 0,
  },
  color: '#8b5cf6',
  icon: 'folder',
});

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [createDefaultProject()],
      activeProjectId: null,

      createProject: (name, description = '') => {
        const newProject = createDefaultProject(name, description);
        set((state) => ({
          projects: [...state.projects, newProject],
          activeProjectId: newProject.id,
        }));
        return newProject.id;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => {
          const remainingProjects = state.projects.filter((p) => p.id !== id);

          // Si no quedan proyectos, crear uno por defecto
          if (remainingProjects.length === 0) {
            const defaultProject = createDefaultProject();
            return {
              projects: [defaultProject],
              activeProjectId: defaultProject.id,
            };
          }

          return {
            projects: remainingProjects,
            activeProjectId:
              state.activeProjectId === id
                ? remainingProjects[0].id
                : state.activeProjectId,
          };
        });
      },

      setActiveProject: (id) => {
        set({ activeProjectId: id });
      },

      getActiveProject: () => {
        const state = get();
        if (!state.activeProjectId) {
          // Si no hay proyecto activo, activar el primero
          if (state.projects.length > 0) {
            const firstProject = state.projects[0];
            set({ activeProjectId: firstProject.id });
            return firstProject;
          }
          return null;
        }
        return state.projects.find((p) => p.id === state.activeProjectId) || null;
      },

      updateProjectSettings: (id, settingsUpdates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  settings: { ...project.settings, ...settingsUpdates },
                  updatedAt: new Date(),
                }
              : project
          ),
        }));
      },

      recalculateProjectStats: (id) => {
        // Esta función se llamará desde el prompt store cuando cambie algo
        // Por ahora solo actualiza el contador de prompts
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== id) return project;

            const stats: ProjectStats = {
              ...project.stats,
              totalPrompts: project.promptIds.length,
            };

            return { ...project, stats, updatedAt: new Date() };
          }),
        }));
      },

      addPromptToProject: (projectId, promptId) => {
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== projectId) return project;

            // Evitar duplicados
            if (project.promptIds.includes(promptId)) return project;

            return {
              ...project,
              promptIds: [...project.promptIds, promptId],
              updatedAt: new Date(),
            };
          }),
        }));

        // Recalcular stats
        get().recalculateProjectStats(projectId);
      },

      removePromptFromProject: (projectId, promptId) => {
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== projectId) return project;

            return {
              ...project,
              promptIds: project.promptIds.filter((id) => id !== promptId),
              updatedAt: new Date(),
            };
          }),
        }));

        // Recalcular stats
        get().recalculateProjectStats(projectId);
      },

      getProjectById: (id) => {
        return get().projects.find((p) => p.id === id);
      },

      getProjectPrompts: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId);
        return project?.promptIds || [];
      },
    }),
    {
      name: 'project-library-storage',
    }
  )
);
