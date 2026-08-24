# ink-addons

A monorepo of small, focused [Ink](https://github.com/vadimdemedes/ink) libraries for terminal UIs.

## Packages

| Package | Path | What it does |
| --- | --- | --- |
| [`@oliveryasuna/ink-frame`](./packages/ink-frame) | `packages/ink-frame` | Grids of bordered boxes whose borders join where they meet. |

Each package has its own README with the details.

## Development

This is a [Bun](https://bun.sh) workspace. Use the Bun version pinned in `.bun-version`.

```sh
bun install     # install every workspace
bunx tt         # run the default 'verify' task
bunx tt --help  # list available tasks
```

Tasks are defined with [`ts-task`](hhttps://github.com/oliveryasuna/ts-task): the root
runs repo-wide checks and merges in each package's own tasks (build, lint, and so on), so you can
drive everything from here.

## Layout

- `packages/*` — the published packages
- `shared/` — build and task helpers shared across packages

## Contributing

Fully AI-generated pull requests are not accepted. You can use AI, but should be verified and cleaned up by a human. Only Opus 4.6+ (high-effort) and Codex 5.4+ (extra high) are accepted models. Preferably created with Opus and verified by Codex. *This blurb is adapted from [Ink](https://github.com/vadimdemedes/ink).*

I think this is a reasonable requirement, particularly for a tiny library like this. If you think it's too strict, please open an issue and let me know why.

## License

MIT © Oliver Yasuna
