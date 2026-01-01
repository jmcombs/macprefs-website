# macprefs.app Website Implementation Plan

**Version**: 1.0  
**Created**: 2026-01-01  
**Status**: Ready for Implementation  
**Domain**: macprefs.app

---

## Executive Summary

This document provides a complete, self-contained implementation plan for the macprefs public website. It is designed to be imported into a new Augment chat session in the website repository for immediate implementation without requiring context from prior conversations.

### Product Context

**macprefs** is a declarative macOS preferences management CLI tool that:
- Manages macOS `defaults` via JSON configuration files
- Provides plan/apply/rollback workflow (like Terraform for preferences)
- Targets power users, fleet admins, and CI/CD engineers
- Uses tiered licensing: Free (Apple domains) and Pro ($39 one-time, all domains + CI features)

### Website Goals

1. **Soft launch** - Documentation and marketing pages (no download/purchase yet)
2. **Establish credibility** - Professional presence for Lemon Squeezy store approval
3. **Educate users** - Clear documentation for the CLI tool
4. **Position product** - Differentiate from nix-darwin and MDM solutions

---

## Technical Specifications

### Confirmed Requirements

| Requirement   | Value                                |
| ------------- | ------------------------------------ |
| Domain        | `macprefs.app`                       |
| Hosting       | GitHub Pages                         |
| Framework     | Astro 4.x + Starlight                |
| Styling       | Tailwind CSS 4.x                     |
| Default Theme | **Light mode** (dark mode supported) |
| Analytics     | None (deferred)                      |
| Pricing       | Pro: $39 one-time                    |
| Enterprise    | Excluded from v1                     |
| Download      | Excluded from soft launch            |

### Repository

| Setting        | Value                                         |
| -------------- | --------------------------------------------- |
| **Name**       | `macprefs-website`                            |
| **Visibility** | Public                                        |
| **Owner**      | jmcombs                                       |
| **URL**        | `https://github.com/jmcombs/macprefs-website` |
| **Pages URL**  | `https://macprefs.app` (after DNS setup)      |

**Why `macprefs-website`:**
- Clear purpose (not just docs)
- Separates website from closed-source CLI repo
- Standard naming convention (`{product}-website`)

---

## Brand & Design System

### Taglines

| Usage                      | Text                                                  |
| -------------------------- | ----------------------------------------------------- |
| **Primary (Hero)**         | "Declare your Mac."                                   |
| **Secondary (Subheading)** | "Your Mac, your rules. JSON-powered, no MDM excuses." |
| **Short (Social/Meta)**    | "Declarative macOS preferences manager"               |

### Color Palette

```css
/* Tailwind config values */
:root {
  --color-primary: #0066FF;      /* Blue from logo bracket */
  --color-primary-dark: #0052CC;
  --color-dark: #1a1a1a;          /* Logo gear color */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-600: #4b5563;
  --color-gray-900: #111827;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-code-bg: #1e293b;
}
```

### Typography

| Element  | Font Stack                                                                   | Weight  |
| -------- | ---------------------------------------------------------------------------- | ------- |
| Headings | `system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif` | 600-700 |
| Body     | `system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif`    | 400     |
| Code     | `'SF Mono', ui-monospace, 'JetBrains Mono', monospace`                       | 400     |

### Design Principles

1. **Light mode default** - Clean, professional, Apple-like
2. **Developer-focused** - Abundant code examples, syntax highlighting
3. **High information density** - Power users expect efficiency
4. **macOS-native feel** - System fonts, subtle shadows, Apple HIG spacing

---

## Logo & Asset Requirements

### Required Logo Formats

The current PNG logo must be converted to the following formats and sizes:

