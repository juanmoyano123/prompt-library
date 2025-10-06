import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Copy,
  Edit3,
  Trash2,
  MoreVertical,
  Sparkles,
  Calendar,
  Hash
} from 'lucide-react';
import { format } from 'date-fns';
import { Prompt } from '@/types';
import { usePromptStore } from '@/store/promptStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PromptCardProps {
  prompt: Prompt;
  onEdit?: (prompt: Prompt) => void;
  onCopy?: (prompt: Prompt) => void;
}

export function PromptCard({ prompt, onEdit, onCopy }: PromptCardProps) {
  const { toggleFavorite, deletePrompt, duplicatePrompt, incrementUsageCount, categories } = usePromptStore();
  const [isHovered, setIsHovered] = useState(false);

  const category = categories.find(c => c.name === prompt.category);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    incrementUsageCount(prompt.id);
    toast.success('Copied to Clipboard!', {
      description: `"${prompt.title}" has been copied.`,
    });
    onCopy?.(prompt);
  };

  const handleEdit = () => {
    incrementUsageCount(prompt.id);
    onEdit?.(prompt);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      deletePrompt(prompt.id);
      toast.success('Prompt Deleted', {
        description: `"${prompt.title}" has been removed from your library.`,
      });
    }
  };

  const handleDuplicate = () => {
    duplicatePrompt(prompt.id);
    toast.success('Prompt Duplicated!', {
      description: `A copy of "${prompt.title}" has been created.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:border-foreground/20",
        isHovered && "shadow-lg"
      )}>
        {/* Favorite indicator */}
        {prompt.isFavorite && (
          <div className="absolute top-3 right-3 z-10">
            <Sparkles className="w-4 h-4 text-foreground fill-foreground" />
          </div>
        )}

        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold line-clamp-1 flex-1">
              {prompt.title}
            </h3>
            {prompt.usageCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                Used {prompt.usageCount}x
              </Badge>
            )}
          </div>

          {/* Category badge */}
          {category && (
            <Badge variant="secondary" className="w-fit mt-2">
              {category.name}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="relative">
          {/* Content preview */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {prompt.content}
          </p>

          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Hash className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Date and version info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Calendar className="w-3 h-3" />
            <span>{format(new Date(prompt.updatedAt), 'MMM d, yyyy')}</span>
            {prompt.versions.length > 0 && (
              <>
                <span>•</span>
                <span>{prompt.versions.length} versions</span>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={prompt.isFavorite ? "default" : "ghost"}
              onClick={() => toggleFavorite(prompt.id)}
              className="h-8 w-8 p-0"
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  prompt.isFavorite && "fill-current"
                )}
              />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDuplicate}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}