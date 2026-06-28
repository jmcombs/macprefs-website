/**
 * Handlebars helpers for CLI documentation transformation
 * 
 * These helpers are used by the Handlebars templates to format CLI data
 * for MDX output. They are designed to be pure functions that can be
 * unit-tested in isolation.
 */

import Handlebars from 'handlebars';
import type { Flag, Argument, AsideType } from '../types/cli-types.js';

// =============================================================================
// Pure Helper Functions (exported for testing)
// =============================================================================

/**
 * Format a flag for display in MDX
 * Builds flag string like: -c, --config <config>
 */
export function formatFlag(flag: Flag): string {
  const parts: string[] = [];
  if (flag.short) parts.push(flag.short);
  if (flag.long) parts.push(flag.long);
  let flagStr = parts.join(', ');
  if (flag.argument) {
    flagStr += ` <${flag.argument}>`;
  }
  return flagStr;
}

/**
 * Format tier for display (capitalize first letter)
 */
export function formatTier(tier: string | undefined): string {
  if (!tier) return 'Free';
  return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
}

/**
 * Format an argument for display
 * Returns: `<argument>` — description (required)
 */
export function formatArgument(arg: Argument): string {
  const required = arg.is_required ? ' (required)' : '';
  return `\`<${arg.argument}>\` — ${arg.description}${required}`;
}

/**
 * Escape content for use in MDX (escape backticks in code contexts)
 */
export function escapeForMdx(content: string): string {
  // Escape backticks that might break MDX
  return content.replace(/`/g, '\\`');
}

/**
 * Escape MDX-control characters in *plain-prose* text so it renders literally.
 *
 * MDX is a superset of Markdown that also parses JSX, so a bare `<` is read as
 * the start of a JSX element (`<input>` → "expected a closing tag") and a bare
 * `{` is read as the start of a JS expression. Upstream CLI help text legitimately
 * contains `<placeholder>` and `{...}` tokens, so any prose field rendered into the
 * MDX body must neutralize these. We emit HTML entities, which MDX renders as the
 * literal character.
 *
 * Intentionally does NOT escape backticks: prose fields such as enriched command
 * overviews use deliberate inline code (e.g. "runs a safe `defaults` smoke test"),
 * and a stray, unmatched backtick is harmless to MDX compilation. Backtick handling
 * is the separate concern of `escapeForMdx` for code-only contexts.
 *
 * Use ONLY for plain CLI/enrichment prose — never for authored Markdown/MDX such as
 * aside content, which intentionally contains real markup.
 */
export function escapeMdxText(content: unknown): string {
  if (content === null || content === undefined) return '';
  return String(content)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

/**
 * Escape plain-prose text destined for a Markdown table cell.
 *
 * Extends `escapeMdxText` with `|` → `\|`. An unescaped pipe inside a GFM table
 * cell is read as a column delimiter, which both breaks the table layout (the
 * cosmetic `(table|json)` stray-column bug) and can corrupt the row structure.
 */
export function escapeMdxTableCell(content: unknown): string {
  return escapeMdxText(content).replace(/\|/g, '\\|');
}

/**
 * Generate an Aside component string
 */
export function generateAside(type: AsideType, content: string): string {
  return `<Aside type="${type}">\n${content}\n</Aside>`;
}

/**
 * Check if a value is truthy (for Handlebars conditionals)
 */
export function isTruthy(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
  return Boolean(value);
}

// =============================================================================
// Handlebars Registration
// =============================================================================

/**
 * Register all CLI helpers with a Handlebars instance
 */
export function registerHelpers(hbs: typeof Handlebars): void {
  // Format a flag for display
  hbs.registerHelper('formatFlag', function(flag: Flag): string {
    return formatFlag(flag);
  });

  // Format tier for display
  hbs.registerHelper('formatTier', function(tier: string | undefined): string {
    return formatTier(tier);
  });

  // Format an argument for display
  hbs.registerHelper('formatArgument', function(arg: Argument): string {
    return formatArgument(arg);
  });

  // Escape content for MDX
  hbs.registerHelper('escapeForMdx', function(content: string): string {
    return escapeForMdx(content);
  });

  // Escape plain-prose text so MDX-control chars render literally
  hbs.registerHelper('escapeMdxText', function(content: unknown): string {
    return escapeMdxText(content);
  });

  // Escape plain-prose text for a Markdown table cell (also escapes `|`)
  hbs.registerHelper('escapeMdxTableCell', function(content: unknown): string {
    return escapeMdxTableCell(content);
  });

  // Generate an Aside component
  hbs.registerHelper('aside', function(type: AsideType, content: string): Handlebars.SafeString {
    return new Handlebars.SafeString(generateAside(type, content));
  });

  // Check if array/object has items
  hbs.registerHelper('hasItems', function(this: unknown, value: unknown, options: Handlebars.HelperOptions): string {
    if (isTruthy(value)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // Join array with separator
  hbs.registerHelper('join', function(arr: string[], separator: string): string {
    if (!Array.isArray(arr)) return '';
    return arr.join(separator);
  });

  // Wrap each item in backticks and join
  hbs.registerHelper('codeList', function(arr: string[], separator: string): string {
    if (!Array.isArray(arr)) return '';
    return arr.map(item => `\`${item}\``).join(separator);
  });

  // Equality check
  hbs.registerHelper('eq', function(a: unknown, b: unknown): boolean {
    return a === b;
  });

  // Boolean check for tier features
  hbs.registerHelper('tierCheck', function(value: boolean): string {
    return value ? '✓' : '✗';
  });
}

/**
 * Create a configured Handlebars instance with all helpers registered
 */
export function createHandlebarsInstance(): typeof Handlebars {
  const hbs = Handlebars.create();
  registerHelpers(hbs);
  return hbs;
}

