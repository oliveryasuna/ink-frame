import type {GlyphStyles} from './glyphs';
import type {BoxProps} from 'ink';
import type React from 'react';

interface FrameProps {
  width: number;
  height: number;
  borderStyle?: (keyof GlyphStyles);
  borderColor?: BoxProps['borderColor'];
  /** `Pane` elements. */
  children?: React.ReactNode;
}

export type {
  FrameProps
};
