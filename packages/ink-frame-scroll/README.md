# ink-frame-scroll

A scrollable viewport for [Ink](https://github.com/vadimdemedes/ink), sized to an
[ink-frame](https://github.com/oliveryasuna/ink-addons/tree/main/packages/ink-frame) rect.

ink-frame gives you fixed regions. Real apps have content taller than the region: logs, lists,
trees, help text. `Scrollable` renders that content at its natural height, clips it to the region,
and lets you move through it with the keyboard or programmatically. It drops straight into a `Pane`,
or stands on its own.

## Install

```sh
bun add @oliveryasuna/ink-frame-scroll
```

It expects `@oliveryasuna/ink-frame` (>=1.1), `ink` (>=5), and `react` (>=18) alongside it.

## Quick start

Drop a `Scrollable` inside a `Pane`, sized to the same rect:

```tsx
import {render, Text, useStdout} from 'ink';
import {Frame, Pane, splitRows} from '@oliveryasuna/ink-frame';
import {Scrollable} from '@oliveryasuna/ink-frame-scroll';

const App = () => {
  const {stdout} = useStdout();
  const [main] = splitRows({left: 0, top: 0, width: stdout.columns, height: stdout.rows}, ['grow']);

  return (
    <Frame width={stdout.columns} height={stdout.rows}>
      <Pane rect={main}>
        <Scrollable rect={main}>
          {Array.from({length: 200}, (_, i) => <Text key={i}>{`line ${i}`}</Text>)}
        </Scrollable>
      </Pane>
    </Frame>
  );
};

render(<App />);
```

`rect={main}` sizes the viewport to that pane's interior. The 200 lines are clipped to it, and the arrow keys scroll. That is the whole idea.

ink-frame-scroll also works without a frame, with an explicit height:

```tsx
import {render, Text, useStdout} from 'ink';
import {Scrollable} from '@oliveryasuna/ink-frame-scroll';

// `Scrollable` needs no `Frame` or `Pane`. Without a `rect` it takes an explicit
// `height` (and optionally `width`), and clips and scrolls just the same.
const App = () => {
  const {stdout} = useStdout();

  return (
    <Scrollable height={stdout.rows}>
      {Array.from({length: 200}, (_, i) => <Text key={i}>{`line ${i}`}</Text>)}
    </Scrollable>
  );
};

render(<App />);
```

## Scrolling it

**By keyboard.** When focused (see `isActive`), `Scrollable` handles:

- `↑` / `↓`: one row
- `PgUp` / `PgDn`: one page (a viewport, less a row of overlap)
- `g` / `G`: top / bottom

**Programmatically**, own the offset yourself with the `useScroll` hook and pass it back in:

```tsx
const scroll = useScroll({viewportHeight: 20, contentHeight: lines.length});

// scroll.scrollBy(5); scroll.scrollToBottom(); scroll.atBottom; ...
<Scrollable height={20} offset={scroll.offset} onScroll={() => {}}>
  {lines}
</Scrollable>
```

`Scrollable` is uncontrolled by default (it owns the offset). Pass `offset` to control it, and `onScroll` fires after every move in both modes.

## Following a log

For an append-only log, `followTail` pins the view to the bottom as content grows, and quietly disengages the moment the reader scrolls up:

```tsx
<Pane rect={logPane}>
  <Scrollable rect={logPane} followTail>
    {log.map((line, i) => <Text key={i}>{line}</Text>)}
  </Scrollable>
</Pane>
```

## Sizing

Give the viewport a size one of two ways:

- `rect` — sized to `interiorOf(rect)`, the drawable area inside a pane's border. This is the common
  case and keeps the viewport in lockstep with the frame.
- `height` (and optional `width`) — an explicit size, for use outside a frame. Without `width`, the
  viewport fills the width its parent gives it.

By default the content's height is **measured** after render so the scroll offset can clamp to real bounds. If you already know it (virtualized content, or a fixed line count), pass `contentHeight` to skip measuring. That is also what makes behavior deterministic in tests.

## The scrollbar

A one-column bar in the last interior column, shown per `scrollbar`:

- `'auto'` (default) — only when the content overflows
- `'always'` — always
- `'never'` — never

The thumb's size tracks the visible fraction and its position tracks the scroll progress.

## API

| Export | Kind | Notes |
| --- | --- | --- |
| `Scrollable` | component | The viewport. Props below. |
| `useScroll` | hook | Offset state + `scrollTo`/`scrollBy`/`scrollToTop`/`scrollToBottom`, clamped, with follow-tail. |
| `ScrollState` | type | `{offset, maxOffset, atTop, atBottom}`. |
| `maxOffset`, `clampOffset`, `pageSize`, `overflows` | functions | The pure geometry, exported for advanced use. |

`Scrollable` props: `rect?`, `height?`, `width?`, `offset?`, `onScroll?`, `contentHeight?`,
`followTail?`, `scrollbar?` (`'auto'` \| `'always'` \| `'never'`), `keyboard?`, `isActive?`.

## Notes and limits

- **Vertical only, for now.** Horizontal scrolling is not implemented yet; the internals are laid out so it can be added without breaking this API.
- **One-frame settle.** When the height is measured (no `contentHeight`), a newly mounted or newly grown viewport takes one frame to learn its content height. Pass `contentHeight` to avoid it.
- **Several viewports.** Each `Scrollable` captures keys when `keyboard` and `isActive` are both true. With more than one on screen, drive `isActive` from your focus logic so only the focused one moves.
- **Not virtualized.** All children render even when off-screen. Fine for hundreds of lines; for very large content, pass a windowed subset plus `contentHeight`.

## License

MIT © Oliver Yasuna
