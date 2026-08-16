import type {GlyphStyles} from './glyphs';
import type {BoxProps} from 'ink';
import type React from 'react';

interface FrameProps {
  width: number;
  height: number;
  borderStyle?: (keyof GlyphStyles);
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
  FrameProps
};
