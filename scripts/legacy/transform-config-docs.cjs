#!/usr/bin/env node
/**
 * Transform config-examples.md to Starlight MDX format
 * 
 * Usage: node transform-config-docs.js <config-md-path> [output-path]
 * 
 * Converts configuration documentation to Starlight MDX with proper
 * frontmatter and component imports.
 */

const fs = require('fs');
const path = require('path');

/**
 * Transform config markdown to MDX
 */
function transform(content) {
  // Remove the original title if present (we'll use frontmatter)
  let mdx = content.replace(/^#\s+.*\n+/, '');
  
  // Add frontmatter and imports
  const frontmatter = `---
title: Configuration Format
description: macprefs JSON configuration file format and examples
---

import { Tabs, TabItem, Badge, Aside } from '@astrojs/starlight/components';

`;

  // Convert blockquotes to Aside components
  mdx = mdx.replace(
    /^>\s*\*\*Note:\*\*\s*(.+)$/gm,
    '<Aside type="note">\n$1\n</Aside>'
  );
  
  mdx = mdx.replace(
    /^>\s*\*\*Tip:\*\*\s*(.+)$/gm,
    '<Aside type="tip">\n$1\n</Aside>'
  );
  
  mdx = mdx.replace(
    /^>\s*\*\*Warning:\*\*\s*(.+)$/gm,
    '<Aside type="caution">\n$1\n</Aside>'
  );
  
  mdx = mdx.replace(
    /^>\s*\*\*Caution:\*\*\s*(.+)$/gm,
    '<Aside type="caution">\n$1\n</Aside>'
  );

  // Convert remaining blockquotes to generic asides
  mdx = mdx.replace(
    /^>\s*(.+)$/gm,
    (match, content) => {
      // Skip if already converted
      if (content.startsWith('<Aside')) return match;
      return `<Aside type="note">\n${content}\n</Aside>`;
    }
  );

  // Ensure code blocks have language specified
  mdx = mdx.replace(/```\n/g, '```json\n');
  
  // Fix any double-specified languages
  mdx = mdx.replace(/```json\njson/g, '```json\n');
  mdx = mdx.replace(/```jsonjson/g, '```json');

  // Add footer
  mdx += '\n---\n\n*Documentation auto-synced from macprefs configuration examples.*\n';

  return frontmatter + mdx;
}

// CLI entry point
if (require.main === module) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];

  if (!inputPath) {
    console.error('Usage: node transform-config-docs.js <config-md-path> [output-path]');
    process.exit(1);
  }

  const content = fs.readFileSync(inputPath, 'utf8');
  const result = transform(content);

  if (outputPath) {
    fs.writeFileSync(outputPath, result);
    console.log(`Transformed config-examples.md -> ${outputPath}`);
  } else {
    console.log(result);
  }
}

module.exports = { transform };
