import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import Xarrow from '../src/Xarrow/Xarrow';
import Xwrapper from '../src/Xwrapper';

/**
 * Smoke coverage for the render path. These are deliberately shallow — they exist
 * so that CI fails loudly if the component stops mounting or starts emitting
 * invalid SVG, which is the failure mode behind several open issues.
 */

const TwoBoxes = ({ ...arrowProps }) => (
  <Xwrapper>
    <div id="box-a" data-testid="box-a">
      A
    </div>
    <div id="box-b" data-testid="box-b">
      B
    </div>
    <Xarrow start="box-a" end="box-b" {...arrowProps} />
  </Xwrapper>
);

const getPath = (container: HTMLElement) => container.querySelector('svg path');

describe('Xarrow', () => {
  it('mounts and renders an svg path between two elements', () => {
    const { container } = render(<TwoBoxes />);

    expect(screen.getByTestId('box-a')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(getPath(container)).toBeInTheDocument();
  });

  it('never emits NaN into the path geometry', () => {
    const { container } = render(<TwoBoxes />);

    const d = getPath(container)?.getAttribute('d');
    expect(d).toBeTruthy();
    expect(d).not.toMatch(/NaN/);
  });

  it('never emits NaN into head or tail transforms', () => {
    const { container } = render(<TwoBoxes showHead showTail />);

    const groups = container.querySelectorAll('svg g');
    expect(groups.length).toBeGreaterThan(0);
    groups.forEach((g) => {
      expect(g.getAttribute('transform') ?? '').not.toMatch(/NaN/);
    });
  });

  it('renders without an arrowhead when showHead is false', () => {
    const { container } = render(<TwoBoxes showHead={false} />);

    expect(getPath(container)).toBeInTheDocument();
  });

  // jsdom implements no SMIL, so nothing here fires on its own. The component
  // listens with plain addEventListener, so dispatching the events by hand
  // drives the same code paths a browser would.
  describe('draw animation', () => {
    const getDrawAnim = (container: HTMLElement) => container.querySelector('#svgEndAnimate');
    const getHead = (container: HTMLElement) => container.querySelector<SVGGElement>('svg g:has(> animate)');

    it('ends the draw phase when there is no arrowhead', () => {
      // Issue #106. The endEvent listener is what ends the draw phase, and it
      // used to be attached only when an arrowhead existed, so showHead={false}
      // left the arrow stuck mid-draw forever.
      const { container } = render(<TwoBoxes showHead={false} animateDrawing />);

      const drawAnim = getDrawAnim(container);
      expect(drawAnim).not.toBeNull();

      act(() => {
        drawAnim!.dispatchEvent(new Event('endEvent'));
      });

      // Once the phase ends the component swaps the draw animation out.
      expect(getDrawAnim(container)).toBeNull();
    });

    it('never emits repeatCount="0"', () => {
      // Issue #193. SMIL has no zero repeat count and the browser logs
      // "Unexpected value 0 parsing repeatCount attribute" on every arrow.
      const { container } = render(<TwoBoxes animateDrawing />);

      container.querySelectorAll('animate').forEach((animate) => {
        expect(animate.getAttribute('repeatCount')).not.toBe('0');
      });
    });

    it('leaves the head opacity to React rather than writing an inline style', () => {
      // An inline style outranks a presentation attribute permanently, and
      // React only ever writes the attribute, so mutating the style here means
      // React can never restore the head afterwards.
      const { container } = render(<TwoBoxes animateDrawing />);

      expect(getHead(container)?.getAttribute('opacity')).toBe('0');

      act(() => {
        getDrawAnim(container)!.dispatchEvent(new Event('beginEvent'));
      });

      expect(getHead(container)?.style.opacity).toBe('');
    });
  });

  // Known bug: with curveness 0 (or path="straight") the head angle is computed as
  // Math.atan(absDy / absDx), which is 0/0 when both elements resolve to the same
  // point — exactly what happens before layout has measured them. Tracked in
  // Issues #139, #171 and #192. Both deltas are zero whenever start and end sit
  // at the same point, which includes elements not yet measured on first render.
  // atan(0 / 0) was NaN and poisoned every coordinate downstream. Swept across
  // prop combinations because the straight-path branch is only one of the ways
  // in, and jsdom reports zero-sized rects for everything.
  describe('never emits NaN for unmeasured elements', () => {
    for (const curveness of [0, 0.1, 0.8, 1, 2])
      for (const path of ['smooth', 'grid', 'straight'] as const)
        for (const heads of [
          { showHead: true, showTail: true },
          { showHead: false, showTail: false },
          { showHead: true, showTail: false },
        ])
          it(`curveness=${curveness} path=${path} head=${heads.showHead} tail=${heads.showTail}`, () => {
            const { container } = render(
              <Xwrapper>
                <div id="start-elem" />
                <div id="end-elem" />
                <Xarrow start="start-elem" end="end-elem" curveness={curveness} path={path} {...heads} />
              </Xwrapper>,
            );

            expect(container.innerHTML).not.toMatch(/NaN/);
          });
  });

  it('accepts refs as start and end', () => {
    const WithRefs = () => {
      const a = useRef<HTMLDivElement>(null);
      const b = useRef<HTMLDivElement>(null);
      return (
        <Xwrapper>
          <div ref={a}>A</div>
          <div ref={b}>B</div>
          <Xarrow start={a} end={b} />
        </Xwrapper>
      );
    };

    const { container } = render(<WithRefs />);
    expect(container.querySelector('svg path')).toBeInTheDocument();
  });
});
