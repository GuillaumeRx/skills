# Migration ledger

Read this file during intake, on every resume, and before each remote write.

## Location and identity

Store the ledger outside both repositories in the platform user-state directory:

`metamask-package-migrations/<source-owner>-<source-repo>--<destination-owner>-<destination-repo>--<package-key>.json`

Derive `<package-key>` from the full package name. Replace each character outside `A-Z`, `a-z`, `0-9`, `.`, `_`, and `-` with `_`. For example, `@metamask/utils` becomes `_metamask_utils`.

If the package name is unknown during intake, use `_pending`. After Discovery, atomically rename the existing `_pending` ledger. Stop if the final path exists or the `_pending` ledger does not exist.

## Schema version 1

Record these fields:

- `schema_version`: `1`
- `ledger_path`: absolute path to this ledger
- `status`: `intake-awaiting-approval`, `discovery-ready`, `active`, `awaiting-merge`, `blocked`, `complete`, or `cancelled`
- `repositories`: source and destination URLs and default branches
- `package`: full package name, package key, source path, staging path, and final path
- `intake`: migration scope, exceptions, tracking link, and required reviewers
- `strategy`: analysis, recommendation, selection, and approval
- `steps`: one object for every PR and non-PR sequence entry. Append `-r2`, `-r3`, and so on to the step identifier for each rerun.
- `history`: discovery snapshot, final source version, source release commit, import snapshot, commit-map artifact, rewritten release commit, and destination tag
- `decisions`: approvals, confirmations, assumptions, deferred commits, and unresolved items
- `remote_actions`: comments, locks, transfers, issue creation, tags, archives, publications, and their remote identifiers
- `updated_at`: timestamp of the last atomic write

Each `steps` object contains:

- `status`: `pending`, `active`, `awaiting-merge`, `complete`, `skipped`, or `blocked`
- `skip_reason`, when applicable
- Branch, commits, PR, tests, merge data, and required post-merge tests

## Atomic updates

Write each update to a temporary file in the ledger directory. Validate the complete JSON. Atomically rename the temporary file over the ledger.

Store the full `git-filter-repo` commit map beside the ledger. Record its path and checksum. Store the source-release-to-rewritten-release mapping in `history`.

## Resume reconciliation

Treat GitHub and Git as authoritative. Reconcile both remotes before every write.

Adopt an unrecorded remote object only when its branch, target branch, commits, changed paths, and PR text identify the expected step. Re-run the step's post-merge tests before advancing. Stop when:

- The ledger records an object that the remote does not contain.
- A remote object conflicts with the ledger.
- More than one object can match the same step.
- A new package migration conflicts with the staging path, lockfile, root configuration, or downstream workspaces.

Search remote state before each public action. Do not repeat a branch, PR, comment, lock, tag, issue transfer, issue creation, archive, or publication.

If the ledger or commit-map artifact is missing or invalid, stop all writes. Rebuild the state from both remotes and a fresh source clone. Require user approval of the reconstructed ledger before resuming.
