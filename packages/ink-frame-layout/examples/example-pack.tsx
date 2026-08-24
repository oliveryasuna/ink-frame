import {Frame, Pane} from '@oliveryasuna/ink-frame';
import {render, Text, useStdout} from 'ink';
import {grid} from '../src';

/**
 * `seams: 'pack'` butts the areas edge to edge with no shared cell, which is
 * what a `noBorders` frame wants: with no borders to share, a shared cell would
 * just be overlapping content. The backgrounds make the tight tiling visible.
 *
 * Run it with `bun examples/example-pack.tsx`.
 */
const PackExample = (() => {
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
      rows: [3, 'grow', 3],
      seams: 'pack'
    }
  );

  return (
    <Frame width={width} height={height} noBorders>
      <Pane rect={areas.header} backgroundColor="cyan" paddingX={1}>
        <Text color="black">header</Text>
      </Pane>

      <Pane rect={areas.side} backgroundColor="blue" paddingX={1}>
        <Text color="white">sidebar · seams: pack</Text>
      </Pane>

      <Pane rect={areas.main} backgroundColor="magenta" paddingX={1}>
        <Text color="white">main</Text>
      </Pane>

      <Pane rect={areas.footer} backgroundColor="gray" paddingX={1}>
        <Text color="white">footer</Text>
      </Pane>
    </Frame>
  );
});

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- Supported.
if(import.meta.main) {
  render(<PackExample />, {alternateScreen: true});
}

export {
  PackExample
};
