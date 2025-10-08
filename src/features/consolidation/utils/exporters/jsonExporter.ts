import { ConsolidationResult } from '@/types';
import { saveAs } from 'file-saver';

/**
 * Exporta el resultado de consolidación como JSON
 */
export function exportAsJSON(result: ConsolidationResult, filename?: string): void {
  const jsonString = JSON.stringify(result, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  const defaultFilename = `${result.project.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;

  saveAs(blob, filename || defaultFilename);
}

/**
 * Exporta solo los prompts como JSON (para importar en otros proyectos)
 */
export function exportPromptsAsJSON(result: ConsolidationResult, filename?: string): void {
  const promptsData = {
    projectName: result.project.name,
    exportedAt: result.generatedAt,
    prompts: result.prompts.map(p => ({
      title: p.title,
      content: p.content,
      category: p.category,
      tags: p.tags,
      description: p.description,
      metadata: p.metadata,
    })),
  };

  const jsonString = JSON.stringify(promptsData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  const defaultFilename = `${result.project.name.replace(/\s+/g, '-').toLowerCase()}-prompts-only.json`;

  saveAs(blob, filename || defaultFilename);
}
