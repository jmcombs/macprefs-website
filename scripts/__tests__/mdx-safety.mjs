/**
 * mdx-safety.mjs — proves the CLI docs transform emits MDX that actually compiles.
 *
 * Run with the tsx loader so the TypeScript transform/helpers resolve:
 *   node --import tsx scripts/__tests__/mdx-safety.mjs
 * (wired as `npm run test:mdx-safety`).
 *
 * It compiles with `@mdx-js/mdx` + `remark-gfm` — matching the real Astro/Starlight
 * pipeline (`@mdx-js/rollup` with `markdown.gfm` on by default), the exact layer that
 * produced the original "Expected a closing tag for `<input>`" build failure (#31).
 * GFM is what makes `| ... |` rows behave as tables, so it is required to validate the
 * table-cell `|`→`\|` escaping with real semantics rather than as a substring.
 *
 * Checks:
 *   0. Negative control — a known-bad bare `<input>` in a table cell MUST be rejected
 *      by the compiler (proves the harness is meaningful, not vacuous).
 *   1. Transform an adversarial fixture CLI.json (chars: < > { } | and a backtick)
 *      and compile the output.
 *   2. Compile the committed, regenerated reference/cli.mdx + configuration.mdx.
 *   3. Assert real GFM table semantics: escaped `\|` stays one intact cell; an
 *      unescaped `|` corrupts the cell.
 *   4. Unit-assert the escape helpers directly (covers the overview path too), incl.
 *      an overview-style prose doc that compiles.
 */

import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeMdxText, escapeMdxTableCell } from '../helpers/cli-helpers.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

// GFM on by default in Astro/Starlight — compile with it on every call.
const MDX_OPTS = { remarkPlugins: [remarkGfm] };

let failures = 0;
const pass = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => { console.error(`  ✗ ${msg}`); failures++; };

function assert(cond, msg) {
  if (cond) pass(msg);
  else fail(msg);
}

async function expectCompiles(label, source) {
  try {
    await compile(source, MDX_OPTS);
    pass(`${label} compiles via @mdx-js/mdx + remark-gfm`);
  } catch (err) {
    fail(`${label} FAILED to compile: ${err && err.message ? err.message : err}`);
  }
}

async function expectThrows(label, source) {
  try {
    await compile(source, MDX_OPTS);
    fail(`${label} UNEXPECTEDLY compiled (negative control did not fire)`);
  } catch (err) {
    pass(`${label} correctly rejected: ${String(err && err.message).split('\n')[0]}`);
  }
}

// Compile a one-row, two-column GFM table and return the rendered `<td>` count.
async function tableCellCount(descriptionCell) {
  const src = `| Flag | Description |\n|------|-------------|\n| \`x\` | ${descriptionCell} |\n`;
  const out = String(await compile(src, MDX_OPTS));
  return { tds: (out.match(/_components\.td/g) || []).length, out };
}

// --- 0. Negative control ----------------------------------------------------
console.log('\n[0] Negative control — bad MDX must be rejected');
// This is exactly the shape that broke the build before the fix (issue #31):
// a bare `<input>` (outside backticks) in a GFM table cell.
await expectThrows(
  'bare `<input>` in a table cell',
  '| Flag | Description |\n|------|-------------|\n| `-o, --output <o>` | default: <input>.x |\n'
);