| Asset                  | Format | Dimensions          | Usage                       |
| ---------------------- | ------ | ------------------- | --------------------------- |
| `logo.svg`             | SVG    | Vector              | Primary logo (scalable)     |
| `logo-full.svg`        | SVG    | Vector              | Logo + wordmark horizontal  |
| `logo-dark.svg`        | SVG    | Vector              | For dark backgrounds        |
| `favicon.ico`          | ICO    | 16x16, 32x32, 48x48 | Browser favicon             |
| `favicon.svg`          | SVG    | Vector              | Modern browsers             |
| `apple-touch-icon.png` | PNG    | 180x180             | iOS home screen             |
| `icon-192.png`         | PNG    | 192x192             | PWA/Android                 |
| `icon-512.png`         | PNG    | 512x512             | PWA/Android                 |
| `og-image.png`         | PNG    | 1200x630            | Social sharing (Open Graph) |
| `twitter-card.png`     | PNG    | 1200x600            | Twitter cards               |

### Logo Conversion Tasks

1. **Trace PNG to SVG** using Adobe Illustrator, Figma, or Vectorizer.ai
2. **Create favicon variants** - Simplified gear icon only (no brackets for small sizes)
3. **Generate OG image** - Logo centered on light background with tagline
4. **Create dark variant** - White/light version for dark backgrounds

### Asset Directory Structure

```text
public/
├── favicon.ico
├── favicon.svg
├── apple-touch-icon.png
├── icon-192.png
├── icon-512.png
├── og-image.png
├── twitter-card.png
└── images/
    ├── logo.svg
    ├── logo-full.svg
    ├── logo-dark.svg
    └── hero-terminal.png
```

---

## Site Architecture

### Page Structure

```text
macprefs.app/
├── /                       # Homepage
├── /docs/                  # Documentation (Starlight)
│   ├── /getting-started/
│   │   ├── installation/
│   │   ├── quick-start/
│   │   └── first-config/
│   ├── /guides/
│   │   ├── power-users/
│   │   ├── fleet-management/
│   │   └── ci-cd/
│   ├── /reference/
│   │   ├── cli/
│   │   ├── config-format/
│   │   └── exit-codes/
│   ├── /examples/
│   │   ├── dock/
│   │   ├── finder/
│   │   └── keyboard/
│   └── /troubleshooting/
├── /pricing/               # Pricing page (Free vs Pro)
├── /use-cases/             # Use case landing pages
│   ├── /power-users/
│   ├── /fleet-admins/
│   └── /ci-cd/
└── /changelog/             # Release notes
```

### Navigation Structure

**Header:**

```text
[Logo] Docs | Pricing | Use Cases | GitHub ←→ [Theme Toggle]
```

**Footer:**

```text
macprefs                    Resources              Legal
├── Home                    ├── Documentation      ├── License (Apache 2.0)
├── Pricing                 ├── GitHub             └── Privacy
└── Changelog               ├── Discussions
                            └── Issues
```

---

## Repository Setup Instructions

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Git
- GitHub CLI (`gh`) - optional but recommended

### Step 1: Create GitHub Repository

```bash
# Option A: Using GitHub CLI (recommended)
gh repo create jmcombs/macprefs-website --public --description "macprefs.app website - Declarative macOS preferences manager"

# Option B: Create via GitHub.com
# 1. Go to https://github.com/new
# 2. Repository name: macprefs-website
# 3. Description: macprefs.app website - Declarative macOS preferences manager
# 4. Public repository
# 5. Do NOT initialize with README (we'll create our own)
```

### Step 2: Initialize Local Project

```bash
# Create and enter project directory
mkdir -p ~/Projects/macprefs-website
cd ~/Projects/macprefs-website

# Initialize Astro with Starlight template
npm create astro@latest . -- --template starlight --install --git --typescript strict

# Add Tailwind CSS
npx astro add tailwind --yes

# Add sitemap for SEO
npx astro add sitemap --yes

# Install additional dependencies
npm install @astrojs/check astro-seo
```

### Step 3: Configure Git Remote

```bash
# Initialize git if not already done
git init

# Add remote
git remote add origin https://github.com/jmcombs/macprefs-website.git

# Create main branch
git branch -M main

# Initial commit
git add .
git commit -m "Initial Astro + Starlight setup"

# Push to GitHub
git push -u origin main
```

