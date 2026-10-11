import { act, render } from '@testing-library/react';
import { createRef, useLayoutEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Xarrow from '../src/Xarrow/Xarrow';
import Xwrapper from '../src/Xwrapper';

/**
 * Regression coverage for where and when the arrow measures the elements it
 * connects. Each test is named after the issue it closes.
 *
 * jsdom performs no layout, so a stubbed getBoundingClientRect stands in for
 * one. The important property of the stub is that it derives everything from
 * the live DOM at the moment it is called: a measurement taken during render
 * therefore describes the previous commit, and a measurement taken in a layout
 * effect describes the commit that just happened. That difference is the whole
 * subject of these tests, so a stub returning canned values per element would
 * make most of them pass either way.
 */

const SIZE = 50;

const toDOMRect = (rect: Omit<DOMRect, 'toJSON'>): DOMRect => ({ ...rect, toJSON: () => rect });

const emptyRect = () => toDOMRect({ x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 });

/**
 * A deliberately crude layout model: an element marked `data-box` is SIZE
 * square, sits at the x given by its `data-x` attribute, and is stacked down
 * the page by its index among its siblings - so inserting a sibling above it
 * moves it, exactly as a real block layout would.
 *
 * Everything else - the arrow's own container and its svg - measures as zero,
 * which is what bare jsdom reports anyway. A detached element also measures as
 * zero, which is what a browser reports and is what makes the remount tests
 * meaningful: an arrow left holding a detached node collapses onto the
 * viewport origin.
 */
const measure = (el: Element): DOMRect => {
  if (!el.isConnected || !el.hasAttribute('data-box') || !el.parentElement) return emptyRect();
  const x = Number(el.getAttribute('data-x') ?? 0);
  const y = SIZE * Array.prototype.indexOf.call(el.parentElement.children, el);
  return toDOMRect({ x, y, width: SIZE, height: SIZE, left: x, top: y, right: x + SIZE, bottom: y + SIZE });
};

let originalGetBoundingClientRect: typeof Element.prototype.getBoundingClientRect;

beforeEach(() => {
  originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (this: Element) {
    return measure(this);
  };
});

afterEach(() => {
  Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
});

/**
 * Canvas size and path are relative to the two elements, so they describe the
 * arrow's geometry without depending on where the svg itself landed.
 */
const geometry = (container: HTMLElement) => {
  const svg = container.querySelector('svg');
  return {
    width: svg?.getAttribute('width'),
    height: svg?.getAttribute('height'),
    d: svg?.querySelector('path')?.getAttribute('d'),
  };
};

/**
 * A re-render driven from outside the arrow, changing nothing. Xarrow listens
 * for window resize itself, and this is how a user meets a stale arrow: it
 * looks right until anything at all re-renders, and then it snaps - to the
 * viewport origin, if the element it holds has since been detached.
 */
const rerenderFromOutside = () =>
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });

