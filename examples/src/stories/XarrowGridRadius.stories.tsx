import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import Xarrow, { Xwrapper } from 'react-xarrows';
import { DraggableBox } from '../components/DraggableBox';
import NumericInput from '../components/NumericInput';

// gridRadius rounds the corners of a path="grid" arrow. These stories exist to
// make the two things that are easy to get wrong visible: what the radius does
// to a normal arrow, and what it does when there is not enough room for it.

export default {
  title: 'gridRadius',
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
  height: 220,
  border: '1px solid #ddd',
  borderRadius: 6,
  marginTop: 12,
  background: '#fafafa',
};
const note: React.CSSProperties = { margin: '6px 0', color: '#555', maxWidth: 720 };

const Box = ({ id, left, top }: { id: string; left: number; top: number }) => (
  <div
    id={id}
    style={{
      position: 'absolute',
      left,
      top,
      width: 80,
      height: 36,
      display: 'grid',
      placeItems: 'center',
      border: '1px solid #888',
      borderRadius: 6,
      background: '#fff',
      fontSize: 13,
    }}>
    {id}
  </div>
);

/**
 * The headline comparison: identical arrows, one square and one rounded.
 */
const SideBySideTemplate: StoryFn = () => (
  <div style={page}>
    <h3 style={{ margin: 0 }}>square vs rounded</h3>
    <p style={note}>
      Both arrows use <code>path="grid"</code> with identical anchors. The only difference is{' '}
      <code>gridRadius</code>. Passing <code>true</code> uses <code>strokeWidth * 2</code>.
    </p>
    <div style={canvas}>
      <Xwrapper>
        <Box id="sq-a" left={40} top={30} />
        <Box id="sq-b" left={280} top={140} />
        <Xarrow start="sq-a" end="sq-b" path="grid" />
      </Xwrapper>
      <Xwrapper>
        <Box id="rd-a" left={440} top={30} />
        <Box id="rd-b" left={680} top={140} />
        <Xarrow start="rd-a" end="rd-b" path="grid" gridRadius lineColor="#c0392b" headColor="#c0392b" />
      </Xwrapper>
    </div>
  </div>
);
export const SquareVsRounded = SideBySideTemplate.bind({});

/**
 * The case PR #178 got wrong. A fixed 12px corner offset overshoots any segment
 * shorter than 24px and the line doubles back on itself; the radius has to be
 * capped at half the shorter adjacent segment.
 */
const ShortArrowsTemplate: StoryFn = () => (
  <div style={page}>
    <h3 style={{ margin: 0 }}>radius larger than the arrow</h3>
    <p style={note}>
      Every arrow asks for <code>gridRadius={'{40}'}</code>, but the boxes get closer left to right. The
      corners should get tighter and stay smooth. No line should ever kink or double back on itself.
    </p>
    <div style={canvas}>
      {[160, 90, 45, 20].map((gap, i) => (
        <Xwrapper key={gap}>
          <Box id={`short-a-${i}`} left={40 + i * 210} top={30} />
          <Box id={`short-b-${i}`} left={40 + i * 210 + gap} top={140} />
          <Xarrow start={`short-a-${i}`} end={`short-b-${i}`} path="grid" gridRadius={40} />
        </Xwrapper>
      ))}
    </div>
  </div>
);
export const RadiusLargerThanArrow = ShortArrowsTemplate.bind({});

/**
 * Drag the boxes and scrub the radius. Corner rounding is only ever convincing
 * when you can watch it react to a moving anchor.
 */
const PlaygroundTemplate: StoryFn = () => {
  const [radius, setRadius] = useState(12);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [gridBreak, setGridBreak] = useState('50%');

  return (
    <div style={page}>
      <h3 style={{ margin: 0 }}>playground</h3>
      <p style={note}>Drag either box. The radius is capped by the segments, so it stops growing on its own.</p>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          gridRadius <NumericInput value={radius} onChange={setRadius} min={0} />
        </label>
        <label>
          strokeWidth <NumericInput value={strokeWidth} onChange={(v) => setStrokeWidth(v || 1)} min={1} />
        </label>
        <label>
          gridBreak{' '}
          <select value={gridBreak} onChange={(e) => setGridBreak(e.target.value)}>
            <option value="0%">0%</option>
            <option value="20%">20%</option>
            <option value="50%">50%</option>
            <option value="100%">100%</option>
          </select>
        </label>
      </div>
      <div style={{ ...canvas, height: 300 }}>
        <Xwrapper>
          <DraggableBox id="play-a" initialOffset={{ x: 60, y: 40 }} />
          <DraggableBox id="play-b" initialOffset={{ x: 420, y: 190 }} />
          <Xarrow
            start="play-a"
            end="play-b"
            path="grid"
            gridRadius={radius}
            strokeWidth={strokeWidth}
            gridBreak={gridBreak}
          />
        </Xwrapper>
      </div>
    </div>
  );
};
export const Playground = PlaygroundTemplate.bind({});
