import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Xarrow from '../src/Xarrow/Xarrow';
import Xwrapper from '../src/Xwrapper';

/**
 * Covers the gridRadius prop end to end: user prop -> parser -> getPosition ->
 * rendered `d`. The corner geometry itself is covered by polylinePath.test.ts.
 *
 * jsdom reports every element as a zero sized box at the origin, which makes
 * both boxes land on the same point and collapses the path to nothing. Stubbing
 * getBoundingClientRect is what gives the arrow real coordinates to work with.
 */

const placeBoxes = () => {
  const rects: Record<string, Partial<DOMRect>> = {
    'box-a': { left: 0, top: 0, right: 80, bottom: 40, width: 80, height: 40, x: 0, y: 0 },
    'box-b': { left: 400, top: 300, right: 480, bottom: 340, width: 80, height: 40, x: 400, y: 300 },
  };
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const rect = rects[this.id] ?? { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 };
    return { ...rect, toJSON: () => rect } as DOMRect;
  });
};

const Boxes = ({ ...arrowProps }) => (
  <Xwrapper>
    <div id="box-a">A</div>
    <div id="box-b">B</div>
    <Xarrow start="box-a" end="box-b" path="grid" {...arrowProps} />
  </Xwrapper>
);

const pathD = (container: HTMLElement) => container.querySelector('svg path')?.getAttribute('d') ?? '';

describe('gridRadius', () => {
  afterEach(() => vi.restoreAllMocks());

  it('draws square corners by default', () => {
    placeBoxes();
    const d = pathD(render(<Boxes />).container);

    expect(d).toMatch(/^M /);
    expect(d).not.toMatch(/Q/);
    expect(d).not.toMatch(/NaN/);
  });

  it('rounds the corners when given a number', () => {
    placeBoxes();
    const d = pathD(render(<Boxes gridRadius={12} />).container);

    // A grid arrow between diagonally placed boxes has two corners.
    expect(d.match(/Q/g)).toHaveLength(2);
    expect(d).not.toMatch(/NaN/);
  });

  it('treats gridRadius as strokeWidth * 2', () => {
    placeBoxes();
    const fromTrue = pathD(render(<Boxes gridRadius strokeWidth={5} />).container);
    const fromNumber = pathD(render(<Boxes gridRadius={10} strokeWidth={5} />).container);

    expect(fromTrue).toBe(fromNumber);
  });

  it('is ignored for paths other than grid', () => {
    placeBoxes();
    const withRadius = pathD(render(<Boxes path="smooth" gridRadius={12} />).container);
    const without = pathD(render(<Boxes path="smooth" />).container);

    expect(withRadius).toBe(without);
  });
});
