import { Contains } from "../types";
import { IDir, IVector, parseDirection, parsePossiblyDirectedVector, PossiblyDirectedVector, UVector } from "../types";
import { between, deg2Rad, eq, math_operators, operatorFunc, round } from "./mathUtils";
import { toArray } from "../utils";
import { number } from "prop-types";

// const pathMargin = 15;
export class Vector {
  // _tmp: T;
  x: number;
  y: number;
  // // direction of the vector with respect to x and y
  // dir!: Dir;
  // vector going outside from the end of this vector must be in a direction in this list
  trailingDir: Dir[] | undefined;

  constructor(x: number, y: number);
  constructor(v: Vector);
  constructor(v: Contains<{ x: number; y: number; trailingDir?: Dir[] }>);
  // constructor(x: number | Vector | Contains<{ x: number; y: number }>, y?: number) {
  constructor(arg1: number | Vector | Contains<PossiblyDirectedVector>, arg2?: number) {
    if (arg1 instanceof Vector || typeof arg1 === "object") {
      if (typeof arg2 === "number") throw Error("illegal");
      if (arg1 instanceof Vector) {
        this.x = arg1.x;
        this.y = arg1.y;
        this.trailingDir = arg1.trailingDir;
      } else {
        this.x = arg1.x;
        this.y = arg1.y;
        if (arg1.trailingDir) {
          const trailingDirs = toArray(arg1.trailingDir);
          this.trailingDir = trailingDirs?.map((d) => new Dir(parseDirection(d)));
        }
      }
    } else {
      this.x = arg1;
      this.y = arg2 as number;
    }

    // if (!(this instanceof Dir)) this.dir = new Dir(this.x, this.y);
  }

  eq(p: Vector): boolean {
    return eq(p.x, this.x) && eq(p.y, this.y);
  }

  dir() {
    return new Dir(this.x, this.y);
  }

  notEq(p: Vector): boolean {
    return !eq(p.x, this.x) || !eq(p.y, this.y);
  }

  add<T extends Vector>(this: T, p: Vector | number, self = false): Vector {
    return operatorFunc(this, p, math_operators.add, self);
  }

  sub<T extends Vector>(this: T, p: Vector | number, self = false): Vector {
    return operatorFunc(this, p, math_operators.sub, self);
  }

  // mul(p: Vector | number,self=false) {
  mul<T extends Vector>(this: T, p: Vector | number, self = false): Vector {
    return operatorFunc(this, p, math_operators.mul, self);
  }

  dev<T extends Vector>(this: T, p: Vector | number, self = false): Vector {
    return operatorFunc(this, p, math_operators.dev, self);
  }

  absSize() {
    // return Math.sqrt(this.x ** 2 + this.y ** 2);
    return Math.abs(this.x) + Math.abs(this.y ** 2);
  }

  size() {
    return this.x + this.y;
  }

  abs() {
    return new Vector(Math.abs(this.x), Math.abs(this.y));
  }

  rotate(deg) {
    const rad = deg2Rad(deg);
    // let v =
    const contextClass: any = this.constructor;
    return new contextClass(round(this.x * Math.cos(rad) - this.y * Math.sin(rad)), round(this.x * Math.sin(rad) + this.y * Math.cos(rad)));
  }

  projection<T extends Vector>(this: T, v: Vector): Vector {
    // return new Vector(this.dir().mul(v));
    // return this.mul(Math.atan2(this.size(), v.size()));
    // return this.mul(v)
    //   .dev(v.size() ** 2)
    //   .mul(v);
    // return this.mul(v).dev(v.mul(v)).mul(v)  ;
    return this.mul(v).dev(v.mul(v)).mul(v);
  }

  round() {
    this.x = round(this.x);
    this.y = round(this.y);
    return this;
  }

  // to establish zTurn, 2 vectors must be in the same direction
  // this method check of there is a direction that is allowed in both vectors, and if so return it
  canZTurnTo(v: Vector): Dir | undefined {
    const res = this.trailingDir?.find((d) => v.trailingDir?.some((d2) => d.eq(d2)));
    return res;
  }

  // to establish rTurn, the second vector must be in 90 degree or -90 degrees to the direction of the first vector
  // this method check of there is a pair of directions that are allowed in both vectors, and if so return it
  canRTurnTo(v: Vector): [Dir, Dir] | undefined {
    for (const d of this.trailingDir ?? []) {
      for (const d2 of v.trailingDir ?? []) {
        if (d.eq(d2.rotate(90)) || d.eq(d2.rotate(-90))) return [d, d2];
      }
    }
  }
}

