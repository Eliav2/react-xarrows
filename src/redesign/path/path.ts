import { IDir, IVector, parsePossiblyDirectedVector, PossiblyDirectedVector, UVector } from "../types";
import { Dir, Vector } from "./vector";

// subtract two points with respect to a given factor
const deltaPoints = (p1: [number, number], p2: [number, number], factor = 0.5): [number, number] => {
  return [(p2[0] - p1[0]) * factor, (p2[1] - p1[1]) * factor];
};

/**
 * receives a list of points and returns a string that that represents curves intersections when used as the 'd' attribute of svg path element
 */
export const pointsToCurves = (points: IVector[]) => {
  if (points.length == 0) return "";
  const p0 = points[0];
  let path = `M ${p0.x} ${p0.y} `;
  if (points.length == 1) return path;
  if (points.length == 2) return path + `L ${points[1].x} ${points[1].y}`;

  let i;
  for (i = 1; i < points.length - 2; i++) {
    let [pdx, pdy] = deltaPoints(Object.values(points[i]) as [number, number], Object.values(points[i + 1]) as [number, number], 0.5);
    path += `Q ${points[i].x} ${points[i].y} ${points[i].x + pdx} ${points[i].y + pdy} `;
  }
  path += `Q ${points[i].x} ${points[i].y} ${points[i + 1].x} ${points[i + 1].y}`;
  return path;
};

// receives a list of points and returns a string that that represents lines intersections when used as the 'd' attribute of svg path element
export const pointsToLines = (points: IVector[]): string => {
  const p1 = points.splice(0, 1)[0];
  const first = `M ${p1.x} ${p1.y}`;
  return points.reduce((ac, cr) => ac + ` L ${cr.x} ${cr.y} `, first);
};

// rTurn takes a start point and an end point and returns a list of points that represents a right or left turn
// travel direction is on the 'x' or the 'y' axis. the direction is determined by the 'dir' parameter
export const rTurn = (
  start: UVector,
  end: UVector,
  {
    dir = "auto",
    includeStart = true,
    includeEnd = true,
  }: {
    dir?: "x" | "y" | "auto";
    includeStart?: boolean;
    includeEnd?: boolean;
  } = {}
): Vector[] => {
  let [s, e] = [new Vector(start), new Vector(end)];
  let d = e.sub(s);
  if (dir == "auto") dir = Math.abs(d.x) > Math.abs(d.y) ? "x" : "y";
  const points: Vector[] = [];
  if (includeStart) points.push(s);
  if (dir == "x") points.push(new Vector(e.x, s.y));
  else points.push(new Vector(s.x, e.y));
  if (includeEnd) points.push(e);
  return points;
};

// zTurn is consists of two rTurns and a specified break point
export const zTurn = (
  start: UVector,
  end: UVector,
  {
    breakPoint = 0.5,
    dir = "auto",
  }: {
    breakPoint?: number;
    dir?: "x" | "y" | "auto";
  } = {}
): Vector[] => {
  let points: Vector[] = [];
  let [s, e] = [new Vector(start), new Vector(end)];
  let d = e.sub(s).mul(breakPoint);
  if (dir == "auto") dir = Math.abs(d.x) > Math.abs(d.y) ? "x" : "y";
  let [x, y] = [s.x, s.y];
  points.push(s);
  if (dir == "x") {
    x += d.x;
    points.push(new Vector({ x, y }));
    points.push(new Vector({ x, y: e.y }));
  } else {
    y += d.y;
    points.push(new Vector({ x, y }));
    points.push(new Vector({ x: e.x, y }));
  }
  points.push(e);
  return points;
};

/**
 * takes start and end points and returns a list of points that represents the best intuitive path between them
 * currently the best path can be either a straight line rTurn or zTurn
 * todo: add pTurn option
 */
export const getBestPath = (
  startPoint: Vector,
  endPoint: Vector,
  options: { zBreakPoint: number } = { zBreakPoint: 0.5 }
): { points: IVector[]; startDir: Dir; endDir: Dir } => {
  const { zBreakPoint = 0.5 } = options;
  const startVector = new Vector(parsePossiblyDirectedVector(startPoint));
  const endVector = new Vector(parsePossiblyDirectedVector(endPoint));
  // console.log("startVector", startVector.trailingDir);
  // console.log("endPoint", endPoint.x);

  const forwardDir = endVector.sub(startVector).dir();
  const startDir = startVector.chooseDir(forwardDir);
  let endDir = endVector.chooseDir(forwardDir);

  if (startDir && endDir && startDir.canZTurnTo(endDir)) {
    console.log("Z turn");
    return {
      // points: zTurn(startVector, endVector, { dir: zDir.getCloserAxisName(), breakPoint: zBreakPoint }),
      points: zTurn(startVector, endVector, { dir: endDir.getCloserAxisName(), breakPoint: zBreakPoint }),
      // todo: fix types issues
      startDir,
      endDir,
    };
  }
  // console.log(startVector, endVector);
  if (startDir && endDir && startDir.canRTurnTo(endDir)) {
    console.log("R turn");
    const points = rTurn(startVector, endVector, { dir: startDir.getCloserAxisName() });
    return {
      points,
      startDir,
      endDir,
    };
  }
  // if no turn is possible, return a straight line
  return {
    points: [startVector, endVector],
    startDir: startVector.trailingDir?.[0] ?? forwardDir,
    endDir: endVector.trailingDir?.[0] ?? forwardDir,
  };
};
