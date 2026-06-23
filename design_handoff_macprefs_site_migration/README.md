# Handoff: macprefs site migration → Netservant Design System + Astro monorepo

## Overview

This package is the design + architecture handoff for migrating the **macprefs website**
(`jmcombs/macprefs-website`, live at `https://macprefs.app`) onto the **Netservant Design
System**, restructured as an **Astro monorepo** hosting a bespoke marketing site and the
existing Starlight docs, and re-skinned to be brand-compliant in both light and dark mode.

It also delivers the **finalized macprefs app icon** (adaptive light/dark) and every exported
asset, plus wiring instructions for web favicons and the macOS GUI app `.icns`.

Three things are being delivered together:

1. **Architecture** — split the single Starlight site into `apps/marketing` (bespoke Astro,
   full DS) + `apps/docs` (Starlight, themed) + `packages/design-system`, in one monorepo on Vercel.
2. **Design-system compliance** — the real gap is the **light theme** (currently *Blue PSL 10K*:
   warm Stone grays + system fonts) and **typography** (system-ui, not Manrope). Dark mode is
   already Catppuccin Mocha and is essentially aligned. Full token diff in §4 + drop-in CSS.
3. **App icon** — Option B "Liquid Glass toggle", adaptive light + dark, all sizes exported.

> ### About the design files
> The HTML files in `design-references/` are **design references created as Design Components** —
> prototypes showing intended look, layout, and the exact icon construction. They are **not
> production code to copy**. The task is to recreate these intentions in the **real codebase**
> (`jmcombs/macprefs-website`, an Astro/Starlight project) using its established patterns — Astro
> components, MDX, the Starlight theme system, and the Netservant DS component bundle. The icon
> **PNG assets in `assets/macprefs-icon/` ARE production assets** — ship them directly.

## Fidelity

**High-fidelity.** Colors, typography, spacing, and the icon construction are final and exact.
Hex values, the type scale, and the Starlight variable mapping in this README are authoritative.
Recreate them precisely using the codebase's Astro/Starlight environment and the Netservant DS.

---

## 1. Current state (as built today)

Read this before changing anything — the repo has a **load-bearing CI/CD docs pipeline** that
must survive the migration.

**Stack** (`package.json`): Astro `5.6.1`, `@astrojs/starlight` `0.37.1`, Tailwind `4.1.18`
(via `@tailwindcss/vite`), `astro-seo`, `@astrojs/sitemap`, `sharp`, `handlebars` + `tsx`
(for the docs-sync transform scripts). Package manager: **npm** today.

**It is a single Starlight site.** Marketing pages live *inside* the docs content tree:

| Path | Role | Migration target |
|---|---|---|
| `src/content/docs/index.mdx` | Splash homepage | → **marketing** (rebuild) |
| `src/content/docs/pricing.mdx` | Pricing page | → **marketing** (rebuild) |
| `src/content/docs/getting-started/*.mdx` | installation, quick-start, first-config | → **docs** (lift) |
| `src/content/docs/guides/*.mdx` | power-users, ci-cd, migration-curation, migration-pitfalls | → **docs** (lift) |
| `src/content/docs/reference/*.mdx` | cli, config-format, configuration, exit-codes, troubleshooting | → **docs** (lift) |
| `src/content/docs/examples/*.mdx` | dock, finder, keyboard, workflows | → **docs** (lift) |

**Theming**: `src/styles/custom.css` (≈570 lines) — light = *Blue PSL 10K* (Stone warm grays,
Path-Blue accent, system-ui font); dark = *Catppuccin Mocha*; header is Path Blue `#3465a4` in
both modes. `src/styles/global.css` is near-empty.

**CI/CD docs sync (do not break)**: `.github/workflows/receive-docs-sync.yml` +
`scripts/transform-{cli,config,migration}-docs.ts` (tsx + Handlebars) transform docs pushed from
the `macprefs` CLI repo into MDX. npm scripts `transform:cli|config|migration`. A known
duplicate-content bug is logged in `DOCS_SYNC_ISSUE.md` — **out of scope** for this redesign;
just don't disturb the pipeline. These scripts + the workflow move into `apps/docs` unchanged.

