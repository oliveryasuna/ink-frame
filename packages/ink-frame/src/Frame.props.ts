import type {BoxProps} from 'ink';
import type React from 'react';

// `normal` is deprecated and will be removed in the next major version.
// There is no way to mark a string in the union type as deprecated.
type BorderStyle = (
  | 'normal'
  | 'single'
  | 'bold'
  | 'double'
  | 'none'
);

interface FrameProps {
  width: number;
  height: number;
  borderStyle?: BorderStyle;
  borderColor?: BoxProps['borderColor'];
  /**
   * Draws no borders at all, and reserves no space for them: content fills each
   * pane's whole `rect`.
   *
   * This is not `borderStyle: 'none'`, which still paints the border ring as
   * spaces and keeps content inset by a cell on every side.
   */
  noBorders?: boolean;
  /** `Pane` elements. */
  children?: React.ReactNode;
}

export type {
  BorderStyle,
  FrameProps
};
