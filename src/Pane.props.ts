import type {Rect} from './rect';
import type {BoxProps} from 'ink';
import type React from 'react';

/**
 * Every `Box` prop passes through to the pane's content, which is laid inside
 * the border. Position and size are fixed by the `rect` and cannot be
 * overridden.
 */
type PaneProps = (BoxProps & {
  /** The box's outer bounds, borders included. */
  rect: Rect;
  children?: React.ReactNode;
});

export type {
  PaneProps
};
