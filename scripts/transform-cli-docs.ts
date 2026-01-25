#!/usr/bin/env npx tsx
/**
 * transform-cli-docs.ts
 * 
 * Transforms docs/CLI.json (structured format) to Starlight MDX format
 * using TypeScript and Handlebars templates.
 * 
 * Usage:
 *   npx tsx scripts/transform-cli-docs.ts <input-json> [output-mdx]
 * 
 * See scripts/legacy/transform-cli-docs.cjs for the original CJS implementation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import type { CLIData, Command, Enrichments, Aside } from './types/cli-types.js';
import { createHandlebarsInstance } from './helpers/cli-helpers.js';

// Get directory paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Command ordering for consistent output
const COMMAND_ORDER = [
  'preflight', 'list', 'inspect', 'export', 'validate',
  'plan', 'apply', 'rollback', 'license', 'upgrade', 'about',
  'license_status', 'license_activate', 'license_deactivate'
];

// Page configuration
const PAGE_CONFIG = {
  title: 'CLI Reference',
  description: 'Complete command-line interface reference for macprefs',
  intro: 'Complete documentation for all macprefs commands and flags.',
  cautionMessage: `When a gated feature is used without proper license, the CLI returns exit code 1 with message:
\`This feature requires Pro tier or higher. Run 'macprefs upgrade' to unlock.\``
};

/**
 * Prepared command data ready for Handlebars template rendering
 */
interface PreparedCommand {
  name: string;
  overview: string;
  usage: string;
  arguments: Command['arguments'];
  flags: Command['flags'];
  subcommands: string[];
  exitCodes: Record<string, string> | null;
  aside: Aside | null;
}

/**
 * Template context for the CLI reference page
 */
interface TemplateContext {
  title: string;
  description: string;
  intro: string;
  commands: PreparedCommand[];
  tierComparison: {
    features: Enrichments['tierComparison']['features'];
    cautionMessage: string;
  };
}

/**
 * Prepare command data for template rendering
 */
function prepareCommand(cmdData: Command, enrichments: Enrichments): PreparedCommand {
  const enrichment = enrichments.commands[cmdData.name] || {};
  
  return {
    name: cmdData.name,
    overview: enrichment.description || cmdData.description || cmdData.abstract,
    usage: cmdData.usage || '',
    arguments: cmdData.arguments || [],
    flags: cmdData.flags || [],
    subcommands: cmdData.subcommands || [],
    exitCodes: cmdData.exit_codes || null,
    aside: enrichment.asides?.[0] || null  // Use first aside if present
  };
}

/**
 * Load and compile all Handlebars templates
 */
function loadTemplates(hbs: typeof Handlebars): Handlebars.TemplateDelegate<TemplateContext> {
  const templatesDir = path.join(__dirname, 'templates');
  const partialsDir = path.join(templatesDir, 'partials');
  
  // Register partials
  const partialFiles = ['frontmatter', 'command', 'flags-table', 'tier-comparison'];
  for (const partial of partialFiles) {
    const partialPath = path.join(partialsDir, `${partial}.hbs`);
    const partialContent = fs.readFileSync(partialPath, 'utf8');
    hbs.registerPartial(partial, partialContent);
  }
  
  // Compile main template
  const mainTemplatePath = path.join(templatesDir, 'cli-reference.hbs');
  const mainTemplate = fs.readFileSync(mainTemplatePath, 'utf8');
  return hbs.compile<TemplateContext>(mainTemplate);
}

/**
 * Transform CLI.json to MDX using Handlebars templates
 */
function transform(cliData: CLIData, enrichments: Enrichments): string {
  // Create configured Handlebars instance with helpers
  const hbs = createHandlebarsInstance();
  
  // Load and compile templates
  const template = loadTemplates(hbs);
  
  // Prepare commands in specified order
  const commands: PreparedCommand[] = [];
  for (const cmdKey of COMMAND_ORDER) {
    const cmdData = cliData.commands[cmdKey];
    if (cmdData) {
      commands.push(prepareCommand(cmdData, enrichments));
    }
  }
  
  // Build template context
  const context: TemplateContext = {
    title: PAGE_CONFIG.title,
    description: PAGE_CONFIG.description,
    intro: PAGE_CONFIG.intro,
    commands,
    tierComparison: {
      features: enrichments.tierComparison.features,
      cautionMessage: PAGE_CONFIG.cautionMessage
    }
  };
  
  // Render template
  return template(context);
}

// Main execution
const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath) {
  console.error('Usage: transform-cli-docs.ts <input-json> [output-mdx]');
  process.exit(1);
}

// Handle .md input path (convert to .json)
let jsonPath = inputPath;
if (inputPath.endsWith('.md')) {
  jsonPath = inputPath.replace(/\.md$/, '.json');
}

if (!fs.existsSync(jsonPath)) {
  console.error(`Error: JSON file not found: ${jsonPath}`);
  process.exit(1);
}

// Load input files
const cliData: CLIData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const enrichmentsPath = path.join(__dirname, 'cli-enrichments.json');
const enrichments: Enrichments = JSON.parse(fs.readFileSync(enrichmentsPath, 'utf8'));

// Transform
const mdx = transform(cliData, enrichments);

// Output
if (outputPath) {
  fs.writeFileSync(outputPath, mdx);
  console.log(`Transformed ${jsonPath} -> ${outputPath}`);
} else {
  console.log(mdx);
}

