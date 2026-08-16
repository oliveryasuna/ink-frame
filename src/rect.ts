/** A box's outer bounds, borders included. */
interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** A fixed size in cells, or `'grow'` to share what the fixed ones leave. */
type PaneSize = (number | 'grow');

/**
 * The area inside a box's border. Empty when the box is too small to have one.
 */
const interiorOf = ((rect: Rect): Rect => ({
  left: (rect.left + 1),
  top: (rect.top + 1),
  width: Math.max(0, (rect.width - 2)),
  height: Math.max(0, (rect.height - 2))
}));

/** Cells a box needs before it has an interior: its two borders. */
const MINIMUM_SIZE = 2;

/**
 * Divides `total` among `sizes`.
 *
 * When `overlap` is set, adjacent boxes overlap by one cell so that they share
 * a border rather than drawing two side by side; the budget is inflated by one
 * cell per shared edge to make room for it. When it is not, the boxes butt
 * edge to edge and the sizes sum to exactly `total`.
 *
 * Fixed sizes are scaled down when they will not fit, rather than overflowing:
 * a terminal narrower than a sidebar should shrink the sidebar, not push the
 * panes past the edge of the screen.
 */
const divide = ((
  total: number,
  sizes: (readonly PaneSize[]),
  overlap: boolean
): number[] => {
  const shared = (overlap ? Math.max(0, (sizes.length - 1)) : 0);
  const budget = (total + shared);

  const requested = sizes.reduce<number>(((sum, size) => (sum + ((size === 'grow') ? 0 : size))), 0);
  const growing = sizes.filter(size => (size === 'grow')).length;

  const forFixed = Math.max(0, (budget - (growing * MINIMUM_SIZE)));
  const scale = (((requested > forFixed) && (requested > 0)) ? (forFixed / requested) : 1);

  const fixed = sizes.map(size => ((size === 'grow') ? 0 : Math.max(0, Math.floor((size * scale)))));
  const spent = fixed.reduce<number>(((sum, size) => (sum + size)), 0);

  let remaining = Math.max(0, (budget - spent));
  let unassigned = growing;

  return sizes.map((size, index) => {
    if(size !== 'grow') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Same length as `sizes`.
      return fixed[index]!;
    }

    const share = Math.floor((remaining / unassigned));

    remaining -= share;
    unassigned -= 1;

    return share;
  });
});

/**
 * Lays `sizes` out left to right across `rect`, sharing borders when `overlap`.
 */
const columns = ((
  rect: Rect,
  sizes: (readonly PaneSize[]),
  overlap: boolean
): Rect[] => {
  let left = rect.left;

  return divide(rect.width, sizes, overlap).map((width) => {
    const pane: Rect = {
      left: left,
      top: rect.top,
      width: width,
      height: rect.height
    };

    left += (overlap ? Math.max(0, (width - 1)) : width);

    return pane;
  });
});

/**
 *  Lays `sizes` out top to bottom down `rect`, sharing borders when `overlap`.
 */
const rows = ((
  rect: Rect,
  sizes: (readonly PaneSize[]),
  overlap: boolean
): Rect[] => {
  let top = rect.top;

  return divide(rect.height, sizes, overlap).map((height) => {
    const pane: Rect = {
      left: rect.left,
      top: top,
      width: rect.width,
      height: height
    };

    top += (overlap ? Math.max(0, (height - 1)) : height);

    return pane;
  });
});

// The cast on each wrapper below is safe: `columns`/`rows` return one rect per
// size, by construction, so the result has the tuple's shape, which is what
// lets callers destructure without a possibly-undefined check.

/**
 * Splits `rect` into a row of boxes, each sharing a border with its neighbour.
 *
 * The shared column is what makes the junction work: both boxes paint an edge
 * into it, so it resolves to `┬`/`┴`/`┼` rather than two parallel lines. Use
 * {@link packColumns} when the boxes should butt together with no shared cell.
 */
const splitColumns = (<const Sizes extends (readonly PaneSize[])>(
  rect: Rect,
  sizes: Sizes
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Length matches `sizes`.
): {[Index in (keyof Sizes)]: Rect} => (columns(rect, sizes, true) as {[Index in (keyof Sizes)]: Rect}));

/**
 * Splits `rect` into a column of boxes, each sharing a border with its
 * neighbour.
 */
const splitRows = (<const Sizes extends (readonly PaneSize[])>(
  rect: Rect,
  sizes: Sizes
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Length matches `sizes`.
): {[Index in (keyof Sizes)]: Rect} => (rows(rect, sizes, true) as {[Index in (keyof Sizes)]: Rect}));

/**
 * Packs `rect` into a row of boxes that butt edge to edge, sharing no cell.
 *
 * Unlike {@link splitColumns}, adjacent boxes do not overlap, so the sizes sum
 * to exactly the width. Pair this with a `noBorders` `Frame`, where a shared
 * border cell would otherwise become a cell of overlapping content.
 */
const packColumns = (<const Sizes extends (readonly PaneSize[])>(
  rect: Rect,
  sizes: Sizes
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Length matches `sizes`.
): {[Index in (keyof Sizes)]: Rect} => (columns(rect, sizes, false) as {[Index in (keyof Sizes)]: Rect}));

/**
 * Packs `rect` into a column of boxes that butt edge to edge, sharing no cell.
 *
 * The row counterpart to {@link packColumns}: adjacent boxes do not overlap, so
 * the sizes sum to exactly the height. Pair this with a `noBorders` `Frame`.
 */
const packRows = (<const Sizes extends (readonly PaneSize[])>(
  rect: Rect,
  sizes: Sizes
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Length matches `sizes`.
): {[Index in (keyof Sizes)]: Rect} => (rows(rect, sizes, false) as {[Index in (keyof Sizes)]: Rect}));

export type {
  Rect,
  PaneSize
};
export {
  interiorOf,
  splitColumns,
  splitRows,
  packColumns,
  packRows
};
