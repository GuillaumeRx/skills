# Skills Repository Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish the existing migration skill in a minimal, installable skills repository.

**Architecture:** Keep skills under `skills/<name>/`. Use a small Node.js validator with YAML and Markdown parsers. Publish the setup as a draft PR against the license-only default branch.

**Tech Stack:** Markdown, GitHub Actions, Node.js LTS, Yarn 4, Node's built-in test runner.

**Spec:** [Approved design](../specs/2026-10-22-skills-repository-design.md)

**Status:** Approved for inline execution with one independent review.

## Global Constraints

- Copy all six migration skill files without changes.
- Leave the global installation and `release-tools` unchanged.
- Use the MIT license.
- Use Node.js LTS and Yarn 4. Set `.nvmrc` to `lts/*`. Pin Yarn and commit its lockfile.
- Set `enableGlobalCache`, `enableScripts`, and `enableTelemetry` to `false` in `.yarnrc.yml`. Add LavaMoat's allow-scripts Yarn plugin and review any lifecycle-script exceptions.
- Use `@lavamoat/harden` to apply moderate package-manager defaults. Keep hardening checks separate from `yarn test`.
- Use `yarn test` as the single verification command locally and in CI.
- Require no model, API key, subscription, or model download. Do not add Python, agent-behavior evaluations, or publishing machinery.
- Work in an isolated worktree on `gr/initial-skills`.
- Open a draft PR and leave merging to the user.

## Review Focus

- Vercel's `skills` CLI must discover the skill without changing local installations.
- Metadata validation must reject missing required fields.
- Local-link validation must reject a missing target.
- Exact HTML notice placeholders must remain unchanged and pass validation.
- Default-branch installation must not be presented as available before the PR merges.

## Task 1: Package and validate the skill

**Files:** Create `README.md`, `.gitignore`, `.nvmrc`, `.github/workflows/validate.yml`, `package.json`, `.yarnrc.yml`, `.yarn/plugins/@yarnpkg/plugin-allow-scripts.cjs`, `yarn.lock`, `scripts/validate.mjs`, `tests/validate.test.mjs`, and `skills/package-migration/`.

**Interfaces:** Consume the global six-file skill. Produce a discoverable skill plus metadata and offline-link checks. Expose `validateRepository(root)` from `scripts/validate.mjs`, returning an array of errors.

- [x] Copy the skill directory and compare every file with its original.
- [x] Write and run failing tests for missing or malformed metadata, invalid names, missing local links, and valid Markdown with code placeholders.
- [x] Implement the validator with YAML and Markdown parsers.
- [x] Add the README, pinned Yarn version and parser dependencies, workflow, and minimal ignores. Apply `@lavamoat/harden` moderate defaults. Set the `test` script to `node --test && node scripts/validate.mjs`. Document `yarn test` as the single verification command and state that it does not test agent behavior. Run the same command in CI after an immutable Yarn install.
- [x] Run `yarn test`. Expect both the validator tests and validation of the repository's skill files to pass without model credentials. Verify that a temporary broken local-link fixture makes the same command fail; restore it afterward.
- [x] Run Skills CLI discovery. Review language manually to keep Python out of the tooling.
- [ ] Review the diff and commit the setup.

## Task 2: Publish for human review

**Files:** No additional repository files.

**Interfaces:** Consume the verified setup commit. Produce a public branch and draft PR.

- [ ] Obtain an independent review against the approved scope.
- [ ] Push `gr/initial-skills` to `GuillaumeRx/skills`.
- [ ] Create a draft PR with the summary and verification evidence.
- [ ] Confirm the public repository, PR draft state, and CI outcome.
- [ ] Report the repository URL, draft PR URL, and pending merge.
