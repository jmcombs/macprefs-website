/**
 * TypeScript type definitions for CLI.json and cli-enrichments.json
 */

// =============================================================================
// CLI.json Types (from macprefs/docs/CLI.json)
// =============================================================================

/** Flag definition for a CLI command */
export interface Flag {
  short?: string;
  long: string;
  argument?: string;
  description: string;
  is_required: boolean;
  tier: 'free' | 'pro';
}

/** Argument definition for a CLI command */
export interface Argument {
  argument: string;
  description: string;
  is_required: boolean;
  tier: 'free' | 'pro';
}

/** Exit codes mapping (code string to description) */
export interface ExitCodes {
  [code: string]: string;
}

/** Command definition from CLI.json */
export interface Command {
  name: string;
  abstract: string;
  description: string;
  usage: string;
  flags: Flag[];
  arguments: Argument[];
  exit_codes?: ExitCodes;
  subcommands?: string[];
}

/** Commands mapping (command name to Command) */
export interface Commands {
  [commandName: string]: Command;
}

/** Root structure of CLI.json */
export interface CLIData {
  commands: Commands;
  generated: string;
  version: string;
}

// =============================================================================
// cli-enrichments.json Types
// =============================================================================

/** Aside callout types */
export type AsideType = 'note' | 'tip' | 'caution' | 'danger';

/** Aside callout block */
export interface Aside {
  type: AsideType;
  content: string;
}

/** Tier-specific exit codes */
export interface TierExitCodes {
  [code: string]: string;
}

/** Exit codes by tier */
export interface EnrichmentExitCodes {
  pro?: TierExitCodes;
  free?: TierExitCodes;
}

/** Flag enrichment */
export interface FlagEnrichment {
  tier: string;
  description: string;
}

/** Flags enrichments mapping */
export interface FlagsEnrichments {
  [flagName: string]: FlagEnrichment;
}

/** Subcommand enrichment */
export interface SubcommandEnrichment {
  description: string;
  tier: string;
}

/** Subcommands enrichments mapping */
export interface SubcommandsEnrichments {
  [subcommandName: string]: SubcommandEnrichment;
}

/** Command enrichment data */
export interface CommandEnrichment {
  description?: string;
  asides?: Aside[];
  exitCodes?: EnrichmentExitCodes;
  flags?: FlagsEnrichments;
  subcommands?: SubcommandsEnrichments;
}

/** Commands enrichments mapping */
export interface CommandsEnrichments {
  [commandName: string]: CommandEnrichment;
}

/** Feature comparison row */
export interface TierFeature {
  feature: string;
  free: boolean;
  pro: boolean;
}

/** Tier comparison section */
export interface TierComparison {
  features: TierFeature[];
}

/** Root structure of cli-enrichments.json */
export interface Enrichments {
  $schema: string;
  version: string;
  commands: CommandsEnrichments;
  tierComparison: TierComparison;
}

// =============================================================================
// Configuration Reference Types (for transform-config-docs.ts)
// =============================================================================

/** Template context for configuration.hbs */
export interface ConfigTemplateContext {
  title: string;
  description: string;
  body: string;
}
