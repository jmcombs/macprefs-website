# GitHub Action Documentation Sync Research

## Overview

This document outlines the feasibility and implementation approach for automatically syncing documentation files (CLI.md and config-examples.md) from the main `macprefs` repository to the `macprefs-website` repository.

## Recommended Approach

Use a combination of:
1. **`repository_dispatch`** event in `macprefs-website` to receive updates
2. **`peter-evans/create-pull-request`** action to create PRs with the updated content
3. **Fine-grained PAT or GitHub App token** for cross-repository authentication

## Implementation Options

### Option 1: Push-based Sync (Recommended)

The `macprefs` repo pushes changes to `macprefs-website` when docs change.

**In macprefs/.github/workflows/sync-docs.yml:**

```yaml
name: Sync Documentation to Website

on:
  push:
    branches: [main]
    paths:
      - 'docs/CLI.md'
      - 'docs/config-examples.md'

jobs:
  sync-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout macprefs
        uses: actions/checkout@v4

      - name: Trigger website update
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.WEBSITE_REPO_PAT }}
          repository: jmcombs/macprefs-website
          event-type: docs-updated
          client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'
```

**In macprefs-website/.github/workflows/receive-docs-sync.yml:**

```yaml
name: Receive Documentation Sync

on:
  repository_dispatch:
    types: [docs-updated]

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout website
        uses: actions/checkout@v4

      - name: Checkout macprefs docs
        uses: actions/checkout@v4
        with:
          repository: jmcombs/macprefs
          path: macprefs-source
          sparse-checkout: docs
          token: ${{ secrets.MACPREFS_REPO_PAT }}

      - name: Run migration script
        run: |
          # Transform CLI.md to cli.mdx format
          node scripts/migrate-cli-docs.js
          # Transform config-examples.md to website format
          node scripts/migrate-config-docs.js

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v8
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'docs: sync CLI and config documentation from macprefs'
          title: '[Auto] Update documentation from macprefs'
          body: |
            Automated sync of documentation from macprefs repository.
            Source commit: ${{ github.event.client_payload.sha }}
          branch: auto/docs-sync
          delete-branch: true
          labels: documentation,automated
```

### Option 2: Pull-based Sync (Scheduled)

The website repo periodically checks for changes.

```yaml
name: Check for Documentation Updates

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  check-and-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check for updates and sync
        # ... similar to above
```

## Authentication Requirements

### Fine-grained PAT (Recommended)
- **Repository access**: Both `macprefs` and `macprefs-website`
- **Permissions needed**:
  - `contents: read` on source repo (macprefs)
  - `contents: write` on target repo (macprefs-website)
  - `pull-requests: write` on target repo

### GitHub App Alternative
More secure but requires more setup. Benefits:
- Better audit trail
- Can be shared across organization
- Rate limits are higher

## Transformation Script Requirements

The sync process needs a transformation script because:
1. Source files are plain Markdown, target files are MDX
2. Website uses Starlight components (Aside, Tabs)
3. Schema uses `domains` but website currently needs proper formatting
4. Frontmatter must be added for Starlight

Example script approach (`scripts/migrate-cli-docs.js`):
```javascript
// Read CLI.md, transform to cli.mdx format
// - Add MDX frontmatter
// - Convert markdown tables to proper format
// - Add Starlight component imports
// - Format code blocks appropriately
```

## Pros and Cons

| Approach | Pros | Cons |
|----------|------|------|
| Push-based | Immediate updates, triggered only when needed | Requires PAT in source repo |
| Pull-based | Simpler secrets management | May miss updates, uses CI minutes |

## Recommendation

**Use Option 1 (Push-based)** with:
1. A fine-grained PAT stored as `WEBSITE_REPO_PAT` in macprefs secrets
2. A transformation script in macprefs-website to convert MD → MDX
3. peter-evans/create-pull-request for safe, reviewable updates

## Security Considerations

- Use fine-grained PATs with minimal required permissions
- PRs allow human review before merging transformed docs
- Consider branch protection rules on macprefs-website
- Tokens should have expiration dates (90 days recommended)

## Next Steps

1. Create the transformation scripts in macprefs-website
2. Set up fine-grained PAT with required permissions
3. Add the workflow files to both repositories
4. Test the sync process manually first

