# Cleanup and release gates

Read the applicable section before the final source release, source cleanup, the destination source-release tag, or the destination release.

At each gate, show exact objects and public effects. If the interactive question tool is unavailable, ask in chat and wait. A perform choice never authorizes a PR merge.

## Release need

Apply this rule before the final source release and the destination release. It does not govern the historical destination tag.

Evaluate each affected package separately. Compare the last published version with the content proposed for publication. Inspect the consumer surface: code, types, API, installed production dependencies, peer ranges, and supported runtimes. Development-only dependencies, scripts, tooling, CI, and repository-only files do not reach consumers.

Recommend publication for a package when a consumer-facing change exists. Ask the user to approve the recommendation. Record the decision in the ledger. When the user approves no publication for a package with no consumer-facing change, record an approved skip for that release entry. Name the published version that stays current. A user decision to publish without a consumer-facing change overrides the recommendation. Record the override and run the full publication gate.

## Final source release

Apply the release-need rule. When it finds no consumer-facing change and the user approves no publication, skip PR 5. Use the source default branch tip as the history-import snapshot, or an accepted earlier snapshot when the user defers commits. The import keeps the unreleased repository-only commits.

If the user declines publication while a consumer-facing change exists, stop. The PR 5 entry stays `blocked`, not `skipped`. Require one outcome for each affected change. The outcomes are publication approval, explicit approval to import the unreleased content, or an approved deferral under the drift outcomes in [`history-import.md`](history-import.md). Record the chosen outcome. An approved import of unreleased consumer-facing content also records the release-need skip and unblocks PR 6.

Before PR 5 publication:

1. Use the source release tool.
2. Compare versions with semantic-version precedence.
3. Verify that the proposed version is newer than the configured stable registry channel.
4. Discover whether publication creates a source tag or GitHub release.
5. Show every publication target.
6. Ask the user to choose **publish** or **prepare and report only**.
7. Ask for final confirmation before publication or a release-triggering merge instruction.

A report-only choice pauses the migration before PR 6. Record the prepared release and exact publication work as remaining human work. Resume only after a human publishes and the agent verifies the outputs.

After a human publishes, verify that the registry, source tag, and GitHub release use the same version when the workflow creates them. Verify that the source default branch tip equals the release commit. Record the version and commit in the ledger.

## Destination source-release tag

Use the tag gate in [`history-import.md`](history-import.md). A tag push that starts publication is also a publication gate.

## Source cleanup choices

After PR 12 merges, collect exact lists of open source issues and PRs. Ask for **perform** or **report only** separately for:

- Issue transfers
- Source PR comment-and-lock actions
- Source repository archival

Record each report-only choice as an approved skip for its dependent remote actions.

### Issue transfers

Verify that GitHub permits transfer between the repositories. Verify that the authenticated user has the required access. Transfer only approved issues.

If transfer is unavailable, stop and ask whether to report only or create destination issues with source backlinks.

### Source PR comments and locks

Read [`notice-templates.md`](notice-templates.md) before this action. Require archival intent because the exact comment promises archival.

Treat the lock and comment as one action:

1. Lock the approved source PR without a lock reason.
2. Verify the lock.
3. Post the exact rendered comment.

If the comment fails, keep the truthful lock state and stop. On resume, verify the existing lock and post the missing comment to complete the approved action. Do not offer an independent comment-only or lock-only action.

### Permanent source notice and archival

Read [`notice-templates.md`](notice-templates.md) before PR 13.

If the user does not intend to archive, do not post the source PR comment or open PR 13. Ask for approved skips. Report that the temporary migration notice remains unless the user approves a separate cleanup plan.

With archival intent:

1. Open PR 13 with the permanent source notice.
2. Before merge, verify archive permission and source drift.
3. Resolve every later source commit under the drift rules in [`history-import.md`](history-import.md).
4. Record final archival confirmation.
5. Ask the human to merge only when the agent can archive immediately afterward.
6. After merge, compare the result with the approved commit and archive the repository.

If archival fails, start the approved rollback immediately. Delete the migration comments by their recorded remote identifiers. Unlock only the PRs that this action locked. Open a draft PR that reverts the false archival statement. Report all rollback results. Do not leave false archival text without an active recovery action.

## Destination release

Before PR 15, resolve all downstream TODO cleanup. The user can approve linked follow-up issues for blocked items.

Apply the release-need rule to the migrated package and each affected downstream package. Record a per-package decision. Do not open a release PR for a package with an approved no-publication choice. Record that its Unreleased changelog entries remain until its next release.

A user decision to publish a package without a consumer-facing change overrides the recommendation. Record the override and continue.

Open one release PR for the packages with approved publication:

1. Use the destination release-branch tool for those packages.
2. Compare versions with semantic-version precedence.
3. Verify that the migrated package version is newer than the final source version and the configured stable registry channel. Verify that each downstream package version is newer than its stable channel.
4. Discover whether publication creates tags or a GitHub release.
5. Show every publication target.
6. Ask the user to choose **publish** or **prepare and report only**.
7. Ask for final confirmation immediately before publication.

A prepare-and-report-only choice leaves publication as remaining human work. Record the release PR result and stop at the publication gate. Never merge the release PR. After a human publishes, verify each published registry version and expected tags or GitHub release.
