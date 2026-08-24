import {describe, expect, test} from 'bun:test';
import {Text} from 'ink';
import {render} from 'ink-testing-library';
import {Scrollable} from '../src/Scrollable';

/** `count` stacked lines, "L0".."L{count-1}", as Scrollable content. */
const lines = ((count: number) => (Array.from({length: count}, ((_unused, i) => (<Text key={i}>{`L${i}`}</Text>)))));

/** Which "L{n}" markers the frame shows, in order. */
const visibleLines = ((frame: (string | undefined)): number[] => ([...(frame ?? '').matchAll(/L(\d+)/g)].map(match => Number(match[1]))));

const tick = (async(): Promise<void> => {
  await (new Promise((resolve) => {
    setTimeout(resolve, 20);
  }));
});

describe(
  'Scrollable',
  (() => {
    test(
      'shows the window of content at a controlled offset',
      (() => {
        const {lastFrame} = render(
          <Scrollable height={4} contentHeight={10} offset={3}>
            {lines(10)}
          </Scrollable>
        );

        expect(visibleLines(lastFrame())).toEqual([3, 4, 5, 6]);
      })
    );

    test(
      'shows the top when offset is 0',
      (() => {
        const {lastFrame} = render(
          <Scrollable height={4} contentHeight={10} offset={0}>
            {lines(10)}
          </Scrollable>
        );

        expect(visibleLines(lastFrame())).toEqual([0, 1, 2, 3]);
      })
    );

    test(
      'clamps an over-scrolled offset to the last window',
      (() => {
        const {lastFrame} = render(
          <Scrollable height={4} contentHeight={10} offset={999}>
            {lines(10)}
          </Scrollable>
        );

        // maxOffset = 6, so the last window is L6..L9.
        expect(visibleLines(lastFrame())).toEqual([6, 7, 8, 9]);
      })
    );

    test(
      'draws a scrollbar only when content overflows',
      (() => {
        const overflowing = render(
          <Scrollable height={4} contentHeight={10} offset={0}>
            {lines(10)}
          </Scrollable>
        );
        const fits = render(
          <Scrollable height={4} contentHeight={3} offset={0}>
            {lines(3)}
          </Scrollable>
        );

        expect(overflowing.lastFrame()).toContain('█');
        expect(fits.lastFrame()).not.toContain('█');
      })
    );

    test(
      'moves the window on arrow and page keys',
      (async() => {
        const {stdin, lastFrame} = render(
          <Scrollable height={4} contentHeight={20}>
            {lines(20)}
          </Scrollable>
        );

        expect(visibleLines(lastFrame())[0]).toBe(0);

        stdin.write('[B');  // down arrow
        await tick();
        expect(visibleLines(lastFrame())[0]).toBe(1);

        stdin.write('[6~');  // page down
        await tick();
        // pageSize(4) = 3, so from offset 1 -> 4.
        expect(visibleLines(lastFrame())[0]).toBe(4);

        stdin.write('G');  // jump to bottom
        await tick();
        // maxOffset = 16, last window starts at L16.
        expect(visibleLines(lastFrame())[0]).toBe(16);
      })
    );

    test(
      'follow-tail stays pinned to the bottom as content grows',
      (async() => {
        const {rerender, lastFrame} = render(
          <Scrollable height={4} contentHeight={6} followTail>
            {lines(6)}
          </Scrollable>
        );

        await tick();
        expect(visibleLines(lastFrame())).toEqual([2, 3, 4, 5]);

        rerender(
          <Scrollable height={4} contentHeight={12} followTail>
            {lines(12)}
          </Scrollable>
        );
        await tick();

        expect(visibleLines(lastFrame())).toEqual([8, 9, 10, 11]);
      })
    );
  })
);
