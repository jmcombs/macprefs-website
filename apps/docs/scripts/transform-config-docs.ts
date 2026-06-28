#!/usr/bin/env npx tsx
/**
 * Transform config-examples.md to Starlight MDX format using TypeScript + Handlebars.
 *
 * Usage: npx tsx scripts/transform-config-docs.ts <config-md-path> [output-path]
 *
 * Converts configuration documentation to Starlight MDX with proper
 * frontmatter, Aside components, and component imports.
 */

import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import type { ConfigTemplateContext } from './types/cli-types.js';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert markdown blockquotes to Starlight Aside components.
 * 
 * Handles:
 * - > **Note:** ... → <Aside type="note">...</Aside>
 * - > **Tip:** ... → <Aside type="tip">...</Aside>
 * - > **Warning:** ... → <Aside type="caution">...</Aside>
 * - > **Caution:** ... → <Aside type="caution">...</Aside>
 * - > other content → <Aside type="note">...</Aside>
 */
function convertBlockquotesToAsides(content: string): string {
  let result = content;

  // Convert typed blockquotes
  result = result.replace(
    /^>\s*\*\*Note:\*\*\s*(.+)$/gm,
    '<Aside type="note">\n$1\n</Aside>'
  );

  result = result.replace(
    /^>\s*\*\*Tip:\*\*\s*(.+)$/gm,
    '<Aside type="tip">\n$1\n</Aside>'
  );

  result = result.replace(
    /^>\s*\*\*Warning:\*\*\s*(.+)$/gm,
    '<Aside type="caution">\n$1\n</Aside>'
  );

  result = result.replace(
    /^>\s*\*\*Caution:\*\*\s*(.+)$/gm,
    '<Aside type="caution">\n$1\n</Aside>'
  );

  // Convert remaining blockquotes to generic note asides
  result = result.replace(
    /^>\s*(.+)$/gm,
    (match, content: string) => {
      // Skip if already converted to Aside
      if (content.startsWith('<Aside')) return match;
      return `<Aside type="note">\n${content}\n</Aside>`;
    }
  );

  return result;
}

/**
 * Ensure code blocks have language specified (default to json).
 * Only adds language to opening code blocks (those followed by content, not closing ones).
 */
function fixCodeBlockLanguages(content: string): string {
  let result = content;

  // Add language to opening code blocks without a language specified.
  // Opening code blocks are followed by non-empty content on the next line.
  // Closing code blocks (```) are typically followed by a blank line or end of file.
  // This regex matches ``` at start of line, followed by newline, followed by non-empty content.
  result = result.replace(/^```\n(?=\S)/gm, '```json\n');

  // Also handle cases where the code block opening is followed by a { (common for JSON)
  result = result.replace(/^```\n(\{)/gm, '```json\n$1');

  // Fix any double-specified languages (safety measure)
  result = result.replace(/```json\njson/g, '```json\n');
  result = result.replace(/```jsonjson/g, '```json');

  return result;
}

/**
 * Remove the original title (we use frontmatter instead).
 */
function removeTitle(content: string): string {
  return content.replace(/^#\s+.*\n+/, '');
}

/**
 * Transform config markdown content to MDX body.
 */
function transformContent(content: string): string {
  let result = removeTitle(content);
  result = convertBlockquotesToAsides(result);
  result = fixCodeBlockLanguages(result);
  return result;
}

/**
 * Load and compile the configuration template.
 */
function loadTemplate(): Handlebars.TemplateDelegate<ConfigTemplateContext> {
  // Register frontmatter partial
  const frontmatterPath = path.join(__dirname, 'templates', 'partials', 'frontmatter.hbs');
  const frontmatterSource = fs.readFileSync(frontmatterPath, 'utf8');
  Handlebars.registerPartial('frontmatter', frontmatterSource);

  // Load main template
  const templatePath = path.join(__dirname, 'templates', 'configuration.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  return Handlebars.compile<ConfigTemplateContext>(templateSource);
}

/**
 * Main transformation function.
 */
function transform(inputPath: string, outputPath?: string): void {
  // Read input
  const content = fs.readFileSync(inputPath, 'utf8');

  // Transform content
  const body = transformContent(content);

  // Prepare template context
  const context: ConfigTemplateContext = {
    title: 'Configuration Format',
    description: 'macprefs JSON configuration file format and examples',
    body,
  };

  // Render template
  const template = loadTemplate();
  const result = template(context);

  // Output
  if (outputPath) {
    fs.writeFileSync(outputPath, result);
    console.log(`Transformed ${inputPath} -> ${outputPath}`);
  } else {
    console.log(result);
  }
}

// CLI entry point
const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath) {
  console.error('Usage: npx tsx scripts/transform-config-docs.ts <config-md-path> [output-path]');
  process.exit(1);
}

transform(inputPath, outputPath);

