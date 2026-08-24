/**
 * Indexed access that fails loud instead of yielding `undefined`. Used where an
 * index has already been range-checked, so the throw is a guard against a logic
 * error, never an expected outcome.
 */
const at = (<T>(
  items: (readonly T[]),
  index: number
): T => {
  const item = items[index];

  if(item === undefined) {
    throw (new Error(`ink-frame-layout: index ${index} is out of range (length ${items.length}).`));
  }

  return item;
});

export {
  at
};
