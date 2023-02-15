import { between, deg2Rad, math_operators, operatorFunc, round } from "../utils/mathUtils";
import { Contains, dimensionType, removeReadOnly } from "../privateTypes";
import _ from "lodash";
import { _faceDirType, anchorNamedType } from "../types";

export const MATH_PRECISION = 5;

// const eq = (a: number, b: number, precision = MATH_PRECISION) => Math.abs(a - b) < 1 / 10 ** precision;
// const eq = (a: number, b: number) => Math.abs(a - b) < Number.EPSILON;
const eq = (a: number, b: number) => Math.abs(a - b) < 10 ** -(MATH_PRECISION - 1);

const operators = {
  add: (x, y) => x + y,
  sub: (x, y) => x - y,
  mul: (x, y) => x * y,
  dev: (x, y) => x / y,
  greater: (x, y) => x > y,
  greaterEqual: (x, y) => x >= y,
  smaller: (x, y) => x < y,
  smallerEqual: (x, y) => x <= y,
};

// const pathMargin = 15;
export class Vector {
  // _tmp: T;
  x: number;
  y: number;
  faceDirs: Dir[] | null; // all allowed dirs
  _chosenFaceDir: Dir | null; // to which dir the vector is pointing
  dir: Dir | undefined; // direction of the vector with respect to x and y

  constructor(x: number, y: number);
  constructor(v: Vector);
  constructor(v: Contains<{ x: number; y: number }>);
  // constructor(x: number | Vector | Contains<{ x: number; y: number }>, y?: number) {
  constructor(x, y?) {
    if (x instanceof Vector || typeof x === "object") {
      this.x = x.x;
      this.y = x.y;
      if (typeof y === "number") throw Error("illegal");
    } else {
      this.x = x;
      this.y = y;
    }
    this.faceDirs = null;
    this._chosenFaceDir = null;

    if (!(this instanceof Dir)) this.dir = new Dir(this.x, this.y);
  }

  eq(p: Vector): boolean {
    return eq(p.x, this.x) && eq(p.y, this.y);
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

  setDirs(d: Dir[]) {
    // let v = new Vector(this);
    this.faceDirs = d;
    return this;
  }

  setChosenDir(d: Dir) {
    // let v = new Vector(this);
    // v.requiredFaceDir = this.requiredFaceDir;
    this._chosenFaceDir = d;
    return this;
  }

  // setRequiredDir = (d: Dir) => {
  //   // let v = new Vector(this);
  //   this.requiredFaceDir = d;
  //   return this;
  // };

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

  // eq = (p: Dir) => p.x === this.x && p.y === this.y;
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

/**
 * normalized direction
 */
export class Dir extends Vector {
  // @ts-ignore
  constructor(xDiff: number | Vector | { x: number; y: number }, yDiff?: number) {
    if (xDiff instanceof Vector || typeof xDiff === "object") [xDiff, yDiff] = [xDiff.x, xDiff.y];
    if (typeof xDiff === "number" && typeof yDiff !== "number") throw Error("second argument should be number");
    // unit circle -  max dir  [0.707,0.707]
    let [x, y] = fQ2(xDiff, yDiff);
    super(x, y);
    // // unit rect - max dir  [1,1]
    // let m = Math.max(Math.abs(xDiff), Math.abs(yDiff));
    // if (m == 0) m = 1;
    // super(xDiff / m, yDiff / m);
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
  readonly b: number; // meet with y axis

  // note! this doesn't have to be direction on x or y exclusively
  readonly dir: Dir;

  // the vector connecting start and end
  readonly diff: Vector;

  private readonly startIncluded: boolean;
  private readonly endIncluded: boolean;

  constructor(start: Vector, end: Vector, { startIncluded = true, endIncluded = false } = { startIncluded: true, endIncluded: false }) {
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