describe('element measurement', () => {
  it('#146 recovers when an element is remounted under the same id', () => {
    const Scene = ({ withEnd = true }) => (
      <Xwrapper>
        <div id="box-a" data-box data-x="0" />
        {withEnd ? <div id="box-b" data-box data-x="300" /> : null}
        <Xarrow start="box-a" end="box-b" />
      </Xwrapper>
    );

    const { container, rerender } = render(<Scene />);
    const connected = geometry(container);

    rerender(<Scene withEnd={false} />);
    rerenderFromOutside();
    // guards the stub as much as the fix: a missing element has to measure as
    // zeros, otherwise the recovery below proves nothing.
    expect(geometry(container)).not.toEqual(connected);

    rerender(<Scene />);
    expect(geometry(container)).toEqual(connected);

    // and it stays recovered, rather than being right only until the next render
    rerenderFromOutside();
    expect(geometry(container)).toEqual(connected);
  });

  it('#134 reflects a sibling insert in the commit that made it, not the one after', () => {
    const Scene = ({ withSpacer = false }) => (
      <Xwrapper>
        <div id="box-a" data-box data-x="0" />
        {withSpacer ? <div id="spacer" data-box data-x="0" /> : null}
        <div id="box-b" data-box data-x="300" />
        <Xarrow start="box-a" end="box-b" />
      </Xwrapper>
    );

    // what the arrow is supposed to look like, taken from a fresh mount of the
    // very same layout. Unmounted before the scene under test renders, so that
    // only one element ever answers to each id.
    const reference = render(<Scene withSpacer />);
    const expected = geometry(reference.container);
    reference.unmount();

    const { container, rerender } = render(<Scene />);
    const before = geometry(container);
    expect(before).not.toEqual(expected); // the insert really does move box-b

    rerender(<Scene withSpacer />);
    expect(geometry(container)).toEqual(expected);
  });

  it('#182 re-resolves the element after a keyed remount', () => {
    const Scene = ({ instance = 0 }) => (
      <Xwrapper>
        <div id="box-a" data-box data-x="0" />
        <div key={instance} id="box-b" data-box data-x="300" />
        <Xarrow start="box-a" end="box-b" />
      </Xwrapper>
    );

    const { container, rerender } = render(<Scene />);
    const before = geometry(container);
    const firstNode = document.getElementById('box-b');

    rerender(<Scene instance={1} />);

    // changing the key throws the old node away and mounts a new one under the
    // same id, so an arrow holding the old node is holding a detached node.
    expect(document.getElementById('box-b')).not.toBe(firstNode);
    expect(geometry(container)).toEqual(before);

    // the arrow caches the element it resolved, so holding a detached one does
    // no visible damage until the next render of any kind - at which point the
    // detached node measures as zeros and the arrow collapses onto the origin.
    rerenderFromOutside();
    expect(geometry(container)).toEqual(before);
  });

  it('#182 re-resolves an element given as a ref after a keyed remount', () => {
    // the same remount as above, but the ref object itself never changes - only
    // its current does - so nothing about the props tells the arrow to look again.
    const startRef = createRef<HTMLDivElement>();
    const endRef = createRef<HTMLDivElement>();
    const Scene = ({ instance = 0 }) => (
      <Xwrapper>
        <div ref={startRef} data-box data-x="0" />
        <div key={instance} ref={endRef} data-box data-x="300" />
        <Xarrow start={startRef} end={endRef} />
      </Xwrapper>
    );

    const { container, rerender } = render(<Scene />);
    const before = geometry(container);
    const firstNode = endRef.current;

    rerender(<Scene instance={1} />);
    expect(endRef.current).not.toBe(firstNode);

    rerenderFromOutside();
    expect(geometry(container)).toEqual(before);
  });

  it('#89 picks up a position committed by a layout effect in the same commit', () => {
    // stands in for a drag implementation: it positions the element
    // imperatively in a layout effect, and it sits before the arrow in the
    // tree, so its effect runs first.
    const Mover = ({ x }: { x: number }) => {
      useLayoutEffect(() => {
        document.getElementById('box-b')?.setAttribute('data-x', String(x));
      });
      return null;
    };

    const Scene = ({ x }: { x: number }) => (
      <Xwrapper>
        <div id="box-a" data-box data-x="0" />
        <div id="box-b" data-box />
        <Mover x={x} />
        <Xarrow start="box-a" end="box-b" />
      </Xwrapper>
    );

    const reference = render(<Scene x={300} />);
    const expected = geometry(reference.container);
    reference.unmount();

    const { container, rerender } = render(<Scene x={0} />);
    expect(geometry(container)).not.toEqual(expected); // the drag really does move box-b

    rerender(<Scene x={300} />);
    expect(geometry(container)).toEqual(expected);
  });

  it('does not start one arrow from the parsed props of the arrow before it', () => {
    // an arrow that shares nothing with the defaults
    render(
      <Xwrapper>
        <div id="loud-a" data-box data-x="0" />
        <div id="loud-b" data-box data-x="300" />
        <Xarrow start="loud-a" end="loud-b" strokeWidth={20} lineColor="rgb(1, 2, 3)" />
      </Xwrapper>,
    );

    // the probe sits before the second arrow, so its layout effect runs before
    // any of the arrow's own: what it reads is that arrow's first committed
    // frame, before its prop effects have had a chance to correct anything.
    let firstFrame: Record<string, string | null | undefined> | undefined;
    const Probe = () => {
      useLayoutEffect(() => {
        const path = document.querySelector('#second-tree path');
        firstFrame = {
          strokeWidth: path?.getAttribute('stroke-width'),
          stroke: path?.getAttribute('stroke'),
        };
      }, []);
      return null;
    };

    render(
      <div id="second-tree">
        <Xwrapper>
          <div id="quiet-a" data-box data-x="0" />
          <div id="quiet-b" data-box data-x="300" />
          <Probe />
          <Xarrow start="quiet-a" end="quiet-b" />
        </Xwrapper>
      </div>,
    );

    expect(firstFrame).toEqual({ strokeWidth: '4', stroke: 'CornflowerBlue' });
  });
});
