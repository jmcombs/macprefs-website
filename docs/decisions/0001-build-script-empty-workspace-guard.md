# ADR 0001 — Build-script empty-workspace guard

- **Status:** Accepted
- **Phase:** 1
- **Kind:** Forced workaround

## Decision
Root `package.json` `build`/`dev`/`check` scripts wrap the literal PLAN.md fan-out form
(`"npm run build --workspaces --if-present"`) in a shell guard that checks for
non-empty workspace membership before invoking the fan-out. When no workspaces exist the
scripts exit 0 immediately; when at least one workspace exists the exact spec'd command
runs.

## Rationale
`npm run build --workspaces --if-present` exits 1 ("No workspaces found!") when the
`apps/` and `packages/` directories contain zero `package.json` manifests. The
`--if-present` flag suppresses errors when a *listed workspace* lacks the named script,
but does not suppress the error for the zero-workspace case itself. Without the guard,
Appendix D #3 (full-repo build regression) fails on Phase 1's empty shell, blocking the
phase even though no predecessor app exists to break. The guard is self-healing: once
Phase 3 adds `apps/docs`, the guard falls through to the literal fan-out command.

## Impact
- **Files changed:** root `package.json` (scripts only).
- **Gates:** no Testing Gate definition altered; the guard ensures the root `npm run build`
  regression check (Appendix D #3) remains green.
- **Follow-on:** the guard becomes a no-op once `apps/docs` is created (Phase 3). At that
  point the scripts may be simplified to the literal form.
