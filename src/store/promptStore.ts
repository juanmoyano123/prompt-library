import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prompt, Collection, Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface PromptStore {
  prompts: Prompt[];
  collections: Collection[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];

  // Actions
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'versions'>) => void;
  updatePrompt: (id: string, prompt: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  duplicatePrompt: (id: string) => void;
  toggleFavorite: (id: string) => void;
  incrementUsageCount: (id: string) => void;

  // Version management
  addVersion: (promptId: string, content: string, type: 'manual' | 'optimized') => void;

  // Collection management
  createCollection: (name: string, description?: string) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, promptId: string) => void;
  removeFromCollection: (collectionId: string, promptId: string) => void;

  // Category management
  createCategory: (name: string, color: string, icon?: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Search and filter
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;

  // Utils
  exportData: () => string;
  importData: (jsonData: string) => void;
  clearAll: () => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'General', color: 'bg-neutral-700' },
  { id: '2', name: 'Development', color: 'bg-neutral-700' },
  { id: '3', name: 'Writing', color: 'bg-neutral-700' },
  { id: '4', name: 'Analysis', color: 'bg-neutral-700' },
  { id: '5', name: 'Creative', color: 'bg-neutral-700' },
];

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      prompts: [],
      collections: [],
      categories: defaultCategories,
      searchQuery: '',
      selectedCategory: null,
      selectedTags: [],

      addPrompt: (promptData) => {
        const newPrompt: Prompt = {
          ...promptData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
          usageCount: 0,
          versions: [],
        };
        set((state) => ({ prompts: [...state.prompts, newPrompt] }));
      },

      updatePrompt: (id, updates) => {
        set((state) => ({
          prompts: state.prompts.map((prompt) =>
            prompt.id === id
              ? { ...prompt, ...updates, updatedAt: new Date() }
              : prompt
          ),
        }));
      },

      deletePrompt: (id) => {
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.id !== id),
          collections: state.collections.map((collection) => ({
            ...collection,
            promptIds: collection.promptIds.filter((promptId) => promptId !== id),
          })),
        }));
      },

      duplicatePrompt: (id) => {
        const prompt = get().prompts.find((p) => p.id === id);
        if (prompt) {
          const duplicated: Prompt = {
            ...prompt,
            id: uuidv4(),
            title: `${prompt.title} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
            usageCount: 0,
            isFavorite: false,
            versions: [],
          };
          set((state) => ({ prompts: [...state.prompts, duplicated] }));
        }
      },

      toggleFavorite: (id) => {
        set((state) => ({
          prompts: state.prompts.map((prompt) =>
            prompt.id === id
              ? { ...prompt, isFavorite: !prompt.isFavorite }
              : prompt
          ),
        }));
      },

      incrementUsageCount: (id) => {
        set((state) => ({
          prompts: state.prompts.map((prompt) =>
            prompt.id === id
              ? { ...prompt, usageCount: prompt.usageCount + 1 }
              : prompt
          ),
        }));
      },

      addVersion: (promptId, content, type) => {
        const newVersion = {
          id: uuidv4(),
          content,
          timestamp: new Date(),
          type,
        };
        set((state) => ({
          prompts: state.prompts.map((prompt) =>
            prompt.id === promptId
              ? {
                  ...prompt,
                  versions: [...prompt.versions, newVersion],
                  updatedAt: new Date(),
                }
              : prompt
          ),
        }));
      },

      createCollection: (name, description) => {
        const newCollection: Collection = {
          id: uuidv4(),
          name,
          description,
          promptIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ collections: [...state.collections, newCollection] }));
      },

      updateCollection: (id, updates) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === id
              ? { ...collection, ...updates, updatedAt: new Date() }
              : collection
          ),
        }));
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((collection) => collection.id !== id),
        }));
      },

      addToCollection: (collectionId, promptId) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === collectionId
              ? {
                  ...collection,
                  promptIds: [...collection.promptIds, promptId],
                  updatedAt: new Date(),
                }
              : collection
          ),
        }));
      },

      removeFromCollection: (collectionId, promptId) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === collectionId
              ? {
                  ...collection,
                  promptIds: collection.promptIds.filter((id) => id !== promptId),
                  updatedAt: new Date(),
                }
              : collection
          ),
        }));
      },

      createCategory: (name, color, icon) => {
        const newCategory: Category = {
          id: uuidv4(),
          name,
          color,
          icon,
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      toggleTag: (tag) => {
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        }));
      },

      clearFilters: () =>
        set({ searchQuery: '', selectedCategory: null, selectedTags: [] }),

      exportData: () => {
        const state = get();
        return JSON.stringify({
          prompts: state.prompts,
          collections: state.collections,
          categories: state.categories,
        });
      },

      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          set({
            prompts: data.prompts || [],
            collections: data.collections || [],
            categories: data.categories || defaultCategories,
          });
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },

      clearAll: () =>
        set({
          prompts: [],
          collections: [],
          categories: defaultCategories,
          searchQuery: '',
          selectedCategory: null,
          selectedTags: [],
        }),
    }),
    {
      name: 'prompt-library-storage',
    }
  )
);