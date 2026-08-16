import { describe, expect, it } from 'vitest';
import { polylinePath } from '../src/Xarrow/utils';

/**
 * polylinePath is what draws every `path="grid"` arrow, so these cover the
 * geometry directly instead of through a render. jsdom reports every element as
 * zero sized, which makes the coordinates a component test would see useless
 * for checking corner shapes.
 */

// The numbers a path command carries, in order of appearance.
const numbersIn = (d: string) => (d.match(/-?\d+(\.\d+)?(e-?\d+)?/g) ?? []).map(Number);

const square = (n: number) => [
  { x: 0, y: 0 },
  { x: n, y: 0 },
  { x: n, y: n },
  { x: 2 * n, y: n },
];

describe('polylinePath', () => {
  it('draws straight segments when the radius is zero', () => {
    expect(polylinePath(square(100), 0)).toBe('M 0 0 L 100 0 L 100 100 L 200 100');
  });

  it('treats a negative or non finite radius as zero', () => {
    const straight = polylinePath(square(100), 0);
    expect(polylinePath(square(100), -5)).toBe(straight);
    expect(polylinePath(square(100), NaN)).toBe(straight);
  });

  it('rounds every interior corner', () => {
    const d = polylinePath(square(100), 10);

    // Two interior corners, so two quadratics, and the control point of each is
    // the corner itself.
    expect(d).toBe('M 0 0 L 90 0 Q 100 0 100 10 L 100 90 Q 100 100 110 100 L 200 100');
  });

  it('pulls the curve inward rather than outward', () => {
    // The rounded path must stay inside the bounding box of the square path,
    // otherwise the svg canvas sizing in GetPosition would clip it.
    const d = polylinePath(square(100), 40);
    const nums = numbersIn(d);
    const xs = nums.filter((_, i) => i % 2 === 0);
    const ys = nums.filter((_, i) => i % 2 === 1);

    expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...xs)).toBeLessThanOrEqual(200);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(100);
  });

  it('clamps the radius to half of the shorter adjacent segment', () => {
    // PR #178 hardcoded a 12px offset with no clamp, so any segment shorter
    // than 24px produced a point behind the one before it and the line visibly
    // doubled back. x must never decrease along this path.
    const d = polylinePath(square(10), 1000);
    const xs = numbersIn(d).filter((_, i) => i % 2 === 0);

    xs.forEach((x, i) => {
      if (i > 0) expect(x).toBeGreaterThanOrEqual(xs[i - 1]);
    });
    expect(d).not.toMatch(/NaN/);
  });

  it('collapses repeated points instead of dividing by zero', () => {
    // The hv and vh grid paths put the second control point on top of the end
    // point. Left in, the zero length segment makes the corner math NaN.
    const d = polylinePath(
      [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 100, y: 100 },
      ],
      10,
    );

    expect(d).not.toMatch(/NaN/);
    // One real corner survives, so exactly one quadratic.
    expect(d.match(/Q/g)).toHaveLength(1);
  });

  it('rounds corners that are not axis aligned', () => {
    // _cpx1Offset and friends can knock the grid control points off the axis.
    // #178 compared coordinates for equality and silently emitted a degenerate
    // zero length quadratic whenever that happened.
    const d = polylinePath(
      [
        { x: 0, y: 0 },
        { x: 100, y: 20 },
        { x: 200, y: 0 },
      ],
      10,
    );

    expect(d).not.toMatch(/NaN/);
    expect(d).toMatch(/Q 100 20/);
    // A real curve, not `Q corner corner`.
    expect(d).not.toMatch(/Q 100 20 100 20/);
  });

  it('handles degenerate input', () => {
    expect(polylinePath([], 10)).toBe('');
    expect(polylinePath([{ x: 5, y: 5 }], 10)).toBe('M 5 5');
    expect(
      polylinePath(
        [
          { x: 5, y: 5 },
          { x: 5, y: 5 },
        ],
        10,
      ),
    ).toBe('M 5 5');
  });
});
