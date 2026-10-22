# Skills repository

## Goal

Maintain reusable skills in the public `GuillaumeRx/skills` repository. Start with `package-migration`.

## Approved scope

- Copy all six files from the existing global `package-migration` skill without changes.
- Store the skill in `skills/package-migration/`.
- Add a concise README with an overview, installation instructions, and validation commands.
- Use the MIT license.
- Add a small GitHub Actions workflow for skill metadata and local Markdown links.
- Leave the existing global installation and `release-tools` unchanged.

Use the standard skill layout found in `mattpocock/skills` and `dietrichgebert/ponytail`. Do not copy their plugins, publishing tools, or branding.

## Implementation choices

Use Node.js LTS and Yarn 4. Set `.nvmrc` to `lts/*`. Pin Yarn and commit its lockfile. Set `enableGlobalCache`, `enableScripts`, and `enableTelemetry` to `false` in `.yarnrc.yml`. Add LavaMoat's allow-scripts Yarn plugin and review any lifecycle-script exceptions. Use `@lavamoat/harden` to apply moderate package-manager defaults. Keep hardening checks separate from `yarn test`. Check required skill metadata and local Markdown link targets with a small Node.js script. Use YAML and Markdown parsers instead of custom parsers. Do not add Python or publishing machinery.

## Testing decision

Use `yarn test` as the single verification command locally and in CI. It runs Node's built-in test runner for validator tests, then validates the repository's skill files. No model, API key, subscription, or model download is required. Do not add Promptfoo, Ollama, or agent-behavior evaluations in this setup.

These checks validate packaging, not whether an agent follows the migration skill.

## Delivery

Work on `gr/initial-skills` in an isolated worktree. Publish the setup through a draft PR. Leave merging to the user. The default-branch installation command becomes usable after that merge.

## Acceptance checks

- All six skill files match the global originals byte for byte.
- Vercel's `skills` CLI discovers `package-migration` without installing it.
- Metadata and local-link validation pass for the repository.
- Validation rejects malformed metadata and a broken local link.
- Notice-template placeholders do not cause link failures.
- The repository is public and the setup PR remains a draft.
