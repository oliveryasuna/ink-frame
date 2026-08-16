import type {ReactNode} from 'react';
import {Children, Fragment, isValidElement} from 'react';

/**
 * Normalizes `children` into a flat list, unwrapping fragments.
 *
 * `Children.toArray` flattens arrays but leaves fragments intact, which would
 * otherwise hide the contents of a `<>...</>` from a component that inspects
 * its own children.
 */
const flattenChildren = ((children: ReactNode): ReactNode[] =>
  // eslint-disable-next-line @eslint-react/no-children-to-array -- Safe.
  (Children.toArray(children).flatMap((child): ReactNode[] => (
    (isValidElement(child) && (child.type === Fragment))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Safe.
      ? flattenChildren((child.props as {children?: ReactNode;}).children)
      : [child]
  ))));

export {
  flattenChildren
};
