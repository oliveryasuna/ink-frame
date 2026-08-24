import type {ScrollbarProps} from './Scrollbar.props';
import figures from 'figures';
import {Box, Text} from 'ink';
import {scrollbarThumb} from './scroll';

/** The rail behind the thumb. */
const TRACK_GLYPH = figures.lineVertical;
/** The draggable-looking part that marks the visible window. */
const THUMB_GLYPH = figures.square;

/**
 * A one-column vertical scrollbar. Purely presentational: it is handed the
 * offset and content height and draws the thumb {@link scrollbarThumb} computes.
 */
const Scrollbar = ((
  {
    height,
    offset,
    contentHeight
  }: ScrollbarProps
) => {
  const {size, start} = scrollbarThumb(offset, contentHeight, height);

  return (
    <Box
      flexDirection="column"
      width={1}
      flexShrink={0}
    >
      {Array.from(
        {length: Math.max(0, height)},
        ((_unused, row) => {
          const isThumb = ((row >= start) && (row < (start + size)));

          return (
            <Text

              key={row}
              dimColor={!isThumb}
            >
              {isThumb ? THUMB_GLYPH : TRACK_GLYPH}
            </Text>
          );
        })
      )}
    </Box>
  );
});

export {
  Scrollbar
};
