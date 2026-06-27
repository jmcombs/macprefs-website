/**
 * mdx-safety.mjs — proves the CLI docs transform emits MDX that actually compiles.
 *
 * Run with the tsx loader so the TypeScript transform/helpers resolve:
 *   node --import tsx scripts/__tests__/mdx-safety.mjs
 * (wired as `npm run test:mdx-safety`).
 *
 * It uses `@mdx-js/mdx`'s `compile` — the exact parser Astro/Starlight drives via
 * `@mdx-js/rollup`, the layer that produced the original
 * "Expected a closing tag for `<input>`" build failure (issue #31). A passing
 * compile here is real proof, not "looks fixed".
 *
 * Checks:
 *   1. Transform an adversarial fixture CLI.json (chars: < > { } | and a backtick)
 *      and compile the output.
 *   2. Compile the committed, regenerated reference/cli.mdx.
 *   3. Compile the committed reference/configuration.mdx (same exposure class).
 *   4. Assert the fixture output neutralized control chars in prose, while
 *      authored aside markdown (backticked inline code) was left intact.
 *   5. Unit-assert the escape helpers directly (covers the overview path too).
 */

import { compile } from '@mdx-js/mdx';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeMdxText, escapeMdxTableCell } from '../helpers/cli-helpers.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

let failures = 0;
const pass = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => { console.error(`  ✗ ${msg}`); failures++; };

function assert(cond, msg) {
  if (cond) pass(msg);
  else fail(msg);
}

async function expectCompiles(label, source) {
  try {
    await compile(source);
    pass(`${label} compiles via @mdx-js/mdx`);
  } catch (err) {
    fail(`${label} FAILED to compile: ${err && err.message ? err.message : err}`);
  }
}

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

// --- 2 & 3. Committed MDX artifacts ----------------------------------------
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

// --- 4. Helper unit contract (covers overview / argument / exit-code prose) -
console.log('\n[3] Escape-helper unit contract');
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
