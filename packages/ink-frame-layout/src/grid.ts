import type {AreaBounds} from './areas';
import type {PaneSize, Rect} from '@oliveryasuna/ink-frame';
import {packColumns, packRows, splitColumns, splitRows} from '@oliveryasuna/ink-frame';
import {analyzeAreas} from './areas';
import {at} from './util';

/**
 * A track size: a fixed number of cells, or `'grow'` to share the remainder.
 */
type Track = PaneSize;

/**
 * How adjacent areas meet:
 * - `'share'` (default): neighbours overlap by a cell to share a border, for a
 *   `Frame`.
 * - `'pack'`: neighbours butt edge to edge with no shared cell, for a
 *   `noBorders` frame.
 */
type Seams = ('share' | 'pack');

/**
 * A grid template: a matrix of area names plus the column and row track sizes.
 *
 * `areas` is row-major; every row must have the same length, `columns` must
 * have one entry per column and `rows` one per row. A `'.'` cell is a gap. Each
 * name must form a solid rectangle (it may span several tracks).
 */
interface GridTemplate<Areas extends (readonly (readonly string[])[])> {
  areas: Areas;
  columns: (readonly Track[]);
  rows: (readonly Track[]);
  seams?: Seams;
}

/** A rect per unique area name in the template (gaps excluded). */
type GridResult<Areas extends (readonly (readonly string[])[])> =
  Record<Exclude<Areas[number][number], '.'>, Rect>;

/** The bounding rect of the tracks an area spans. */
const areaRect = ((
  span: AreaBounds,
  columnTracks: (readonly Rect[]),
  rowTracks: (readonly Rect[])
): Rect => {
  const firstColumn = at(columnTracks, span.colStart);
  const lastColumn = at(columnTracks, span.colEnd);
  const firstRow = at(rowTracks, span.rowStart);
  const lastRow = at(rowTracks, span.rowEnd);

  return {
    left: firstColumn.left,
    top: firstRow.top,
    width: ((lastColumn.left + lastColumn.width) - firstColumn.left),
    height: ((lastRow.top + lastRow.height) - firstRow.top)
  };
});

/**
 * Compiles a {@link GridTemplate} against `rect` into a rect per named area.
 *
 * A grid is separable, so the geometry comes straight from ink-frame's public
 * splitters: the columns divide `rect`'s width and the rows divide its height,
 * and each area is the bounding box of the tracks it covers. Using `split*` /
 * `pack*` means the rounding and shared-border overlap match a hand-written
 * split exactly, with nothing re-derived here.
 *
 * @example
 * ```ts
 * const areas = grid(root, {
 *   areas: [['header', 'header'], ['side', 'main'], ['side', 'footer']],
 *   columns: [24, 'grow'],
 *   rows: [3, 'grow', 3]
 * });
 * // areas.header, areas.side, areas.main, areas.footer
 * ```
 */
const grid = (<const Areas extends (readonly (readonly string[])[])>(
  rect: Rect,
  template: GridTemplate<Areas>
): GridResult<Areas> => {
  const {areas, columns, rows, seams = 'share'} = template;
  const {rowCount, colCount, bounds} = analyzeAreas(areas);

  if(columns.length !== colCount) {
    throw (new Error(`grid: \`columns\` has ${columns.length} tracks, but the template has ${colCount} columns.`));
  }
  if(rows.length !== rowCount) {
    throw (new Error(`grid: \`rows\` has ${rows.length} tracks, but the template has ${rowCount} rows.`));
  }

  const overlap = (seams === 'share');
  const columnTracks = (overlap ? splitColumns(rect, columns) : packColumns(rect, columns));
  const rowTracks = (overlap ? splitRows(rect, rows) : packRows(rect, rows));

  const result: Record<string, Rect> = {};
  for(const [name, span] of bounds) {
    result[name] = areaRect(span, columnTracks, rowTracks);
  }

  // Every unique, non-gap name is mapped exactly once, so the keys match the
  // template's names.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Keys match the template.
  return (result as GridResult<Areas>);
});

export type {
  Track,
  Seams,
  GridTemplate,
  GridResult
};
export {
  grid
};
