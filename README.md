# kit-test

Agent-friendly PC admin project scaffold.

`kit-test` creates a full-stack admin workspace with:

- a Vue admin frontend template;
- a Fastify backend template;
- `AGENTS.md`, `SPECS`, `rules`, `workflow`, `tasks`, and `memory` control files;
- a staged workflow lock driven by `workflow-state.json`;
- bundled project skills under `.agents/skills`.

## Usage

Create a project without installing globally:

```sh
npx kit-test init my-admin
```

Then run the generated project checks:

```sh
cd my-admin
node scripts/kit.mjs check
```

You can also install the package globally:

```sh
npm install -g kit-test
kit init my-admin
```

## Commands

```sh
kit-test init <project-name>
kit-test check [project-root]
kit-test stage advance <stage> --by user --quote "<user exact quote>"
```

The generated project also includes local scripts:

```sh
node scripts/kit.mjs check
node scripts/kit.mjs stage advance requirements-draft --by user --quote "进入需求草稿"
```

## Requirements

- Node.js `^20.19.0 || >=22.13.0`
- pnpm `>=9`

## Publishing

Release checks:

```sh
pnpm test
pnpm typecheck
pnpm build
npm pack --dry-run
```