**Payments**: Lemon Squeezy **client-side widget** (`lemon.js` injected in `astro.config.mjs`
head; `.lemonsqueezy-button` class; checkout at `shop.macprefs.app`). No server needed.

**Brand assets in repo**: `src/assets/logo-symbol-blue.svg` (light), `logo-symbol.svg` (dark),
`logo-wordmark-white.svg` (header). Favicons: `/favicon.svg`, `/favicon-32x32.png`,
`/apple-touch-icon.png`, `/site.webmanifest`, `theme-color #3465a4`.

---

## 2. Target architecture

### 2.1 Framework decision — Astro for BOTH (not Next.js)

Locked. Rationale:

- **Docs is Starlight, which *is* Astro**, and the CLI→docs sync is Astro/tsx/Handlebars — it
  stays. Putting marketing on Next.js would mean **two frameworks in one monorepo** (two build
  pipelines, two dep trees, no shared layouts/components) for zero gain on a content site.
- Marketing is brand/content. **Astro islands ship ~0 JS** except where a DS React component
  mounts → best performance.
- The usual reason to pick Next (SSR/commerce) is already handled: **Lemon Squeezy is a client
  widget**. Even the paid GUI app doesn't force SSR yet.
- The DS React components + Tailwind 4 already run in this Astro repo.

Revisit Next.js only if the *marketing* site becomes app-like (accounts, dashboard, auth);
Astro-on-Vercel can add serverless endpoints when that day comes.

### 2.2 Monorepo layout (restructure the existing repo in place)

```
macprefs-website/                  ← keep this repo
├─ apps/
│  ├─ marketing/                   Astro — bespoke, 100% Netservant DS
│  │  ├─ astro.config.mjs          (+ @astrojs/react for DS islands, sitemap, astro-seo)
│  │  └─ src/
│  │     ├─ pages/                  index.astro, pricing.astro, (download.astro)
│  │     ├─ layouts/                BaseLayout.astro (head: fonts, favicons, lemon.js)
│  │     └─ components/             React islands wrapping DS components
│  └─ docs/                         Astro + Starlight — lifted from today's site
│     ├─ astro.config.mjs          (existing Starlight config, minus Pricing in sidebar)
│     ├─ src/content/docs/**        ← getting-started, guides, reference, examples
│     ├─ src/styles/                custom.css (token diff applied) + global.css
│     ├─ scripts/transform-*.ts     ← moved intact
│     └─ public/                    favicons (adaptive set), site.webmanifest
├─ packages/
│  └─ design-system/               Netservant tokens + React component bundle (shared)
├─ .github/workflows/              receive-docs-sync.yml (retarget paths → apps/docs)
├─ turbo.json                      Turborepo task graph
└─ pnpm-workspace.yaml             pnpm workspaces (migrate from npm)
```

**Tooling**: pnpm workspaces + Turborepo (Vercel-native; repo uses npm today → migrate). npm
workspaces is an acceptable fallback if you'd rather not switch package managers.

### 2.3 Shared design system as a versioned package

The moment marketing and docs are separate apps, **both** need the Netservant tokens + component
bundle. Do **not** copy-paste between apps. Stand up `packages/design-system` as the single source
consumed by both apps (workspace dependency). **The complete design system is included in this
package at `design-system/`** — the full source tree, not just the bundle. Copy it into
`packages/design-system`:

