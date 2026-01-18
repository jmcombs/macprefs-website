#!/usr/bin/env node
/**
 * transform-cli-docs.cjs
 * Transforms docs/CLI.json to Starlight MDX format
 * Uses structured JSON instead of parsing markdown
 */

const fs = require('fs');
const path = require('path');

// Load enrichment data
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
  jsonPath = inputPath.replace(/\.md$/, '.json');
}

if (!fs.existsSync(jsonPath)) {
  console.error(`Error: JSON file not found: ${jsonPath}`);
  process.exit(1);
}

const cliData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

/**
 * Parse help text to extract flags and their descriptions
 */
function parseFlags(helpText) {
  const flags = [];
  const lines = helpText.split('\n');
  let inOptions = false;
  let currentFlag = null;
  
  for (const line of lines) {
    if (line.trim() === 'OPTIONS:') {
      inOptions = true;
      continue;
    }
    if (line.trim() === 'ARGUMENTS:') {
      inOptions = false;
      continue;
    }
    
    if (inOptions && line.trim()) {
      // Check if this is a new flag line (starts with spaces then -)
      const flagMatch = line.match(/^\s+(-[^\s]+(?:,\s*--[^\s]+)?(?:\s+<[^>]+>)?)\s*(.*)/);
      if (flagMatch) {
        if (currentFlag) flags.push(currentFlag);
        currentFlag = {
          flag: flagMatch[1].trim(),
          description: flagMatch[2].trim()
        };
      } else if (currentFlag && line.match(/^\s{20,}/)) {
        // Continuation of previous description
        currentFlag.description += ' ' + line.trim();
      }
    }
  }
  if (currentFlag) flags.push(currentFlag);
  
  return flags;
}

/**
 * Extract OVERVIEW from help text
 */
function extractOverview(helpText) {
  const match = helpText.match(/OVERVIEW:\s*(.+?)(?:\n\n|\nUSAGE:)/s);
  if (match) {
    return match[1].trim().split('\n')[0];
  }
  return '';
}

/**
 * Extract USAGE from help text
 */
function extractUsage(helpText) {
  const match = helpText.match(/USAGE:\s*(.+?)(?:\n\n|\nOPTIONS:|\nARGUMENTS:)/s);
  if (match) {
    return match[1].trim().split('\n')[0];
  }
  return '';
}

/**
 * Escape angle brackets for MDX (they're interpreted as JSX)
 */
function escapeMdx(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Get tier for a flag based on enrichments
 */
function getFlagTier(cmdName, flagName) {
  const cmdEnrichment = enrichments.commands[cmdName];
  if (cmdEnrichment && cmdEnrichment.flags) {
    const flagEnrichment = cmdEnrichment.flags[flagName];
    if (flagEnrichment) {
      return flagEnrichment.tier || 'Free';
    }
  }
  return 'Free';
}

/**
 * Generate MDX for a command
 */
function generateCommandMdx(cmdKey, cmdData) {
  const cmdName = cmdData.name;
  const helpText = cmdData.help_text;
  const enrichment = enrichments.commands[cmdName] || {};
  
  const overview = enrichment.description || extractOverview(helpText);
  const usage = extractUsage(helpText);
  const flags = parseFlags(helpText);

  let mdx = `### \`${cmdName}\`\n\n`;
  // Escape angle brackets in overview text (not in code blocks)
  mdx += `${escapeMdx(overview)}\n\n`;
  mdx += `\`\`\`bash\n${usage}\n\`\`\`\n\n`;
  
  // Flags table
  if (flags.length > 0) {
    mdx += `| Flag | Description | Tier |\n`;
    mdx += `|------|-------------|------|\n`;
    for (const flag of flags) {
      const tier = getFlagTier(cmdName, flag.flag.split(/[\s,]/)[0]);
      // Escape angle brackets in flag and description to prevent MDX/JSX parsing issues
      const escapedFlag = escapeMdx(flag.flag);
      const escapedDesc = escapeMdx(flag.description);
      mdx += `| \`${escapedFlag}\` | ${escapedDesc} | ${tier} |\n`;
    }
    mdx += '\n';
  }
  
  // Add enrichment notes
  if (enrichment.exitCodes) {
    mdx += `**Exit codes:**\n`;
    for (const [tier, codes] of Object.entries(enrichment.exitCodes)) {
      const codeStr = Object.entries(codes).map(([c,d]) => `\`${c}\` = ${d}`).join("; "); mdx += `- **${tier}:** ${codeStr}\n`;
    }
    mdx += '\n';
  }
  
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