// --- 1. Transform the adversarial fixture ----------------------------------
console.log('\n[1] Adversarial fixture transform + compile');
const fixture = path.join(__dirname, '..', '__fixtures__', 'cli-adversarial.json');
const tmpOut = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mdx-safety-')), 'fixture.mdx');
const run = spawnSync(
  process.execPath,
  ['--import', 'tsx', path.join(repoRoot, 'scripts', 'transform-cli-docs.ts'), fixture, tmpOut],
  { encoding: 'utf8' }
);
if (run.status !== 0) {
  fail(`transform on fixture exited ${run.status}: ${run.stderr}`);
} else {
  pass('transform ran on adversarial fixture');
  const fixtureMdx = fs.readFileSync(tmpOut, 'utf8');
  await expectCompiles('fixture output', fixtureMdx);

  // Control chars in prose must be neutralized to entities.
  assert(fixtureMdx.includes('&lt;input&gt;.filtered.json'),
    'flag description: `<input>` escaped to entities in table cell');
  assert(fixtureMdx.includes('table\\|json'),
    'flag description: table-cell `|` escaped to `\\|`');
  assert(/&#123;.*&#125;/.test(fixtureMdx),
    'curly braces `{ }` escaped to entities');
  assert(!/\(default: <input>/.test(fixtureMdx),
    'no bare `<input>` survives in descriptions');

  // Authored aside markdown (from cli-enrichments.json) must be left intact.
  assert(fixtureMdx.includes('`--filter` and `--verbose` are mutually exclusive.'),
    'authored aside keeps its literal backticked inline code (not escaped)');
}

// --- 2. Committed MDX artifacts --------------------------------------------
console.log('\n[2] Committed MDX artifacts compile');
const committed = [
  'src/content/docs/reference/cli.mdx',
  'src/content/docs/reference/configuration.mdx',
];
for (const rel of committed) {
  const abs = path.join(repoRoot, rel);
  if (!fs.existsSync(abs)) { fail(`${rel} missing`); continue; }
  await expectCompiles(rel, fs.readFileSync(abs, 'utf8'));
}

// Regenerated cli.mdx must no longer carry bare `<...>` in flag descriptions.
const cliMdx = fs.readFileSync(path.join(repoRoot, 'src/content/docs/reference/cli.mdx'), 'utf8');
assert(!/\(default: <input>/.test(cliMdx),
  'committed cli.mdx: no bare `<input>` in descriptions');
assert(!/\(table\|json\)/.test(cliMdx),
  'committed cli.mdx: no unescaped `(table|json)` in table cells');

// --- 3. Real GFM table semantics for `|` escaping --------------------------
console.log('\n[3] GFM table-cell `|` semantics');
{
  // Escaped `\|`: the row stays 2 cells and the pipe text survives intact in cell 2.
  const esc = await tableCellCount(escapeMdxTableCell('Output format (table|json)'));
  assert(esc.tds === 2,
    `escaped \\| keeps a 2-column row (got ${esc.tds} cells)`);
  assert(esc.out.includes('table|json'),
    'escaped \\| renders the literal `table|json` intact in one cell');

  // Unescaped `|`: GFM treats it as a column delimiter, corrupting the cell —
  // the intact "table|json" no longer exists (content split/dropped).
  const raw = await tableCellCount('Output format (table|json)');
  assert(!raw.out.includes('table|json'),
    'unescaped | corrupts the cell — literal `table|json` is lost (why escaping is needed)');
}

// --- 4. Helper unit contract (covers overview / argument / exit-code prose) -
console.log('\n[4] Escape-helper unit contract');
assert(escapeMdxText('a <x> {y} b') === 'a &lt;x&gt; &#123;y&#125; b',
  'escapeMdxText neutralizes < > { }');
assert(escapeMdxText('a|b') === 'a|b',
  'escapeMdxText leaves `|` untouched (non-table prose)');
assert(escapeMdxText('keep `code` spans') === 'keep `code` spans',
  'escapeMdxText leaves backticks untouched');
assert(escapeMdxTableCell('table|json <x>') === 'table\\|json &lt;x&gt;',
  'escapeMdxTableCell additionally escapes `|`');
assert(escapeMdxText(null) === '' && escapeMdxText(undefined) === '',
  'escapeMdxText is null/undefined safe');
// An overview-style block-prose document built from the helper must compile.
await expectCompiles('overview-style prose via escapeMdxText',
  `# Title\n\n${escapeMdxText('Overview with <ph>, {brace}, a|b and a `code` span.')}\n`);

// --- Result ----------------------------------------------------------------
console.log('');
if (failures > 0) {
  console.error(`MDX safety: ${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('MDX safety: all checks passed');
