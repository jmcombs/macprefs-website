#!/usr/bin/env node
/**
 * Transform CLI.md to Starlight MDX format
 * 
 * Usage: node transform-cli-docs.js <cli-md-path> [output-path]
 * 
 * Reads CLI.md (auto-generated from macprefs --help) and enriches it with
 * tier information, aside notes, and proper Starlight MDX formatting.
 */

const fs = require('fs');
const path = require('path');

// Load enrichments
const enrichmentsPath = path.join(__dirname, 'cli-enrichments.json');
const enrichments = JSON.parse(fs.readFileSync(enrichmentsPath, 'utf8'));

/**
 * Parse a command block from CLI.md
 */
function parseCommandBlock(name, content) {
  const lines = content.split('\n');
  const result = {
    name,
    overview: '',
    usage: '',
    options: [],
    arguments: [],
    examples: []
  };

  let section = null;
  for (const line of lines) {
    if (line.startsWith('OVERVIEW:')) {
      result.overview = line.replace('OVERVIEW:', '').trim();
      section = 'overview';
    } else if (line.startsWith('USAGE:')) {
      result.usage = line.replace('USAGE:', '').trim();
      section = 'usage';
    } else if (line.startsWith('OPTIONS:')) {
      section = 'options';
    } else if (line.startsWith('ARGUMENTS:')) {
      section = 'arguments';
    } else if (line.startsWith('Examples:')) {
      section = 'examples';
    } else if (section === 'overview' && line.trim() && !line.startsWith('USAGE:')) {
      result.overview += ' ' + line.trim();
    } else if (section === 'options' && line.trim().startsWith('-')) {
      const match = line.match(/^\s*(--?\S+(?:\s+<\S+>)?(?:\/--?\S+)?)\s+(.+)$/);
      if (match) {
        result.options.push({ flag: match[1].trim(), description: match[2].trim() });
      }
    } else if (section === 'arguments' && line.trim().startsWith('<')) {
      const match = line.match(/^\s*(<\S+>)\s+(.+)$/);
      if (match) {
        result.arguments.push({ arg: match[1], description: match[2].trim() });
      }
    } else if (section === 'examples' && line.trim().startsWith('macprefs')) {
      result.examples.push(line.trim());
    }
  }

  return result;
}

/**
 * Generate MDX for a command
 */
function generateCommandMDX(parsed, enrichment) {
  let mdx = '';
  
  // Command heading
  mdx += `### \`${parsed.name}\`\n\n`;
  
  // Description from enrichment (preferred) or parsed overview
  const description = enrichment?.description || parsed.overview;
  mdx += `${description}\n\n`;
  
  // Usage code block
  if (parsed.usage) {
    mdx += '```bash\n';
    mdx += parsed.usage + '\n';
    mdx += '```\n\n';
  }
  
  // Arguments table
  if (parsed.arguments.length > 0) {
    mdx += '| Argument | Description |\n';
    mdx += '|----------|-------------|\n';
    for (const arg of parsed.arguments) {
      mdx += `| \`${arg.arg}\` | ${arg.description} |\n`;
    }
    mdx += '\n';
  }
  
  // Flags table with tier info
  if (parsed.options.length > 0) {
    const flagEnrichments = enrichment?.flags || {};
    mdx += '| Flag | Description | Tier |\n';
    mdx += '|------|-------------|------|\n';
    for (const opt of parsed.options) {
      // Skip common flags
      if (opt.flag === '--version' || opt.flag === '-h, --help') continue;
      
      const flagKey = opt.flag.split(' ')[0].replace(',', '');
      const tierInfo = flagEnrichments[flagKey] || flagEnrichments[opt.flag.split(' ')[0]];
      const tier = tierInfo?.tier || 'Free';
      mdx += `| \`${opt.flag}\` | ${opt.description} | ${tier} |\n`;
    }
    mdx += '\n';
  }
  
  // Exit codes if present
  if (enrichment?.exitCodes) {
    mdx += '**Exit codes:**\n';
    if (enrichment.exitCodes.pro) {
      const proCodes = Object.entries(enrichment.exitCodes.pro)
        .map(([code, desc]) => `\`${code}\` = ${desc}`)
        .join('; ');
      mdx += `- **Pro+ tier:** ${proCodes}\n`;
    }
    if (enrichment.exitCodes.free) {
      const freeCodes = Object.entries(enrichment.exitCodes.free)
        .map(([code, desc]) => `\`${code}\` = ${desc}`)
        .join('; ');
      mdx += `- **Free tier:** ${freeCodes}\n`;
    }
    mdx += '\n';
  }
  
  // Aside notes
  if (enrichment?.asides) {
    for (const aside of enrichment.asides) {
      mdx += `<Aside type="${aside.type}">\n`;
      mdx += `${aside.content}\n`;
      mdx += `</Aside>\n\n`;
    }
  }
  
  // Subcommands (for license command)
  if (enrichment?.subcommands) {
    mdx += '| Subcommand | Description | Status |\n';
    mdx += '|------------|-------------|--------|\n';
    for (const [name, info] of Object.entries(enrichment.subcommands)) {
      mdx += `| \`${name}\` | ${info.description} | Available |\n`;
    }
    mdx += '\n';
  }
  
  mdx += '---\n\n';
  return mdx;
}

