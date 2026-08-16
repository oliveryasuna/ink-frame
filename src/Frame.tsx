import type {FrameProps} from './Frame.props';
import type {PaneProps} from './Pane.props';
import type {ReactElement} from 'react';
import {Box, Text} from 'ink';
import {isValidElement} from 'react';
import {flattenChildren} from './children';
import {renderBorders} from './grid';
import {Pane} from './Pane';
import {interiorOf} from './rect';

/**
 * A grid of bordered boxes, nested or adjacent, whose borders join properly
 * where they meet.
 *
 * The borders are drawn as one character grid rather than as Ink box borders:
 * a box border is an unbroken line that cannot carry a junction glyph part-way
 * along it, so adjacent boxes would each draw their own edge and meet as `││`.
 * Painting edges into a shared grid resolves each cell once.
 *
 * Content is laid over that grid with absolute positioning, so a pane's
 * children are ordinary Ink elements and know nothing about the borders.
 *
 * `Pane` must be a direct child. The rects are read from the element tree.
 *
 * @example
 * ```tsx
 * const [header, body] = splitRows({left: 0, top: 0, width: cols, height: rows}, [3, 'grow']);
 * const [side, main] = splitColumns(body, [40, 'grow']);
 *
 * <Frame width={cols} height={rows}>
 *   <Pane rect={header}>{title}</Pane>
 *   <Pane rect={side}>{list}</Pane>
 *   <Pane rect={main}>{log}</Pane>
 * </Frame>
 * ```
 */
const Frame = ((
  {
    width,
    height,
    borderColor,
    borderStyle = 'normal',
    noBorders = false,
    children
  }: FrameProps
) => {
  const panes = flattenChildren(children)
    .filter((child): child is ReactElement<PaneProps> => (isValidElement(child) && (child.type === Pane)));

  const lines = (noBorders ? [] : renderBorders(width, height, panes.map(pane => pane.props.rect), borderStyle));

  return (
    <Box
      flexDirection="column"
      width={width}
      height={height}
    >
      {lines.map((line, row) => (
        <Text
          // eslint-disable-next-line @eslint-react/no-array-index-key -- Rows are positional.
          key={row}
          color={borderColor}
        >
          {line}
        </Text>
      ))}

      {panes.map((pane, index) => {
        const {rect, children: content, ...boxProps} = pane.props;
        // With borders, content sits inside the ring; without, it fills the
        // rect.
        const region = (noBorders ? rect : interiorOf(rect));

        if((content === undefined) || (region.width === 0) || (region.height === 0)) {
          return null;
        }

        return (
          <Box
            // eslint-disable-next-line @eslint-react/no-array-index-key -- Panes are positional.
            key={index}
            {...boxProps}
            position="absolute"
            marginLeft={region.left}
            marginTop={region.top}
            width={region.width}
            height={region.height}
            overflow="hidden"
          >
            {content}
          </Box>
        );
      })}
    </Box>
  );
});

export {
  Frame
};
