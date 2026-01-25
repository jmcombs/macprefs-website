#!/usr/bin/env npx tsx
/**
 * Transform MIGRATION_SETUP_CONFIG_AND_TROUBLESHOOTING.md to multiple Starlight MDX pages.
 *
 * Usage: npx tsx scripts/transform-migration-docs.ts <migration-md-path>
 *
 * Extracts sections from the migration guide and generates/updates:
 * - getting-started/quick-start.mdx (Quick Start section)
 * - guides/migration-curation.mdx (Manual Curation Workflow)
 * - getting-started/first-config.mdx (Recommended Template - merged)
 * - guides/migration-pitfalls.mdx (Common Pitfalls)
 * - guides/power-users.mdx (Dotfiles Integration - section replacement)
 * - reference/troubleshooting.mdx (Troubleshooting Migration Issues)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Content base directory
const CONTENT_BASE = path.join(__dirname, '..', 'src', 'content', 'docs');

/** Section definition for extraction */
interface SectionDef {
  name: string;
  startHeading: RegExp;
  endHeading?: RegExp;
  targetPath: string;
  strategy: 'replace' | 'create' | 'merge-section';
  frontmatter: { title: string; description: string };
  sectionMarker?: string; // For merge-section strategy
}

/** Extracted section content */
interface ExtractedSection {
  name: string;
  content: string;
  targetPath: string;
  strategy: 'replace' | 'create' | 'merge-section';
  frontmatter: { title: string; description: string };
  sectionMarker?: string;
}

/** Section definitions for extraction */
const SECTIONS: SectionDef[] = [
  {
    name: 'Quick Start',
    startHeading: /^## Quick Start: Your First Migration$/m,
    endHeading: /^## Manual Curation Workflow$/m,
    targetPath: 'getting-started/quick-start.mdx',
    strategy: 'replace',
    frontmatter: {
      title: 'Quick Start',
      description: 'Get started with macprefs in minutes - safely migrate your macOS preferences',
    },
  },
  {
    name: 'Manual Curation Workflow',
    startHeading: /^## Manual Curation Workflow$/m,
    endHeading: /^## Recommended Configuration Template$/m,
    targetPath: 'guides/migration-curation.mdx',
    strategy: 'create',
    frontmatter: {
      title: 'Manual Curation Workflow',
      description: 'Step-by-step guide to curating your macOS preferences for safe migration',
    },
  },
  {
    name: 'Recommended Template',
    startHeading: /^## Recommended Configuration Template$/m,
    endHeading: /^## Common Pitfalls and How to Avoid Them$/m,
    targetPath: 'getting-started/first-config.mdx',
    strategy: 'replace',
    frontmatter: {
      title: 'Your First Configuration',
      description: 'Create your first macprefs configuration file with this battle-tested template',
    },
  },
  {
    name: 'Common Pitfalls',
    startHeading: /^## Common Pitfalls and How to Avoid Them$/m,
    endHeading: /^## Free vs Pro Workflow Comparison$/m,
    targetPath: 'guides/migration-pitfalls.mdx',
    strategy: 'create',
    frontmatter: {
      title: 'Common Migration Pitfalls',
      description: 'Avoid these common mistakes when migrating macOS preferences with macprefs',
    },
  },
  {
    name: 'Dotfiles Integration',
    startHeading: /^## Integration with Dotfiles$/m,
    endHeading: /^## Troubleshooting Migration Issues$/m,
    targetPath: 'guides/power-users.mdx',
    strategy: 'merge-section',
    sectionMarker: '## Multi-Mac Sync',
    frontmatter: {
      title: 'Power User Guide',
      description: 'Advanced workflows for power users including dotfiles integration and multi-Mac sync',
    },
  },
  {
    name: 'Troubleshooting',
    startHeading: /^## Troubleshooting Migration Issues$/m,
    endHeading: /^## Related Documentation$/m,
    targetPath: 'reference/troubleshooting.mdx',
    strategy: 'create',
    frontmatter: {
      title: 'Troubleshooting',
      description: 'Solutions to common issues when using macprefs for preference migration',
    },
  },
];

/**
 * Extract a section from the source content.
 */
function extractSection(content: string, startRegex: RegExp, endRegex?: RegExp): string {
  const startMatch = content.match(startRegex);
  if (!startMatch || startMatch.index === undefined) {
    return '';
  }

  const startIndex = startMatch.index;
  let endIndex = content.length;

  if (endRegex) {
    const afterStart = content.slice(startIndex + startMatch[0].length);
    const endMatch = afterStart.match(endRegex);
    if (endMatch && endMatch.index !== undefined) {
      endIndex = startIndex + startMatch[0].length + endMatch.index;
    }
  }

  return content.slice(startIndex, endIndex).trim();
}

/**
 * Convert markdown headings to appropriate level for MDX page.
 * H2 (##) in source becomes H2 in output (main sections).
 */
function processContent(content: string): string {
  let result = content;
  // Convert blockquotes to Asides
  result = result.replace(/^>\s*\*\*Note:\*\*\s*(.+)$/gm, '<Aside type="note">\n$1\n</Aside>');
  result = result.replace(/^>\s*\*\*Tip:\*\*\s*(.+)$/gm, '<Aside type="tip">\n$1\n</Aside>');
  result = result.replace(/^>\s*\*\*Warning:\*\*\s*(.+)$/gm, '<Aside type="caution">\n$1\n</Aside>');
  result = result.replace(/^>\s*\*\*Caution:\*\*\s*(.+)$/gm, '<Aside type="caution">\n$1\n</Aside>');
  return result;
}

