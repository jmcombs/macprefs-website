# ADR 0002 — design-system node smoke entry for the plain-`node` import gate

- **Status:** Accepted
- **Phase:** 2
- **Kind:** Forced workaround

## Decision
The Phase 2 TODO specifies `packages/design-system/package.json` with an `"exports"` map
exposing `"."` → `./src/index.js`, where `src/index.js` is a barrel that statically
re-exports the 12 raw `.jsx` components. Two small additions are made on top of that literal spec:

1. `"exports"."."` is a **conditional** object rather than a bare string:
   ```json
   ".": { "node-addons": "./src/index.node.js", "default": "./src/index.js" }
   ```
   The `"default"` target is still `./src/index.js` (the literal, app-facing barrel that
   Astro/Vite consume and JSX-transform). A second, node-only entry `src/index.node.js` is
   reached **only** via the `node-addons` condition.
2. `src/index.node.js` registers the repo's existing `tsx` ESM loader (`tsx/esm/api`,
   added as a devDependency) and then **delegates to the literal `./index.js` barrel**: it
   `await import('./index.js')` and re-exports the result, so the barrel remains the single
   source of truth and the gate exercises the real `src/index.js` (not a copy). The smoke entry
   imports no component file of its own. A *dynamic* import is required — a static
   `export * from './index.js'` is linked during instantiation, before the body's `register()`
   runs, so the raw `.jsx` would resolve before the loader exists; the dynamic import defers
   loading until after registration.

## Rationale
Locked Decision **D3** mandates raw `.jsx` source with **no build/bundler step**. Plain Node
has no `.jsx` extension handler, so `import('@macprefs/design-system')` over the static barrel
fails with `Unknown file extension ".jsx"`. The Phase 2 "Barrel exports" Testing Gate
(`node --input-type=module -e "import('@macprefs/design-system').then(m=>console.log(Object.keys(m).length))"`)
runs under **bare `node`**, which therefore cannot load the raw barrel directly — an
irreconcilable conflict between the gate and D3 as written.

`node-addons` is a condition that bare Node sets by default but Astro/Vite do **not** set, so it
cleanly isolates the smoke entry from the app build path: the gate command resolves to
`src/index.node.js`, which delegates to `src/index.js` through `tsx` and yields its 12 exports,
while every app and bundler resolves the unchanged raw barrel `src/index.js` directly. No `dist/`
is produced and the raw-source consumption path (D3) is preserved for Phases 6–8.

## Impact
- **Files added:** `packages/design-system/src/index.node.js`; `tsx` added to the package's
  `devDependencies`. `packages/design-system/src/index.js` remains the literal, app-facing barrel
  and the single source of truth — the smoke entry delegates to it rather than duplicating it.
- **Gates:** unblocks the Phase 2 "Barrel exports" gate (`12`, exit 0); because the count flows
  through `./index.js`, a broken barrel fails the gate (verified). The other three Phase 2 gates
  are unaffected. Verified that the `default`/non-`node-addons` resolution still points at the raw
  `./src/index.js` barrel (i.e. the bundler path is untouched).
- **Follow-on phases:** Phase 6 wiring is unaffected — apps import the `default` raw barrel through
  `@astrojs/react` + Vite, exactly as D3 intends. The node-only entry is never on the app path.
- Appendix B row added below.
