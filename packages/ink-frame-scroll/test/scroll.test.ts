import {describe, expect, test} from 'bun:test';
import {clampOffset, maxOffset, overflows, pageSize, scrollbarThumb} from '../src/scroll';

describe(
  'maxOffset',
  (() => {
    test(
      'is the content past the viewport',
      (() => {
        expect(maxOffset(100, 20)).toBe(80);
      })
    );

    test(
      'never goes negative when content fits',
      (() => {
        expect(maxOffset(10, 20)).toBe(0);
        expect(maxOffset(20, 20)).toBe(0);
      })
    );
  })
);

describe(
  'overflows',
  (() => {
    test(
      'true only when content exceeds the viewport',
      (() => {
        expect(overflows(21, 20)).toBe(true);
        expect(overflows(20, 20)).toBe(false);
        expect(overflows(0, 20)).toBe(false);
      })
    );
  })
);

describe(
  'clampOffset',
  (() => {
    test(
      'clamps to the bottom',
      (() => {
        expect(clampOffset(999, 100, 20)).toBe(80);
      })
    );

    test(
      'clamps to the top',
      (() => {
        expect(clampOffset(-5, 100, 20)).toBe(0);
      })
    );

    test(
      'passes through a valid offset',
      (() => {
        expect(clampOffset(30, 100, 20)).toBe(30);
      })
    );

    test(
      'truncates fractional offsets toward zero',
      (() => {
        expect(clampOffset(3.9, 100, 20)).toBe(3);
      })
    );

    test(
      'is 0 when content fits',
      (() => {
        expect(clampOffset(10, 15, 20)).toBe(0);
      })
    );
  })
);

describe(
  'pageSize',
  (() => {
    test(
      'is a viewport less one row of overlap',
      (() => {
        expect(pageSize(20)).toBe(19);
      })
    );

    test(
      'is at least one row even for tiny viewports',
      (() => {
        expect(pageSize(1)).toBe(1);
        expect(pageSize(0)).toBe(1);
      })
    );
  })
);

describe(
  'scrollbarThumb',
  (() => {
    test(
      'fills the track when content does not overflow',
      (() => {
        expect(scrollbarThumb(0, 10, 20)).toEqual({
          size: 20,
          start: 0
        });
      })
    );

    test(
      'is zero for a zero-height track',
      (() => {
        expect(scrollbarThumb(0, 100, 0)).toEqual({
          size: 0,
          start: 0
        });
      })
    );

    test(
      'sits at the top when offset is 0',
      (() => {
        const thumb = scrollbarThumb(0, 100, 20);
        expect(thumb.start).toBe(0);
        expect(thumb.size).toBeGreaterThanOrEqual(1);
        expect(thumb.size).toBeLessThan(20);
      })
    );

    test(
      'sits at the bottom when fully scrolled',
      (() => {
        const thumb = scrollbarThumb(80, 100, 20);  // maxOffset = 80
        expect(thumb.start + thumb.size).toBe(20);
      })
    );

    test(
      'size is proportional to the visible fraction',
      (() => {
        // Viewport shows a quarter of the content -> thumb ~ a quarter of the track.
        expect(scrollbarThumb(0, 80, 20).size).toBe(5);
      })
    );

    test(
      'thumb is at least one cell even for huge content',
      (() => {
        expect(scrollbarThumb(0, 100_000, 10).size).toBe(1);
      })
    );

    test(
      'never runs off the track at any offset',
      (() => {
        const content = 137;
        const viewport = 17;
        for(let offset = -5; offset <= 200; offset += 1) {
          const {size, start} = scrollbarThumb(offset, content, viewport);
          expect(start).toBeGreaterThanOrEqual(0);
          expect(start + size).toBeLessThanOrEqual(viewport);
        }
      })
    );
  })
);
