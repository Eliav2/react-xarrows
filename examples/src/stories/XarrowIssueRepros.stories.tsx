import React, { useEffect, useRef, useState } from 'react';
import type { Meta } from '@storybook/react-vite';

import Xarrow, { Xwrapper } from 'react-xarrows';

// One story per reported issue, reproducing the exact condition from the report.
// Each carries a live verdict where the symptom is machine checkable, so these
// stay useful as regression checks instead of decaying into screenshots nobody
// re-reads.

export default {
  title: 'Issue repros',
  component: Xarrow,
  parameters: { layout: 'fullscreen' },
} as Meta;

const page: React.CSSProperties = {
  padding: 16,
  fontFamily: 'system-ui, sans-serif',
  color: '#111',
  background: '#fff',
  minHeight: '100vh',
};
const canvas: React.CSSProperties = {
  position: 'relative',
  height: 260,
  border: '1px solid #ddd',
  borderRadius: 6,
  marginTop: 12,
  background: '#fafafa',
};
const box: React.CSSProperties = {
  position: 'absolute',
  width: 80,
  height: 40,
  display: 'grid',
  placeItems: 'center',
  border: '1px solid #888',
  borderRadius: 6,
  background: '#fff',
  fontSize: 13,
};

const Issue = ({
  n,
  title,
  symptom,
  check,
  children,
}: {
  n: number;
  title: string;
  symptom: string;
  check: string;
  children: React.ReactNode;
}) => (
  <div style={page}>
    <h3 style={{ margin: 0 }}>
      <a href={`https://github.com/Eliav2/react-xarrows/issues/${n}`} target="_blank" rel="noreferrer">
        #{n}
      </a>{' '}
      {title}
    </h3>
    <p style={{ margin: '6px 0', color: '#555' }}>
      <strong>Reported:</strong> {symptom}
    </p>
    <p style={{ margin: '6px 0', color: '#555' }}>
      <strong>What to look for:</strong> {check}
    </p>
    {children}
  </div>
);

/** Scans the rendered SVG for the symptom and reports pass or fail on screen. */
const Verdict = ({ scope, test, label }: { scope: React.RefObject<HTMLDivElement | null>; test: (root: HTMLElement) => boolean; label: string }) => {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    // Runs once. An effect without a dependency array would re-run on the
    // setOk re-render and cancel the pending timer that was about to report,
    // leaving the verdict stuck on "checking...".
    // Two samples: one after the arrow has measured, one after the longest
    // draw animation in these stories has finished.
    const timers = [400, 1600].map((ms) =>
      window.setTimeout(() => scope.current && setOk(test(scope.current)), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [scope, test]);
  return (
    <p style={{ margin: '8px 0', fontWeight: 600, color: ok === false ? '#b00' : ok ? '#070' : '#666' }}>
      {ok === null ? 'checking...' : ok ? `PASS - ${label}` : `FAIL - ${label}`}
    </p>
  );
};

const noNaN = (root: HTMLElement) => {
  for (const el of root.querySelectorAll('svg, svg *'))
    for (const a of el.attributes) if (a.value.includes('NaN')) return false;
  return true;
};

// Module scope so their identity is stable across renders; an inline arrow here
// changes every render and makes the Verdict effect reschedule endlessly.
const noZeroRepeatCount = (root: HTMLElement) =>
  ![...root.querySelectorAll('animate')].some((a) => a.getAttribute('repeatCount') === '0');

// ---------------------------------------------------------------------------
// #139 - straight arrow between elements sharing an x coordinate.
// ---------------------------------------------------------------------------
export const Issue139_CurvenessZero = () => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Issue
      n={139}
      title="Dividing with 0 if curveness is 0 and absDx"
      symptom="curveness={0} produced NaN coordinates. The report titles it as absDx being 0, but a zero absDx alone divides to Infinity, and atan(Infinity) is a correct PI/2. The screenshot shows the boxes overlaying each other, which is the real trigger: BOTH deltas zero makes it 0/0."
      check="The two boxes sit exactly on top of each other (the second is faded). Expect no NaN in any SVG attribute. Reverting to Math.atan makes this read FAIL.">
      <Verdict scope={ref} test={noNaN} label="no NaN in the rendered SVG" />
      <div style={canvas} ref={ref}>
        <Xwrapper>
          <div id="i139-a" style={{ ...box, left: 160, top: 100 }}>
            box1
          </div>
          <div id="i139-b" style={{ ...box, left: 160, top: 100, opacity: 0.5 }}>
            box2
          </div>
          <Xarrow start="i139-a" end="i139-b" curveness={0} />
        </Xwrapper>
      </div>
    </Issue>
  );
};

