# Skills

Reusable [Agent Skills](https://agentskills.io/) for coding agents.

- [package-migration](skills/package-migration/SKILL.md): Migrate MetaMask packages into a Yarn monorepo, preserving Git history and human merge gates.

## Install

After the setup PR merges into `main`, use [Vercel's skills CLI](https://github.com/vercel-labs/skills):

```sh
yarn dlx skills add GuillaumeRx/skills --skill package-migration
```

Choose the agent and installation scope when prompted. Preview a checkout without installing: `yarn dlx skills add . --list`.

## Development

Use Node.js LTS (`.nvmrc`) and the Yarn version pinned in `package.json`. npm only bootstraps Corepack.

```sh
npm install --global --ignore-scripts corepack@0.36.0
corepack enable
yarn install --immutable
yarn test
```

`yarn test` runs validator tests and checks skill metadata and local Markdown links, not agent behavior.
It ignores external URLs, anchors, and code examples. No model credentials are needed.

[LavaMoat allow-scripts](https://github.com/LavaMoat/LavaMoat/tree/main/packages/yarn-plugin-allow-scripts) checks lifecycle-script permissions after each install; no scripts are currently allowed.
Inspect new scripts before changing `lavamoat.allowScripts` in `package.json`.

Check [LavaMoat harden](https://github.com/LavaMoat/LavaMoat/tree/main/packages/harden) moderate defaults separately:

```sh
yarn harden check --package-manager yarn --level moderate
```

## License

[MIT](LICENSE). The vendored LavaMoat plugin retains its [upstream MIT notice](.yarn/plugins/@yarnpkg/plugin-allow-scripts.LICENSE).
