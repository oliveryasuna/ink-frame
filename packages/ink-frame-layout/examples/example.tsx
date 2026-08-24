import {Frame, Pane} from '@oliveryasuna/ink-frame';
import {render, Text, useStdout} from 'ink';
import {grid} from '../src';

/**
 * A header / sidebar / main / footer dashboard from one grid template.
 *
 * `side` spans both body rows and `header` spans both columns. The default
 * `'share'` seam overlaps neighbours by a cell, so their borders join inside the
 * `Frame`.
 *
 * Run it with `bun examples/example.tsx`.
 */
const Example = (() => {
  const {stdout} = useStdout();
  const width = (stdout.columns || 80);
  const height = (stdout.rows || 24);

  const areas = grid(
    {
      left: 0,
      top: 0,
      width: width,
      height: height
    },
    {
      areas: [
        ['header', 'header'],
        ['side', 'main'],
        ['side', 'footer']
      ],
      columns: [24, 'grow'],
      rows: [3, 'grow', 3]
    }
  );

  return (
    <Frame width={width} height={height} borderColor="cyan">
      <Pane rect={areas.header} paddingX={1} justifyContent="space-between">
        <Text bold>ink-frame-layout</Text>
        <Text dimColor>Ctrl-C to exit</Text>
      </Pane>

      <Pane rect={areas.side} paddingX={1} flexDirection="column">
        <Text>sidebar</Text>
        <Text dimColor>columns [24, grow]</Text>
      </Pane>

      <Pane rect={areas.main} paddingX={1} flexDirection="column">
        <Text>main</Text>
        <Text dimColor>one cell</Text>
      </Pane>

      <Pane rect={areas.footer} paddingX={1}>
        <Text dimColor>footer</Text>
      </Pane>
    </Frame>
  );
});

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- Supported.
if(import.meta.main) {
  render(<Example />, {alternateScreen: true});
}

export {
  Example
};