// receives a vector and returns direction unit
const fQ2 = (x, y) => {
  let ySign = y >= 0 ? 1 : -1;
  let xSqrt = Math.sqrt(x ** 2 + y ** 2);
  if (xSqrt == 0) return [0, 0];
  let xDir = x / xSqrt;
  let yDir = Math.sqrt(1 - xDir ** 2) * ySign;
  return [xDir, yDir];
};
export const omitAttrs = <T, K extends keyof T>(Class: new () => T, keys: K[]): new () => Omit<T, typeof keys[number]> => {
  return Class;
};

type t = typeof Vector;

/**
 * normalized direction
 */
// @ts-ignore
// export class Dir extends omitAttrs(Vector, ["trailingDir", "dir"]) {
export class Dir extends Vector {
  constructor(xDiff: number | Vector | { x: number; y: number }, yDiff?: number) {
    if (xDiff instanceof Vector || typeof xDiff === "object") [xDiff, yDiff] = [xDiff.x, xDiff.y];
    if (typeof xDiff === "number" && typeof yDiff !== "number") throw Error("second argument should be number");
    // unit circle -  max dir  [0.707,0.707]
    let [x, y] = fQ2(xDiff, yDiff);
    super(x, y);
    // // @ts-ignore
    // delete this.trailingDir;
    // // @ts-ignore
    // delete this.dir;
  }

  reverse() {
    return new Dir(-this.x, -this.y);
  }

  //replace direction of x and y
  mirror() {
    return new Dir(this.y, this.x);
  }

  abs() {
    return new Dir(Math.abs(this.x), Math.abs(this.y));
  }

  //mean that parallel directions
  parallel(p: Vector) {
    return Math.abs(p.x) === Math.abs(this.x) && Math.abs(p.y) === Math.abs(this.y);
  }

  toDegree() {
    return (Math.atan2(this.y, this.x) * 180) / Math.PI;
  }

  // returns 'x' if x is bigger, 'y' if y is bigger, 'x' if x and y are equal
  toCloserAxis(): "x" | "y" {
    return Math.abs(this.x) >= Math.abs(this.y) ? "x" : "y";
  }

  //rotate a point around the root (0,0) point
}

// // mini test
// const v1 = new Vector(1, 0.6);
// const v2 = new Vector(1, 0.6);
// console.log(v1.projection(v2));

/**
 * straight line
 */
export class Line {
  readonly root: Vector;
  readonly end: Vector;

  readonly a: number; //slope
  readonly b: number; // meet with y-axis

  // note! this doesn't have to be direction on x or y exclusively
  readonly dir: Dir;

  // the vector connecting start and end
  readonly diff: Vector;

  private readonly startIncluded: boolean;
  private readonly endIncluded: boolean;

  constructor(
    start: Vector,
    end: Vector,
    { startIncluded = true, endIncluded = false } = {
      startIncluded: true,
      endIncluded: false,
    }
  ) {
    this.root = start;
    this.end = end;
    let [a, b] = this.getAB();
    this.a = a;
    this.b = b;
    this.startIncluded = startIncluded;
    this.endIncluded = endIncluded;
    this.dir = new Dir(this.end.x - this.root.x, this.end.y - this.root.y);

    this.diff = new Vector(this.end.x - this.root.x, this.end.y - this.root.y);
  }

  //return form of y = ax+b form
  private getAB() {
    let a = round((this.end.y - this.root.y) / (this.end.x - this.root.x)); //slope
    let b = round(this.root.y - a * this.root.x); // meet with y axis
    return [a, b];
  }

  stripEnd(size: number) {
    return new Line(this.root, this.end.sub(this.dir.mul(size)));
  }

  xDiff() {
    return new Vector(this.end.x - this.root.x, 0);
  }

  yDiff() {
    return new Vector(0, this.end.y - this.root.y);
  }

  getCloserEdge(v: Vector) {
    let l1 = new Line(v, this.root);
    let l2 = new Line(v, this.end);
    return l1.diff.absSize() < l2.diff.absSize() ? this.root : this.end;
  }

  // meeting point with other line
  getCut(l: Line): Vector | null {
    // handle edge cases
    if (l.dir.parallel(this.dir)) {
      // return null; //dont include inclusive points when parallel
      // if (this.isOnLine(l.end)) {
      //   // return this.getCloserEdge(l.end);
      //   // return l.end;
      // }
      return null;
    }
    // normal cases
    let xCut, yCut, vCut: Vector;
    let [[a1, b1], [a2, b2]] = [
      [this.a, this.b],
      [l.a, l.b],
    ];
    let [a, b] = [a1, b1];
    if (Math.abs(a1) == Infinity) {
      xCut = this.root.x;
      [a, b] = [a2, b2];
    } else if (Math.abs(a2) == Infinity) {
      xCut = l.root.x;
    } else xCut = round((b2 - b1) / (a1 - a2));
    yCut = round(a * xCut + b); //also equals to a2 * xCut + b2
    vCut = new Vector(xCut, yCut);
    if (!this.isOnLine(vCut) || !l.isOnLine(vCut)) return null;
    if (vCut.eq(this.root)) return null;
    return vCut;
  }

