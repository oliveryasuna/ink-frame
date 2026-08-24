/** A vertical scrollbar drawn in a single column beside the content. */
interface ScrollbarProps {
  /** Track height in rows. */
  height: number;
  /** Current scroll offset in rows. */
  offset: number;
  /** Natural content height in rows. */
  contentHeight: number;
}

export type {
  ScrollbarProps
};
