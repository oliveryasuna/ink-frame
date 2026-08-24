import type {Rect} from '../src';
import {render, Text, useStdout} from 'ink';
import {Frame, packColumns, packRows, Pane} from '../src';

/** Rows a header or footer band takes. No borders, so this is all content. */
const BAND = 3;

/**
 * `noBorders` on one screen.
 *
 * With `noBorders`, a pane's content fills its whole `rect`, and no cell is
 * reserved for a border. The panes are laid out with `packColumns` / `packRows`
 * rather than `splitColumns` / `splitRows`, so neighbours butt edge to edge
 * with no shared cell: without that, the one-cell overlap the split functions
 * use to share a border would show up here as overlapping content.
 *
 * Each pane gets a background so the tight, gap-free tiling is visible without
 * any lines drawn.
 *
 * Run it with `bun examples/example-noborders.tsx`.
 */
const NoBordersExample = (() => {
  const {stdout} = useStdout();
  const width = (stdout.columns || 80);
  const height = (stdout.rows || 24);

  const root: Rect = {
    left: 0,
    top: 0,
    width: width,
    height: height
  };

  // `pack*` divides the same way `split*` does, minus the shared-border overlap,
  // so these sizes sum to exactly the width or height.
  const [header, body, footer] = packRows(root, [BAND, 'grow', BAND]);
  const [side, main] = packColumns(body, [24, 'grow']);
  const [upper, lower] = packRows(main, ['grow', 'grow']);

  return (
    <Frame width={width} height={height} noBorders>
      <Pane rect={header} backgroundColor="cyan" justifyContent="space-between">
        <Text bold color="black">Frame · noBorders</Text>
        <Text color="black">{`${width}x${height}`}</Text>
      </Pane>

      <Pane rect={side} backgroundColor="blue" flexDirection="column">
        <Text color="white">packColumns([24, grow])</Text>
        <Text color="whiteBright" dimColor>content fills the rect</Text>
      </Pane>

      <Pane rect={upper} backgroundColor="magenta">
        <Text color="white">no shared cell, no overlap</Text>
      </Pane>

      <Pane rect={lower} backgroundColor="green">
        <Text color="black">panes butt edge to edge</Text>
      </Pane>

      <Pane rect={footer} backgroundColor="gray" justifyContent="space-between">
        <Text color="white">packRows / packColumns</Text>
        <Text color="white">no borders drawn</Text>
      </Pane>
    </Frame>
  );
});

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- Supported.
if(import.meta.main) {
  render(<NoBordersExample />);
}

export {
  NoBordersExample
};
