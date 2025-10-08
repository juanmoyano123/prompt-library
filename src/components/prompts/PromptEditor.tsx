import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Save,
  X,
  Sparkles,
  Hash,
  FolderOpen,
  Wand2,
  Eye,
  Code,
  History
} from 'lucide-react';
import { Prompt, PromptVersion } from '@/types';
import { usePromptStore } from '@/store/promptStore';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { getApiKey, optimizePrompt, isApiKeyConfigured } from '@/utils/claudeAPI';
import { ApiSettings } from '@/components/settings/ApiSettings';
import { toast } from 'sonner';

interface PromptEditorProps {
  prompt?: Prompt | null;
  onSave?: () => void;
  onCancel?: () => void;
}

export function PromptEditor({ prompt, onSave, onCancel }: PromptEditorProps) {
  const { categories, addPrompt, updatePrompt, addVersion } = usePromptStore();

  const [title, setTitle] = useState(prompt?.title || '');
  const [content, setContent] = useState(prompt?.content || '');
  const [category, setCategory] = useState(prompt?.category || categories[0]?.name || 'General');
  const [tags, setTags] = useState<string[]>(prompt?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [showVersions, setShowVersions] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Missing Information', {
        description: 'Please provide both title and content for your prompt.',
      });
      return;
    }

    const promptData = {
      title,
      content,
      category,
      tags,
      metadata: {},
      isFavorite: prompt?.isFavorite || false,
      executionHistory: [],
    };

    if (prompt) {
      updatePrompt(prompt.id, promptData);
      toast.success('Prompt Updated!', {
        description: `"${title}" has been successfully updated.`,
      });
    } else {
      addPrompt(promptData);
      toast.success('Prompt Created!', {
        description: `"${title}" has been added to your library.`,
      });
    }

    onSave?.();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleOptimize = async () => {
    if (!isApiKeyConfigured()) {
      toast.error('API Key Not Configured', {
        description: 'Please add your Claude API key to .env.local file.',
        duration: 5000,
      });
      setShowApiSettings(true);
      return;
    }

    if (!content.trim()) {
      toast.error('No Content', {
        description: 'Please add some content to your prompt before optimizing.',
      });
      return;
    }

    setIsOptimizing(true);
    setShowOptimizer(true);

    try {
      toast.info('Optimizing...', {
        description: 'Claude is analyzing and improving your prompt.',
      });

      const optimized = await optimizePrompt(content, { model: 'sonnet' });
      setOptimizedContent(optimized);

      toast.success('Optimization Complete!', {
        description: 'Your prompt has been successfully optimized.',
      });
    } catch (error) {
      console.error('Failed to optimize prompt:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      toast.error('Optimization Failed', {
        description: errorMessage,
        duration: 5000,
      });

      // Close the optimizer dialog on error
      setShowOptimizer(false);
      setIsOptimizing(false);
      return;
    } finally {
      setIsOptimizing(false);
    }
  };

  const acceptOptimization = () => {
    if (prompt) {
      addVersion(prompt.id, content, 'manual');
    }
    setContent(optimizedContent);
    setShowOptimizer(false);
    toast.success('Optimization Applied!', {
      description: 'The optimized version has been applied to your prompt.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-6xl mx-auto p-6"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {prompt ? 'Edit Prompt' : 'Create New Prompt'}
          </h2>
          <div className="flex items-center gap-2">
            {prompt && prompt.versions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersions(true)}
              >
                <History className="w-4 h-4 mr-2" />
                {prompt.versions.length} Versions
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleOptimize}
              disabled={!content.trim()}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Optimize with AI
            </Button>
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter prompt title..."
            className="text-lg"
          />
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={category === cat.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat.name)}
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Tags Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add tags..."
              className="flex-1"
            />
            <Button onClick={handleAddTag} size="sm">
              <Hash className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Editor Toolbar */}
        <div className="flex items-center gap-2 border-b pb-2">
          <Button
            size="sm"
            variant={viewMode === 'edit' ? 'default' : 'ghost'}
            onClick={() => setViewMode('edit')}
          >
            <Code className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'preview' ? 'default' : 'ghost'}
            onClick={() => setViewMode('preview')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>

        {/* Markdown Editor */}
        <div className="border rounded-lg overflow-hidden" data-color-mode="auto">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            preview={viewMode === 'preview' ? 'preview' : 'edit'}
            height={400}
            hideToolbar={viewMode === 'preview'}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Prompt
          </Button>
        </div>
      </div>

      {/* Optimization Dialog */}
      <Dialog open={showOptimizer} onOpenChange={setShowOptimizer}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI-Optimized Prompt
            </DialogTitle>
            <DialogDescription>
              Here's an optimized version of your prompt using AI
            </DialogDescription>
          </DialogHeader>

          {isOptimizing ? (
            <div className="py-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Optimizing your prompt...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-semibold mb-2">Optimized Version:</h4>
                <MDEditor
                  value={optimizedContent}
                  preview="preview"
                  height={300}
                  hideToolbar
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOptimizer(false)}>
              Cancel
            </Button>
            <Button onClick={acceptOptimization} disabled={isOptimizing}>
              Use Optimized Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Settings Dialog */}
      <ApiSettings
        open={showApiSettings}
        onOpenChange={setShowApiSettings}
      />
    </motion.div>
  );
}