- `design-system/_ds_bundle.js` — React components, registered on global `BluePSL10KDesignSystem_ff9c76.*`
- `design-system/styles.css` — entry stylesheet (consumers link this)
- `design-system/tokens/*.css` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`
- `design-system/components/{core,paper,brand,code}/` — component **sources** (`.jsx`), TypeScript
  types (`.d.ts`), per-component usage notes (`.prompt.md`), and specimen cards (`.card.html`)
- `design-system/ui_kits/paper-landing/` — the Netservant company landing kit (hero/services/team/
  contact) — the layout reference for the marketing build
- `design-system/guidelines/*.card.html` — color / type / spacing / brand specimen cards
- `design-system/assets/` — brand marks + app-icon/favicon source PNGs
- `design-system/Netservant Logo.html` — logo specimen (lockups, inverted, app icons)
- `design-system/SKILL.md` — the DS's own agent-skill notes
- `design-system/_ds_manifest.json` — component manifest (names, props)
- `design-system/_adherence.oxlintrc.json` — the DS adherence lint contract
- `design-system/readme.md` — the DS's own usage notes

A brand change then ships to both apps from one place.

### 2.4 Vercel

Two Vercel projects off the one repo (root dirs `apps/marketing` and `apps/docs`):

- **marketing** → apex `macprefs.app`
- **docs** → **`docs.macprefs.app`** (recommended — two independent projects, simplest) **or**
  `macprefs.app/docs` via Vercel rewrites (better SEO unity, a bit more wiring). Decision still
  open; default to the subdomain unless SEO unity is a priority.

Each app deploys on its own trigger. The docs-sync workflow only touches `apps/docs`.

---

## 3. Compliance items (the five that were outstanding)

| # | Item | Resolution |
|---|---|---|
| 1 | **Dark theme** | Already Catppuccin Mocha = DS dark ramp. Keep. Only change: accent → DS lightened Path Blue `#7aa2d6` (was Catppuccin blue `#89b4fa`); switch expressiveCode dark theme Frappé → Mocha. |
| 2 | **Pages beyond homepage** | Token diff (§4) applies **site-wide** in docs. Marketing pages (index, pricing) are **rebuilt** with DS components. |
| 3 | **CommandBox** | Adopt `CommandBox` for all install / quick-start / license commands (replaces raw ` ```bash ` fences on marketing; usable as an MDX island in docs). |
| 4 | **Token vs component adoption** | **Hybrid** (decided): token diff across **docs**; **full DS components** on **marketing**. |
| 5 | **Icon wiring** | New adaptive favicon set + `prefers-color-scheme` (§6); generate `.icns` for the GUI app from the exported masters. |

---

## 4. Design-system compliance — the token diff

**The gap.** Dark mode is already on-system. **Light mode and typography are not**: the site
uses *Blue PSL 10K* warm **Stone** grays (`#fafaf9 … #1c1917`) + Google-gray Starlight vars
(`#f8f9fa`, `#f1f3f4`, …) and a **system-ui / SF Pro** font stack. The Netservant system uses
**cool Catppuccin-Latte neutrals** and **Manrope + JetBrains Mono**. Path Blue `#3465a4` accent
is already correct.

A ready-to-use drop-in is included: **`netservant-starlight-theme.css`**. Replace the
`:root[data-theme="light"]` and `:root[data-theme="dark"]` **token blocks** in
`apps/docs/src/styles/custom.css` with it. The component-level overrides in `custom.css`
(`.card`, `.sidebar`, `.sl-link-card`, pagination, hero, etc.) can stay — but their **hardcoded
hex values must be remapped** using the find/replace table below.

### 4.1 Starlight variable mapping (light mode)

| Starlight var | Today (Blue PSL 10K) | → Netservant (Latte) | Token |
|---|---|---|---|
| `--sl-color-white` (page bg) | `#f8f9fa` | **`#eff1f5`** | latte-base |
| `--sl-color-gray-1` (nav/sidebar) | `#f1f3f4` | **`#e6e9ef`** | latte-mantle |
| `--sl-color-gray-2` (borders/code bg) | `#e8eaed` | **`#dce0e8`** | latte-crust |
| `--sl-color-gray-3` (heavy borders) | `#dadce0` | **`#ccd0da`** | latte-surface0 |
| `--sl-color-gray-4` (muted text) | `#9aa0a6` | **`#8c8fa1`** | latte-overlay1 |
| `--sl-color-gray-5` (secondary text) | `#5f6368` | **`#6c6f85`** | latte-subtext0 |
| `--sl-color-gray-6` (strong text) | `#3c4043` | **`#5c5f77`** | latte-subtext1 |
| `--sl-color-black` (headings) | `#202124` | **`#4c4f69`** | latte-text |
| `--sl-color-accent` | `#3465a4` | `#3465a4` (keep) | path-blue |
| `--sl-color-accent-high` | `#204a87` | **`#2855a3`** | path-blue-active |
| `--sl-color-text` | `#202124` | **`#4c4f69`** | latte-text |
| Status success / warning / error | `#4e9a06 / #c4a000 / #cc0000` | **`#40a02b / #df8e1d / #d20f39`** | latte green/yellow/red |

### 4.2 Typography (both modes)

Replace the system-ui stack:

```css
--sl-font:      "Manrope", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
--sl-font-mono: "JetBrains Mono", ui-monospace, "SF Mono", "Menlo", monospace;
```

Load the webfonts (per app). Prefer `@fontsource` for perf, or Google Fonts in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

(`Instrument Serif` is available in the DS for occasional posh display moments — not required here.)

### 4.3 Hardcoded-hex find/replace inside `custom.css` component overrides

```
#f8f9fa → #eff1f5     (page bg)
#f1f3f4 → #e6e9ef     (sidebar/nav)
#e8eaed → #dce0e8     (inline-code / hairline-light)
#dadce0 → #ccd0da     (borders)
#9aa0a6 → #8c8fa1     (muted)
#5f6368 → #6c6f85     (secondary text)
#3c4043 → #5c5f77     (body)
#202124 → #4c4f69     (text/headings)
#1c1917 → #4c4f69     (headings)
#292524 → #4c4f69     (content/sidebar text)
#44403c → #5c5f77     (group labels)
#57534e → #6c6f85     (tagline / icons)
#dropped: --psl-gray-* Stone ramp (remove or remap to Latte equivalents)
```
Card backgrounds may stay `#ffffff` (raised surface) on the `#eff1f5` page; just move borders to
`#ccd0da`. Keep the **Path-Blue header in both modes** — it's on-brand, leave it.

### 4.4 Dark mode (already Mocha — minor alignment only)

Neutrals already match the DS Mocha ramp exactly (`base #1e1e2e`, `text #cdd6f4`, …). Two nits:

- Accent: `--sl-color-accent: #7aa2d6` and `--sl-color-text-accent: #7aa2d6` (DS lightened Path
  Blue), and hero `h1` dark `#89b4fa → #7aa2d6`. (Keeping `#89b4fa` is acceptable Catppuccin, but
  `#7aa2d6` is the DS brand value.)
- In `astro.config.mjs`, set expressiveCode `themes: ["catppuccin-latte", "catppuccin-mocha"]`
  (was `…-frappe`) so code blocks match the DS dark ramp.

---

## 5. Marketing pages — rebuild with DS components

Both pages today are Starlight MDX. In `apps/marketing` they become bespoke `.astro` pages whose
interactive/branded pieces are DS React islands. DS components are global on
`window.BluePSL10KDesignSystem_ff9c76.*` (namespace `BluePSL10KDesignSystem_ff9c76`); mount via
`@astrojs/react` islands or the bundle's global components. Available: `Button`, `Badge`, `Card`,
`PaperButton`, `PaperCard`, `FeatureItem`, `TeamCard`, `ContactForm`, `CommandBox`, `CodeBlock`/`Tok`,
`Swatch`. The DS ships a `design-system/ui_kits/paper-landing/` reference (Netservant company
landing built from the Paper components) — **included in this package** — use its hero/feature/
section rhythm as the marketing layout reference. Component sources, `.d.ts` types, and per-
component `.prompt.md` usage notes are all in `design-system/components/`.

### 5.1 `index.astro` (homepage)

- **Hero** — `logo-symbol-blue.svg` (light) / `logo-symbol.svg` (dark), H1 **"Declare your Mac"**,
  tagline **"Your Mac, your rules. JSON-powered, no MDM excuses."**, two CTAs:
  `Get Started` → docs `/getting-started/installation/` (`PaperButton`/`Button` primary),
  `Get macprefs Pro` → `/pricing` (secondary). Manrope, Path-Blue H1.
- **"Why macprefs?"** — 6 cards (`FeatureItem` or `PaperCard`), one Latte accent each:
  *JSON Config, Drift Detection, Instant Rollback, Fast & Native, No Elevation, CI/CD Ready (Pro)*.
  Copy is in `design-references/source-content/index.mdx`.
- **"See it in action"** — 4 link cards → `/docs/examples/{dock,finder,keyboard,workflows}`.
- **Tier table** — Free `$0 forever` vs Pro `$39 one-time`; Pro "Buy Now" → Lemon Squeezy
  checkout `https://shop.macprefs.app/checkout/buy/000a6a3d-ae40-453e-8efe-e620a0d603c8`
  (keep `.lemonsqueezy-button` + `lemon.js`). Use `Badge tone="accent"` for "Pro",
  `Badge tone="info"` for "🔜 Coming Soon".
- **Quick install** — `CommandBox` with `brew install jmcombs/macprefs/macprefs`.

### 5.2 `pricing.astro`

- Intro, then **feature-comparison table** (Free / Pro), same checkout button.
- **"Why upgrade to Pro?"** — 4 `FeatureItem`/`Card`: CI/CD Automation, Machine-Readable Output,
  Precise Rollback, Smart Drift Detection.
- **"How licensing works"** — numbered steps; the activation command in a `CommandBox`
  (`macprefs license activate --key <your-license-key>`).
- **FAQ** — 6 Q&As (verbatim copy in `design-references/source-content/pricing.mdx`).

Map: CTAs → `PaperButton`/`Button`; feature grids → `FeatureItem`/`PaperCard`; commands →
`CommandBox`; tiers/labels → `Card` + `Badge`. Keep all existing copy and links exactly.

---

## 6. App icon — finalized + wiring

**Option B "Liquid Glass toggle"**, adaptive. Construction (see
`design-references/Macprefs App Icon - Final (Option B).dc.html`):

- **Squircle** 22.37% continuous-corner radius.
- **Dark appearance**: 160° Path-Blue glass gradient `#5b8ad0 → #3465a4 → #28518a`, top-left
  specular; **white** `NSSwitch` (knob right/on); **white @e** mark, ©-sized, 7% inset lower-right.
- **Light appearance**: light glass `#fdfdff → #e9edf4`; **Path-Blue** `#3465a4` switch; **blue
  @e**. Same composition, tonally adapted (not inverted).
- The **@e** is the Netservant maker's mark at copyright size; it drops below 128px.

### 6.1 Exported assets (`assets/macprefs-icon/` — ship directly)

Dark/primary: `icon-1024/512/256/128/64/32/16.png`, `apple-touch-icon-180.png`,
`favicon-32.png`, `favicon-16.png`.
Light: same names with `-light` (`icon-light-1024…16`, `apple-touch-icon-light-180`,
`favicon-light-32/16`).

### 6.2 Web favicons (adaptive via `prefers-color-scheme`)

Replace the favicon `<link>`s (Starlight `head` array in `apps/docs/astro.config.mjs`, and the
marketing `BaseLayout` head). Put the light files under each app's `public/`:

```html
<link rel="icon" href="/favicon-light-32.png" type="image/png" sizes="32x32" media="(prefers-color-scheme: light)">
<link rel="icon" href="/favicon-32.png"       type="image/png" sizes="32x32" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon-light-16.png" type="image/png" sizes="16x16" media="(prefers-color-scheme: light)">
<link rel="icon" href="/favicon-16.png"       type="image/png" sizes="16x16" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32"> <!-- default fallback -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

Update `site.webmanifest` icons to the new PNGs; keep `theme-color #3465a4`.

### 6.3 macOS GUI app `.icns`

Build the iconset from the exported masters, then `iconutil`:

```
macprefs.iconset/
  icon_16x16.png      ← icon-16.png        icon_16x16@2x.png    ← icon-32.png
  icon_32x32.png      ← icon-32.png        icon_32x32@2x.png    ← icon-64.png
  icon_128x128.png    ← icon-128.png       icon_128x128@2x.png  ← icon-256.png
  icon_256x256.png    ← icon-256.png       icon_256x256@2x.png  ← icon-512.png
  icon_512x512.png    ← icon-512.png       icon_512x512@2x.png  ← icon-1024.png
```
```bash
iconutil -c icns macprefs.iconset -o macprefs.icns
```

For an **appearance-aware** (light/dark) macOS 26 app icon, supply both masters
(`icon-1024.png` dark, `icon-light-1024.png` light) to **Icon Composer** (`.icon`) or an
`Assets.xcassets` App Icon set with light/dark appearance variants.

---

## 7. Design tokens (reference)

**Colors** — full set in `design-system/tokens/colors.css` (included in this package). Key values:

- Path Blue `#3465a4` · active `#2855a3` · soft `#5a85c2` · dark-mode accent `#7aa2d6`
- Latte neutrals: base `#eff1f5` · mantle `#e6e9ef` · crust `#dce0e8` · surface0 `#ccd0da` ·
  overlay1 `#8c8fa1` · subtext0 `#6c6f85` · subtext1 `#5c5f77` · text `#4c4f69`
- Mocha neutrals (dark): base `#1e1e2e` · mantle `#181825` · crust `#11111b` · text `#cdd6f4`
- Status: success `#40a02b` · warning `#df8e1d` · error `#d20f39` · info `#179299`
- Icon gradient (dark): `#5b8ad0 → #3465a4 → #28518a`; (light): `#fdfdff → #e9edf4`

**Type** — Manrope (UI/marketing/body), JetBrains Mono (code/paths/version numbers),
Instrument Serif (optional display). Scale (`tokens/typography.css`): 12 / 13 / 15 / 17 / 20 /
25 / 32 / 42 / 56 / 76 px. Weights 400–800. Tracking: tight `-0.02em`, caps eyebrows `0.12em`.

**Spacing / radius / shadow** — 4px base; chrome radius 4–6px, paper card radius 16px, pills full;
soft cool low-opacity shadows. See `tokens/spacing.css`.

---

## 8. Assets in this package

- `assets/macprefs-icon/*.png` — **production** app-icon + favicon set (light + dark, all sizes).
- `netservant-starlight-theme.css` — **drop-in** light/dark token diff for `apps/docs`.
- `design-references/Macprefs App Icon - Final (Option B).dc.html` — icon spec sheet (construction,
  sizes, dock contexts, favicon, manifest).
- `design-references/Macprefs Icon - Three Directions.dc.html` — the A/B/C exploration (context).
- `design-references/Macprefs Home - Before & After.dc.html` — the original homepage reskin study.
- `design-references/source-content/{index.mdx,pricing.mdx}` — verbatim copy for the rebuilt
  marketing pages.

- `design-system/` — **the complete Netservant Design System source tree**, included in this
  package: `_ds_bundle.js` (React components), `styles.css`, `tokens/*.css`,
  `components/{core,paper,brand,code}/` (`.jsx` sources + `.d.ts` + `.prompt.md` + `.card.html`),
  `ui_kits/paper-landing/`, `guidelines/*.card.html`, `assets/`, `Netservant Logo.html`,
  `SKILL.md`, `_ds_manifest.json`, `_adherence.oxlintrc.json`, `readme.md`. Copy into
  `packages/design-system` (§2.3).

The DS components are global on `window.BluePSL10KDesignSystem_ff9c76.*`; mount via `@astrojs/react`
islands or the bundle's global components.

## 9. Suggested sequence

1. Restructure repo → monorepo (pnpm + Turborepo); move docs content + transform scripts +
   workflow into `apps/docs`; stand up `packages/design-system`.
2. Apply `netservant-starlight-theme.css` + font loading to `apps/docs`; remap hardcoded hex;
   align dark accent + expressiveCode. Verify all docs pages light **and** dark.
3. Build `apps/marketing` (`index.astro`, `pricing.astro`) with DS components; wire Lemon Squeezy.
4. Drop in the adaptive favicons + webmanifest; build the `.icns` for the GUI app.
5. Configure two Vercel projects (apex + docs subdomain/path); confirm the docs-sync workflow
   still targets `apps/docs`.
