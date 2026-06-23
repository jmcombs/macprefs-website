# Phase Verification Prompt

Copy this prompt and replace every `[N]` with the phase that was just claimed complete. Send it to a
**fresh** agent — not the one that built the phase.

---

You are verifying **Phase [N]** of `PLAN.md` in the `macprefs-website` repo. Assume the completion
claim is **FALSE** until you re-derive it from real command output. Your role is adversarial: poke
holes, then either certify the phase or produce a remediation prompt.

## Hard rules
- **Read-only**, with one exception: on a PASS you tick Phase [N]'s checkboxes in `PLAN.md`. You may
  **not** edit, create, or delete any other file; you may **not** "fix while you're in there."
- You may run builds, the gate commands, `npm run build`, `/run`, and read-only git/inspection.
- Start from a clean tree: `git status --porcelain` must be empty before you begin.

## Step 0 — Read the spec, not the summary
- Read **`PLAN.md`** Phase [N] (Objectives, Architectural Constraints, Actionable TODOs, Testing
  Gates), plus Locked Decisions D1–D7, the Git/PR conventions, and Appendices B & D.
- Read the PR diff: `gh pr diff <PR#>` (or `git diff main...HEAD`).
- Locked Decisions are non-negotiable; a deviation is acceptable **only** if there is a matching ADR
  in `docs/decisions/` referenced from Appendix B.

## Step 1 — Re-run every Testing Gate empirically
For **each** row of Phase [N]'s table: run the exact command, capture real stdout/stderr/exit code,
compare to Expected literally. A gate passes only if the real output matches. **Do not stop at the
first failure** — collect them all.

## Step 2 — Full regression + hygiene
- `npm run build` (root fan-out): every app must still build — a broken predecessor app is a Phase [N]
  regression and a FAIL even if all Phase [N] gates pass.
- Confirm the **docs-sync** workflow is untouched in behavior and still targets `apps/docs` (D5), and
  the `DOCS_SYNC_ISSUE.md` bug was not "fixed" or otherwise disturbed.
- Commit hygiene: inspect `git log` since the predecessor's last commit — Conventional Commits,
  branch↔commit-type symmetry, atomic scope, nothing committed to `main`, no `dist/`/`.astro/` files.

## Step 3 — Audit what the gates do not assert
- **Literal layout:** every file/dir/name in Phase [N]'s TODOs exists at that exact path. Relocations
  or renames without an ADR = FAIL.
- **Locked-Decision compliance:** no `pnpm-workspace.yaml`/`turbo.json` (D1); DS consumed as raw
  source via `@astrojs/react` islands, not the global bundle (D3); web favicons only, no `.icns`/
  `.icon` (D4); workspace names are `@macprefs/*` (D6); Path-Blue header + Latte/Mocha + Manrope/
  JetBrains tokens (D7).
- **Phase-specific behavior** (apply those that exist this phase): DS islands actually hydrate; the
  Stone-gray hex is gone and the Latte/Mocha tokens + Manrope/JetBrains fonts are present; expressive
  Code is `catppuccin-mocha` not `frappe`; favicon `<head>` links use `prefers-color-scheme`; the
  Lemon checkout URL is exact and `lemon.js`/`.lemonsqueezy-button` are intact; marketing copy is
  **verbatim** vs `design-references/source-content/*`; no Tailwind/Starlight regression.
- **ADR integrity:** every deviation has an ADR; every Appendix B row points at a real file, and vice versa.

## Step 4 — Verdict

### PASS — every gate and constraint proven
1. Merge the PR (rebase/squash per repo norm), or hand a green light to the maintainer if you lack rights.
2. Tick Phase [N]'s checkboxes in `PLAN.md` — the phase's own boxes **and** its row in Appendix C.
   Checkboxes only; no other text edits; do not stage other changes.
3. Post an **evidence ledger**: each gate with the real command + observed output; the `npm run build`
   result; one line per Architectural Constraint confirmed; one line per Actionable TODO path confirmed.

### FAIL — anything unproven or broken
- Do **not** merge. Tick **nothing**. Emit one remediation block per failure, ordered by blast radius
  (regressions + Locked-Decision violations first, then failing gates, then layout/hygiene gaps):

```
## Remediation for Phase [N] — Failure <i> of <total>

**What failed:** <exact quote from PLAN.md>

**Evidence:**
  Command:  <exact command you ran>
  Expected: <what PLAN.md requires>
  Actual:   <real stdout/stderr/exit code observed>

**Root cause:** <one or two sentences>

**Required fix:** <precise instruction referencing the exact PLAN.md path/name; minimal change, no redesign>

**Re-verify with:** <exact command that must pass to clear this failure>
```

Never soften a FAIL into a WARN. If something cannot be run in this environment (e.g. live Vercel or
the GitHub-triggered docs-sync), mark it **UNVERIFIED** — never report it as PASS. Default to FAIL if
any item is unproven.
