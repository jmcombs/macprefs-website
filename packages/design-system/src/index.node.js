// Node-only smoke entry for @macprefs/design-system.
//
// Raw `.jsx` source (Locked Decision D3) is not loadable by plain Node — Node has
// no `.jsx` extension handler. Apps consume the clean static barrel `./index.js`
// through Astro/Vite's JSX transform. This entry exists solely so the package is
// importable under bare `node` (the Phase 2 "Barrel exports" Testing Gate): it
// registers the repo's `tsx` ESM loader (already a devDependency) to transform JSX
// on the fly, then re-exports the same 12 components as the static barrel.
//
// It is reached only via the `node-addons` export condition, which bare Node sets
// by default but Astro/Vite do not — so the app build path never loads this file.
// See docs/decisions/0002-design-system-node-smoke-entry.md.
import { register } from 'tsx/esm/api';

register();

const core = await import('../components/core/Button.jsx');
const badge = await import('../components/core/Badge.jsx');
const card = await import('../components/core/Card.jsx');
const paperButton = await import('../components/paper/PaperButton.jsx');
const paperCard = await import('../components/paper/PaperCard.jsx');
const featureItem = await import('../components/paper/FeatureItem.jsx');
const teamCard = await import('../components/paper/TeamCard.jsx');
const contactForm = await import('../components/paper/ContactForm.jsx');
const commandBox = await import('../components/code/CommandBox.jsx');
const codeBlock = await import('../components/code/CodeBlock.jsx');
const swatch = await import('../components/brand/Swatch.jsx');

export const Button = core.Button;
export const Badge = badge.Badge;
export const Card = card.Card;
export const PaperButton = paperButton.PaperButton;
export const PaperCard = paperCard.PaperCard;
export const FeatureItem = featureItem.FeatureItem;
export const TeamCard = teamCard.TeamCard;
export const ContactForm = contactForm.ContactForm;
export const CommandBox = commandBox.CommandBox;
export const CodeBlock = codeBlock.CodeBlock;
export const Tok = codeBlock.Tok;
export const Swatch = swatch.Swatch;
