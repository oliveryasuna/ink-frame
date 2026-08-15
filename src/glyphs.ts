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

interface GlyphStyles {
  normal: string;
  bold: string;
  double: string;
}

const GLYPHS = (new Map<number, GlyphStyles>([
  [
    (UP | DOWN),
    {
      normal: figures.lineVertical,
      bold: figures.lineVerticalBold,
      double: figures.lineVerticalDouble
    }
  ],
  [
    (LEFT | RIGHT),
    {
      normal: figures.line,
      bold: figures.lineBold,
      double: figures.lineDouble
    }
  ],
  [
    (DOWN | RIGHT),
    {
      normal: figures.lineDownRight,
      bold: figures.lineDownBoldRightBold,
      double: figures.lineDownDoubleRightDouble
    }
  ],
  [
    (DOWN | LEFT),
    {
      normal: figures.lineDownLeft,
      bold: figures.lineDownBoldLeftBold,
      double: figures.lineDownDoubleLeftDouble
    }
  ],
  [
    (UP | RIGHT),
    {
      normal: figures.lineUpRight,
      bold: figures.lineUpBoldRightBold,
      double: figures.lineUpDoubleRightDouble
    }
  ],
  [
    (UP | LEFT),
    {
      normal: figures.lineUpLeft,
      bold: figures.lineUpBoldLeftBold,
      double: figures.lineUpDoubleLeftDouble
    }
  ],
  [
    ((UP | DOWN) | RIGHT),
    {
      normal: figures.lineUpDownRight,
      bold: figures.lineUpBoldDownBoldRightBold,
      double: figures.lineUpDoubleDownDoubleRightDouble
    }
  ],
  [
    ((UP | DOWN) | LEFT),
    {
      normal: figures.lineUpDownLeft,
      bold: figures.lineUpBoldDownBoldLeftBold,
      double: figures.lineUpDoubleDownDoubleLeftDouble
    }
  ],
  [
    ((DOWN | LEFT) | RIGHT),
    {
      normal: figures.lineDownLeftRight,
      bold: figures.lineDownBoldLeftBoldRightBold,
      double: figures.lineDownDoubleLeftDoubleRightDouble
    }
  ],
  [
    ((UP | LEFT) | RIGHT),
    {
      normal: figures.lineUpLeftRight,
      bold: figures.lineUpBoldLeftBoldRightBold,
      double: figures.lineUpDoubleLeftDoubleRightDouble
    }
  ],
  [
    ((UP | DOWN | LEFT) | RIGHT),
    {
      normal: figures.lineUpDownLeftRight,
      bold: figures.lineUpBoldDownBoldLeftBoldRightBold,
      double: figures.lineUpDoubleDownDoubleLeftDoubleRightDouble
    }
  ],
  // Stubs, which a well-formed box never produces but a clipped one can.
  [
    UP,
    {
      normal: figures.lineVertical,
      bold: figures.lineVerticalBold,
      double: figures.lineVerticalDouble
    }
  ],
  [
    DOWN,
    {
      normal: figures.lineVertical,
      bold: figures.lineVerticalBold,
      double: figures.lineVerticalDouble
    }
  ],
  [
    LEFT,
    {
      normal: figures.line,
      bold: figures.lineBold,
      double: figures.lineDouble
    }
  ],
  [
    RIGHT,
    {
      normal: figures.line,
      bold: figures.lineBold,
      double: figures.lineDouble
    }
  ]
]));

/** The character for a cell, or a space where no line passes through it. */
const glyphFor = ((
  edges: number,
  style: (keyof GlyphStyles)
): string => (GLYPHS.get(edges)?.[style] ?? ' '));

export type {
  GlyphStyles
};
export {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  glyphFor
};
