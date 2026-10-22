# History import and source release tag

Read this file before PR 6, after PR 6 merges, and before the destination source-release tag step.

## Preconditions

Confirm all of these conditions:

- One of these is true:
  - The final source release exists, its outputs use one version, and the registry, source tag, and GitHub release exist when the workflow creates them. The import snapshot is that release commit.
  - PR 5 has an approved release-need skip. The import snapshot is the source default branch tip or an accepted earlier snapshot under the drift rules. Imported commits after the latest published release are repository-only, or the user approved importing their unreleased consumer-facing content.
- The ledger records the accepted snapshot. It is the release commit after publication, the verified source tip after a skip, or an approved earlier commit under the drift rules.
- The accepted snapshot contains the latest published release commit.
- Destination branch rules permit a merge commit.
- Discovery recorded whether the staging path matches a Yarn workspace.
- Discovery recorded the destination tag convention and every tag-triggered workflow effect.

Do not start PR 6 until these conditions pass.

## Source drift

Before PR 6 merges, compare a fresh source clone's default branch tip with the history-import snapshot.

If the tip differs, report every later commit. Classify each commit as consumer-facing or repository-only. For a consumer-facing commit, recommend a new final source release. Publication creates a new release commit and accepted snapshot. Restart the import from it. For repository-only commits, recommend updating the accepted snapshot to the current tip. The user can instead approve an earlier snapshot and defer the excluded commits. A deferred commit does not block PR 6.

After PR 6 merges, compare later source commits with the accepted snapshot. Do not offer an import restart or a new source release. For each later commit, require one outcome:

- Port it in a destination PR.
- Create a follow-up issue.
- Exclude it with explicit user approval.

Do not rebase the import or add an unapproved migration PR.

## PR 6: Rewrite and import

**Rewrite history in:** Temporary source clone. **Integrate in:** Destination worktree. **Open PR in:** Destination GitHub.

1. Create a fresh source clone in the platform-approved temporary directory.
2. Create and switch to an import branch at the accepted history-import snapshot.
3. Delete other local branches and tags from the temporary clone.
4. Run `git filter-repo --force --to-subdirectory-filter <staging-path>/<package-directory>` on the import branch.
5. Store and record the commit map as specified in [`ledger-schema.md`](ledger-schema.md).
6. Add the temporary clone as a local remote in the destination worktree.
7. Fetch the rewritten import branch without tags.
8. Merge it with `--allow-unrelated-histories`.
9. Run the staging tests recorded during Discovery. Do not rewrite imported commits.
10. If the staging path is outside the Yarn workspaces, inspect its structure and history. Record each deferred workspace-dependent test.
11. Push the branch and open a draft PR. State: **Use a merge commit. Do not squash or rebase.**

## Post-merge gate

After PR 6 merges, inspect the merge commit for two parents. Confirm that the imported commit graph and rewritten source release commit remain reachable.

If the human used squash or rebase, stop. Ask the human to revert the incorrect merge. Prepare a new clean import PR only after approval. Do not continue or change the default branch without approval.

## Destination source-release tag

**Create in:** Clean destination worktree after the post-merge gate. **Push to:** Destination GitHub.

1. Confirm the recorded commit-map checksum. Use the recorded mapping to identify the rewritten source release commit.
2. Find the commit in destination history.
3. Read the exact package name and version from the manifest at the release commit.
4. Derive the tag with the destination convention found during Discovery. Use `<full-package-name>@<version>` only when the destination uses that convention.
5. Search for a conflicting local or remote tag. Stop if one exists.
6. Show the tag, target commit, and every tag-triggered workflow effect.
7. If the push can publish a package and the registry contains that version, recommend **report only**. Do not push unless repository evidence proves that the workflow will not republish or replace the existing version.
8. Ask the user to choose **push** or **report only**. Include any publication in this choice.
9. Ask for final confirmation immediately before the push.
10. Push only after confirmation. Inspect the remote target and record the result.

A report-only choice records an approved skip for this tag entry. Report the missing historical tag and continue to PR 7.
