# Documentation Sync Duplicate Content Issue

## Problem Statement

The automated documentation sync workflow (`.github/workflows/receive-docs-sync.yml`) created duplicate content in documentation files during a sync operation on January 25, 2026. Specifically, Pull Request #10 attempted to add the "Integration with Dotfiles" section to `src/content/docs/guides/power-users.mdx`, but the transformation script created **four duplicate copies** of the same section instead of recognizing that the content already existed in the target file.

This resulted in:
- 115 lines of duplicate content added to the file
- A total of 461 lines of redundant documentation (4 copies of the same section)
- PR #10 being created with changes that were immediately superseded by manual cleanup in PR #11
- Confusion about the correct state of the documentation

The duplicate content was manually removed in PR #11 (merged January 25, 2026), which explicitly removed the duplicate "Integration with Dotfiles" sections. PR #10 was subsequently closed on February 9, 2026, as its changes had been superseded.

## Identified Issues

### 1. Merge-Section Strategy Does Not Validate Existing Content

The `merge-section` strategy in `scripts/transform-migration-docs.ts` (lines 197-202) contains logic that appends content to the end of a file when the expected section marker is not found:

```typescript
if (!markerMatch) {
  // Section marker not found, append at end
  return existingContent.trim() + '\n\n' + newContent.trim() + '\n';
}
```

**Issue:** This behavior silently creates duplicate content instead of failing or warning when the section marker is missing. The script does not check whether the content being inserted already exists in the target file before appending it.

**Impact:** When the section marker (`## Multi-Mac Sync`) was not found in `power-users.mdx`, the script appended the "Integration with Dotfiles" section at the end of the file, even though an identical section already existed earlier in the file.

### 2. Lack of Duplicate Detection in Transformation Scripts

The transformation scripts (`transform-cli-docs.ts`, `transform-config-docs.ts`, `transform-migration-docs.ts`) do not include any mechanism to detect duplicate content before writing to target files.

**Issue:** The scripts assume that the target file structure matches expectations and do not validate whether:
- Section headings already exist in the target file
- Content being inserted is semantically identical to existing content
- The file has been manually modified since the last automated sync

**Impact:** Automated syncs can create duplicate sections, overwrite manual edits, or introduce inconsistencies without detection.

### 3. No Mechanism to Prevent Superseded Automated PRs

The workflow creates automated PRs without checking whether:
- Recent manual PRs have already modified the same files
- The automated changes conflict with or duplicate recent manual changes
- The automated PR is still relevant given the current state of the main branch

**Issue:** Automated PRs remain open even when manual PRs have merged changes to the same files, creating confusion and potential merge conflicts.

**Impact:** In this case, PR #10 was created at 23:08 UTC and PR #11 (which removed the duplicates) was merged at 23:27 UTC—only 19 minutes later. The automated PR remained open for 15 days despite being immediately superseded.

## Follow-up Actions

The following actions should be reviewed to determine the best way to solve the problem:

1. **Review the automated sync workflow** (`.github/workflows/receive-docs-sync.yml`) to prevent future duplicate content issues
   - Evaluate whether the current merge-section strategy is appropriate
   - Consider adding validation steps before creating PRs
   - Assess whether the workflow should fail fast when unexpected file structures are encountered

2. **Add duplicate detection to the sync bot** to avoid creating multiple copies of the same section
   - Implement content hash comparison to detect identical sections
   - Add section heading validation to prevent duplicate H2/H3 headings in the same file
   - Consider semantic similarity checks for near-duplicate content

3. **Consider adding a check that closes automated PRs** if they're superseded by manual changes within a short timeframe
   - Detect when manual PRs have modified the same files as an open automated PR
   - Automatically close automated PRs that are no longer relevant
   - Add clear comments explaining why automated PRs are being closed

4. **Improve error handling in transformation scripts** to make failures visible
   - Replace silent fallback behaviors (like appending when section marker is missing) with explicit errors
   - Add verbose logging to show what content is being inserted and where
   - Consider creating backups before modifying files

5. **Add pre-merge validation** to catch issues before PRs are created
   - Validate MDX syntax in transformed files
   - Check for merge conflicts with the current main branch
   - Run duplicate detection checks as part of the workflow

## Timeline of Events

- **January 25, 2026, 23:05 UTC**: Base commit (36b5116) - TypeScript + Handlebars migration merged
- **January 25, 2026, 23:08 UTC**: PR #10 created by automated sync - added duplicate "Integration with Dotfiles" sections
- **January 25, 2026, 23:27 UTC**: PR #11 merged - manually removed duplicate sections (461 lines)
- **February 9, 2026, 19:22 UTC**: PR #10 closed as superseded

## References

- **Closed PR**: [#10 - [Auto] Update documentation from macprefs](https://github.com/jmcombs/macprefs-website/pull/10)
- **Cleanup PR**: [#11 - fix: Documentation cleanup and broken link fixes](https://github.com/jmcombs/macprefs-website/pull/11)
- **Affected File**: `src/content/docs/guides/power-users.mdx`
- **Transformation Script**: `scripts/transform-migration-docs.ts`
- **Workflow File**: `.github/workflows/receive-docs-sync.yml`

---

**Status**: Documented for future review and resolution planning.

