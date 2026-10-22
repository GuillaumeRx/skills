# Skills

Reusable [Agent Skills](https://agentskills.io/) for coding agents.

## Available skills

| Skill | Purpose |
| --- | --- |
| [package-migration](skills/package-migration/SKILL.md) | Migrate a MetaMask package into a Yarn monorepo while preserving Git history and human merge gates. |

## Install

After the setup PR merges into `main`, install the skill with [Vercel's skills CLI](https://github.com/vercel-labs/skills):

```sh
yarn dlx skills add GuillaumeRx/skills --skill package-migration
```

Choose the agent and installation scope when prompted.

Before the merge, list the skill from this checkout without installing it:

```sh
yarn dlx skills add . --list
```

## Development

Use Node.js LTS and the Yarn version pinned in `package.json`. The `.nvmrc` file selects the current LTS version.

```sh
corepack enable
yarn install --immutable
yarn test
```

`yarn test` runs Node's built-in tests, then checks skill metadata and local Markdown link targets under `skills/`.
The link check ignores external URLs, anchor fragments, and examples inside code blocks.
These checks validate packaging, not agent behavior. No model, API key, subscription, or Python is required.

Yarn stores its dependency cache locally and disables telemetry. Dependency lifecycle scripts are disabled by default.
The [LavaMoat allow-scripts plugin](https://github.com/LavaMoat/LavaMoat/tree/main/packages/yarn-plugin-allow-scripts) checks the allowlist after each install.
No dependency scripts are currently allowed. Git dependencies are blocked, and new package versions must be at least three days old.

When a dependency adds a lifecycle script, inspect it before changing `lavamoat.allowScripts` in `package.json`.
Run `yarn allow-scripts auto` to record new scripts as denied, then review the changes.

The package-manager settings use [LavaMoat harden](https://github.com/LavaMoat/LavaMoat/tree/main/packages/harden) moderate defaults.
Check them separately when changing dependency configuration:

```sh
yarn harden check --package-manager yarn --level moderate
```

## License

[MIT](LICENSE). The vendored LavaMoat plugin retains its [upstream MIT notice](.yarn/plugins/@yarnpkg/plugin-allow-scripts.LICENSE).
