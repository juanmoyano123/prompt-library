import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ConsolidationResult } from '@/types';
import { generateDetailedReport, generateExecutiveSummary } from '../consolidate';

/**
 * Exporta todo el proyecto como un archivo ZIP completo
 */
export async function exportAsZip(result: ConsolidationResult): Promise<void> {
  const zip = new JSZip();
  const projectName = result.project.name.replace(/\s+/g, '-').toLowerCase();

  // 1. README.md - Resumen ejecutivo
  const readme = generateExecutiveSummary(result);
  zip.file('README.md', readme);

  // 2. Full Report - Reporte detallado
  const fullReport = generateDetailedReport(result);
  zip.file('FULL_REPORT.md', fullReport);

  // 3. Data completa en JSON
  const jsonData = JSON.stringify(result, null, 2);
  zip.file('project-data.json', jsonData);

  // 4. Carpeta de prompts individuales
  const promptsFolder = zip.folder('prompts');
  if (promptsFolder) {
    result.prompts.forEach((prompt, index) => {
      const filename = `${String(index + 1).padStart(3, '0')}-${prompt.title
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()
        .substring(0, 50)}.md`;

      const promptContent = `# ${prompt.title}

**Category:** ${prompt.category}
**Tags:** ${prompt.tags.join(', ') || 'None'}
**Created:** ${new Date(prompt.createdAt).toLocaleDateString()}
**Updated:** ${new Date(prompt.updatedAt).toLocaleDateString()}

${prompt.description ? `## Description\n\n${prompt.description}\n\n` : ''}

## Prompt Content

\`\`\`
${prompt.content}
\`\`\`

## Metadata

- **Usage Count:** ${prompt.usageCount}
- **Favorite:** ${prompt.isFavorite ? 'Yes' : 'No'}
- **Versions:** ${prompt.versions?.length || 0}
- **Executions:** ${prompt.executionHistory?.length || 0}

${
  prompt.versions && prompt.versions.length > 0
    ? `## Version History

${prompt.versions
  .map(
    (v, i) => `### Version ${i + 1} - ${v.type}
**Date:** ${new Date(v.timestamp).toLocaleString()}

\`\`\`
${v.content}
\`\`\`
`
  )
  .join('\n')}`
    : ''
}

${
  prompt.executionHistory && prompt.executionHistory.length > 0
    ? `## Execution History

${prompt.executionHistory
  .map(
    (exec, i) => `### Execution ${i + 1}
**Model:** ${exec.model}
**Date:** ${new Date(exec.executedAt).toLocaleString()}
**Tokens:** ${exec.tokensUsed.toLocaleString()}
**Cost:** $${exec.estimatedCost.toFixed(6)}
${exec.notes ? `**Notes:** ${exec.notes}` : ''}
`
  )
  .join('\n')}`
    : ''
}
`;

      promptsFolder.file(filename, promptContent);
    });
  }

  // 5. Execution History CSV
  if (result.executionHistory.length > 0) {
    const csvContent = generateExecutionHistoryCSV(result);
    zip.file('execution-history.csv', csvContent);
  }

  // 6. Project Settings
  const settingsContent = `# Project Settings

## ${result.project.name}

**Description:** ${result.project.description || 'N/A'}
**Created:** ${new Date(result.project.createdAt).toLocaleString()}
**Last Updated:** ${new Date(result.project.updatedAt).toLocaleString()}

## Default Configuration

- **Model:** ${result.project.settings.defaultModel}
- **Token Limit:** ${result.project.settings.defaultTokenLimit.toLocaleString()}
- **Temperature:** ${result.project.settings.temperature || 0.7}
- **Cost per 1K Tokens:** $${result.project.settings.estimatedCostPerToken}

## Project Tags

${result.project.settings.tags.length > 0 ? result.project.settings.tags.map(tag => `- ${tag}`).join('\n') : 'No tags'}

## Statistics

- **Total Prompts:** ${result.statistics.totalPrompts}
- **Total Executions:** ${result.statistics.totalExecutions}
- **Total Cost:** $${result.statistics.totalCost.toFixed(4)}
- **Total Tokens:** ${result.statistics.totalTokensUsed.toLocaleString()}
`;

  zip.file('PROJECT_SETTINGS.md', settingsContent);

  // Generar y descargar el ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectName}-complete-${new Date().toISOString().split('T')[0]}.zip`);
}

/**
 * Genera CSV del historial de ejecuciones
 */
function generateExecutionHistoryCSV(result: ConsolidationResult): string {
  const headers = ['Prompt Title', 'Model', 'Date', 'Tokens Used', 'Estimated Cost', 'Response Time', 'Notes'];

  const rows = result.executionHistory.map((exec) => {
    const prompt = result.prompts.find((p) => p.id === exec.promptId);
    return [
      prompt?.title || 'Unknown',
      exec.model,
      new Date(exec.executedAt).toISOString(),
      exec.tokensUsed.toString(),
      exec.estimatedCost.toFixed(6),
      exec.responseTime?.toString() || 'N/A',
      exec.notes || '',
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Exporta solo CSV del historial de ejecuciones
 */
export function exportExecutionHistoryCSV(result: ConsolidationResult): void {
  const csvContent = generateExecutionHistoryCSV(result);
  const blob = new Blob([csvContent], { type: 'text/csv' });

  const filename = `${result.project.name.replace(/\s+/g, '-').toLowerCase()}-executions.csv`;
  saveAs(blob, filename);
}
