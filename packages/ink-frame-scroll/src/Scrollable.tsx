import type {ScrollableProps} from './Scrollable.props';
import type {DOMElement} from 'ink';
import {interiorOf} from '@oliveryasuna/ink-frame';
import {Box, measureElement, useInput} from 'ink';
import {useEffect, useRef, useState} from 'react';
import {overflows} from './scroll';
import {Scrollbar} from './Scrollbar';
import {useScroll} from './useScroll';

/**
 * A scrollable viewport sized to an ink-frame rect (or an explicit height).
 *
 * The content is rendered at its natural height inside a fixed, clipped box and
 * shifted up by the scroll offset, so nothing here reaches into the border grid:
 * it drops straight into a `Pane`'s children, or stands alone.
 *
 * @example
 * ```tsx
 * <Pane rect={main}>
 *   <Scrollable rect={main} followTail>
 *     {log.map((line, i) => <Text key={i}>{line}</Text>)}
 *   </Scrollable>
 * </Pane>
 * ```
 */
const Scrollable = ((
  {
    rect,
    height,
    width,
    offset: controlledOffset,
    // eslint-disable-next-line @typescript-eslint/unbound-method -- Safe.
    onScroll,
    contentHeight: contentHeightProp,
    followTail = false,
    scrollbar = 'auto',
    keyboard = true,
    isActive = true,
    children
  }: ScrollableProps
// eslint-disable-next-line complexity -- Clean.
) => {
  const viewport =
    ((rect === undefined)
      ? {
          width: width,
          height: (height ?? 0)
        }
      : interiorOf(rect));
  const viewportHeight = viewport.height;

  const innerRef = useRef<DOMElement | null>(null);
  const [measured, setMeasured] = useState(0);
  const contentHeight = (contentHeightProp ?? measured);

  // Measure the natural content height when we are not told it, so the offset
  // clamps to real bounds. Deliberately runs after every render, with no dep
  // list, so content growth is picked up; the equality guard stops the loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentional per-render measure.
  useEffect((() => {
    if((contentHeightProp === undefined) && (innerRef.current !== null)) {
      const {height: natural} = measureElement(innerRef.current);

      setMeasured(prev => ((prev === natural) ? prev : natural));
    }
  }));

  const scroll = useScroll({
    viewportHeight: viewportHeight,
    contentHeight: contentHeight,
    followTail: followTail,
    offset: controlledOffset,
    onScroll: onScroll
  });

  useInput(
    ((input, key) => {
      if(key.downArrow) {
        scroll.scrollBy(1);
      } else if(key.upArrow) {
        scroll.scrollBy(-1);
      } else if(key.pageDown) {
        scroll.scrollBy(scroll.page);
      } else if(key.pageUp) {
        scroll.scrollBy(-scroll.page);
      } else if(input === 'g') {
        scroll.scrollToTop();
      } else if(input === 'G') {
        scroll.scrollToBottom();
      }
    }),
    {isActive: (keyboard && isActive)}
  );

  if(viewportHeight <= 0) {
    return null;
  }

  const showBar = ((scrollbar === 'always') || ((scrollbar === 'auto') && overflows(contentHeight, viewportHeight)));

  return (
    <Box
      width={viewport.width}
      height={viewportHeight}
      flexDirection="row"
    >
      <Box
        flexGrow={1}
        height={viewportHeight}
        flexDirection="column"
        overflow="hidden"
      >
        <Box
          ref={innerRef}
          flexShrink={0}
          flexDirection="column"
          marginTop={-scroll.offset}
        >
          {children}
        </Box>
      </Box>

      {showBar
        ? (
            <Scrollbar
              height={viewportHeight}
              offset={scroll.offset}
              contentHeight={contentHeight}
            />
          )
        : null}
    </Box>
  );
});

export {
  Scrollable
};
