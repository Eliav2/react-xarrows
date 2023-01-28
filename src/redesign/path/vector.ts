// const pathMargin = 15;
import { Contains, IVector, OneOrMore, parseDirection, PossiblyDirectedVector } from "../types";
import { toArray } from "../utils";
import { deg2Rad, eq, math_operators, operatorFunc, round } from "./mathUtils";

type TrailingDir = Dir[] | undefined;

class _Vector<T extends TrailingDir> {
  // _tmp: T;
  x: number;
  y: number;
  // // direction of the vector with respect to x and y
  // dir!: Dir;

  // vector going outside from the end of this vector must be in a direction in this list
  trailingDir!: T;

  // trailingDir: withDir extends true ? Dir[] : undefined;

  constructor(x: number, y: number);
  constructor(v: Vector<T>);
  constructor(v: Contains<{ x: number; y: number; trailingDir?: Dir[] }>);
  // constructor(x: number | Vector | Contains<{ x: number; y: number }>, y?: number) {
  constructor(arg1: number | Vector<T> | Contains<PossiblyDirectedVector>, arg2?: number) {
    if (arg1 instanceof Vector || typeof arg1 === "object") {
      if (arg2) throw Error("illegal");
      if (arg1 instanceof Vector) {
        this.x = arg1.x;
        this.y = arg1.y;
        this.trailingDir = arg1.trailingDir;
        // console.log(arg1, this.trailingDir);
      } else {
        this.x = arg1.x;
        this.y = arg1.y;
        if (arg1.trailingDir) {
          const trailingDirs = toArray(arg1.trailingDir);
          this.trailingDir = trailingDirs?.map((d) => new Dir(parseDirection(d))) as T;
        }
      }
    } else {
      this.x = arg1;
      this.y = arg2 as number;
    }

    // if (!(this instanceof Dir)) this.dir = new Dir(this.x, this.y);
  }

  eq(p: Vector<any>): boolean {
    return eq(p.x, this.x) && eq(p.y, this.y);
  }

  dir() {
    return new Dir(this.x, this.y);
  }

  notEq(p: Vector): boolean {
    return !eq(p.x, this.x) || !eq(p.y, this.y);
  }

  add<T extends Vector>(this: T, p: IVector | number, self = false): T {
    return operatorFunc(this, p, math_operators.add, self) as any;
  }

  sub<T extends Vector>(this: T, p: IVector | number, self = false): T {
    return operatorFunc(this, p, math_operators.sub, self) as any;
  }

  // mul(p: IVectorself=false) {
  mul<T extends Vector>(this: T, p: IVector | number, self = false): T {
    return operatorFunc(this, p, math_operators.mul, self) as any;
  }

  dev<T extends Vector>(this: T, p: IVector | number, self = false): T {
    return operatorFunc(this, p, math_operators.dev, self) as any;
  }

