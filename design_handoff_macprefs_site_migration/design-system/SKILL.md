---
name: netservant-design
description: Use this skill to generate well-branded interfaces and assets for Netservant, LLC — an IT / managed-network services company. Its visual foundation is the Netservant palette (Catppuccin Latte base, signature Path Blue #3465a4) and the modernized Netservant @e wordmark. Contains design guidelines, colors, type, fonts, logo assets, components, and full UI kits for prototyping marketing pages, product UI, editor/terminal mocks, docs, and decks.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, marketing pages, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view — link `styles.css` for tokens, reuse the components in `components/**`, and the full surfaces in `ui_kits/**`. If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

Key things to honor:
- **Identity:** the **Netservant** wordmark — retro @-as-"e" mark (`Net` dark + `servant` slate, two-tone, one word), tagline *"How may we help you?"*. Logo assets: `assets/netservant-e.png` (mark), `assets/netservant-e-white.png` (mark, white), `assets/netservant-icon-512.png` (app icon). Source/spec: `Netservant Logo.html`.
- **Path Blue `#3465a4`** is the one signature accent — the @e mark, primary buttons, focus rings, links.
- Light theme always; Catppuccin Latte pastels (Netservant); flat surfaces, 1px borders, soft shadows — no gradients/photography/textures. Paper Kit "paper" shapes (rounded pills, soft cards) are available for marketing surfaces.
- Mono-forward type (JetBrains Mono); Manrope for UI; Instrument Serif for posh display moments.
- Iconography is **codicons** (VS Code's icon font) for UI; Nerd Font glyphs for real terminal prompts.
- Voice: professional, warm, service-first — *"How may we help you?"*.

Netservant is the **color foundation / developer theme** Netservant authored and uses — not the company name. When in doubt, the brand is **Netservant**.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask a few clarifying questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