/**
 * Generate MDX frontmatter with Starlight metadata.
 */
function generateFrontmatter(title: string, description: string): string {
  return `---
title: "${title}"
description: "${description}"
---

import { Aside } from '@astrojs/starlight/components';
`;
}

/**
 * Read existing frontmatter from a file if it exists.
 * Returns frontmatter + import statements, normalized to end with single newline.
 */
function readExistingFrontmatter(filePath: string): string | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    // Include all import statements if present
    const afterFm = content.slice(fmMatch[0].length);
    const importMatch = afterFm.match(/^(\s*import\s+[^;]+;\s*)+/);
    if (importMatch) {
      // Normalize: frontmatter + imports + single blank line
      return fmMatch[0] + '\n' + importMatch[0].trim() + '\n';
    }
    return fmMatch[0] + '\n\nimport { Aside } from \'@astrojs/starlight/components\';\n';
  }
  return null;
}

/**
 * Merge new content into an existing file at a specific section marker.
 * For merge-section strategy: replaces content from marker to next H2 or end.
 */
function mergeSection(existingContent: string, newContent: string, sectionMarker: string): string {
  const markerRegex = new RegExp(`^${sectionMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
  const markerMatch = existingContent.match(markerRegex);

  if (!markerMatch || markerMatch.index === undefined) {
    // Section marker not found, append at end
    return existingContent.trim() + '\n\n' + newContent.trim() + '\n';
  }

  const beforeMarker = existingContent.slice(0, markerMatch.index);
  const afterMarkerStart = existingContent.slice(markerMatch.index + markerMatch[0].length);

  // Find next H2 heading after the marker
  const nextH2Match = afterMarkerStart.match(/^## /m);
  let afterSection: string;

  if (nextH2Match && nextH2Match.index !== undefined) {
    afterSection = afterMarkerStart.slice(nextH2Match.index);
  } else {
    afterSection = '';
  }

  return beforeMarker.trim() + '\n\n' + newContent.trim() + '\n\n' + afterSection.trim() + '\n';
}

/**
 * Write an MDX file with the given content.
 */
function writeMdxFile(
  targetPath: string,
  frontmatter: { title: string; description: string },
  content: string,
  strategy: 'replace' | 'create' | 'merge-section',
  sectionMarker?: string
): void {
  const fullPath = path.join(CONTENT_BASE, targetPath);
  const dir = path.dirname(fullPath);

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const processedContent = processContent(content);

  if (strategy === 'merge-section' && sectionMarker && fs.existsSync(fullPath)) {
    // Merge into existing file
    const existingContent = fs.readFileSync(fullPath, 'utf-8');
    const mergedContent = mergeSection(existingContent, processedContent, sectionMarker);
    fs.writeFileSync(fullPath, mergedContent);
    console.log(`  ✓ Merged section into ${targetPath}`);
  } else if (strategy === 'replace' || strategy === 'create' || !fs.existsSync(fullPath)) {
    // Create new or replace existing
    const existingFm = readExistingFrontmatter(fullPath);
    const fm = existingFm || generateFrontmatter(frontmatter.title, frontmatter.description);
    const finalContent = fm + '\n' + processedContent + '\n';
    fs.writeFileSync(fullPath, finalContent);
    console.log(`  ✓ ${fs.existsSync(fullPath) ? 'Replaced' : 'Created'} ${targetPath}`);
  }
}

/**
 * Main transformation function.
 */
function transform(inputPath: string): void {
  console.log(`Reading migration guide from: ${inputPath}`);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const sourceContent = fs.readFileSync(inputPath, 'utf-8');
  console.log(`Source file: ${sourceContent.length} characters, ${sourceContent.split('\n').length} lines`);
  console.log('\nExtracting sections...\n');

  const extractedSections: ExtractedSection[] = [];

  for (const section of SECTIONS) {
    const content = extractSection(sourceContent, section.startHeading, section.endHeading);

    if (!content) {
      console.warn(`  ⚠ Warning: Could not extract section "${section.name}"`);
      continue;
    }

    console.log(`  ✓ Extracted "${section.name}" (${content.length} chars)`);
    extractedSections.push({
      name: section.name,
      content,
      targetPath: section.targetPath,
      strategy: section.strategy,
      frontmatter: section.frontmatter,
      sectionMarker: section.sectionMarker,
    });
  }

  console.log(`\nWriting ${extractedSections.length} MDX files...\n`);

  for (const section of extractedSections) {
    writeMdxFile(
      section.targetPath,
      section.frontmatter,
      section.content,
      section.strategy,
      section.sectionMarker
    );
  }

  console.log('\n✅ Migration docs transformation complete!');
}

// CLI entry point
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: npx tsx scripts/transform-migration-docs.ts <migration-md-path>');
  console.error('Example: npx tsx scripts/transform-migration-docs.ts macprefs-source/docs/MIGRATION_SETUP_CONFIG_AND_TROUBLESHOOTING.md');
  process.exit(1);
}

transform(args[0]);
