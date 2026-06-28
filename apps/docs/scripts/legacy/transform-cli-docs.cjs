#!/usr/bin/env node
/**
 * transform-cli-docs.cjs
 * Transforms docs/CLI.json (structured format) to Starlight MDX format
 *
 * New structured JSON format (from macprefs generate-cli-docs):
 * {
 *   "commands": {
 *     "name": {
 *       "name": "...",
 *       "abstract": "...",
 *       "description": "...",
 *       "usage": "...",
 *       "flags": [{ "short": "-c", "long": "--config", "argument": "config", "description": "...", "tier": "free" }],
 *       "arguments": [...],
 *       "exit_codes": { "0": "...", "2": "..." },
 *       "subcommands": ["..."]
 *     }
 *   }
 * }
 */

const fs = require('fs');
const path = require('path');

// Load enrichment data (for any additional enrichments beyond structured data)
const enrichmentsPath = path.join(__dirname, 'cli-enrichments.json');
const enrichments = JSON.parse(fs.readFileSync(enrichmentsPath, 'utf8'));

// Input/output paths
const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath) {
  console.error('Usage: transform-cli-docs.cjs <input-json> [output-mdx]');
  process.exit(1);
}

// Read JSON - try .json first, fall back to parsing .md path to find .json
let jsonPath = inputPath;
if (inputPath.endsWith('.md')) {
  jsonPath = jsonPath.replace(/\.md$/, '.json');
}

if (!fs.existsSync(jsonPath)) {
  console.error(`Error: JSON file not found: ${jsonPath}`);
  process.exit(1);
}

const cliData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

/**
 * Format a flag for display in MDX
 * Builds flag string like: -c, --config <config>
 */
function formatFlag(flag) {
  let parts = [];
  if (flag.short) parts.push(flag.short);
  if (flag.long) parts.push(flag.long);
  let flagStr = parts.join(', ');
  if (flag.argument) {
    flagStr += ` <${flag.argument}>`;
  }
  return flagStr;
}

/**
 * Get display tier (capitalize first letter)
 */
function formatTier(tier) {
  if (!tier) return 'Free';
  return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
}

/**
 * Generate MDX for a command using structured JSON data
 */
function generateCommandMdx(cmdKey, cmdData) {
  const cmdName = cmdData.name;
  const enrichment = enrichments.commands[cmdName] || {};

  // Use structured data directly - no parsing needed!
  const overview = enrichment.description || cmdData.description || cmdData.abstract;
  const usage = cmdData.usage || '';
  const flags = cmdData.flags || [];
  const args = cmdData.arguments || [];
  const exitCodes = cmdData.exit_codes || null;

  let mdx = `### \`${cmdName}\`\n\n`;
  mdx += `${overview}\n\n`;

  if (usage) {
    mdx += `\`\`\`bash\n${usage}\n\`\`\`\n\n`;
  }

  // Arguments section (if any)
  if (args.length > 0) {
    mdx += `**Arguments:**\n`;
    for (const arg of args) {
      const required = arg.is_required ? ' (required)' : '';
      mdx += `- \`<${arg.argument}>\` — ${arg.description}${required}\n`;
    }
    mdx += '\n';
  }

  // Flags table - use structured flag data directly
  if (flags.length > 0) {
    mdx += `| Flag | Description | Tier |\n`;
    mdx += `|------|-------------|------|\n`;
    for (const flag of flags) {
      const flagStr = formatFlag(flag);
      const tier = formatTier(flag.tier);
      mdx += `| \`${flagStr}\` | ${flag.description} | ${tier} |\n`;
    }
    mdx += '\n';
  }

  // Subcommands (if any)
  if (cmdData.subcommands && cmdData.subcommands.length > 0) {
    mdx += `**Subcommands:** ${cmdData.subcommands.map(s => `\`${s}\``).join(', ')}\n\n`;
  }

  // Exit codes from structured data
  if (exitCodes && Object.keys(exitCodes).length > 0) {
    mdx += `**Exit codes:**\n`;
    for (const [code, desc] of Object.entries(exitCodes)) {
      mdx += `- \`${code}\` — ${desc}\n`;
    }
    mdx += '\n';
  }

  // Additional enrichments from cli-enrichments.json (for anything not in structured data)
  if (enrichment.aside) {
    mdx += `<Aside type="${enrichment.aside.type}">\n`;
    mdx += `${enrichment.aside.content}\n`;
    mdx += `</Aside>\n\n`;
  }

  mdx += `---\n\n`;
  return mdx;
}

// Generate MDX output
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
  'plan', 'apply', 'rollback', 'license', 'upgrade', 'about',
  'license_status', 'license_activate', 'license_deactivate'
];

for (const cmdKey of commandOrder) {
  const cmdData = cliData.commands[cmdKey];
  if (cmdData) {
    mdx += generateCommandMdx(cmdKey, cmdData);
  }
}

// Add tier comparison table
mdx += `## Tier Feature Comparison

| Feature | Free | Pro+ |
|---------|:----:|:----:|
| Apple domains (com.apple.*, NSGlobalDomain) | ✓ | ✓ |
| JSON export format | ✗ | ✓ |
| Third-party app domains | ✗ | ✓ |
| Headless mode (--yes) | ✗ | ✓ |
| --filter flag (plan) | ✗ | ✓ |
| Semantic exit codes (2 for drift) | ✗ | ✓ |
| --run-id (rollback to specific run) | ✗ | ✓ |
| --baseline (export) | ✗ | ✓ |

<Aside type="caution">
When a gated feature is used without proper license, the CLI returns exit code 1 with message:
\`This feature requires Pro tier or higher. Run 'macprefs upgrade' to unlock.\`
</Aside>

---

*Documentation auto-synced from macprefs CLI help.*
`;

// Output
if (outputPath) {
  fs.writeFileSync(outputPath, mdx);
  console.log(`Transformed ${jsonPath} -> ${outputPath}`);
} else {
  console.log(mdx);
}
