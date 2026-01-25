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

