import {describe, expect, test} from 'bun:test';
import {analyzeAreas} from '../src/areas';

describe(
  'analyzeAreas',
  (() => {
    test(
      'reports grid dimensions',
      (() => {
        const {rowCount, colCount} = analyzeAreas([['a', 'b'], ['c', 'd']]);

        expect(rowCount).toBe(2);
        expect(colCount).toBe(2);
      })
    );

    test(
      'bounds a single cell',
      (() => {
        const {bounds} = analyzeAreas([['a', 'b']]);

        expect(bounds.get('a')).toEqual({
          rowStart: 0,
          rowEnd: 0,
          colStart: 0,
          colEnd: 0
        });
        expect(bounds.get('b')).toEqual({
          rowStart: 0,
          rowEnd: 0,
          colStart: 1,
          colEnd: 1
        });
      })
    );

    test(
      'bounds an area spanning several tracks',
      (() => {
        const {bounds} = analyzeAreas([
          ['header', 'header'],
          ['side', 'main'],
          ['side', 'footer']
        ]);

        expect(bounds.get('header')).toEqual({
          rowStart: 0,
          rowEnd: 0,
          colStart: 0,
          colEnd: 1
        });
        expect(bounds.get('side')).toEqual({
          rowStart: 1,
          rowEnd: 2,
          colStart: 0,
          colEnd: 0
        });
      })
    );

    test(
      'ignores gap cells',
      (() => {
        const {bounds} = analyzeAreas([['a', '.']]);

        expect([...bounds.keys()]).toEqual(['a']);
      })
    );

    test(
      'throws on an empty grid',
      (() => {
        expect(() => analyzeAreas([])).toThrow('at least one row');
      })
    );

    test(
      'throws on ragged rows',
      (() => {
        expect(() => analyzeAreas([['a', 'b'], ['c']])).toThrow('row 1 has 1 columns');
      })
    );

    test(
      'throws on an L-shaped area',
      (() => {
        expect(() => analyzeAreas([['a', 'a'], ['a', '.']])).toThrow('not a solid rectangle');
      })
    );

    test(
      'throws on a disjoint area',
      (() => {
        expect(() => analyzeAreas([['a', 'b'], ['b', 'a']])).toThrow('not a solid rectangle');
      })
    );
  })
);
