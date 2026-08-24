import {Frame, Pane} from '@oliveryasuna/ink-frame';
import {render, Text, useStdout} from 'ink';
import {grid, template} from '../src';

/**
 * The same dashboard, written with the `template` tag: an aligned, multi-line
 * map that reads like the screen. Whitespace runs collapse, so columns can be
 * padded. Names widen to `string`, so the keys are not checked at compile time.
 *
 * Run it with `bun examples/example-template.tsx`.
 */
const TemplateExample = (() => {
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
      areas: template`
      header header
      side   main
      side   footer
    `,
      columns: [24, 'grow'],
      rows: [3, 'grow', 3]
    }
  );

  return (
    <Frame width={width} height={height}>
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Safe. */}
      <Pane rect={areas.header!} paddingX={1}>
        <Text bold>template`...`</Text>
      </Pane>

      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Safe. */}
      <Pane rect={areas.side!} paddingX={1}>
        <Text>sidebar</Text>
      </Pane>

      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Safe. */}
      <Pane rect={areas.main!} paddingX={1}>
        <Text>main</Text>
      </Pane>

      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Safe. */}
      <Pane rect={areas.footer!} paddingX={1}>
        <Text dimColor>footer</Text>
      </Pane>
    </Frame>
  );
});

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- Supported.
if(import.meta.main) {
  render(<TemplateExample />, {alternateScreen: true});
}

export {
  TemplateExample
};
