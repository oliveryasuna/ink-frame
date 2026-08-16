import type {Rect} from '../src';
import {render, Text, useStdout} from 'ink';
import {Frame, interiorOf, Pane, splitColumns, splitRows} from '../src';

/** Rows a header or footer band takes, borders included. */
const BAND = 3;

/** Reports the space a pane actually has, using `interiorOf`. */
const Size = (({rect}: {rect: Rect;}) => {
  const interior = interiorOf(rect);

  return (<Text dimColor>{`${interior.width}x${interior.height}`}</Text>);
});

/**
 * Every `Frame` feature on one screen.
 *
 * Run it with `bun examples/example.tsx`.
 */
const FrameExample = (() => {
  const {stdout} = useStdout();
  const width = (stdout.columns || 80);
  const height = (stdout.rows || 24);

  const root: Rect = {
    left: 0,
    top: 0,
    width: width,
    height: height
  };

  // Splits nest freely, and adjacent rects overlap by a cell so that they share
  // a border. Sizes are cells, or `'grow'` to divide up what is left.
  const [header, body, footer] = splitRows(root, [BAND, 'grow', BAND]);
  const [side, main] = splitColumns(body, [24, 'grow']);
  const [list, sideKeys] = splitRows(side, ['grow', BAND]);
  const [upper, lower] = splitRows(main, ['grow', 'grow']);
  const [lowerLeft, lowerRight] = splitColumns(lower, ['grow', 'grow']);

  // A rect need not come from a split. This one sits inside `upper`, so its
  // border stays separate rather than merging with the pane around it.
  const inset: Rect = {
    left: (upper.left + 4),
    top: (upper.top + 2),
    width: 22,
    height: 5
  };

  return (
    <Frame width={width} height={height} borderColor="cyan">
      {/* `Pane` takes any Box prop for its content. */}
      <Pane rect={header} paddingX={1} justifyContent="space-between">
        <Text bold>Frame</Text>
        <Size rect={header} />
      </Pane>

      <Pane rect={list} paddingX={1} flexDirection="column">
        <Text>fixed width</Text>
        <Text dimColor>splitColumns([24, grow])</Text>
      </Pane>

      <Pane rect={sideKeys} paddingX={1}>
        <Text dimColor>a pane of its own</Text>
      </Pane>

      <Pane rect={upper} paddingX={1} flexDirection="column">
        <Text>grow</Text>
      </Pane>

      {/* Nested: borders do not merge with the pane containing it. */}
      <Pane rect={inset} paddingX={1} flexDirection="column">
        <Text>nested box</Text>
        <Size rect={inset} />
      </Pane>

      <Pane rect={lowerLeft} paddingX={1}>
        <Text dimColor>two grows share</Text>
      </Pane>

      <Pane rect={lowerRight} paddingX={1}>
        <Text dimColor>what is left</Text>
      </Pane>

      <Pane rect={footer} paddingX={1} justifyContent="space-between">
        <Text dimColor>junctions are derived, never written</Text>
        <Size rect={root} />
      </Pane>
    </Frame>
  );
});

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- Supported.
if(import.meta.main) {
  render(<FrameExample />);
}

export {
  FrameExample
};
