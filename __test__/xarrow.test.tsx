import { render, screen } from '@testing-library/react';
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

  // Known bug: with curveness 0 (or path="straight") the head angle is computed as
  // Math.atan(absDy / absDx), which is 0/0 when both elements resolve to the same
  // point — exactly what happens before layout has measured them. Tracked in
  // issues #139, #171 and #192. Unskip this once the guard lands.
  it.skip('does not emit NaN when curveness is 0', () => {
    const { container } = render(<TwoBoxes curveness={0} />);

    expect(getPath(container)?.getAttribute('d')).not.toMatch(/NaN/);
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
