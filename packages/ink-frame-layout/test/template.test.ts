import {describe, expect, test} from 'bun:test';
import {grid} from '../src/grid';
import {template} from '../src/template';

describe(
  'template',
  (() => {
    test(
      'splits aligned rows into a matrix, collapsing whitespace runs',
      (() => {
        const areas = template`
      header header
      side   main
      side   footer
    `;

        expect(areas).toEqual([
          ['header', 'header'],
          ['side', 'main'],
          ['side', 'footer']
        ]);
      })
    );

    test(
      'drops blank lines',
      (() => {
        expect(template`

      a b

    `).toEqual([['a', 'b']]);
      })
    );

    test(
      'throws on interpolation',
      (() => {
        const name = 'main';

        expect(() => template`a ${name}`).toThrow('interpolation is not supported');
      })
    );

    test(
      'feeds grid the same way an inline matrix does',
      (() => {
        const root = {
          left: 0,
          top: 0,
          width: 40,
          height: 12
        };
        const areas = grid(
          root,
          {
            areas: template`
        header header
        side   main
        side   footer
      `,
            columns: [24, 'grow'],
            rows: [3, 'grow', 3]
          }
        );

        expect(areas.header).toEqual({
          left: 0,
          top: 0,
          width: 40,
          height: 3
        });
        expect(areas.main).toEqual({
          left: 23,
          top: 2,
          width: 17,
          height: 8
        });
      })
    );
  })
);
