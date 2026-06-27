// Node-only smoke entry for @macprefs/design-system.
// Raw `.jsx` (D3) isn't loadable by bare `node`. This entry registers the repo's
// `tsx` ESM loader, then delegates to the literal app-facing barrel `./index.js`
// so the Phase 2 "Barrel exports" gate exercises the REAL barrel (not a copy).
// Reached only via the `node-addons` export condition; Astro/Vite use `default`
// → raw `./index.js`. See docs/decisions/0002-design-system-node-smoke-entry.md.
//
// `./index.js` is loaded via dynamic `import()` *after* `register()`, not a static
// `export *`: a static re-export is linked during instantiation — before this
// module's body (the `register()` call) runs — so the raw `.jsx` would resolve
// before the `tsx` loader exists. The dynamic import defers loading until the
// loader is registered. The barrel remains the single source of truth: every
// component binding flows through `./index.js`; this file imports no component.
import { register } from 'tsx/esm/api';

register();

export const {
  Button,
  Badge,
  Card,
  PaperButton,
  PaperCard,
  FeatureItem,
  TeamCard,
  ContactForm,
  CommandBox,
  CodeBlock,
  Tok,
  Swatch,
} = await import('./index.js');
