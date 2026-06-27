# macprefs-website — Migration PLAN

> **Migration:** single Astro + Starlight site (GitHub Pages) → **Astro monorepo** (bespoke
> marketing + Starlight docs + shared Netservant design-system package) on **Vercel**, re-skinned
> light/dark to the **Netservant Design System**.
>
> The full design/architecture spec is `design_handoff_macprefs_site_migration/README.md` and its
> bundled `design-system/`, `netservant-starlight-theme.css`, icon assets, and verbatim marketing
> copy under `design-references/source-content/`. This PLAN turns that handoff into ordered,
> independently-verifiable phases.

## How to use this document

**`PLAN.md` is the executable source of truth.** Work proceeds one phase at a time:

1. **Implement** — a build agent runs `docs/prompts/build-phase.md` (replace `[N]`), implements the
   phase's TODOs on a branch, opens a PR with green CI, and **stops** (does not merge or tick).
2. **Verify** — a fresh agent runs `docs/prompts/verify-phase.md`, re-proves every Testing Gate
   empirically, and on PASS **merges the PR and ticks** that phase's checkboxes. On FAIL it ticks
   nothing and emits a remediation prompt.

**Rules that bind every phase:**

- **TODO file paths and names are literal specs.** If a TODO says `apps/docs/src/styles/custom.css`,
  it means exactly that path. Any deviation requires an ADR in `docs/decisions/` (see Appendix B).
- **Checkboxes are ticked by the verifier only**, never by the implementer.
- **Locked Decisions (below) are frozen.** Violating one is an automatic FAIL unless ADR'd.
- **The docs-sync pipeline must keep working** (see D5). The known duplicate-content bug in
  `DOCS_SYNC_ISSUE.md` is **out of scope** — do not touch it.
- **Escalation:** max **3** failed-gate fix loops on a phase, then stop and escalate to the user.

## Locked Decisions (frozen)

