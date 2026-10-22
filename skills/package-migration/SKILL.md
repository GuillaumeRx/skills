---
name: package-migration
description: Use when migrating a MetaMask package into a Yarn monorepo or resuming after a preparation, history import, integration, cleanup, or release pause.
---

# Package Migration

## Overview

Migrate a package while preserving Git history and the required PR sequence. Discover repository conventions. Stop at every human merge gate.

Use [`migration-sequence.md`](migration-sequence.md) as the ordered index. Before a change, read the current entry and its phase ordering only. Load these references only when their condition applies:

- [`ledger-schema.md`](ledger-schema.md): during intake, on resume, and before each remote write
- [`history-import.md`](history-import.md): before PR 6, after PR 6 merges, and before the destination source-release tag
- [`cleanup-release.md`](cleanup-release.md): before PR 5, source cleanup, the destination source-release tag, or PR 15
- [`notice-templates.md`](notice-templates.md): before a source README edit or source PR comment

## Requirements intake

Before repository inspection, use **Ask Me a Question** to gather:

- Exact source repository
- Exact destination monorepo
- Package name, if known
- Staging directory, with `merged-packages/` as the proposed default
- Final package directory, with `packages/` as the proposed default
- Migration scope or known exceptions
- Tracking issue or project link
- Required teams or maintainers

Do not ask for values that Discovery can determine. Create the ledger under [`ledger-schema.md`](ledger-schema.md). Summarize assumptions and unresolved items. Get approval before Discovery.

At each later choice gate, preselect the evidence-based recommendation when one exists. If the interactive tool is unavailable, ask in chat and wait.

## Reconciliation strategy gate

After Discovery and before PR 2, compare scripts, dependencies, TypeScript, lint, format, tests, coverage, CI, releases, package managers, runtimes, builds, publication, and shared configuration. Classify each difference as compatible drift, blocking incompatibility, or structural mismatch.

Show behavior mappings, required changes, risks, unsupported work, and one recommendation. Ask the user to approve one strategy.

### Strategy 1: Source reconciliation

Recommend this when differences are small, the source can adopt destination conventions safely, and source CI can test the changes. Reconcile in source PR 2. The import includes these commits, with or without a final source release.

### Strategy 2: Destination reconciliation

Recommend this when the source is far behind or divergent, or the work requires monorepo context. Skip PR 2 under the strategy approval. Import into the approved staging path. Reconcile configuration in PR 9 and dependencies and scripts in PR 10.

Treat planned archival as supporting evidence, not as the deciding factor. If new evidence invalidates the strategy, stop and repeat this gate. Keep completed source changes unless the user approves a separate rollback.

## Operating contract

1. Use Yarn only.
2. Use isolated worktrees and repository branch rules. If no rule exists, use `migration/<package>-<step>`.
3. Create draft PRs with repository templates.
4. Preserve the PR sequence in each repository. Keep at most one sequence PR open in each repository.
5. Wait for a human merge before starting the next PR in that repository.
6. Never merge a PR or enable auto-merge. Mark a draft ready only when the user asks.
7. Never rebase or squash imported history.
8. Run applicable repository-defined Yarn tests before each push. Report failures.
9. Stop when repository state is ambiguous. Show the conflict and ask for a decision.

## Execution loop

For each entry in [`migration-sequence.md`](migration-sequence.md):

1. Reconcile the ledger and remotes under [`ledger-schema.md`](ledger-schema.md).
2. Search for conflicting destination migrations.
3. Verify the prior required merge and entry conditions.
4. Show planned files, commands, tests, and public effects.
5. Apply the smallest complete change in a clean worktree.
6. Run applicable Yarn install, format, lint, build, test, constraint, changelog, and generated-content tests.
7. Commit, push, and open one draft PR when the entry requires one.
8. Update the ledger.
9. Report the remote result, tests, required merge method, and resume condition. Stop.

## Process messages

Keep each message focused on the current entry. Lead with the result or required decision. Do not repeat migration history, settled choices, successful command output, or unchanged ledger data.

Use this shape when handing off a PR or remote action:

```markdown
### <entry>: <status>

- **Result:** <PR or action result with link>
- **Tests:** <passed, failed, or deferred summary>
- **Attention:** <only risks, drift, skips, or required merge method>
- **Resume:** <one exact condition>
```

Omit `Tests` or `Attention` when it has no content. Link to failures or issues instead of copying long output. Put pending obligations under `Attention`. Keep `Resume` to one observable event.

For a user decision:

1. State the decision in one sentence.
2. Show only evidence that changes the choice.
3. Put the recommended option first. Label its heading **Recommended** and preselect it in the question tool.
4. State the consequence of each option in one short sentence.
5. Ask one question. Include dependent approvals in the option consequence instead of asking again.

For a block, use this shape:

```markdown
**Blocked:** <failed condition>

- **Safe state:** <what completed and remains valid>
- **Not run:** <actions that did not occur>
- **Next:** <one decision or observable resume condition>
```

Do not claim that a partially completed remote action failed as a whole. Omit a field with no content.

For completion, use this shape:

```markdown
### Migration status: <complete or awaiting human action>

- **Completed:** <phases or major results>
- **Skips:** <approved skips and their public consequence>
- **Human work:** <remaining actions, or `None`>
- **Ledger:** <absolute path>
```

Use `complete` only when no required human publication or verification remains. Do not list every commit, command, or successful test unless the user asks.

## Rationalizations to reject

| Rationalization | Required response |
|---|---|
| "Stack later PRs to save time." | Keep one sequence PR open per repository. |
| "Rebase to include later source commits." | Apply the source-drift rules in `history-import.md`. |
| "Green CI means the agent can merge." | Report readiness and wait for a human. |
| "Close old issues and deprecate versions too." | Perform only approved cleanup actions. |
| "The ledger marks it complete." | Reconcile the ledger with both remotes. |

## Completion

Finish only when each sequence entry has a remote result or approved skip. Resolve every ledger action. Report completed work, skips, and remaining human work.
