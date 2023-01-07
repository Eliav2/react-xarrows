import { Vector } from "./vector";
import { Contains } from "../types";

export class Rectangle {
  leftTop: Vector;
  rightBottom: Vector;
  left: number;
  top: number;
  right: number;
  bottom: number;
  height: number;
  width: number;

  constructor(dims: Contains<{ left: number; top: number; right: number; bottom: number }>);
  constructor(leftTop: Vector, rightBottom: Vector);
  constructor(arg1: Vector | Contains<{ left: number; top: number; right: number; bottom: number }>, arg2?: Vector) {
    if (arg1 instanceof Vector) {
      if (!(arg2 instanceof Vector)) throw Error("illegal");
      this.leftTop = arg1;
      this.rightBottom = arg2;
      this.left = arg1.x;
      this.top = arg1.y;
      this.right = arg2.x;
      this.bottom = arg2.y;
      this.height = arg2.y - arg1.y;
      this.width = arg2.x - arg1.x;
    } else {
      this.leftTop = new Vector(arg1.left, arg1.top);
      this.rightBottom = new Vector(arg1.right, arg1.bottom);
      this.left = arg1.left;
      this.top = arg1.top;
      this.right = arg1.right;
      this.bottom = arg1.bottom;
      this.height = arg1.bottom - arg1.top;
      this.width = arg1.right - arg1.left;
    }
    // this.left = new Line(this.leftTop, new Vector(this.leftTop.x, this.rightBottom.y));
    // this.top = new Line(this.leftTop, new Vector(this.rightBottom.x, this.leftTop.y));
    // this.right = new Line(this.rightBottom, new Vector(this.rightBottom.x, this.leftTop.y));
    // this.bottom = new Line(this.rightBottom, new Vector(this.leftTop.x, this.rightBottom.y));
  }

  // getCuts(l: Line) {
  //   let cuts: [Line, Vector][] = [];
  //   for (let line of [this.left, this.right, this.top, this.bottom]) {
  //     let vcut = line.getCut(l);
  //     if (vcut) cuts.push([line, vcut]);
  //   }
  //   return cuts;
  // }
  //
  // // return the closer edge of the line to the given vector
  // getAvoidVectorEdge(rectLine: Line, v: Vector) {
  //   let ll1 = new Line(v, rectLine.root);
  //   let ll2 = new Line(v, rectLine.end);
  //   let [vll1, vll2] = ll1.diff.absSize() < ll2.diff.absSize() ? [ll1.diff, ll2.diff] : [ll2.diff, ll1.diff];
  //   let vCornerClose = v.add(vll1);
  //   // let vCornerFar = v.faceDir.parallel(rectLine.dir) ? v.add(vll2) : null;
  //   return vCornerClose;
  // }
  //
  // isInside(v: Vector) {
  //   return between(v.x, this.leftTop.x, this.rightBottom.x) && between(v.y, this.leftTop.y, this.rightBottom.y);
  // }

  // expand the rectangle by the given amount in all directions
  expand(n: number) {
    return new Rectangle(this.leftTop.sub(n), this.rightBottom.add(n));
  }

  shrink(n: number) {
    return this.expand(-n);
  }
}
