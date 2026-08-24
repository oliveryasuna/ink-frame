import type {ScrollState} from './scroll';
import {useCallback, useState} from 'react';
import {clampOffset, maxOffset, pageSize} from './scroll';

interface UseScrollOptions {
  /** Rows the viewport can show. */
  viewportHeight: number;
  /** Rows the content actually is. */
  contentHeight: number;
  /** Pin to the bottom as content grows; disengages once scrolled away. */
  followTail?: boolean;
  /** Controlled offset. When set, the hook does not own the offset state. */
  offset?: number;
  /** Notified after every move, in both controlled and uncontrolled modes. */
  onScroll?(state: ScrollState): void;
}

interface UseScrollResult extends ScrollState {
  /** Rows a page key moves. */
  page: number;
  scrollTo(offset: number): void;
  scrollBy(delta: number): void;
  scrollToTop(): void;
  scrollToBottom(): void;
}

const stateOf = ((
  offset: number,
  max: number
): ScrollState => ({
  offset: offset,
  maxOffset: max,
  atTop: (offset <= 0),
  atBottom: (offset >= max)
}));

/**
 * Owns a viewport's scroll offset, clamped to content bounds, with follow-tail
 * pinning. Works controlled (pass `offset` + `onScroll`) or uncontrolled. The
 * geometry lives in `./scroll`; this only wires it to React state.
 *
 * Follow-tail is derived rather than pinned by an effect: while the user has
 * not scrolled away (`stuck`), the offset simply tracks the bottom, so content
 * growth keeps us pinned with no ref writes or state updates during render.
 */
// eslint-disable-next-line max-lines-per-function -- Clean.
const useScroll = ((options: UseScrollOptions): UseScrollResult => {
  const {
    viewportHeight,
    contentHeight,
    followTail = false,
    offset: controlled,
    // eslint-disable-next-line @typescript-eslint/unbound-method -- A plain callback prop, not a method.
    onScroll
  } = options;

  const isControlled = (controlled !== undefined);
  const [internal, setInternal] = useState(0);
  // The user's intent to stay pinned to the bottom. Toggled only when they
  // move, never during render, so it survives content growth.
  const [stuck, setStuck] = useState(true);

  const max = maxOffset(contentHeight, viewportHeight);
  const raw = (isControlled ? controlled : internal);
  const offset = ((followTail && stuck) ? max : clampOffset(raw, contentHeight, viewportHeight));

  const commit = useCallback(
    ((next: number): void => {
      const nextMax = maxOffset(contentHeight, viewportHeight);
      const clamped = clampOffset(next, contentHeight, viewportHeight);

      if(!isControlled) {
        setInternal(clamped);
      }

      setStuck(clamped >= nextMax);
      onScroll?.(stateOf(clamped, nextMax));
    }),
    [contentHeight, viewportHeight, isControlled, onScroll]
  );

  return {
    ...stateOf(offset, max),
    page: pageSize(viewportHeight),
    scrollTo: useCallback(
      ((to: number): void => {
        commit(to);
      }),
      [commit]
    ),
    scrollBy: useCallback(
      ((delta: number): void => {
        commit(offset + delta);
      }),
      [commit, offset]
    ),
    scrollToTop: useCallback(
      ((): void => {
        commit(0);
      }),
      [commit]
    ),
    scrollToBottom: useCallback(
      ((): void => {
        commit(max);
      }),
      [commit, max]
    )
  };
});

export type {
  UseScrollOptions,
  UseScrollResult
};
export {
  useScroll
};
