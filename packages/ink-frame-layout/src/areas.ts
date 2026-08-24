import {at} from './util';

/** The cell name that marks a deliberate gap: no area, no rect. */
const GAP = '.';

/** Row/column span of a named area within the template grid, inclusive. */
interface AreaBounds {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
}

/** The validated shape of an `areas` matrix. */
interface AreaLayout {
  rowCount: number;
  colCount: number;
  bounds: ReadonlyMap<string, AreaBounds>;
}

/** An area's bounding box plus how many cells actually carry its name. */
interface Extent extends AreaBounds {
  cells: number;
}

/** The number of rows and columns in an `areas` matrix. */
interface Dimensions {
  rowCount: number;
  colCount: number;
}

/** Validates the matrix is non-empty and rectangular, and returns its size. */
const dimensionsOf = ((areas: (readonly (readonly string[])[])): Dimensions => {
  const rowCount = areas.length;
  if(rowCount === 0) {
    throw (new Error('grid: `areas` must have at least one row.'));
  }

  const colCount = at(areas, 0).length;
  if(colCount === 0) {
    throw (new Error('grid: `areas` rows must have at least one column.'));
  }

  for(const [index, row] of areas.entries()) {
    if(row.length !== colCount) {
      throw (new Error(`grid: row ${index} has ${row.length} columns, but row 0 has ${colCount}.`));
    }
  }

  return {
    rowCount: rowCount,
    colCount: colCount
  };
});

/**
 * The extent grown to include cell (`row`, `col`); pure, never mutates `prev`.
 */
const grown = ((
  prev: (Extent | undefined),
  row: number,
  col: number
): Extent => {
  if(prev === undefined) {
    return {
      rowStart: row,
      rowEnd: row,
      colStart: col,
      colEnd: col,
      cells: 1
    };
  }

  return {
    rowStart: Math.min(prev.rowStart, row),
    rowEnd: Math.max(prev.rowEnd, row),
    colStart: Math.min(prev.colStart, col),
    colEnd: Math.max(prev.colEnd, col),
    cells: (prev.cells + 1)
  };
});

/** Gathers each name's bounding extent across the grid, skipping gaps. */
const extentsOf = ((
  areas: (readonly (readonly string[])[]),
  rowCount: number,
  colCount: number
): Map<string, Extent> => {
  const extents = (new Map<string, Extent>());

  for(let row = 0; row < rowCount; row += 1) {
    const cells = at(areas, row);

    for(let col = 0; col < colCount; col += 1) {
      const name = at(cells, col);
      if(name === GAP) {
        continue;
      }

      extents.set(name, grown(extents.get(name), row, col));
    }
  }

  return extents;
});

/**
 * Freezes extents into bounds, checking each area is a solid rectangle: it is
 * solid exactly when its cell count equals the area of its bounding box, which
 * rules out holes, L-shapes, and two disjoint blocks of one name.
 */
const boundsOf = ((extents: ReadonlyMap<string, Extent>): Map<string, AreaBounds> => {
  const bounds = (new Map<string, AreaBounds>());

  for(const [name, extent] of extents) {
    const rows = ((extent.rowEnd - extent.rowStart) + 1);
    const cols = ((extent.colEnd - extent.colStart) + 1);
    if(extent.cells !== (rows * cols)) {
      throw (new Error(`grid: area "${name}" is not a solid rectangle.`));
    }

    bounds.set(
      name,
      {
        rowStart: extent.rowStart,
        rowEnd: extent.rowEnd,
        colStart: extent.colStart,
        colEnd: extent.colEnd
      }
    );
  }

  return bounds;
});

/**
 * Validates an `areas` matrix and returns each area's bounds. Throws, naming
 * the offender, on an empty or ragged grid or a non-rectangular area. `'.'`
 * cells are gaps and produce no area.
 */
const analyzeAreas = ((areas: (readonly (readonly string[])[])): AreaLayout => {
  const {rowCount, colCount} = dimensionsOf(areas);
  const extents = extentsOf(areas, rowCount, colCount);

  return {
    rowCount: rowCount,
    colCount: colCount,
    bounds: boundsOf(extents)
  };
});

export type {
  AreaBounds,
  AreaLayout
};
export {
  GAP,
  analyzeAreas
};
