import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Xarrow from '../src/Xarrow/Xarrow';
import Xwrapper from '../src/Xwrapper';

/**
 * Guards the prop-parsing behaviour that the type work changed on purpose.
 * Everything else about the rendered output was verified byte for byte against
 * the previous release across a prop matrix, so these cover only the cases that
 * moved.
 */

const geom: Record<string, Partial<DOMRect>> = {
  'box-a': { left: 40, top: 30, right: 140, bottom: 90, width: 100, height: 60, x: 40, y: 30 },
  'box-b': { left: 400, top: 260, right: 500, bottom: 320, width: 100, height: 60, x: 400, y: 260 },
};

const placeBoxes = () =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const r = geom[this.id] ?? { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 };
    return { ...r, toJSON: () => r } as DOMRect;
  });

const Boxes = ({ ...arrowProps }) => (
  <Xwrapper>
    <div id="box-a">A</div>
    <div id="box-b">B</div>
    <Xarrow start="box-a" end="box-b" {...arrowProps} />
  </Xwrapper>
);

describe('prop parsing', () => {
  afterEach(() => vi.restoreAllMocks());

  describe('edge shapes', () => {
    it('falls back to the default shape when a custom shape has no svgElem', () => {
      placeBoxes();
      // Used to default to the bare string 'path', which React renders as the
      // literal text "path" instead of an arrowhead.
      const { container } = render(<Boxes headShape={{ offsetForward: 0.3 }} />);

      expect(container.textContent).not.toContain('path');
      expect(container.querySelectorAll('svg g path').length).toBeGreaterThan(0);
    });

    it('does not write defaults into the shape object it was given', () => {
      placeBoxes();
      const custom = { offsetForward: 0.3 };
      render(<Boxes headShape={custom} />);

      // Parsing used to fill svgElem in on this object. For a built-in shape
      // name the same code path wrote into the shared arrowShapes constant.
      expect(custom).toEqual({ offsetForward: 0.3 });
    });

    it('keeps a custom offsetForward of 0 rather than defaulting it', () => {
      placeBoxes();
      const { container } = render(<Boxes headShape={{ svgElem: <circle r={0.5} />, offsetForward: 0 }} />);

      expect(container.querySelector('svg g circle')).not.toBeNull();
    });
  });

  describe('dashness', () => {
    const dashArray = (props: Record<string, unknown>) => {
      placeBoxes();
      const { container } = render(<Boxes strokeWidth={4} {...props} />);
      return container.querySelector('svg path')?.getAttribute('stroke-dasharray');
    };

    // strokeLen and nonStrokeLen each fall back on their own. They used to be
    // read as a pair, so only one of the two could be supplied on its own, and
    // `||` meant an explicit 0 was replaced by the default.
    it('fills in nonStrokeLen when only strokeLen is given', () => {
      // Used to render "10 undefined".
      expect(dashArray({ dashness: { strokeLen: 10 } })).toBe('10 4');
    });

    it('keeps nonStrokeLen when only nonStrokeLen is given', () => {
      // Used to discard it entirely and render the default "8 4".
      expect(dashArray({ dashness: { nonStrokeLen: 10 } })).toBe('8 10');
    });

    it('keeps an explicit zero rather than treating it as absent', () => {
      expect(dashArray({ dashness: { strokeLen: 0 } })).toBe('0 4');
      expect(dashArray({ dashness: { nonStrokeLen: 0 } })).toBe('8 0');
      expect(dashArray({ dashness: { strokeLen: 0, nonStrokeLen: 0 } })).toBe('0 0');
    });

    it('defaults both lengths from strokeWidth when neither is given', () => {
      expect(dashArray({ dashness: {} })).toBe('8 4');
      expect(dashArray({ dashness: true })).toBe('8 4');
    });

    it('treats animation: true as the documented one second default', () => {
      placeBoxes();
      // Used to store the boolean and rely on `1 / true` being 1.
      const { container } = render(<Boxes dashness={{ strokeLen: 8, animation: true }} />);

      const anim = container.querySelector('svg path animate');
      expect(anim?.getAttribute('dur')).toBe('1s');
    });
  });

  describe('anchors', () => {
    const anchors = ['auto', 'left', 'right', 'top', 'bottom', 'middle'] as const;
    const paths = ['smooth', 'grid', 'straight'] as const;

    // The curve is picked by a key built from both anchor positions. That key
    // used to be assembled by string concatenation, so a position matching none
    // of the branches produced a key with no entry and threw.
    anchors.forEach((startAnchor) =>
      paths.forEach((path) => {
        it(`renders a valid path for startAnchor=${startAnchor} path=${path}`, () => {
          placeBoxes();
          const { container } = render(<Boxes startAnchor={startAnchor} path={path} />);

          const d = container.querySelector('svg path')?.getAttribute('d') ?? '';
          expect(d).toMatch(/^M /);
          expect(d).not.toMatch(/NaN|undefined/);
        });
      }),
    );
  });
});
