import type {BorderStyle} from './Frame.props';
import figures from 'figures';

/**
 * Which sides of a grid cell a line continues into.
 *
 * Borders are described as edges rather than as characters so that a cell where
 * several boxes meet resolves to one glyph. Painting two adjacent boxes ORs
 * their edges together, and `┬`, `┤`, `┼` and the rest fall out of the result
 * instead of every junction being a case to handle.
 */
const UP = 1;
const DOWN = 2;
const LEFT = 4;
const RIGHT = 8;

const GLYPHS = (new Map<number, Record<BorderStyle, string>>([
  [
    (UP | DOWN),
    {
      normal: figures.lineVertical,
      single: figures.lineVertical,
      bold: figures.lineVerticalBold,
      double: figures.lineVerticalDouble,
      none: ' '
    }
  ],
  [
    (LEFT | RIGHT),
    {
      normal: figures.line,
      single: figures.line,
      bold: figures.lineBold,
      double: figures.lineDouble,
      none: ' '
    }
  ],
  [
    (DOWN | RIGHT),
    {
      normal: figures.lineDownRight,
      single: figures.lineDownRight,
      bold: figures.lineDownBoldRightBold,
      double: figures.lineDownDoubleRightDouble,
      none: ' '
    }
  ],
  [
    (DOWN | LEFT),
    {
      normal: figures.lineDownLeft,
      single: figures.lineDownLeft,
      bold: figures.lineDownBoldLeftBold,
      double: figures.lineDownDoubleLeftDouble,
      none: ' '
    }
  ],
  [
    (UP | RIGHT),
    {
      normal: figures.lineUpRight,
      single: figures.lineUpRight,
      bold: figures.lineUpBoldRightBold,
      double: figures.lineUpDoubleRightDouble,
      none: ' '
    }
  ],
  [
    (UP | LEFT),
    {
      normal: figures.lineUpLeft,
      single: figures.lineUpLeft,
      bold: figures.lineUpBoldLeftBold,
      double: figures.lineUpDoubleLeftDouble,
      none: ' '
    }
  ],
  [
    ((UP | DOWN) | RIGHT),
    {
      normal: figures.lineUpDownRight,
      single: figures.lineUpDownRight,
      bold: figures.lineUpBoldDownBoldRightBold,
      double: figures.lineUpDoubleDownDoubleRightDouble,
      none: ' '
    }
  ],
  [
    ((UP | DOWN) | LEFT),
    {
      normal: figures.lineUpDownLeft,
      single: figures.lineUpDownLeft,
      bold: figures.lineUpBoldDownBoldLeftBold,
      double: figures.lineUpDoubleDownDoubleLeftDouble,
      none: ' '
    }
  ],
  [
    ((DOWN | LEFT) | RIGHT),
    {
      normal: figures.lineDownLeftRight,
      single: figures.lineDownLeftRight,
      bold: figures.lineDownBoldLeftBoldRightBold,
      double: figures.lineDownDoubleLeftDoubleRightDouble,
      none: ' '
    }
  ],
  [
    ((UP | LEFT) | RIGHT),
    {
      normal: figures.lineUpLeftRight,
      single: figures.lineUpLeftRight,
      bold: figures.lineUpBoldLeftBoldRightBold,
      double: figures.lineUpDoubleLeftDoubleRightDouble,
      none: ' '
    }
  ],
  [
    ((UP | DOWN | LEFT) | RIGHT),
    {
      normal: figures.lineUpDownLeftRight,
      single: figures.lineUpDownLeftRight,
      bold: figures.lineUpBoldDownBoldLeftBoldRightBold,
      double: figures.lineUpDoubleDownDoubleLeftDoubleRightDouble,
      none: ' '
    }
  ],
  // Stubs, which a well-formed box never produces but a clipped one can.
  [
    UP,
    {
      normal: figures.lineVertical,
      single: figures.lineVertical,
      bold: figures.lineVerticalBold,
      double: figures.lineVerticalDouble,
      none: ' '
    }
  ],
  [
    DOWN,
    {
      normal: figures.lineVertical,
      single: figures.lineVertical,
      bold: figures.lineVerticalBold,
      double: figures.lineVerticalDouble,
      none: ' '
    }
  ],
  [
    LEFT,
    {
      normal: figures.line,
      single: figures.line,
      bold: figures.lineBold,
      double: figures.lineDouble,
      none: ' '
    }
  ],
  [
    RIGHT,
    {
      normal: figures.line,
      single: figures.line,
      bold: figures.lineBold,
      double: figures.lineDouble,
      none: ' '
    }
  ]
]));

/** The character for a cell, or a space where no line passes through it. */
const glyphFor = ((
  edges: number,
  style: BorderStyle
): string => (GLYPHS.get(edges)?.[style] ?? ' '));

export {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  glyphFor
};
