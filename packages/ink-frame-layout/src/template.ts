/**
 * Turns an aligned, multi-line area map into the matrix {@link grid} expects.
 *
 * Blank lines are dropped and each remaining line is split on runs of
 * whitespace, so columns may be padded for readability. Names are widened to
 * `string`, so `grid`'s result is keyed by `string`; pass the array-of-arrays
 * form directly when you want the names checked at compile time.
 *
 * @example
 * ```ts
 * const areas = template`
 *   header header
 *   side   main
 *   side   footer
 * `;
 * // -> [['header','header'], ['side','main'], ['side','footer']]
 * ```
 */
const template = ((
  strings: TemplateStringsArray,
  ...values: (readonly unknown[])
): string[][] => {
  if(values.length > 0) {
    throw (new Error('template: interpolation is not supported; write the area names literally.'));
  }

  return strings
    .join('')
    .split('\n')
    .map(line => line.trim())
    .filter(line => (line.length > 0))
    .map(line => line.split(/\s+/u));
});

export {
  template
};