/**
 * Generate tier comparison section
 */
function generateTierComparison() {
  const features = enrichments.tierComparison?.features || [];
  let mdx = '## Tier Feature Comparison\n\n';
  mdx += '| Feature | Free | Pro+ |\n';
  mdx += '|---------|:----:|:----:|\n';
  for (const f of features) {
    const free = f.free ? '✓' : '✗';
    const pro = f.pro ? '✓' : '✓';
    mdx += `| ${f.feature} | ${free} | ${pro} |\n`;
  }
  mdx += '\n';
  mdx += '<Aside type="caution">\n';
  mdx += 'When a gated feature is used without proper license, the CLI returns exit code 1 with message:\n';
  mdx += '`This feature requires Pro tier or higher. Run \'macprefs upgrade\' to unlock.`\n';
  mdx += '</Aside>\n\n';
  return mdx;
}

/**
 * Main transformation function
 */
function transform(cliMdContent) {
  // Parse all command blocks
  const commandBlocks = {};
  const regex = /### (\w+(?:\s+\w+)?)\n\n```\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(cliMdContent)) !== null) {
    const name = match[1].trim();
    commandBlocks[name] = parseCommandBlock(name, match[2]);
  }

  // Generate MDX
  let mdx = `---
title: CLI Reference
description: Complete command-line interface reference for macprefs
---

import { Tabs, TabItem, Badge, Aside } from '@astrojs/starlight/components';

Complete documentation for all macprefs commands and flags.

## Commands

`;

  // Order commands logically
  const commandOrder = [
    'preflight', 'list', 'inspect', 'export', 'validate',
    'plan', 'apply', 'rollback', 'license', 'upgrade', 'about'
  ];

  for (const cmdName of commandOrder) {
    const parsed = commandBlocks[cmdName];
    if (parsed) {
      const enrichment = enrichments.commands[cmdName];
      mdx += generateCommandMDX(parsed, enrichment);
    }
  }

  // Add tier comparison
  mdx += generateTierComparison();

  // Footer
  mdx += '---\n\n';
  mdx += '*Documentation auto-synced from macprefs CLI help.*\n';

  return mdx;
}

// CLI entry point
if (require.main === module) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];

  if (!inputPath) {
    console.error('Usage: node transform-cli-docs.js <cli-md-path> [output-path]');
    process.exit(1);
  }

  const content = fs.readFileSync(inputPath, 'utf8');
  const result = transform(content);

  if (outputPath) {
    fs.writeFileSync(outputPath, result);
    console.log(`Transformed CLI.md -> ${outputPath}`);
  } else {
    console.log(result);
  }
}

module.exports = { transform, parseCommandBlock };
