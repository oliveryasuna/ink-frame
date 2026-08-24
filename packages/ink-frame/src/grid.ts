import type {BorderStyle} from './Frame.props';
import type {Rect} from './rect';
import {DOWN, glyphFor, LEFT, RIGHT, UP} from './glyphs';

/**
 * Paints `rect`'s border into `edges`, a `height * width` grid of edge masks.
 *
 * Only the edges are recorded, never the characters. Two boxes that share a
 * column or row therefore combine into one junction when the grid is rendered.
 */
const paintRect = ((
  edges: number[],
  width: number,
  height: number,
  rect: Rect
): void => {
  if((rect.width < 2) || (rect.height < 2)) {
    return;
  }

  const right = ((rect.left + rect.width) - 1);
  const bottom = ((rect.top + rect.height) - 1);

  const add = ((
    x: number,
    y: number,
    mask: number
  ): void => {
    if((x < 0) || (y < 0) || (x >= width) || (y >= height)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Bounds checked above.
    edges[(y * width) + x] = (edges[(y * width) + x]! | mask);
  });

  for(let x = rect.left; x <= right; x += 1) {
    const horizontal = (((x > rect.left) ? LEFT : 0) | ((x < right) ? RIGHT : 0));

    add(x, rect.top, horizontal);
    add(x, bottom, horizontal);
  }

  for(let y = rect.top; y <= bottom; y += 1) {
    const vertical = (((y > rect.top) ? UP : 0) | ((y < bottom) ? DOWN : 0));

    add(rect.left, y, vertical);
    add(right, y, vertical);
  }
});

/** Renders every rect's border into one grid of lines. */
const renderBorders = ((
  width: number,
  height: number,
  rects: Rect[],
  borderStyle: BorderStyle
): string[] => {
  const edges = Array.from<number>({length: Math.max(0, (width * height))}).fill(0);

  for(const rect of rects) {
    paintRect(edges, width, height, rect);
  }

  return Array.from(
    {length: Math.max(0, height)},
    ((_, y: number): string =>
      (Array.from({length: Math.max(0, width)}, ((_2, x: number): string => glyphFor((edges[(y * width) + x] ?? 0), borderStyle))).join('')))
  );
});

export {
  paintRect,
  renderBorders
};
