import type {PaneProps} from './Pane.props';

/**
 * One bordered box within a {@link Frame}.
 *
 * Renders nothing itself: `Frame` reads the rect during its own layout, in the
 * same way `Col` contributes to a `Table` without drawing. Must be a direct
 * child of a `Frame`.
 */
const Pane = ((_props: PaneProps) => null);

export {
  Pane
};