  absSize() {
    // return Math.sqrt(this.x ** 2 + this.y ** 2);
    // return Math.abs(this.x) + Math.abs(this.y ** 2);
    return Math.abs(this.x) + Math.abs(this.y);
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

  projection<T extends Vector<any>>(this: T, v: Vector<any>): T {
    // return new Vector(this.dir().mul(v));
    // return this.mul(Math.atan2(this.size(), v.size()));
    // return this.mul(v)
    //   .dev(v.size() ** 2)
    //   .mul(v);
    // return this.mul(v).dev(v.mul(v)).mul(v)  ;
    // return this.mul(v).dev(v.mul(v)).mul(v);
    return this.mul(v).dev(v.mul(v));
    // return this.mul(v)
    //   .dev(Math.abs(v.size()) ** 2)
    //   .mul(v);
  }

  projectionSize(v: Vector<any>) {
    return this.projection(v).size();
  }

  round() {
    this.x = round(this.x);
    this.y = round(this.y);
    return this;
  }

  // to establish zTurn, 2 vectors must be in the same direction
  // this method check of there is a direction that is allowed in both vectors, and if so return it
  canZTurnTo<T extends TrailingDir>(v: Vector<T>): T extends Dir[] ? Dir : undefined {
    // console.log("canZTurnTo", this.trailingDir, v.trailingDir, v.sub(this).dir().getCloserAxisName());
    // console.log("canZTurnTo2", v.dir(), v.sub(this).dir().getCloserAxis());
    const res = this.trailingDir?.find((d) => v.trailingDir?.some((d2) => d.eq(d2)));
    return res as T extends Dir[] ? Dir : undefined;
  }

  // chooses one trailingDir from the list of trailingDir, based on a given direction
  // the chosen trailingDir is the one that is the closest projection to the given direction
  chooseDir(dir: Dir) {
    if (!this.trailingDir) return;
    // const testTrailingDirs = [
    //   new Dir(1, 0),
    //   // new Dir(1, 1),
    //   new Dir(0, 1),
    //   // new Dir(-1, 1),
    //   new Dir(-1, 0),
    //   // new Dir(-1, -1),
    //   new Dir(0, -1),
    //   // new Dir(1, -1),
    // ];
    // console.log(
    //   "chooseDir",
    //   this.trailingDir.map((d) => dir.projection(d))
    // );
    // console.log(dir);
    const sorted = [...this.trailingDir];
    sorted.sort((a, b) => {
      // console.log("sort", b.projection(dir), a.projection(dir));
      // console.log("sort", round(b.projection(dir).size()), round(a.projection(dir).size()));
      // console.log("sort", a.x, b.x);
      return b.projection(dir).size() - a.projection(dir).size();
    });
    // console.log(
    //   this.trailingDir.map((d) => d.x),
    //   sorted.map((d) => d.x)
    // );
    // console.log(
    //   "chooseDir",
    //   sorted,
    //   this.trailingDir.map((d) => d.projection(dir).size()),
    //   sorted[0]
    // );
    return sorted[0];

    // testTrailingDirs.forEach((d) => {
    //   console.log("chooseDir", d, dir, this.mul(dir.projection(d)));
    //   // d.chooseDir(dir);
    // });
    // const res = this.trailingDir.sort((a, b) => b. - a.p.size());
    // console.log("chooseDir", res);
    // return "?";
  }

  // to establish rTurn, the second vector must be in 90 degree or -90 degrees to the direction of the first vector
  // this method check of there is a pair of directions that are allowed in both vectors, and if so return it
  canRTurnTo(v: Vector<T>): [Dir, Dir] | undefined {
    for (const d of this.trailingDir ?? []) {
      for (const d2 of v.trailingDir ?? []) {
        if (d.eq(d2.rotate(90)) || d.eq(d2.rotate(-90))) return [d, d2];
      }
    }
  }
}

// this is a trick to handle typescript generics in classes https://stackoverflow.com/questions/47867918/declare-a-constructor-to-correctly-infer-generic-type-from-keyof-argument-in-t
export interface Vector<T extends TrailingDir = any> extends _Vector<T> {}

interface VectorConstructor {
  new (x: number, y: number): Vector<undefined>;

  new <T extends TrailingDir>(v: Contains<{ x: number; y: number; trailingDir: T }>): Vector<T>;

  new <T extends TrailingDir>(v: Contains<{ x: number; y: number }>): Vector<undefined>;

  new <T extends TrailingDir>(v: Vector<T>): Vector<T>;
}

export const Vector: VectorConstructor = _Vector;

export const fQ2 = (x, y) => {
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
  constructor(xDiff: number | Vector<any> | { x: number; y: number }, yDiff?: number) {
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
  parallel(p: Vector<any>) {
    return Math.abs(p.x) === Math.abs(this.x) && Math.abs(p.y) === Math.abs(this.y);
  }

  toDegree() {
    return (Math.atan2(this.y, this.x) * 180) / Math.PI;
  }

  // returns 'x' if x is bigger, 'y' if y is bigger, 'x' if x and y are equal
  getCloserAxisName(): "x" | "y" {
    return Math.abs(this.x) >= Math.abs(this.y) ? "x" : "y";
  }

  getCloserAxis(): Dir {
    const closerAxis = this.getCloserAxisName();
    console.log(this.x);
    return new Dir(closerAxis === "x" ? (this.x > 0 ? 1 : -1) : 0, closerAxis === "y" ? (this.y > 0 ? 1 : -1) : 0);
  }

  // projectOnCloserAxis() {
  //   const closerAxis = this.getCloserAxis();
  //   return new Dir(closerAxis === "x" ? this.x : 0, closerAxis === "y" ? this.y : 0);
  // }

  //rotate a point around the root (0,0) point
}

const tmp = new Vector({ x: 10, y: 10 });