  // does a point sits on this line?
  isOnLine(
    v: Vector,
    { startIncluded = this.startIncluded, endIncluded = this.endIncluded } = {
      startIncluded: this.startIncluded,
      endIncluded: this.endIncluded,
    }
  ) {
    let [x1, y1, x2, y2] = [this.root.x, this.root.y, this.end.x, this.end.y];
    // if (x1 == x2 && x1 == v.x) return false;
    // if (y1 == y2 && y1 == v.y) return false;
    // if (x1 == x2 && x1 == v.x) return between(v.y, y1, y2);
    // if (y1 == y2 && y1 == v.y) return between(v.x, x1, x2);
    let res =
      (eq(v.y, this.a * v.x + this.b) || Math.abs(this.a) == Infinity) &&
      between(v.x, x1, x2, startIncluded, endIncluded) &&
      between(v.y, y1, y2, startIncluded, endIncluded);
    //   ||
    // (this.dir.eq(this.diff) &&
    //   between(v.x, x1, x2, true, true) &&
    //   this.dir.eq(this.diff) &&
    //   between(v.y, y1, y2, startIncluded, endIncluded));

    if (!res) {
      // if(v,x)
    }
    return res;

    // let [xMax, xMin] = [Math.max(this.root.x, this.end.x), Math.min(this.root.x, this.end.x)];
    // let [yMax, yMin] = [Math.max(this.root.y, this.end.y), Math.min(this.root.y, this.end.y)];
    // let startComp = this.startIncluded ? operators.greaterEqual : operators.greater;
    // return v.y === this.a * v.x + this.b && v.x >= xMin && v.x <= xMax && v.y >= yMin && v.y <= yMax;
  }
}

class VectorArr extends Array<Vector> {
  constructor(...items) {
    super(...items);

    // Set the prototype explicitly. (typescript does not allow to extend base classes like Array)
    // see: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
    Object.setPrototypeOf(this, VectorArr.prototype);
  }

  toList() {
    return this.map((v) => [v.x, v.y] as const);
  }

  rev() {
    let rev = [...this];
    return new VectorArr(...rev.reverse());
  }

  print() {
    return `Vector ${this.map((v) => `[${[v.x, v.y]}]`)}`;
  }
}

// subtract two points with respect to a given factor
const deltaPoints = (p1: [number, number], p2: [number, number], factor = 0.5): [number, number] => {
  return [(p2[0] - p1[0]) * factor, (p2[1] - p1[1]) * factor];
};

/**
 * receives a list of points and returns a string that that represents curves intersections when used as the 'd' attribute of svg path element
 */
export const pointsToCurves = (points: IVector[]) => {
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
export const pointsToLines = (points: [number, number][]): string => {
  const p1 = points.splice(0, 1)[0];
  const first = `M ${p1[0]} ${p1[1]}`;
  return points.reduce((ac, cr) => ac + ` L ${cr[0]} ${cr[1]} `, first);
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
 */
export const getBestPath = (
  startPoint,
  endPoint,
  options: { breakPoint: number } = { breakPoint: 0.5 }
): { points: IVector[]; startDir: IDir | undefined; endDir: IDir | undefined } => {
  const { breakPoint = 0.5 } = options;
  const startVector = new Vector(parsePossiblyDirectedVector(startPoint));
  const endVector = new Vector(parsePossiblyDirectedVector(endPoint));
  const zDir = startVector.canZTurnTo(endVector);
  if (zDir)
    return {
      points: zTurn(startVector, endVector, { dir: zDir.toCloserAxis(), breakPoint }),
      startDir: zDir,
      endDir: zDir,
    };
  const rDir = startVector.canRTurnTo(endVector);
  if (rDir) {
    const points = rTurn(startVector, endVector, { dir: rDir[0].toCloserAxis() });
    return {
      points,
      startDir: rDir[0],
      endDir: rDir[1],
    };
  }
  return {
    points: [startVector, endVector],
    startDir: startVector.trailingDir?.[0],
    endDir: endVector.trailingDir?.[0],
  };
};
