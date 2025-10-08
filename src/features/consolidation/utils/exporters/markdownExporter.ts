import { ConsolidationResult } from '@/types';
import { saveAs } from 'file-saver';
import { generateDetailedReport } from '../consolidate';

/**
 * Exporta el resultado como un archivo Markdown
 */
export function exportAsMarkdown(result: ConsolidationResult, filename?: string): void {
  const markdown = generateDetailedReport(result);
  const blob = new Blob([markdown], { type: 'text/markdown' });

  const defaultFilename = `${result.project.name.replace(/\s+/g, '-').toLowerCase()}-report.md`;

  saveAs(blob, filename || defaultFilename);
}

/**
 * Exporta como README.md para documentación del proyecto
 */
export function exportAsReadme(result: ConsolidationResult): void {
  const { project, prompts, statistics } = result;

  const readme = `# ${project.name}

${project.description || 'AI Prompt Project'}

## Quick Stats

- 📝 **${statistics.totalPrompts}** prompts
- 🔄 **${statistics.totalExecutions}** total executions
- 💰 **$${statistics.totalCost.toFixed(4)}** total cost
- 🎯 **${statistics.totalTokensUsed.toLocaleString()}** tokens used

## Project Settings

- **Default Model:** ${project.settings.defaultModel}
- **Token Limit:** ${project.settings.defaultTokenLimit.toLocaleString()}
- **Temperature:** ${project.settings.temperature || 0.7}

## Prompts in this Project

${prompts
  .map(
    (p, i) => `
### ${i + 1}. ${p.title}

**Category:** ${p.category}
**Tags:** ${p.tags.join(', ') || 'None'}

\`\`\`
${p.content}
\`\`\`

${p.description ? `> ${p.description}\n` : ''}
**Usage:** ${p.usageCount} times | **Versions:** ${p.versions?.length || 0}
`
  )
  .join('\n---\n')}

## Model Usage Distribution

${Object.entries(statistics.executionsByModel)
  .map(([model, count]) => `- **${model}:** ${count} executions`)
  .join('\n')}

## Cost Breakdown by Model

${Object.entries(statistics.costByModel)
  .map(([model, cost]) => `- **${model}:** $${cost.toFixed(4)}`)
  .join('\n')}

---

*Generated on ${new Date(result.generatedAt).toLocaleString()}*
*Powered by [Prompt Library](https://github.com/yourusername/prompt-library)*
`;

  const blob = new Blob([readme], { type: 'text/markdown' });
  saveAs(blob, 'README.md');
}