// ---------------------------------------------------------------------------
// #171 - NaN reported in the console whenever the path is straight.
// ---------------------------------------------------------------------------
export const Issue171_StraightPath = () => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Issue
      n={171}
      title="NaN value error in console"
      symptom='NaN errors in the console when the arrow path is "straight".'
      check='The four spokes are the healthy case. The fifth arrow, drawn between two boxes stacked on the same spot, is the one that actually reproduced: coincident anchors make both deltas zero.'>
      <Verdict scope={ref} test={noNaN} label="no NaN across every straight-path direction" />
      <div style={canvas} ref={ref}>
        <Xwrapper>
          <div id="i171-c" style={{ ...box, left: 240, top: 110 }}>
            center
          </div>
          {[
            { id: 'i171-n', left: 240, top: 10, label: 'up' },
            { id: 'i171-s', left: 240, top: 210, label: 'down' },
            { id: 'i171-w', left: 60, top: 110, label: 'left' },
            { id: 'i171-e', left: 420, top: 110, label: 'right' },
          ].map(({ id, left, top, label }) => (
            <React.Fragment key={id}>
              <div id={id} style={{ ...box, left, top }}>
                {label}
              </div>
              <Xarrow start="i171-c" end={id} path="straight" />
            </React.Fragment>
          ))}
          {/* The actual repro: two boxes on the same spot, so both deltas are 0. */}
          <div id="i171-dup-a" style={{ ...box, left: 460, top: 200, width: 60, height: 30 }}>
            dup
          </div>
          <div id="i171-dup-b" style={{ ...box, left: 460, top: 200, width: 60, height: 30, opacity: 0.4 }}>
            dup
          </div>
          <Xarrow start="i171-dup-a" end="i171-dup-b" path="straight" />
        </Xwrapper>
      </div>
    </Issue>
  );
};

// ---------------------------------------------------------------------------
// #192 - arrows mounted dynamically render NaN on the first frame, because the
// elements have not been measured yet so both deltas are zero.
// ---------------------------------------------------------------------------
export const Issue192_DynamicallyMounted = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [ids, setIds] = useState<number[]>([]);
  const [sawNaN, setSawNaN] = useState(false);

  // Watch every attribute mutation, so a NaN that appears for a single frame is
  // still caught. The original report is about exactly that first frame.
  useEffect(() => {
    if (!ref.current) return;
    const obs = new MutationObserver(() => {
      if (ref.current && !noNaN(ref.current)) setSawNaN(true);
    });
    obs.observe(ref.current, { attributes: true, subtree: true, childList: true });
    return () => obs.disconnect();
  }, []);

  return (
    <Issue
      n={192}
      title="transform and d attributes show NaN at start"
      symptom="Arrows mounted dynamically emitted NaN into d and transform on the first render, before the elements were measured."
      check='Click "add a connection". The first node is placed directly on top of the hub, which is the coincident case that reproduces; the rest fan out. The verdict watches every DOM mutation, so a NaN lasting a single frame is still caught.'>
      <button onClick={() => setIds((p) => [...p, p.length])} style={{ padding: '6px 12px', marginRight: 12 }}>
        add a connection
      </button>
      <button onClick={() => { setIds([]); setSawNaN(false); }} style={{ padding: '6px 12px' }}>
        reset
      </button>
      <p style={{ margin: '8px 0', fontWeight: 600, color: sawNaN ? '#b00' : '#070' }}>
        {sawNaN ? 'FAIL - NaN observed in a rendered frame' : 'PASS - no NaN observed in any frame so far'}
      </p>
      <div style={canvas} ref={ref}>
        <Xwrapper>
          <div id="i192-hub" style={{ ...box, left: 20, top: 110 }}>
            hub
          </div>
          {ids.map((i) => (
            <React.Fragment key={i}>
              <div
                id={`i192-n${i}`}
                style={
                  i === 0
                    ? { ...box, left: 20, top: 110, opacity: 0.45 }
                    : { ...box, left: 160 + (i % 4) * 100, top: 20 + Math.floor(i / 4) * 70 }
                }>
                node {i}
              </div>
              <Xarrow start="i192-hub" end={`i192-n${i}`} curveness={0} />
            </React.Fragment>
          ))}
        </Xwrapper>
      </div>
    </Issue>
  );
};

