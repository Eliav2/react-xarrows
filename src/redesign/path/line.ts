import { Dir, Vector } from "./vector";
import { between, eq, round } from "./mathUtils";

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
