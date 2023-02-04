import { assert, expect, test } from "vitest";
import { Dir, Vector } from "../src/redesign/path/vector";

test("Vector initialization", () => {
  const v1 = new Vector(1, 2);
  const v2 = new Vector(10, 20);
  const v3 = v2.sub(v1);
  expect(v3.x).toBe(9);
  expect(v3.y).toBe(18);
});

test("Vector projection", () => {
  const xyDirs = [new Dir(1, 0), new Dir(0, 1), new Dir(-1, 0), new Dir(0, -1)];
  const vStart = new Vector({
    x: 0,
    y: 0,
    trailingDir: xyDirs,
  });
  const vEnd = new Vector({
    x: 1000,
    y: 10,
    trailingDir: xyDirs,
  });
  const forwardVector = vEnd.sub(vStart);
  const forwardDir = forwardVector.dir();

  expect(vStart.trailingDir?.map((d) => d.projectionSize(forwardDir))).toEqual([
    0.999900009999, 0.00009999000100002764, -0.999900009999, -0.00009999000100002764,
  ]);
});

test("Vector canZTurnTo", () => {
  const xyDirs = [new Dir(1, 0), new Dir(0, 1), new Dir(-1, 0), new Dir(0, -1)];
  const vStart = new Vector({
    x: 0,
    y: 0,
    trailingDir: xyDirs,
  });
  const vEnd = new Vector({
    x: 1000,
    y: 100,
    trailingDir: xyDirs,
  });
  const forwardVector = vEnd.sub(vStart);
});

test("chooseDir", () => {
  // should choose the dir with the highest projection size to the given dir
  const xyDirs = [new Dir(1, 0), new Dir(0, 1), new Dir(-1, 0), new Dir(0, -1)];
  const vStart = new Vector({
    x: 0,
    y: 0,
    trailingDir: xyDirs,
  });
  const vEnd = new Vector({
    x: -1000,
    y: -100,
    trailingDir: xyDirs,
  });
  const forwardVector = vEnd.sub(vStart);
  const forwardDir = forwardVector.dir();
  expect(vEnd.chooseDir(forwardDir)).toEqual(new Dir(-1, 0));
});
