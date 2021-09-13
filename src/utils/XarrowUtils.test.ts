import { getPathState } from './XarrowUtils';

test('test1', () => {
  let newGetPath = getPathState(
    (pos) => {
      pos.x = 10;
      return pos;
    },
    (pos) => `M0,0 L${pos.x},-10`
  );
  expect(newGetPath()).toMatch(`M0,0 L${10},-10`);

  let newGetPath2 = newGetPath(
    (pos) => {
      pos.x += 20;
      pos.y = 20;
      return pos;
    }
    // (pos) => `M0,0 L${pos.x},${pos.y}`
  );
  expect(newGetPath2()).toMatch(`M0,0 L${30},-10`);

  let newGetPath3 = newGetPath(
    (pos) => {
      pos.x += 20;
      pos.y = 20;
      return pos;
    },
    (pos) => `M0,0 L${pos.x},${pos.y}`
  );
  expect(newGetPath3()).toMatch(`M0,0 L${30},${20}`);
});

test('no extending', () => {
  let newGetPath = getPathState(undefined, (pos) => `M0,0 L${pos.x},-10`, { x: 10 });
  expect(newGetPath).toMatch(`M0,0 L${10},-10`);
});

test('extending pathState types', () => {});
