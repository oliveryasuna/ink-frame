import type {ScrollState} from './scroll';
import type {Rect} from '@oliveryasuna/ink-frame';
import type {ReactNode} from 'react';

/** When the scrollbar is shown. */
type ScrollbarMode = ('auto' | 'always' | 'never');

interface ScrollableProps {
  /**
   * Size the viewport from a pane's rect: the content fills `interiorOf(rect)`.
   * Takes precedence over `height`/`width`.
   */
  rect?: Rect;
  /** Explicit viewport height in rows. Used when `rect` is not given. */
  height?: number;
  /**
   * Explicit viewport width in columns. Used when `rect` is not given; when
   * omitted the viewport fills the width its parent gives it.
   */
  width?: number;
  /** Controlled vertical offset. Omit to let the component own it. */
  offset?: number;
  /** Notified after every scroll, in both controlled and uncontrolled modes. */
  onScroll?(state: ScrollState): void;
  /**
   * Skip measuring and use this content height (rows). Deterministic, and the
   * right choice for virtualized or otherwise-known content.
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering -- Clean.
  contentHeight?: number;
  /** Pin to the bottom as content grows; disengages when scrolled up. */
  // eslint-disable-next-line @typescript-eslint/member-ordering -- Clean.
  followTail?: boolean;
  /** When to show the scrollbar. Default `'auto'`. */
  // eslint-disable-next-line @typescript-eslint/member-ordering -- Clean.
  scrollbar?: ScrollbarMode;
  /** Capture arrow and page keys. Default `true`. */
  // eslint-disable-next-line @typescript-eslint/member-ordering -- Clean.
  keyboard?: boolean;
  /**
   * Gate keyboard capture, e.g. only the focused pane. Default `true`. With
   * several scrollables on screen, set this so only one consumes keys.
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering -- Clean.
  isActive?: boolean;
  // eslint-disable-next-line @typescript-eslint/member-ordering -- Clean.
  children?: ReactNode;
}

export type {
  ScrollbarMode,
  ScrollableProps
};
