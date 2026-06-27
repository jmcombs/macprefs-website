# ADR 0003 — Make the docs-sync CLI transform emit MDX-safe output

- **Status:** Accepted
- **Phase:** 3 (prerequisite — fixes a live bug blocking the Phase 3 docs build gate)
- **Kind:** Bug fix (deviation from Locked Decision D5 "docs-sync scripts move unchanged")

## Decision

The docs-sync transform behavior is changed (not merely retargeted): the CLI transform now
**escapes MDX-control characters in plain-prose fields** before rendering them into the MDX body.
This deviates from Locked Decision **D5** ("Preserve behavior; only retarget paths"), which assumed
the `scripts/transform-*.ts` would move into `apps/docs` byte-for-byte. Per issue #31 the existing
transform emits invalid MDX, so "preserve behavior" would preserve a build-breaking defect; the
transform's actual contract is "convert arbitrary `CLI.json` text into **valid** Starlight MDX", and
that contract must be honored.

### What changed

- **`scripts/helpers/cli-helpers.ts`** — added two pure helpers (and registered them as Handlebars
  helpers), leaving the pre-existing `escapeForMdx` (backtick-only, used for code contexts) untouched:
  - `escapeMdxText(content)` — `<`→`&lt;`, `>`→`&gt;`, `{`→`&#123;`, `}`→`&#125;` (HTML entities, so
    the text renders as the literal character). Deliberately does **not** touch backticks.
  - `escapeMdxTableCell(content)` — `escapeMdxText` plus `|`→`\|` for GFM table cells.
- **`scripts/templates/partials/flags-table.hbs`** — flag `description` → `escapeMdxTableCell`.
- **`scripts/templates/partials/command.hbs`** — command `overview`, argument `description`, and
  exit-code description → `escapeMdxText`.
- **`src/content/docs/reference/cli.mdx`** — regenerated from the current upstream
  `jmcombs/macprefs` `docs/CLI.json` so the committed artifact is faithful to the fixed transform.
- **`scripts/__fixtures__/cli-adversarial.json`** + **`scripts/__tests__/mdx-safety.mjs`** +
  root devDependency `@mdx-js/mdx` and `npm run test:mdx-safety` — the proof harness.

### Field-aware rationale (which fields are escaped vs. left raw, and why)

Escaping is applied **only** to plain CLI/enrichment **prose** rendered into the MDX body:

| Field (template) | Treatment | Why |
|---|---|---|
| flag `description` (`flags-table.hbs`) | `escapeMdxTableCell` | plain CLI prose in a GFM table cell; needs `<>{}` **and** `\|` |
| command `overview` (`command.hbs`) | `escapeMdxText` | block prose (enriched or CLI); needs `<>{}` |
| argument `description` (`command.hbs`) | `escapeMdxText` | block prose in a list item |
| exit-code description (`command.hbs`) | `escapeMdxText` | block prose in a list item |

Deliberately **left raw** (escaping would corrupt them):

- **`aside.content`** (`command.hbs`) — authored in `scripts/cli-enrichments.json` and **intentionally
  contains backticked inline code / Markdown** (e.g. the `plan` aside ``"`--filter` and `--verbose`
  are mutually exclusive."``). It is authored MDX, not CLI prose; escaping would mangle real markup.
- **`usage`** (`command.hbs`) — rendered inside a ```` ```bash ```` code fence, where MDX does not
  parse JSX/expressions, so `<output>` etc. are already literal.
- Backtick-wrapped tokens — `formatFlag` output, `### \`{name}\``, `` `<argument>` ``, `codeList`
  subcommands, `` `exitCode` `` keys — already inline code, hence MDX-safe.
- **`configuration.hbs` `{{{body}}}`** and the migration transform output — already-transformed,
  authored Markdown/MDX (same class as asides); blanket-escaping would corrupt them. The committed
  `reference/configuration.mdx` is verified to compile by the safety test, and contains no bare
  `<...>` exposure today.

Backticks are intentionally **not** escaped by `escapeMdxText`: prose overviews legitimately use
inline code, and a stray unmatched backtick is harmless to MDX compilation.

## Impact

- **Files:** see "What changed" above. The `escapeForMdx` helper and its (currently unused) helper
  registration are unchanged — no regression to existing callers.
- **New gate:** `npm run test:mdx-safety` compiles the adversarial-fixture output, the regenerated
  `cli.mdx`, and `configuration.mdx` with `@mdx-js/mdx` (the exact parser Astro drives via
  `@mdx-js/rollup`). A negative control confirms `compile()` still rejects the original bare
  `<input>` — i.e. the test is meaningful, not vacuous.
- **Recurrence:** because the fix lives in the transform (not a one-off `cli.mdx` patch), every future
  docs-sync run now emits MDX-safe output. Closes #31.
- **Follow-on phases:** Phase 3 moves these scripts/templates into `apps/docs/` carrying this fix;
  the migration is a path change only. Phase 3's build gate can now pass on intact content.
- **PLAN.md:** Appendix B updated with a row for this ADR.
- **Upstream:** no `jmcombs/macprefs` change made — emitting `<input>` placeholders in CLI help is a
  legitimate convention; MDX-safety is correctly owned by this repo's transform.
