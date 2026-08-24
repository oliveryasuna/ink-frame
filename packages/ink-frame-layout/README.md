# ink-frame-layout

Declarative grid templates for [ink-frame](https://github.com/oliveryasuna/ink-addons/tree/main/packages/ink-frame).
Describe a layout the way you would with CSS `grid-template-areas`, and get back a rect per named area.

Nested `splitColumns`/`splitRows` calls are powerful but verbose, and their intermediate variables
exist only to be split again. `grid` lets you name the regions once and reads top to bottom like the
screen it describes.

## Install

```sh
bun add @oliveryasuna/ink-frame-layout
```

It expects `@oliveryasuna/ink-frame` (>=1.1) alongside it. That is the only peer; this package is pure
geometry, with no Ink or React dependency of its own.

## Quick start

```tsx
import {render, Text, useStdout} from 'ink';
import {Frame, Pane} from '@oliveryasuna/ink-frame';
import {grid} from '@oliveryasuna/ink-frame-layout';

const App = () => {
  const {stdout} = useStdout();
  const root = {left: 0, top: 0, width: stdout.columns, height: stdout.rows};

  const areas = grid(root, {
    areas: [
      ['header', 'header'],
      ['side', 'main'],
      ['side', 'footer']
    ],
    columns: [24, 'grow'],
    rows: [3, 'grow', 3]
  });

  return (
    <Frame width={stdout.columns} height={stdout.rows}>
      <Pane rect={areas.header} paddingX={1}><Text bold>Header</Text></Pane>
      <Pane rect={areas.side} paddingX={1}><Text>Sidebar</Text></Pane>
      <Pane rect={areas.main} paddingX={1}><Text>Main</Text></Pane>
      <Pane rect={areas.footer} paddingX={1}><Text dimColor>Footer</Text></Pane>
    </Frame>
  );
};

render(<App />);
```

`areas.header`, `areas.side`, `areas.main`, and `areas.footer` are ordinary `Rect`s, ready to hand to
`Pane`. Because the input is a literal matrix, the returned keys are **typed**: `areas.mian` is a
compile error.

## How it works

A grid is separable, so `grid` needs no new math. It divides the width with ink-frame's `splitColumns`
and the height with `splitRows`, then each area is the bounding box of the tracks it covers. That means
the rounding and the shared-border overlap are identical to a hand-written split, and there is nothing
to keep in sync.

## Tracks and spanning

- `columns` and `rows` are track sizes, each a fixed number of cells or `'grow'` (the same `PaneSize`
  the splitters take). `columns` has one entry per grid column, `rows` one per row.
- An area name may span several tracks by repeating across cells (`header` above spans both columns).
  Every name must form a solid rectangle; a hole, an L-shape, or two disjoint blocks throws with a
  message naming the area.
- `'.'` is a gap: it reserves a cell and produces no rect.

## Sharing borders vs. packing tight

`seams` chooses how neighbours meet, mirroring `split*` vs. `pack*`:

- `'share'` (default): adjacent areas overlap by a cell to share a border. Use with a `Frame`.
- `'pack'`: adjacent areas butt edge to edge with no shared cell. Use with a `noBorders` frame.

```ts
const areas = grid(root, {areas, columns, rows, seams: 'pack'});
```

## The `template` tag

If you prefer the compact, aligned look, the `template` tag turns a multi-line string into the matrix.
Blank lines are dropped and whitespace runs collapse, so you can align columns:

```ts
import {grid, template} from '@oliveryasuna/ink-frame-layout';

const areas = grid(root, {
  areas: template`
    header header
    side   main
    side   footer
  `,
  columns: [24, 'grow'],
  rows: [3, 'grow', 3]
});
```

The trade-off: names from `template` widen to `string`, so the result is keyed by `string` rather than
the exact area names. Use the array-of-arrays form when you want the keys checked at compile time.

## API

| Export | Kind | Notes |
| --- | --- | --- |
| `grid(rect, template)` | function | Compiles a template into a rect per area name. |
| `template` | tag | Turns an aligned multi-line string into an `areas` matrix. |
| `GridTemplate`, `GridResult`, `Seams`, `Track` | types | The template shape, result shape, seam mode, and track size. |

`grid` throws, at call time, on a mismatch between `columns`/`rows` and the template's dimensions, on a
ragged matrix, or on a non-rectangular area. Fail loud, fail early.

## Examples

Runnable ones live in [`examples/`](./examples):

- [`example.tsx`](./examples/example.tsx) — the dashboard above, as an inline matrix in a `Frame`.
- [`example-template.tsx`](./examples/example-template.tsx) — the same, via the `template` tag.
- [`example-pack.tsx`](./examples/example-pack.tsx) — `seams: 'pack'` with a `noBorders` frame.

```sh
bun examples/example.tsx
```

## License

MIT © Oliver Yasuna