| # | Decision | Value |
|---|---|---|
| D1 | Package manager / tooling | **npm workspaces**, no Turborepo, no pnpm (mirror `~/Projects/netservant-website`). Keep `package-lock.json`. |
| D2 | Hosting | **Vercel**, two projects off one repo: marketing → apex `macprefs.app`; docs → `docs.macprefs.app`. Retire GitHub Pages. |
| D3 | DS consumption | Copy **raw `.jsx` sources** into `packages/design-system`; marketing mounts them as `@astrojs/react` islands. `react`/`react-dom` are **peerDependencies**. |
| D4 | Icon scope | **Web favicons + `site.webmanifest` only.** The macOS GUI-app `.icns`/`.icon` (README §6.3) is **out of scope** (belongs to `jmcombs/macprefs`). |
| D5 | Docs-sync pipeline | Preserve behavior; only **retarget paths** to `apps/docs`. `DOCS_SYNC_ISSUE.md` bug stays out of scope. |
| D6 | Workspace scope | `@macprefs/design-system`, `@macprefs/marketing`, `@macprefs/docs` (the DS is the Netservant system, vendored under this repo's scope). |
| D7 | Brand tokens | Path Blue `#3465a4` accent (dark `#7aa2d6`); Catppuccin **Latte** light / **Mocha** dark; **Manrope** + **JetBrains Mono**. Path-Blue header in both modes. |

## Git & PR conventions

- Branch per phase: `feat|fix|chore|docs|refactor/phase-[N]-<slug>` (e.g. `feat/phase-1-monorepo-scaffold`).
- **Never commit to `main`.** Conventional Commits; **branch prefix ↔ commit type symmetry**
  (a `feat/` branch uses `feat(...)` commits).
- One PR per phase. CI must be green before handoff. **The verifier merges**, not the implementer.

## Phase summary

| Phase | Scope | Entry | Branch type |
|---|---|---|---|
| 1 | Monorepo scaffold (npm workspaces) | — | feat |
| 2 | `packages/design-system` (vendor DS) | P1 | feat |
| 3 | `apps/docs` — lift Starlight intact | P1 | refactor |
| 4 | Retarget docs-sync CI → `apps/docs` | P3 | chore |
| 5 | Docs theming (Netservant token diff) | P3 | feat |
| 6 | `apps/marketing` scaffold + DS wiring | P2 | feat |
| 7 | Marketing `index.astro` (homepage) | P6 | feat |
| 8 | Marketing `pricing.astro` | P6 | feat |
| 9 | Adaptive favicons + webmanifest | P3, P6 | feat |
| 10 | Vercel deploy + retire GitHub Pages | P4,5,7,8,9 | chore |

---

## Phase 1 — Monorepo scaffold (npm workspaces)

**Entry:** none. **Shippable as:** an installable npm-workspaces shell with empty `apps/`+`packages/`.

### Objectives & Scope
Convert the repo **in place** to an npm-workspaces monorepo shell. **No content is moved yet** —
the current Starlight site keeps building from root until Phase 3 lifts it. Boundary: do not create
`packages/design-system`, `apps/docs`, or `apps/marketing` here (those are Phases 2/3/6).

### Architectural Constraints
- npm workspaces only — **no** `pnpm-workspace.yaml`, **no** `turbo.json` (D1).
- A single root `package-lock.json` remains the only lockfile.

### Actionable TODOs
- [x] **Root `package.json`** (`package.json`): add `"private": true`,
  `"workspaces": ["apps/*", "packages/*"]`, keep `"type": "module"`, add `"engines": { "node": ">=20" }`;
  replace app build scripts with fan-out scripts (`"build": "npm run build --workspaces --if-present"`,
  same shape for `dev`/`check`). App-specific deps (astro, starlight, etc.) are removed from root and
  re-declared per app in Phases 3/6.
- [x] **Workspace dirs**: create `apps/.gitkeep` and `packages/.gitkeep`.
- [x] **Root `tsconfig.json`** (`tsconfig.json`): keep a base config that per-package tsconfigs `extends`.
- [x] **`.gitignore`**: add `.vercel`; confirm `dist/`, `.astro/`, `node_modules/` are ignored
  (they will appear under each workspace).
- [x] **`.devcontainer`**: leave intact (`npm install` post-create still valid for workspaces).

### Testing Gates
| Criterion | Command | Expected |
|---|---|---|
| Workspaces install | `npm install` | exit 0; one root `package-lock.json` |
| Tree exists | `ls apps packages` | both dirs present |
| Root is private | `node -e "console.log(require('./package.json').private)"` | prints `true` |
| No pnpm/turbo | `ls pnpm-workspace.yaml turbo.json 2>&1` | both "No such file" |

**Development continues only on PASS.**

---

## Phase 2 — `packages/design-system` (vendor the Netservant DS)

**Entry:** Phase 1 merged. **Shippable as:** an importable workspace package of DS components + tokens.

### Objectives & Scope
Vendor the Netservant Design System as a workspace package consumed as **raw source** (D3). Source
of truth: `design_handoff_macprefs_site_migration/design-system/`. No app consumes it yet (that's
Phase 6); this phase only stands up the package and proves it imports + type-checks.

### Architectural Constraints
- Components ship as raw `.jsx` (no build/bundler step). `react` + `react-dom` are **peerDependencies**.
- Token CSS and `styles.css` are exported for apps to import. Dark mode flips on `[data-theme="dark"]`.
- The prebuilt `_ds_bundle.js` global namespace is **not** the consumption path (kept only as reference).

### Actionable TODOs
- [x] **Copy DS source** into `packages/design-system/`: `components/{core,paper,brand,code}/*`,
  `tokens/{colors,typography,spacing,fonts}.css`, `styles.css`, `assets/`, `_ds_manifest.json`,
  `readme.md` — from `design_handoff_macprefs_site_migration/design-system/` (preserve subfolders).
- [x] **`packages/design-system/package.json`**: name `@macprefs/design-system`, `"type": "module"`,
  `"peerDependencies": { "react": "...", "react-dom": "..." }`, an `"exports"` map exposing
  `"."` → `./src/index.js`, `"./styles.css"`, and `"./tokens/*"`; `"sideEffects": ["*.css"]`.
- [x] **`packages/design-system/src/index.js`** barrel re-exporting all components:
  `Button, Badge, Card, PaperButton, PaperCard, FeatureItem, TeamCard, ContactForm, CommandBox,
  CodeBlock, Tok, Swatch`.
- [x] **`packages/design-system/tsconfig.json`** (`extends` root) to type-check the bundled `.d.ts`.
- **(Optional — declined at Phase 2 closeout)** wiring `_adherence.oxlintrc.json` as an `oxlint`
  check script was **not adopted**: the DS package's only gate is `tsc --noEmit` (`npm run check`);
  no separate linter is added, and the oxlint config was intentionally not vendored. (No open item.)

### Testing Gates
| Criterion | Command | Expected |
|---|---|---|
| Package resolves | `npm ls @macprefs/design-system` | listed, no errors |
| Barrel exports | `node --import tsx --input-type=module -e "import('@macprefs/design-system').then(m=>console.log(Object.keys(m).length))"` | ≥ 12 |
| Types check | `npm run check -w @macprefs/design-system` | exit 0 |
| Styles present | `test -f packages/design-system/styles.css` | exit 0 |

**Development continues only on PASS.**

---

## Phase 3 — `apps/docs` (lift Starlight intact)

**Entry:** Phase 1 merged. **Shippable as:** the existing docs site building from `apps/docs`, no reskin.

### Objectives & Scope
Move the existing Starlight site into `apps/docs` **with no visual or theming change** (theming is
Phase 5). Remove the two marketing pages (rebuilt in marketing) and the Pricing sidebar entry.
Boundary: do not apply the token diff, change fonts, or touch the docs-sync workflow here.

### Architectural Constraints
- The docs-sync `scripts/transform-*.ts` move **unchanged** into `apps/docs/scripts/` (D5).
- Starlight `head` (favicons, lemon.js, theme-color), `expressiveCode`, and `customCss` stay as-is.

### Actionable TODOs
- [ ] **Move** `src/content/`, `src/assets/`, `src/styles/`, `content.config.ts`, `public/`,
  `astro.config.mjs`, and `scripts/` → under `apps/docs/`.
- [ ] **Drop marketing from docs**: delete `apps/docs/src/content/docs/index.mdx` and
  `apps/docs/src/content/docs/pricing.mdx`; remove the **Pricing** entry from the `sidebar` in
  `apps/docs/astro.config.mjs`.
- [ ] **`apps/docs/package.json`**: name `@macprefs/docs`; deps `astro`, `@astrojs/starlight`,
  `@astrojs/sitemap`, `astro-seo`, `@tailwindcss/vite`, `tailwindcss`, `sharp`, `handlebars`, `tsx`,
  `@astrojs/check`; scripts `dev`/`build`/`check` and `transform:{cli,config,migration}` pointing at
  `apps/docs/scripts/*`.
- [ ] **Keep** `apps/docs/astro.config.mjs` head/lemon/expressiveCode as-is (theming = Phase 5).

### Testing Gates
| Criterion | Command | Expected |
|---|---|---|
| Docs build | `npm run build -w @macprefs/docs` | exit 0; all doc routes emitted |
| No marketing in docs | `ls apps/docs/src/content/docs/index.mdx` | "No such file" (exit 1) |
| Scripts moved | `ls apps/docs/scripts/transform-cli-docs.ts` | exists |
| Transform runs | `npm run transform:cli -w @macprefs/docs -- <fixture CLI.json> apps/docs/src/content/docs/reference/cli.mdx` | exit 0, MDX written |

**Development continues only on PASS.**

---

## Phase 4 — Retarget docs-sync CI to `apps/docs`

**Entry:** Phase 3 merged. **Shippable as:** the docs-sync workflow writing into `apps/docs`.

### Objectives & Scope
Repoint `.github/workflows/receive-docs-sync.yml` so its transforms read/write under `apps/docs`.
**Behavior is otherwise unchanged.** Boundary: do **not** fix the duplicate-content bug
(`DOCS_SYNC_ISSUE.md`) — out of scope (D5).

### Architectural Constraints
- The `jmcombs/macprefs` sparse-checkout step and the GitHub App token step stay unchanged.
- The auto-PR `add-paths` must point at the new docs content path.

### Actionable TODOs
- [ ] **`.github/workflows/receive-docs-sync.yml`**: change transform **output** paths to
  `apps/docs/src/content/docs/...`; change script invocations to `apps/docs/scripts/...`
  (or `npm run -w @macprefs/docs`); `npm ci` at repo root (installs workspaces); set
  `add-paths: apps/docs/src/content/docs/**`.
- [ ] **Confirm** the sparse-checkout of `macprefs-source/docs/*` inputs and App-token steps are unchanged.

### Testing Gates
| Criterion | Command | Expected |
|---|---|---|
| YAML valid | `npx --yes yaml-lint .github/workflows/receive-docs-sync.yml` | exit 0 |
| Paths repointed | `grep -c "apps/docs/src/content/docs" .github/workflows/receive-docs-sync.yml` | ≥ 1 |
| No bare old path | `grep -nE "(^|[^/])src/content/docs" .github/workflows/receive-docs-sync.yml` | no matches |
| Local transform target | run a transform with a fixture | MDX appears under `apps/docs/...` |

**Development continues only on PASS.**

---

## Phase 5 — Docs theming (Netservant token diff)

**Entry:** Phase 3 merged. **Shippable as:** docs on the DS light/dark theme + typography.

### Objectives & Scope
Bring `apps/docs` onto the DS palette + type per README §4. Replace the light/dark token blocks,
remap hardcoded hex in the component overrides, load the DS fonts, align the dark accent and code
themes. Boundary: keep all component-override **structure**; only token values + fonts change.

### Architectural Constraints
- Replace only the `:root[data-theme="light"]` / `:root[data-theme="dark"]` **token blocks**; the
  `.card`/`.sidebar`/`.sl-link-card`/pagination/hero overrides stay, with hex remapped (README §4.3).
- Path-Blue header stays in both modes; card surfaces stay `#ffffff` on the `#eff1f5` page.

### Actionable TODOs
- [ ] **`apps/docs/src/styles/custom.css`**: replace the two token blocks with the contents of
  `design_handoff_macprefs_site_migration/netservant-starlight-theme.css`.
- [ ] **Hex remap** the component overrides in `custom.css` per README §4.3
  (`#f8f9fa→#eff1f5`, `#f1f3f4→#e6e9ef`, `#202124→#4c4f69`, `#1c1917→#4c4f69`, … drop the
  `--psl-gray-*` Stone ramp).
- [ ] **Fonts**: load Manrope + JetBrains Mono via Google Fonts `<link>` in the Starlight `head`
  (`apps/docs/astro.config.mjs`), mirroring netservant-website's preconnect + stylesheet.
- [ ] **Dark accent**: set `--sl-color-accent`/`--sl-color-text-accent` and hero `h1` dark to `#7aa2d6`.
- [ ] **expressiveCode**: `themes: ["catppuccin-latte", "catppuccin-mocha"]` (was `…-frappe`).

### Testing Gates
| Criterion | Command | Expected |
|---|---|---|
| Build clean | `npm run build -w @macprefs/docs` | exit 0 |
| Stone hex gone | `grep -nE "#f8f9fa|#f1f3f4|#202124|#1c1917|#9aa0a6" apps/docs/src/styles/custom.css` | no matches |
| Mocha code theme | `grep "catppuccin-mocha" apps/docs/astro.config.mjs` | match; no `frappe` |
| Fonts loaded | `grep -E "Manrope|JetBrains" apps/docs/astro.config.mjs` | match |
| Visual light+dark | `/run` docs; screenshot both `data-theme` | Latte light + Mocha dark; Manrope type |

**Development continues only on PASS.**

---

## Phase 6 — `apps/marketing` scaffold + DS wiring

**Entry:** Phase 2 merged. **Shippable as:** an Astro marketing app that hydrates a DS island.

### Objectives & Scope
Stand up the bespoke marketing Astro app able to mount DS React islands and render the shared base
layout. Boundary: no real page content yet (index/pricing are Phases 7/8); only the shell + a smoke
component.

### Architectural Constraints
- React islands via `@astrojs/react`; DS components mount with `client:*` directives (D3).
- Component icons use **codicons** (CDN); fonts via Google Fonts; DS `styles.css` imported once.
- Dark mode via `data-theme` on `<html>` (mirror netservant-website's auto-detect + persist toggle).

### Actionable TODOs
- [ ] **`apps/marketing`** Astro app: integrations `@astrojs/react`, `@astrojs/sitemap`, `astro-seo`;
  `site: "https://macprefs.app"`.
- [ ] **`apps/marketing/package.json`**: name `@macprefs/marketing`; deps incl.
  `@macprefs/design-system: "*"`, `react`, `react-dom`, `@vercel/analytics`, `@vercel/speed-insights`.
- [ ] **`apps/marketing/src/layouts/BaseLayout.astro`**: `<head>` with Google Fonts
  (Manrope/JetBrains Mono/Instrument Serif) + codicons CDN, adaptive favicon stub (real set in P9),
  `theme-color #3465a4`, OG/Twitter meta + Organization JSON-LD (mirror netservant), import DS
  `styles.css`, `data-theme` light/dark handling, mount Vercel `Analytics` + `SpeedInsights`.
- [ ] **Smoke island**: a DS `Button` rendered with `client:load` on a temporary page.

### Testing Gates
| Criterion | Command | Expected |
|---|---|---|
| Builds | `npm run build -w @macprefs/marketing` | exit 0 |
| DS island hydrates | `/run` marketing; inspect the Button | renders Path-Blue, interactive |
| Fonts + tokens | view page source | Manrope/JetBrains links + DS `styles.css` present |

**Development continues only on PASS.**

---

## Phase 7 — Marketing `index.astro` (homepage)

**Entry:** Phase 6 merged. **Shippable as:** the rebuilt homepage.

### Objectives & Scope
Rebuild the homepage from `design-references/source-content/index.mdx` using DS components per
README §5.1. **Keep all copy and links exactly.** Boundary: pricing page is Phase 8.

### Architectural Constraints
- Lemon Squeezy stays a client widget: keep `.lemonsqueezy-button` + `lemon.js` + the exact checkout URL.
- CommandBox renders the install command; CTAs link to the docs app + `/pricing`.

### Actionable TODOs
- [ ] **Hero** (`apps/marketing/src/pages/index.astro`): `logo-symbol-blue.svg`/`logo-symbol.svg`,
  H1 "Declare your Mac", tagline "Your Mac, your rules. JSON-powered, no MDM excuses.", two CTAs —
  `Get Started` → `/getting-started/installation/` (docs), `Get macprefs Pro` → `/pricing`.
- [ ] **"Why macprefs?"** — 6 `FeatureItem`/`PaperCard`: JSON Config, Drift Detection, Instant
  Rollback, Fast & Native, No Elevation, CI/CD Ready (Pro). Copy verbatim from source-content.
- [ ] **"See it in action"** — 4 link cards → docs `examples/{dock,finder,keyboard,workflows}`.
- [ ] **Tier table** — Free `$0 forever` vs Pro `$39 one-time`; `Badge` tones (accent "Pro",
  info "🔜 Coming Soon"); Pro "Buy Now" → `https://shop.macprefs.app/checkout/buy/000a6a3d-ae40-453e-8efe-e620a0d603c8`.
- [ ] **Quick install** — `CommandBox` with `brew install jmcombs/macprefs/macprefs`.

### Testing Gates
| Criterion | Command | Expected |
|---|---|---|
| Builds | `npm run build -w @macprefs/marketing` | exit 0 |
| Copy verbatim | diff rendered text vs `source-content/index.mdx` | matches |
| Checkout URL | `grep "shop.macprefs.app/checkout/buy/000a6a3d" apps/marketing/src/pages/index.astro` | present |
| Links resolve | `/run`; click both CTAs | reach docs installation + pricing |

**Development continues only on PASS.**

---

## Phase 8 — Marketing `pricing.astro`

**Entry:** Phase 6 merged. **Shippable as:** the rebuilt pricing page.

### Objectives & Scope
Rebuild pricing from `design-references/source-content/pricing.mdx` per README §5.2. **Keep copy and
links exactly.**

### Architectural Constraints
- Same Lemon Squeezy checkout button/URL as the homepage.
- FAQ copy is verbatim (6 Q&As).

### Actionable TODOs
- [ ] **Intro + comparison** (`apps/marketing/src/pages/pricing.astro`): Free/Pro feature-comparison
  table; the same Lemon checkout button.
- [ ] **"Why upgrade to Pro?"** — 4 `FeatureItem`/`Card`: CI/CD Automation, Machine-Readable Output,
  Precise Rollback, Smart Drift Detection.
- [ ] **"How licensing works"** — numbered steps; activation command in a `CommandBox`
  (`macprefs license activate --key <your-license-key>`).
- [ ] **FAQ** — 6 Q&As verbatim from source-content.

### Testing Gates
| Criterion | Command | Expected |
|---|---|---|
| Builds | `npm run build -w @macprefs/marketing` | exit 0 |
| FAQ verbatim | diff vs `source-content/pricing.mdx` | 6 Q&As match |
| Activation cmd | `grep "license activate --key" apps/marketing/src/pages/pricing.astro` | present in a CommandBox |
| Checkout URL | `grep "shop.macprefs.app/checkout/buy/000a6a3d" apps/marketing/src/pages/pricing.astro` | present |

**Development continues only on PASS.**

---

## Phase 9 — Adaptive favicons + webmanifest (web only)

**Entry:** Phases 3 & 6 merged. **Shippable as:** both apps serving the adaptive icon set.

### Objectives & Scope
Wire the exported adaptive favicon set into both apps per README §6.2. **No `.icns`/`.icon`** (D4).

### Architectural Constraints
- Adaptive selection via `media="(prefers-color-scheme: …)"` with a default fallback + apple-touch-icon.
- `theme-color` stays `#3465a4`.

### Actionable TODOs
- [ ] **Copy icons** from `design_handoff_macprefs_site_migration/assets/macprefs-icon/`
  (`icon-*`, `favicon-*`, `favicon-light-*`, `apple-touch-icon-*`) into both `apps/docs/public/`
  and `apps/marketing/public/`.
- [ ] **Adaptive `<link>` set**: in `apps/docs/astro.config.mjs` `head` and
  `apps/marketing/src/layouts/BaseLayout.astro` — light/dark `rel="icon"` by `prefers-color-scheme`,
  a default fallback, and `apple-touch-icon`.
- [ ] **`site.webmanifest`** in each `public/`: point icons at the new PNGs; keep `theme-color #3465a4`.

### Testing Gates
| Criterion | Command | Expected |
|---|---|---|
| Icons present | `ls apps/docs/public/favicon-light-32.png apps/marketing/public/favicon-light-32.png` | both exist |
| Adaptive links | `grep -c "prefers-color-scheme" apps/marketing/src/layouts/BaseLayout.astro` | ≥ 2 |
| Manifest valid | `node -e "JSON.parse(require('fs').readFileSync('apps/marketing/public/site.webmanifest'))"` | no throw |
| No .icns added | `git ls-files '*.icns' '*.icon'` | empty |

**Development continues only on PASS.**

---

## Phase 10 — Vercel deployment + retire GitHub Pages

**Entry:** Phases 4, 5, 7, 8, 9 merged. **Shippable as:** two Vercel-ready apps; Pages removed.

### Objectives & Scope
Configure both apps for Vercel mirroring `~/Projects/netservant-website`, remove the GitHub Pages
deployment, and once the Vercel deploy is confirmed live, make the `jmcombs/macprefs-website` GitHub
repo **private**. Boundary: creating/linking the actual Vercel projects + DNS is a manual user step;
this phase delivers the in-repo config + docs, plus the explicit visibility flip.

### Architectural Constraints
- Static Astro output on Vercel needs no adapter. `vercel.json` mirrors netservant's headers.
- The docs-sync workflow must still target `apps/docs` after Pages removal.

### Actionable TODOs
- [ ] **Per-app `vercel.json`** (`apps/marketing/vercel.json`, `apps/docs/vercel.json`): `cleanUrls: true`,
  `trailingSlash: false`, security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
  Permissions-Policy) — copied from netservant-website.
- [ ] **Analytics**: confirm `@vercel/analytics` + `@vercel/speed-insights` are mounted in both apps.
- [ ] **Retire Pages**: delete `.github/workflows/deploy.yml` and `public/CNAME`
  (Vercel manages domains).
- [ ] **`README.md`** (repo root): replace the Starlight starter readme with monorepo docs — workspace
  layout, dev commands, the two Vercel projects (root dirs `apps/marketing` → apex `macprefs.app`,
  `apps/docs` → `docs.macprefs.app`), and a note that docs-sync still targets `apps/docs`.
- [ ] **Remove the handoff folder** — delete `design_handoff_macprefs_site_migration/` (its contents
  are fully vendored by Phases 2/5/7/8/9). Do this **last** among repo-content changes, after the build
  gate below passes once with it still present, then confirm the build still passes without it.
- [ ] **Make the repo private** — once the Vercel deploy is confirmed live for both apps, set
  `jmcombs/macprefs-website` to **private** (`gh repo edit jmcombs/macprefs-website --visibility private`).
  This is the **final action of the migration**. Vercel retains access to private repos via its GitHub
  App, so deploys continue; confirm a deploy still succeeds afterward.

### Testing Gates
| Criterion | Command | Expected |
|---|---|---|
| Both build | `npm run build` (root fan-out) | exit 0 for marketing + docs |
| Pages retired | `ls .github/workflows/deploy.yml public/CNAME 2>&1` | both "No such file" |
| vercel.json valid | `node -e "JSON.parse(require('fs').readFileSync('apps/marketing/vercel.json'))"` | no throw |
| Sync intact | `grep apps/docs .github/workflows/receive-docs-sync.yml` | still targets `apps/docs` |
| Handoff removed | `ls design_handoff_macprefs_site_migration 2>&1` | "No such file" |
| Build w/o handoff | `npm run build` (root fan-out, after deletion) | exit 0 — nothing depended on the folder |
| Repo is private | `gh repo view jmcombs/macprefs-website --json visibility -q .visibility` | `private` (verify only after deploy confirmed; else UNVERIFIED) |

**Development continues only on PASS.**

---

# Appendix A — Asset map (handoff → repo)

| Handoff source | Lands at |
|---|---|
| `design_handoff_.../design-system/{components,tokens,styles.css,assets,_ds_manifest.json,readme.md}` | `packages/design-system/` (P2) |
| `design_handoff_.../netservant-starlight-theme.css` | merged into `apps/docs/src/styles/custom.css` (P5) |
| `design_handoff_.../assets/macprefs-icon/*` | `apps/docs/public/` + `apps/marketing/public/` (P9) |
| `design_handoff_.../design-references/source-content/index.mdx` | rebuilt as `apps/marketing/src/pages/index.astro` (P7) |
| `design_handoff_.../design-references/source-content/pricing.mdx` | rebuilt as `apps/marketing/src/pages/pricing.astro` (P8) |
| current `src/content/docs/**`, `scripts/**`, `public/**` | `apps/docs/**` (P3) |

The `design_handoff_macprefs_site_migration/` folder is a **read-only reference** consumed by Phases
2/5/7/8/9; it is not part of the build. It is **deleted as the final TODO of Phase 10**, once
everything it carries has been vendored.

# Appendix B — Decision Log (ADR index)

Deviations from a TODO's literal spec, or any Locked-Decision exception, require an ADR in
`docs/decisions/000X-<slug>.md` (template: `docs/decisions/0000-template.md`) listed here.

| ADR | Phase | Title | Status | Kind |
|---|---|---|---|---|

_No active ADRs. (ADR 0001 was retired at Phase 2 closeout when the root `dev`/`build`/`check`
scripts returned to PLAN's literal fan-out form — the empty-workspace guard became dead code once
`packages/design-system` existed. The Phase 2 workaround ADR 0002 was earlier superseded by the
`node --import tsx` Barrel-exports gate fix.)_

# Appendix C — Master TODO index (verifier-ticked)

- [x] Phase 1 — Monorepo scaffold
- [x] Phase 2 — `packages/design-system`
- [ ] Phase 3 — `apps/docs` lift
- [ ] Phase 4 — docs-sync retarget
- [ ] Phase 5 — docs theming
- [ ] Phase 6 — `apps/marketing` scaffold
- [ ] Phase 7 — marketing homepage
- [ ] Phase 8 — marketing pricing
- [ ] Phase 9 — favicons + webmanifest
- [ ] Phase 10 — Vercel + retire Pages

# Appendix D — Definition of Done (every phase)

1. Branch + commits follow the conventions (branch-per-phase, Conventional Commits, symmetry, never `main`).
2. `astro check` (where applicable) and `npm run build -w <workspace>` exit 0 for every touched workspace.
3. Full-repo build regression: `npm run build` (root fan-out) still green — no predecessor app broken.
4. The docs-sync pipeline is untouched in behavior and still targets `apps/docs` (D5).
5. No `dist/` or `.astro/` committed; no Tailwind/Starlight/Lemon regression.
6. Every phase Testing Gate re-run by the verifier with **real** output; every literal TODO path exists.
7. PR opened with green CI; **verifier** merges and ticks the phase's boxes (Appendix C + the phase).
8. Any deviation has an ADR in `docs/decisions/` and a row in Appendix B.
