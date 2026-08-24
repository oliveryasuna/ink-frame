/**
 * The scroll geometry, kept pure and free of React so it can be reasoned about
 * and tested on its own. The components and hook are thin shells over these.
 */

/** A snapshot of a viewport's scroll position. */
interface ScrollState {
  /** Rows scrolled past the top. */
  offset: number;
  /** The furthest `offset` can go. */
  maxOffset: number;
  atTop: boolean;
  atBottom: boolean;
}

/** Thumb geometry for a scrollbar track. */
interface ScrollbarThumb {
  /** Thumb length in cells, at least one when there is a track. */
  size: number;
  /** Thumb offset from the track's start, in cells. */
  start: number;
}

/**
 * The furthest a viewport can scroll: the content past its edge, never
 * negative.
 */
const maxOffset = ((
  contentSize: number,
  viewportSize: number
): number => Math.max(0, (contentSize - viewportSize)));

/** Whether content overflows its viewport, and so can scroll at all. */
const overflows = ((
  contentSize: number,
  viewportSize: number
): boolean => (contentSize > viewportSize));

/** Clamps a desired offset into `[0, maxOffset]`, rounding toward zero. */
const clampOffset = ((
  offset: number,
  contentSize: number,
  viewportSize: number
): number => Math.min(Math.max(0, Math.trunc(offset)), maxOffset(contentSize, viewportSize)));

/**
 * How far a page key moves: one viewport, less a row of overlap so the reader
 * keeps a line of context across the jump. Always at least one row.
 */
const pageSize = ((viewportSize: number): number => Math.max(1, (viewportSize - 1)));

/**
 * Thumb geometry for a track `viewportSize` cells tall. Size is proportional to
 * the visible fraction of the content; position to the scroll progress. Both
 * clamp so the thumb stays whole and on the track at the extremes.
 *
 * When the content does not overflow, the thumb fills the whole track (a full
 * bar reads as "nothing to scroll"); a zero-length track yields a zero thumb.
 */
const scrollbarThumb = ((
  offset: number,
  contentSize: number,
  viewportSize: number
): ScrollbarThumb => {
  if(viewportSize <= 0) {
    return {
      size: 0,
      start: 0
    };
  }

  if(!overflows(contentSize, viewportSize)) {
    return {
      size: viewportSize,
      start: 0
    };
  }

  const size = Math.max(1, Math.round(((viewportSize * viewportSize) / contentSize)));
  const travel = (viewportSize - size);
  const max = maxOffset(contentSize, viewportSize);
  const clamped = clampOffset(offset, contentSize, viewportSize);
  const start = ((max === 0) ? 0 : Math.round(((clamped / max) * travel)));

  return {
    size: size,
    start: Math.min(Math.max(0, start), travel)
  };
});

export type {
  ScrollState,
  ScrollbarThumb
};
export {
  maxOffset,
  overflows,
  clampOffset,
  pageSize,
  scrollbarThumb
};
