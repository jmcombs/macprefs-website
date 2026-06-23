# CLAUDE.md — working agreement for macprefs-website

This repo is being migrated from a single Astro + Starlight site into an **Astro monorepo**
(bespoke marketing + Starlight docs + a shared Netservant design-system package) deployed on
**Vercel**. The execution spec is **`PLAN.md`** — it is the source of truth, not this file.

## The loop

Work happens **one phase at a time** through two prompts:

- **Build:** `docs/prompts/build-phase.md` — implement a phase's TODOs, open a PR with green CI, **stop**.
- **Verify:** `docs/prompts/verify-phase.md` — a fresh agent re-proves every gate; on PASS it **merges
  the PR and ticks** the phase's checkboxes. On FAIL it ticks nothing and emits a remediation prompt.

The implementer never merges or ticks. The verifier is adversarial and read-only except for the ticks.

## Locked Decisions (see PLAN.md for the full table)

- **npm workspaces only** — no pnpm, no Turborepo. One root `package-lock.json`.
- **Vercel** hosting — marketing on apex `macprefs.app`, docs on `docs.macprefs.app`. GitHub Pages is retired.
- **Design system** is vendored as **raw `.jsx` source** in `packages/design-system` and mounted as
  `@astrojs/react` islands. `react`/`react-dom` are peerDependencies.
- **Web favicons only** — the macOS `.icns`/`.icon` work is out of scope (it lives in `jmcombs/macprefs`).
- **Workspace scope** is `@macprefs/{design-system,marketing,docs}`.

## Quality gates

- `astro check` clean for any touched Astro workspace.
- `npm run build -w <workspace>` exits 0 for the workspace you changed; `npm run build` (root fan-out)
  stays green — never break a predecessor app.
- Never commit `dist/`, `.astro/`, or `node_modules/`.

## Git conventions

- Branch per phase: `feat|fix|chore|docs|refactor/phase-<N>-<slug>`. **Never commit to `main`.**
- Conventional Commits; **branch prefix ↔ commit type symmetry** (a `feat/` branch uses `feat(...)` commits).
- One PR per phase; the verifier merges.

## Anti-faking rules

- Do not disable, comment out, weaken, or `|| true` a check, test, or gate to make it pass.
- Do not tick a `PLAN.md` checkbox you cannot back with real command output (only the verifier ticks).
- TODO file paths/names in `PLAN.md` are literal. Deviations need an ADR in `docs/decisions/`
  (template `docs/decisions/0000-template.md`) and a row in `PLAN.md` Appendix B.

## Do not disturb

- The **docs-sync pipeline** (`.github/workflows/receive-docs-sync.yml` +
  `scripts/transform-*.ts`, moving to `apps/docs`) must keep working. Only its **paths** change.
- The known duplicate-content bug documented in `DOCS_SYNC_ISSUE.md` is **out of scope** — leave it.
- Lemon Squeezy stays a client widget (`lemon.js`, `.lemonsqueezy-button`, `shop.macprefs.app` checkout).

## Repo layout (target)

```
apps/
  marketing/    Astro — bespoke, full DS (index.astro, pricing.astro)
  docs/         Astro + Starlight — lifted docs + transform scripts
packages/
  design-system/  Netservant tokens + React components (shared, raw source)
docs/
  prompts/      build-phase.md, verify-phase.md
  decisions/    ADRs (0000-template.md + 000X-*.md)
PLAN.md         the phased spec
```
