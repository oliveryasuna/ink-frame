import {packColumns, splitColumns} from '@oliveryasuna/ink-frame';
import {describe, expect, test} from 'bun:test';
import {grid} from '../src/grid';

const ROOT = {
  left: 0,
  top: 0,
  width: 40,
  height: 12
};

describe(
  'grid',
  (() => {
    test(
      'a one-row template matches splitColumns exactly (share)',
      (() => {
        const areas = grid(
          ROOT,
          {
            areas: [['a', 'b']],
            columns: [24, 'grow'],
            rows: ['grow']
          }
        );

        const [a, b] = splitColumns(ROOT, [24, 'grow']);
        expect(areas.a).toEqual(a);
        expect(areas.b).toEqual(b);
      })
    );

    test(
      'a one-row template matches packColumns exactly (pack)',
      (() => {
        const root = {
          left: 0,
          top: 0,
          width: 30,
          height: 10
        };
        const areas = grid(
          root,
          {
            areas: [['a', 'b']],
            columns: [10, 'grow'],
            rows: ['grow'],
            seams: 'pack'
          }
        );

        const [a, b] = packColumns(root, [10, 'grow']);
        expect(areas.a).toEqual(a);
        expect(areas.b).toEqual(b);
      })
    );

    test(
      'compiles a header/sidebar/main/footer dashboard',
      (() => {
        const areas = grid(
          ROOT,
          {
            areas: [
              ['header', 'header'],
              ['side', 'main'],
              ['side', 'footer']
            ],
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
        expect(areas.side).toEqual({
          left: 0,
          top: 2,
          width: 24,
          height: 10
        });
        expect(areas.main).toEqual({
          left: 23,
          top: 2,
          width: 17,
          height: 8
        });
        expect(areas.footer).toEqual({
          left: 23,
          top: 9,
          width: 17,
          height: 3
        });
      })
    );

    test(
      'spanning areas share borders with their neighbours (share)',
      (() => {
        const areas = grid(
          ROOT,
          {
            areas: [
              ['header', 'header'],
              ['side', 'main'],
              ['side', 'footer']
            ],
            columns: [24, 'grow'],
            rows: [3, 'grow', 3]
          }
        );

        // header's bottom row and main's top row are the same cell.
        expect((areas.header.top + areas.header.height) - 1).toBe(areas.main.top);
        // side's right column and main's left column are the same cell.
        expect((areas.side.left + areas.side.width) - 1).toBe(areas.main.left);
      })
    );

    test(
      'omits gap cells from the result',
      (() => {
        const areas = grid(
          ROOT,
          {
            areas: [['a', '.']],
            columns: ['grow', 'grow'],
            rows: ['grow']
          }
        );

        expect(Object.keys(areas)).toEqual(['a']);
      })
    );

    test(
      'throws when the column count does not match',
      (() => {
        expect(() => grid(
          ROOT,
          {
            areas: [['a', 'b']],
            columns: ['grow'],
            rows: ['grow']
          }
        ))
          .toThrow('`columns` has 1 tracks, but the template has 2 columns');
      })
    );

    test(
      'throws when the row count does not match',
      (() => {
        expect(() => grid(
          ROOT,
          {
            areas: [['a']],
            columns: ['grow'],
            rows: ['grow', 'grow']
          }
        ))
          .toThrow('`rows` has 2 tracks, but the template has 1 rows');
      })
    );
  })
);