// ---------------------------------------------------------------------------
// #106 - showHead={false} with animateDrawing left the arrow stuck in its draw
// state, because the endEvent listener was only attached when a head existed.
// ---------------------------------------------------------------------------
export const Issue106_NoHeadWithAnimateDrawing = () => {
  return (
    <Issue
      n={106}
      title="TypeError on showHead={false} and animateDrawing={true}"
      symptom="Crashed with headRef.current is null, and later left the arrow stuck mid-draw because the end-of-animation listener never attached without a head."
      check="Visual only, deliberately. The crash it is named after was already guarded before the real fix, and the remaining symptom is the draw phase never ending, which depends on a SMIL endEvent. Hidden documents do not tick SMIL reliably, so an automated verdict here would pass whether or not the bug is present. Watch the arrow draw once and settle into a solid line; reload to replay.">
      <div style={canvas}>
        <Xwrapper>
          <div id="i106-a" style={{ ...box, left: 40, top: 40 }}>
            start
          </div>
          <div id="i106-b" style={{ ...box, left: 320, top: 170 }}>
            end
          </div>
          <Xarrow start="i106-a" end="i106-b" showHead={false} animateDrawing={true} />
        </Xwrapper>
      </div>
    </Issue>
  );
};

// ---------------------------------------------------------------------------
// #193 - repeatCount="0" is invalid SMIL and Chrome logs a warning per arrow.
// ---------------------------------------------------------------------------
export const Issue193_InvalidRepeatCount = () => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Issue
      n={193}
      title='repeatCount value of 0 prints a warning to the console'
      symptom='Chrome logged "Unexpected value 0 parsing repeatCount attribute" for every arrow created.'
      check='No animate element carries repeatCount="0". The browser emits that warning itself, so it cannot be trapped from JS, which is why this asserts on the DOM instead.'>
      <Verdict
        scope={ref}
        test={noZeroRepeatCount}
        label='no animate element with repeatCount="0"'
      />
      <div style={canvas} ref={ref}>
        <Xwrapper>
          <div id="i193-a" style={{ ...box, left: 40, top: 40 }}>
            start
          </div>
          <div id="i193-b" style={{ ...box, left: 320, top: 170 }}>
            end
          </div>
          <Xarrow start="i193-a" end="i193-b" animateDrawing={false} headSize={6} strokeWidth={3} />
        </Xwrapper>
      </div>
    </Issue>
  );
};

// ---------------------------------------------------------------------------
// #105 - the arrow appeared as a dashed line on first render instead of
// animating, and only animated correctly after being unmounted and remounted.
// ---------------------------------------------------------------------------
export const Issue105_DashedOnFirstRender = () => {
  const [shown, setShown] = useState(true);
  return (
    <Issue
      n={105}
      title="animateDrawing shows dashed line on first render"
      symptom="With animateDrawing the arrow rendered as a dashed line on first paint, and only animated properly once removed and re-added to the DOM."
      check="The arrow draws itself on first paint. Toggle to remount, the behaviour should be identical both times rather than only correct on the second.">
      <button onClick={() => setShown((s) => !s)} style={{ padding: '6px 12px' }}>
        {shown ? 'unmount' : 'mount'} the arrow
      </button>
      <div style={canvas}>
        <Xwrapper>
          <div id="i105-a" style={{ ...box, left: 40, top: 40 }}>
            start
          </div>
          <div id="i105-b" style={{ ...box, left: 320, top: 170 }}>
            end
          </div>
          {shown && <Xarrow start="i105-a" end="i105-b" animateDrawing dashness={false} />}
        </Xwrapper>
      </div>
    </Issue>
  );
};
