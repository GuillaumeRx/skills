# Migration sequence

Use current repository conventions for commands and file shapes. Keep adjacent entries in separate PRs. Keep Phase C in one PR.

## Locations

- **Source worktree**: isolated worktree of the standalone repository
- **Source GitHub**: remote standalone repository
- **Temporary source clone**: fresh clone used only for history rewriting
- **Destination worktree**: isolated worktree of the monorepo
- **Destination GitHub**: remote monorepo
- **User state directory**: migration ledger and history artifacts outside both repositories

## Intake and Discovery

**Run in:** Question tool, both worktrees, both GitHub repositories, and user state directory.

Complete approved intake from `SKILL.md`. Create the ledger under [`ledger-schema.md`](ledger-schema.md). Then:

- Verify `git`, `git-filter-repo`, `gh`, Node.js, Yarn, authentication, and permissions.
- Read repository instructions, manifests, workspaces, PR templates, CODEOWNERS, release configuration, and validation scripts.
- Identify default branches, package paths, stable registry version, release commit, dependencies, downstream workspaces, and peer packages.
- Record a discovery snapshot for Phase A drift reports. Do not use it as the history-import snapshot.
- Determine whether staging matches a Yarn workspace. Record available staging tests and final-path tests.
- Verify that destination branch rules permit a merge commit for PR 6.
- Record the destination tag convention and tag-triggered workflow effects.
- Search for conflicting destination migrations.

Complete and record the reconciliation strategy gate from `SKILL.md`.

## Phase A: Source preparation

Create each entry in a source worktree. Open one draft PR on source GitHub. Wait for its human merge before the next source PR.

### PR 1: Migration notice

**Run in:** Source worktree. **Open PR in:** Source GitHub.

Use the temporary README notice in [`notice-templates.md`](notice-templates.md).

### PR 2: Tooling alignment

**Run in:** Source worktree for Strategy 1. **Open PR in:** Source GitHub for Strategy 1.

For Strategy 1, align dependencies and TypeScript, lint, and format configuration with the destination. Preserve stricter source TypeScript flags. Resolve failures.

For Strategy 2, record the strategy-approved skip. Ask during PR 10 about source dependencies that are newer than destination versions.

### PR 3: Template compliance

**Run in:** Source worktree. **Open PR in:** Source GitHub.

Add required package files, metadata, and the correct license under current MetaMask package conventions.

### PR 4: Package namespace

**Run in:** Source worktree. **Open PR in:** Source GitHub.

When needed, rename the package to the `@metamask/` namespace. Update metadata, README title, lockfile, references, and changelog. Ask before an inapplicable skip.

### PR 5: Final source release

**Prepare in:** Source worktree. **Open PR in:** Source GitHub. **Publish through:** Source release workflow and registry.

Apply the release-need and final source release gates in [`cleanup-release.md`](cleanup-release.md). Do not start PR 6 until the agent records the approved release or release skip and verifies the import point.

## Phase B: Destination staging

Create each entry in a destination worktree. Open one draft PR on destination GitHub. Wait for its human merge before the next destination PR.

### PR 6: Import Git history

**Rewrite in:** Temporary source clone. **Integrate in:** Destination worktree. **Open PR in:** Destination GitHub.

Apply all PR 6 instructions and the post-merge gate in [`history-import.md`](history-import.md).

### Destination source-release tag

**Create in:** Clean destination worktree. **Push to:** Destination GitHub.

After the PR 6 post-merge gate passes, apply the destination tag gate in [`history-import.md`](history-import.md).

### PR 7: Reset changelog

**Run in:** Destination staging package. **Open PR in:** Destination GitHub.

Create a fresh changelog with an Unreleased migration entry and a permanent source-changelog link.

### PR 8: Delete repository-level files

**Run in:** Destination staging package. **Open PR in:** Destination GitHub.

Delete files owned by the monorepo root. Derive the list from destination peers. Preserve package code, tests, documentation, metadata, license, and configuration that PR 9 replaces.

### PR 9: Replace package configuration

**Run in:** Destination staging package. **Open PR in:** Destination GitHub.

For Strategy 2, extend destination root TypeScript, documentation, and test configuration. Preserve source compilation targets, stricter compiler flags, and coverage thresholds. Add project references and configuration dependencies.

For Strategy 1, apply only remaining destination-specific configuration changes.

### PR 10: Align dependencies and scripts

**Run in:** Destination staging package. **Open PR in:** Destination GitHub.

For Strategy 2, delete scripts and dependencies supplied by the root. Keep TypeScript when destination peers keep it. Align peer and internal workspace versions. Ask before replacing a newer source dependency with a destination version. Verify external upgrades.

For Strategy 1, reconcile only remaining destination-specific dependencies and scripts.

Run all staging tests that do not require the final path. Resolve failures. Record final-path tests for PR 12.

### PR 11: Update package README

**Run in:** Destination staging package. **Open PR in:** Destination GitHub.

Keep package introduction and usage. Update installation and contribution sections. Delete standalone development instructions that the root owns.

## Phase C: Integration

### PR 12: Integrate package

**Run in:** Destination worktree. **Open PR and follow-up issues in:** Destination GitHub.

Keep all integration changes in this draft PR:

1. Move the package from staging to the final workspace path.
2. Run `yarn install` at the root.
3. Add root and downstream TypeScript references.
4. Update root and downstream dependency declarations.
5. Run `yarn constraints --fix` when constraints exist.
6. Add required changelog validation scripts.
7. Correct simple downstream errors.
8. Use `@ts-expect-error TODO:` only for blocked errors. Create linked issues.
9. Add changelog entries to each changed package.
10. Run recorded final-path tests and the full destination Yarn suite.
11. Reconcile destination default-branch changes without rewriting imported history.

Wait for a human merge.

## Phase D: Cleanup and release

After PR 12 merges, apply source cleanup choices and actions from [`cleanup-release.md`](cleanup-release.md). Source cleanup and destination PR 14 can proceed in parallel because they use different repositories. Keep at most one sequence PR open in each repository.

### Source issue transfers

**Run from:** GitHub client. **Apply between:** Source and destination GitHub.

Apply the issue-transfer gate in [`cleanup-release.md`](cleanup-release.md).

### Source PR comments and locks

**Run from:** GitHub client. **Apply to:** Source GitHub.

Apply the combined comment-and-lock gate in [`cleanup-release.md`](cleanup-release.md).

### PR 13: Permanent source notice

**Run in:** Source worktree. **Open PR in:** Source GitHub.

Apply the permanent-notice and archival gate in [`cleanup-release.md`](cleanup-release.md).

### Source repository archive

**Run from:** GitHub client or web interface. **Apply to:** Source GitHub.

Archive only through the approved PR 13 flow in [`cleanup-release.md`](cleanup-release.md).

### PR 14: Destination documentation

**Run in:** Destination worktree. **Open PR in:** Destination GitHub.

Add the package to generated documentation and dependency graphs with the destination Yarn command.

### Downstream TODO cleanup

**Run in:** Destination worktree. **Open PR and issues in:** Destination GitHub.

After PR 14 merges, resolve every temporary downstream `@ts-expect-error TODO:` in a separate draft PR. Use linked and assigned issues only for user-approved blocked work.

### PR 15: Destination release

**Prepare in:** Destination worktree. **Open PR in:** Destination GitHub. **Publish through:** Destination release workflow and registry.

Apply the release-need and destination release gates in [`cleanup-release.md`](cleanup-release.md). Never merge the release PR.

## Applicability

Skip an entry only when its condition does not apply or an explicit gate defines the skip. Show evidence, get approval, and record the skip. Human merges remain mandatory at every PR gate.
