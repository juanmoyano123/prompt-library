import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptCard } from './PromptCard';
import { PromptEditor } from './PromptEditor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  Filter,
  Grid3x3,
  List,
  Heart,
  TrendingUp,
  Calendar,
  Sparkles
} from 'lucide-react';
import { usePromptStore } from '@/store/promptStore';
import { Prompt } from '@/types';
import { cn } from '@/lib/utils';

export function PromptGrid() {
  const {
    prompts,
    categories,
    searchQuery,
    selectedCategory,
    selectedTags,
    setSearchQuery,
    setSelectedCategory,
    toggleTag,
    clearFilters
  } = usePromptStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'favorite'>('recent');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    prompts.forEach(prompt => {
      prompt.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [prompts]);

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let filtered = [...prompts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          p.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p =>
        selectedTags.every(tag => p.tags.includes(tag))
      );
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      case 'popular':
        filtered.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'favorite':
        filtered = filtered.filter(p => p.isFavorite);
        break;
    }

    return filtered;
  }, [prompts, searchQuery, selectedCategory, selectedTags, sortBy]);

  if (editingPrompt || isCreating) {
    return (
      <PromptEditor
        prompt={editingPrompt}
        onSave={() => {
          setEditingPrompt(null);
          setIsCreating(false);
        }}
        onCancel={() => {
          setEditingPrompt(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Prompt Library
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredPrompts.length} prompts in your collection
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Prompt
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts..."
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Category filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Category:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={!selectedCategory ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={selectedCategory === cat.name ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={sortBy === 'recent' ? 'default' : 'outline'}
                onClick={() => setSortBy('recent')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Recent
              </Button>
              <Button
                size="sm"
                variant={sortBy === 'popular' ? 'default' : 'outline'}
                onClick={() => setSortBy('popular')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Popular
              </Button>
              <Button
                size="sm"
                variant={sortBy === 'favorite' ? 'default' : 'outline'}
                onClick={() => setSortBy('favorite')}
              >
                <Heart className="w-4 h-4 mr-2" />
                Favorites
              </Button>
            </div>
          </div>

          {/* View mode */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {(selectedTags.length > 0 || selectedCategory || searchQuery) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearFilters}
                className="ml-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Prompts Grid/List */}
      <AnimatePresence mode="popLayout">
        {filteredPrompts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory || selectedTags.length > 0
                ? "Try adjusting your filters"
                : "Create your first prompt to get started"}
            </p>
            {!(searchQuery || selectedCategory || selectedTags.length > 0) && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Prompt
              </Button>
            )}
          </motion.div>
        ) : (
          <div
            className={cn(
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            )}
          >
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={setEditingPrompt}
                onCopy={() => {
                  // Show toast notification here
                  console.log('Prompt copied!');
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}