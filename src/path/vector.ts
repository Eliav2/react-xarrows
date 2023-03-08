// const pathMargin = 15;
import { Contains, IDir, IVector, OneOrMore, parseDirection, PossiblyDirectedVector } from "../types";
import { toArray } from "../utils";
import { deg2Rad, eq, math_operators, operatorFunc, round } from "./mathUtils";
import { DirArr } from "./vectorArr";
import { immerable } from "immer";

export type TrailingDir = Dir[] | undefined;

class _Vector<T extends TrailingDir> {
  [immerable] = true;
  // _tmp: T;
  x: number;
  y: number;
  // // direction of the vector with respect to x and y
  // dir!: Dir;

  // vector going outside from the end of this vector must be in a direction in this list
  trailingDir!: T;
  // trailingDir!: DirArr;

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

  add<T extends Vector>(this: T, p: IVector | number | undefined, self = false): Vector {
    return operatorFunc(this, p, math_operators.add, self) as any;
  }

  sub<T extends Vector>(this: T, p: IVector | number | undefined, self = false): Vector {
    return operatorFunc(this, p, math_operators.sub, self) as any;
  }

  // mul(p: IVectorself=false) {
  mul<T extends Vector>(this: T, p: IVector | number | undefined, self = false): Vector {
    return operatorFunc(this, p, math_operators.mul, self) as any;
  }

  dev<T extends Vector>(this: T, p: IVector | number | undefined, self = false): Vector {
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

  projection<T extends Vector<any>>(this: T, v: Vector<any>): Vector {
    // return this.mul(v).dev(v.absSize() ** 2).mul(v);
    return v.mul(this.mul(v).size() * v.absSize() ** 2);
  }

  projectionSize(v: Vector<any>) {
    return this.projection(v).size();
  }

  projectionSizeAbs(v: Vector<any>) {
    return this.projection(v).absSize();
  }

  round() {
    this.x = round(this.x);
    this.y = round(this.y);
    return this;
  }

  // // to establish zTurn, 2 vectors must be in the same direction
  // // this method returns all starting directions that can be used as starting direction for a zTurn
  // canZTurnTo<T extends TrailingDir>(v: Vector<T>): T extends Dir[] ? Dir : undefined {
  //   const forwardVector = v.sub(this);
  //   const forwardDir = forwardVector.dir();
  //   let trailingDirInForwardDirection =
  //     this.trailingDir?.filter(
  //       (d) =>
  //         v.trailingDir?.some((d2) => d.eq(d2)) && // same direction (so it could be pretty zTurn)
  //         d.projection(forwardVector).dir().eq(forwardDir) // their projection is in the target direction (and not opposite)
  //     ) ?? [];
  //   trailingDirInForwardDirection.sort((a, b) => b.projectionSizeAbs(forwardVector) - a.projectionSizeAbs(forwardVector));
  //   return trailingDirInForwardDirection[0] as T extends Dir[] ? Dir : undefined;
  // }

  // chooses one trailingDir from the list of trailingDir, based on a given direction
  // the chosen trailingDir is the one that is the closest projection to the given direction
  chooseDir(dir: Dir) {
    if (!this.trailingDir) return;
    const forward: Dir[] = this.trailingDir.filter((d) => d.projection(dir).dir().eq(dir));
    forward.sort((a, b) => {
      return b.projection(dir).absSize() - a.projection(dir).absSize();
    });
    return forward[0];
  }

  // // to establish rTurn, the second vector must be in 90 degree or -90 degrees to the direction of the first vector
  // // this method check of there is a pair of directions that are allowed in both vectors, and if so return it
  // canRTurnTo(v: Vector<T>): [Dir, Dir] | undefined {
  //   for (const d of this.trailingDir ?? []) {
  //     for (const d2 of v.trailingDir ?? []) {
  //       if (d.eq(d2.rotate(90)) || d.eq(d2.rotate(-90))) return [d, d2];
  //     }
  //   }
  // }
}

// this is a trick to handle typescript generics in classes https://stackoverflow.com/questions/47867918/declare-a-constructor-to-correctly-infer-generic-type-from-keyof-argument-in-t
export interface Vector<T extends TrailingDir = TrailingDir> extends _Vector<T> {}

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

export type DirInitiator = IDir | `${number}deg`;

/**
 * normalized direction
 */
// export class Dir extends weakenClassTypes(Vector) {
export class Dir extends Vector {
  constructor(x: number, y: number);
  constructor(v: IVector);
  constructor(s: `${number}deg`);
  constructor(xDiff: number | Vector<any> | IVector | `${number}deg`, yDiff?: number) {
    if (xDiff instanceof Vector || typeof xDiff === "object") [xDiff, yDiff] = [xDiff.x, xDiff.y];
    if (typeof xDiff === "number" && typeof yDiff !== "number") throw Error("second argument should be number");
    // unit circle -  max dir  [0.707,0.707]
    let x, y;
    if (typeof xDiff === "string") {
      const deg = parseFloat(xDiff);
      x = Math.cos((deg * Math.PI) / 180);
      y = Math.sin((deg * Math.PI) / 180);
    } else [x, y] = fQ2(xDiff, yDiff);
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
    // return Math.abs(this.x) >= Math.abs(this.y) ? "y" : "x";
    return Math.abs(this.x) >= Math.abs(this.y) ? "x" : "y";
  }

  getCloserAxis(): Dir {
    const closerAxis = this.getCloserAxisName();
    console.log(this.x);
    return new Dir(closerAxis === "x" ? (this.x > 0 ? 1 : -1) : 0, closerAxis === "y" ? (this.y > 0 ? 1 : -1) : 0);
  }

  // to establish zTurn, 2 vectors must be in the same direction
  // this method check of there is a direction that allows zTurn in both vectors, and if so return it
  canZTurnTo(v: Dir): boolean {
    return this.eq(v);
  }

  // to establish rTurn, the second vector must be in 90 degree or -90 degrees to the direction of the first vector
  // this method check of there is a pair of directions that are allowed in both vectors, and if so return it
  canRTurnTo(v: Dir): boolean {
    return this.eq(v.rotate(90)) || this.eq(v.rotate(-90));
  }

  // given a list of directions, returns the direction with the biggest projection on this direction
  biggestProjection(dirs: Dir[]) {
    // filter only forward directions (projections with positive size)
    const forward = dirs.filter((d) => d.projection(this).dir().eq(this));
    forward.sort((a, b) => {
      return b.projection(this).absSize() - a.projection(this).absSize();
    });
    return forward[0];
  }

  // given a list of directions, returns the direction with the biggest projection on this direction
  smallestProjection(dirs: Dir[]) {
    // filter only forward directions (projections with positive size)
    const forward = dirs.filter((d) => d.projection(this).dir().eq(this));
    forward.sort((a, b) => {
      return a.projection(this).absSize() - b.projection(this).absSize();
    });
    return forward[0];
  }

  // projectOnCloserAxis() {
  //   const closerAxis = this.getCloserAxis();
  //   return new Dir(closerAxis === "x" ? this.x : 0, closerAxis === "y" ? this.y : 0);
  // }

  //rotate a point around the root (0,0) point
}

// class A {
//   method(): string {
//     return "1";
//   }
//   method2(): string {
//     return "1";
//   }
// }

// // we can have a helper/utility for suppressing error for unrelated types for method override
// function weakenClass(klass: { new (...args: any[]): any }, key: string) {
//   return class extends klass {};
// }
//
// class B extends weaken(A, "") {
//   method(): number {
//     return 1;
//   }
//   method2(): number {
//     return 1;
//   }
// }
