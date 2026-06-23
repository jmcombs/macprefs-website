# Paper Kit Landing — UI Kit

A pastel marketing landing that **blends Paper Kit 2 PRO's layout & "paper" shapes with the Blue PSL 10K palette and fonts** (per the license held by the project owner). Paper Kit contributes the *structure* — full-bleed photo hero, rounded pill buttons, soft paper cards, feature row, team cards, contact form; Blue PSL 10K contributes the *brand* — Catppuccin Latte pastels, Path Blue, JetBrains Mono / Space Grotesk / Instrument Serif.

## Sections (from the Paper Kit landing example)
- **Hero** — full-bleed pastel placeholder + dark overlay, big serif title, two pill buttons
- **Let's talk product** — image + copy + outline CTA
- **Features** — four `FeatureItem`s in pastel-tinted `PaperCard`s
- **Team** — three `TeamCard`s with avatar placeholders + quotes + socials
- **Keep in touch** — `ContactForm` on a tinted band
- **Footer**

## Built from these components
`PaperButton`, `PaperCard`, `FeatureItem`, `TeamCard`, `ContactForm` (all in `components/paper/`).

## Files
- `index.html` — mounts `PaperLanding`
- `paper-landing.jsx` — all sections
- `placeholders.jsx` — `Photo` / `Avatar` (tasteful "sugar-paper pastel" gradient placeholders, no external photos)

## Assets & substitutions
- **Photos are pastel-gradient placeholders**, not stock images — abstract Catppuccin "sugar-paper" art generated from the palette. Swap in real photography by replacing the `<Photo>` / `<Avatar>` nodes.
- **Icons** use VS Code **codicons** (CDN) in place of Paper Kit's licensed Nucleo icon set.
- **Type** is the Blue PSL 10K stack (Paper Kit ships Montserrat).
- This is a brand-aligned *re-creation* of Paper Kit's layout patterns, not a copy of Creative Tim's proprietary stylesheet. To use Paper Kit's own CSS/assets, import the licensed package into the project and link it here.
