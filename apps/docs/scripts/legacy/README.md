# Legacy Transformation Scripts

This directory contains the original CommonJS transformation scripts preserved for rollback and comparison purposes.

## Files

- `transform-cli-docs.cjs` - Original CLI documentation transformer (CLI.json → cli.mdx)
- `transform-config-docs.cjs` - Original config documentation transformer (config-examples.md → configuration.mdx)

## Purpose

These scripts are kept as a fallback in case issues are discovered with the new TypeScript + Handlebars-based transformations. They are **not** used by the active documentation sync workflow.

## Rollback Instructions

If you need to revert to the legacy scripts:

1. Update `.github/workflows/receive-docs-sync.yml` to use the legacy scripts:
   ```yaml
   # Replace:
   npx tsx scripts/transform-cli-docs.ts ...
   # With:
   node scripts/legacy/transform-cli-docs.cjs ...
   ```

2. Similarly for config docs:
   ```yaml
   # Replace:
   npx tsx scripts/transform-config-docs.ts ...
   # With:
   node scripts/legacy/transform-config-docs.cjs ...
   ```

## Migration Status

- **Migrated to TypeScript + Handlebars:** See `scripts/transform-cli-docs.ts` and `scripts/transform-config-docs.ts`
- **Migration documentation:** See `docs/HANDLEBARS_MIGRATION.md`

---

*These files are preserved for rollback purposes only. Do not modify them.*