### Step 4: Enable GitHub Pages

```bash
# Via GitHub CLI
gh repo edit --enable-pages

# Or manually:
# 1. Go to repository Settings > Pages
# 2. Source: GitHub Actions
# 3. Save
```

---

## Project Configuration Files

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://macprefs.app',
  integrations: [
    starlight({
      title: 'macprefs',
      description: 'Declarative macOS preferences manager',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      social: {
        github: 'https://github.com/jmcombs/macprefs',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Installation', link: '/docs/getting-started/installation/' },
            { label: 'Quick Start', link: '/docs/getting-started/quick-start/' },
            { label: 'First Config', link: '/docs/getting-started/first-config/' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Power Users', link: '/docs/guides/power-users/' },
            { label: 'Fleet Management', link: '/docs/guides/fleet-management/' },
            { label: 'CI/CD', link: '/docs/guides/ci-cd/' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
        {
          label: 'Examples',
          autogenerate: { directory: 'examples' },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
      },
    }),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
});
```

### tailwind.config.mjs

```javascript
import starlightPlugin from '@astrojs/starlight-tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066FF',
          dark: '#0052CC',
          light: '#3385FF',
        },
        accent: {
          DEFAULT: '#0066FF',
          dark: '#0052CC',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'sans-serif'],
        mono: ['SF Mono', 'ui-monospace', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [starlightPlugin()],
};
```

### .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Directory Structure

```text
macprefs-website/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── og-image.png
│   └── images/
│       ├── logo.svg
│       ├── logo-full.svg
│       └── logo-dark.svg
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── FeatureGrid.astro
│   │   ├── PricingTable.astro
│   │   ├── CompareTable.astro
│   │   ├── Terminal.astro
│   │   └── Footer.astro
│   ├── content/
│   │   └── docs/
│   │       ├── getting-started/
│   │       │   ├── installation.mdx
│   │       │   ├── quick-start.mdx
│   │       │   └── first-config.mdx
│   │       ├── guides/
│   │       │   ├── power-users.mdx
│   │       │   ├── fleet-management.mdx
│   │       │   └── ci-cd.mdx
│   │       ├── reference/
│   │       │   ├── cli.mdx
│   │       │   ├── config-format.mdx
│   │       │   └── exit-codes.mdx
│   │       ├── examples/
│   │       │   ├── dock.mdx
│   │       │   ├── finder.mdx
│   │       │   └── keyboard.mdx
│   │       └── troubleshooting.mdx
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── pricing.astro
│   │   ├── changelog.astro
│   │   └── use-cases/
│   │       ├── power-users.astro
│   │       ├── fleet-admins.astro
│   │       └── ci-cd.astro
│   └── styles/
│       ├── custom.css
│       └── tailwind.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Implementation Phases

### Phase 1: Project Scaffold (Day 1-2)

| Task | Description                                       | Status |
| ---- | ------------------------------------------------- | ------ |
| 1.1  | Create GitHub repository `macprefs-website`       | ☐      |
| 1.2  | Initialize Astro + Starlight project              | ☐      |
| 1.3  | Add Tailwind CSS integration                      | ☐      |
| 1.4  | Configure `astro.config.mjs`                      | ☐      |
| 1.5  | Create GitHub Actions deploy workflow             | ☐      |
| 1.6  | Set up directory structure                        | ☐      |
| 1.7  | Add placeholder pages (index, pricing, use-cases) | ☐      |
| 1.8  | Verify deployment to GitHub Pages                 | ☐      |

**Deliverable:** Site deploys successfully to `jmcombs.github.io/macprefs-website`

### Phase 2: Logo & Assets (Day 2-3)

| Task | Description                                       | Status |
| ---- | ------------------------------------------------- | ------ |
| 2.1  | Convert PNG logo to SVG (Vectorizer.ai or manual) | ☐      |
| 2.2  | Create simplified favicon (gear icon only)        | ☐      |
| 2.3  | Generate apple-touch-icon and PWA icons           | ☐      |
| 2.4  | Create OG image (1200x630) with logo + tagline    | ☐      |
| 2.5  | Create Twitter card image (1200x600)              | ☐      |
| 2.6  | Create dark mode logo variant                     | ☐      |
| 2.7  | Add all assets to `public/` directory             | ☐      |

**Deliverable:** All brand assets in place, favicon working

### Phase 3: Homepage Design (Day 3-5)

| Task | Description                                       | Status |
| ---- | ------------------------------------------------- | ------ |
| 3.1  | Create Hero component with tagline                | ☐      |
| 3.2  | Create FeatureGrid component (6 tiles)            | ☐      |
| 3.3  | Create Terminal component (animated demo)         | ☐      |
| 3.4  | Create CompareTable component (vs nix-darwin/MDM) | ☐      |
| 3.5  | Create Footer component                           | ☐      |
| 3.6  | Assemble homepage from components                 | ☐      |
| 3.7  | Add SEO meta tags and OG data                     | ☐      |
| 3.8  | Mobile responsive testing                         | ☐      |

**Deliverable:** Complete, polished homepage

### Phase 4: Documentation (Day 5-8)

| Task | Description                                    | Status |
| ---- | ---------------------------------------------- | ------ |
| 4.1  | Migrate CLI.md to `/docs/reference/cli.mdx`    | ☐      |
| 4.2  | Migrate config-examples.md to examples section | ☐      |
| 4.3  | Create installation guide                      | ☐      |
| 4.4  | Create quick-start guide                       | ☐      |
| 4.5  | Create first-config tutorial                   | ☐      |
| 4.6  | Create power-users guide                       | ☐      |
| 4.7  | Create fleet-management guide                  | ☐      |
| 4.8  | Create CI/CD guide                             | ☐      |
| 4.9  | Migrate troubleshooting content                | ☐      |
| 4.10 | Add code syntax highlighting                   | ☐      |
| 4.11 | Add copy buttons to code blocks                | ☐      |
| 4.12 | Configure Starlight search                     | ☐      |

**Deliverable:** Complete documentation site with all guides

### Phase 5: Pricing & Use Cases (Day 8-10)

| Task | Description                                 | Status |
| ---- | ------------------------------------------- | ------ |
| 5.1  | Create PricingTable component (Free vs Pro) | ☐      |
| 5.2  | Build pricing page with feature comparison  | ☐      |
| 5.3  | Add FAQ section to pricing page             | ☐      |
| 5.4  | Create power-users use case page            | ☐      |
| 5.5  | Create fleet-admins use case page           | ☐      |
| 5.6  | Create CI/CD use case page                  | ☐      |
| 5.7  | Add workflow diagrams to use case pages     | ☐      |

**Deliverable:** Complete pricing and use case pages

### Phase 6: Polish & Launch (Day 10-12)

| Task | Description                                     | Status |
| ---- | ----------------------------------------------- | ------ |
| 6.1  | Create changelog page                           | ☐      |
| 6.2  | Final SEO audit (meta, sitemap, robots.txt)     | ☐      |
| 6.3  | Lighthouse performance audit (target: 95+)      | ☐      |
| 6.4  | Cross-browser testing (Safari, Chrome, Firefox) | ☐      |
| 6.5  | Mobile responsive final check                   | ☐      |
| 6.6  | Configure custom domain (macprefs.app)          | ☐      |
| 6.7  | Verify HTTPS and redirects                      | ☐      |
| 6.8  | Final review and soft launch                    | ☐      |

**Deliverable:** Production-ready site live at macprefs.app

---

## Custom Domain Configuration

### DNS Setup for macprefs.app

Add these DNS records at your domain registrar:

| Type  | Name | Value             |
| ----- | ---- | ----------------- |
| A     | @    | 185.199.108.153   |
| A     | @    | 185.199.109.153   |
| A     | @    | 185.199.110.153   |
| A     | @    | 185.199.111.153   |
| CNAME | www  | jmcombs.github.io |

### GitHub Pages Custom Domain

1. Go to repository Settings > Pages
2. Enter custom domain: `macprefs.app`
3. Check "Enforce HTTPS"
4. Wait for DNS verification (up to 24 hours)

### Add CNAME File

Create `public/CNAME` with content:

```text
macprefs.app
```

This ensures the custom domain persists across deployments.

---

## Page Content Specifications

### Homepage Sections

#### 1. Hero Section

```text
┌─────────────────────────────────────────────────────────────┐
│                         [Logo]                              │
│                                                             │
│                   "Declare your Mac."                       │
│                                                             │
│   Your Mac, your rules. JSON-powered, no MDM excuses.       │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ $ brew install jmcombs/macprefs/macprefs             │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                             │
│        [Get Started - Docs]    [View on GitHub]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Feature Grid (6 tiles)

| Icon | Title            | Description                                        |
| ---- | ---------------- | -------------------------------------------------- |
| 📄    | JSON Config      | Single file defines all your preferences           |
| 🔍    | Drift Detection  | See exactly what will change before applying       |
| ⏪    | Instant Rollback | Undo any change with one command                   |
| 🚀    | Fast & Native    | Pure Swift, universal binary, <10s for 100 domains |
| 🔒    | No Elevation     | User-level preferences, no sudo required           |
| 🤖    | CI/CD Ready      | Headless mode for automation (Pro)                 |

#### 3. Comparison Table

| Feature               | macprefs      | nix-darwin   | MDM          | Scripts  |
| --------------------- | ------------- | ------------ | ------------ | -------- |
| Learning curve        | ✅ Minutes     | ❌ Days/Weeks | ❌ Complex    | ⚠️ Varies |
| Configuration format  | JSON          | Nix          | XML Profiles | Bash     |
| Drift detection       | ✅ Built-in    | ⚠️ Partial    | ❌ No         | ❌ Manual |
| Rollback              | ✅ One command | ⚠️ Complex    | ❌ No         | ❌ Manual |
| Infrastructure needed | ✅ None        | ✅ None       | ❌ Server     | ✅ None   |
| Cost                  | Free / $39    | Free         | $$$          | Free     |

### Pricing Page

#### Two-Tier Layout

```text
┌─────────────────────────┐    ┌─────────────────────────┐
│         FREE            │    │          PRO            │
│                         │    │                         │
│          $0             │    │         $39             │
│                         │    │      one-time           │
│  ✅ Apple domains        │    │  ✅ Everything in Free   │
│  ✅ Plan/Apply/Rollback  │    │  ✅ Third-party domains  │
│  ✅ Interactive mode     │    │  ✅ JSON output          │
│  ✅ Table output         │    │  ✅ Headless (--yes)     │
│  ❌ Third-party domains  │    │  ✅ Rollback to any run  │
│  ❌ JSON output          │    │  ✅ CI/CD workflows      │
│  ❌ Headless mode        │    │                         │
│                         │    │                         │
│    [Get Started]        │    │    [Coming Soon]        │
└─────────────────────────┘    └─────────────────────────┘
```

#### Pricing FAQ

1. **Is the Free tier really free forever?** Yes. Apple domain management is free with no time limits.
2. **What are "third-party domains"?** Preferences for non-Apple apps like iTerm2, VS Code, Chrome, etc.
3. **Do I need Pro for personal use?** Only if you want to manage third-party app preferences or use CI/CD automation.
4. **Is Pro a subscription?** No. $39 is a one-time purchase with lifetime access.
5. **Is there a refund policy?** Yes, 30-day money-back guarantee.

---

## Content Migration Map

Map existing docs from macprefs repo to website:

| Source (macprefs repo)     | Destination (website)                    |
| -------------------------- | ---------------------------------------- |
| `docs/CLI.md`              | `/docs/reference/cli.mdx`                |
| `docs/config-examples.md`  | `/docs/examples/*.mdx`                   |
| `docs/licensing.md`        | `/pricing/` (partial)                    |
| `docs/TROUBLESHOOTING.md`  | `/docs/troubleshooting.mdx`              |
| `docs/ROADMAP.md`          | `/changelog/` (partial)                  |
| `README.md`                | `/docs/getting-started/quick-start.mdx`  |
| `docs/HOMEBREW_FORMULA.md` | `/docs/getting-started/installation.mdx` |

---

## SEO Checklist

### Meta Tags (per page)

```html
<title>Page Title | macprefs</title>
<meta name="description" content="Declarative macOS preferences management...">
<meta name="keywords" content="macOS defaults, preferences, declarative config">
<link rel="canonical" href="https://macprefs.app/page/">

<!-- Open Graph -->
<meta property="og:title" content="macprefs - Declare your Mac">
<meta property="og:description" content="...">
<meta property="og:image" content="https://macprefs.app/og-image.png">
<meta property="og:url" content="https://macprefs.app/">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="macprefs - Declare your Mac">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://macprefs.app/twitter-card.png">
```

### Schema.org (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "macprefs",
  "operatingSystem": "macOS",
  "applicationCategory": "DeveloperApplication",
  "offers": [
    {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "name": "Free"
    },
    {
      "@type": "Offer",
      "price": "39",
      "priceCurrency": "USD",
      "name": "Pro"
    }
  ]
}
```

---

## Soft Launch Modifications

Since this is a soft launch without download/purchase functionality:

### Disabled Elements

| Element                      | Replacement                           |
| ---------------------------- | ------------------------------------- |
| Download buttons             | "Coming Soon" badge or link to GitHub |
| Purchase/Upgrade CTAs        | "Coming Soon" or "Join Waitlist"      |
| Lemon Squeezy checkout links | Placeholder text                      |

### Enabled Elements

- Full documentation
- Pricing information (display only)
- Use case pages
- GitHub links
- All marketing content

### Waitlist (Optional)

Consider adding a simple email collection form:

```html
<form action="https://buttondown.email/api/emails/embed-subscribe/macprefs" method="post">
  <input type="email" name="email" placeholder="your@email.com" required>
  <button type="submit">Get Notified</button>
</form>
```

---

## Quick Reference Commands

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run astro check
```

### Deployment

```bash
# Push to trigger deploy
git push origin main

# Check deployment status
gh run list --workflow=deploy.yml
```

---

## Success Criteria

### Phase 1 Complete When

- [ ] Site accessible at `jmcombs.github.io/macprefs-website`
- [ ] All placeholder pages load without errors
- [ ] GitHub Actions deploys successfully on push

### Soft Launch Complete When

- [ ] Site accessible at `macprefs.app`
- [ ] Homepage loads in <2 seconds
- [ ] Lighthouse score >90 for Performance, Accessibility, SEO
- [ ] All documentation pages render correctly
- [ ] Mobile responsive on iOS Safari and Chrome
- [ ] No broken links (verified with crawler)

---

## Appendix: Key Decisions

| Decision        | Choice            | Rationale                             |
| --------------- | ----------------- | ------------------------------------- |
| Framework       | Astro + Starlight | Zero JS default, excellent docs theme |
| Styling         | Tailwind CSS      | Utility-first, rapid development      |
| Hosting         | GitHub Pages      | Free, fast, simple                    |
| Theme default   | Light mode        | Professional, Apple-like              |
| Analytics       | None (initial)    | Privacy-first, Lemon Squeezy approval |
| Enterprise tier | Excluded          | Not implemented in product yet        |
| Downloads       | Disabled          | Soft launch only                      |

---

## Document Version History

| Version | Date       | Changes                     |
| ------- | ---------- | --------------------------- |
| 1.0     | 2026-01-01 | Initial implementation plan |

---

*This document is self-contained and can be used in a new Augment chat session to implement the macprefs.app website without additional context.*
