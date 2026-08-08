import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Xarrow, { Xwrapper, useXarrow } from 'react-xarrows';

// This suite exists for one reason: the demo resolves the library from ../src
// via a Vite alias, and the repo root has its own React installed for the
// library's build and tests. Without `resolve.dedupe`, the two halves of the
// app get separate React copies. The second copy's hook dispatcher is null, so
// the first hook the library calls throws
//   TypeError: Cannot read properties of null (reading 'useRef')
// and every route that renders an arrow dies. Nothing fails at build time,
// which is what makes it worth a test rather than an eyeball.
//
// These run through examples/vite.config.ts, so the alias and dedupe under test
// are the same ones the dev server and the production build use.

const Boxes = () => (
  <>
    <div id="from" />
    <div id="to" />
  </>
);

describe('demo and library share one React instance', () => {
  it('renders an arrow without a null hook dispatcher', () => {
    // Throws if a second React is in play: Xarrow calls useRef/useState/
    // useLayoutEffect immediately, and the duplicate copy has no dispatcher.
    render(
      <Xwrapper>
        <Boxes />
        <Xarrow start="from" end="to" />
      </Xwrapper>
    );

    expect(document.querySelector('svg')).not.toBeNull();
  });

  it('runs the library hook inside a component the demo rendered', () => {
    // useXarrow reads context the Xwrapper provided. Both the context object
    // and the hook come from the library, while the component calling it is
    // compiled by the demo, so a split React breaks this even when rendering
    // an arrow happens to survive.
    const Consumer = () => {
      const updateXarrow = useXarrow();
      return <span data-testid="consumer">{typeof updateXarrow}</span>;
    };

    render(
      <Xwrapper>
        <Boxes />
        <Consumer />
      </Xwrapper>
    );

    expect(screen.getByTestId('consumer').textContent).toBe('function');
  });
});
