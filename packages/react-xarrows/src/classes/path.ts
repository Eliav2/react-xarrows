import { between, deg2Rad, math_operators, operatorFunc, round } from '../utils/mathUtils';
import { Contains, dimensionType, removeReadOnly } from '../privateTypes';
import _ from 'lodash';
import { _faceDirType, anchorNamedType } from '../types';

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
    if (x instanceof Vector || typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
      if (typeof y === 'number') throw Error('illegal');
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
    return new contextClass(
      round(this.x * Math.cos(rad) - this.y * Math.sin(rad)),
      round(this.x * Math.sin(rad) + this.y * Math.cos(rad))
    );
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
    if (xDiff instanceof Vector || typeof xDiff === 'object') [xDiff, yDiff] = [xDiff.x, xDiff.y];
    if (typeof xDiff === 'number' && typeof yDiff !== 'number') throw Error('second argument should be number');
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

  constructor(
    start: Vector,
    end: Vector,
    { startIncluded = true, endIncluded = false } = { startIncluded: true, endIncluded: false }
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

const filterDirs = (dirs: Dir[], allowedDirs: Dir[]) => {
  let pass: Dir[] = [],
    fail: Dir[] = [];
  let currentPass;
  for (let d of dirs) {
    currentPass = false;
    for (let allowedDir of allowedDirs) {
      if (allowedDir.eq(d)) {
        pass.push(d);
        currentPass = true;
      }
    }
    if (!currentPass) fail.push(d);
  }
  return [pass, fail] as const;
};

type sidesType = 'top' | 'right' | 'bottom' | 'left';

export const gridDirs = {
  up: new Dir(0, -1), //270
  right: new Dir(1, 0), //0
  down: new Dir(0, 1), //90
  left: new Dir(-1, 0), //180
} as const;
// export const pathAllowedDirs = Object.values(gridDirs)

export const SAD = {
  top: 'up',
  right: 'right',
  bottom: 'down',
  left: 'left',
} as const;
export const EAD = {
  top: 'down',
  right: 'left',
  bottom: 'up',
  left: 'right',
} as const;

type condFuncType = (d1: Dir, d2: Dir, vf: Vector, vr: Vector, df: Dir, dr: Dir) => boolean;
const checkPath = (vse: Vector, svDirs: Dir[], evDirs: Dir[], conditionFunc: condFuncType) => {
  for (let svD of svDirs) {
    for (let evD of evDirs) {
      // the rectangle vectors and dirs
      let vf = svD.mul(svD.abs().mul(vse.abs()).size()).round();
      let vr = vse.sub(vf);
      let df = new Dir(vf);
      let dr = new Dir(vr);
      if (conditionFunc(svD, evD, vf, vr, df, dr)) return [svD, evD] as [Dir, Dir];
    }
  }
  return null;
};
const getVectors = (v, vse) => {
  let vf = v.mul(vse.abs());
  let vr = vse.sub(vf);
  let df = new Dir(vf);
  let dr = new Dir(vr);
  return [vf, vr, df, dr];
};

// const myF = (dirs: Dir[], conditionFunc: (d: Dir) => boolean): [Dir[], Dir[]] => {
//
//   return;
// };

/**
 * will set the Dir.chosenFaceDir for sv and ev smartly
 * will return null if no satisfying dir could be chosen(for each sv,ev)
 * only dirs towards inside the rect covering the connection vector could be chosen(else return null)
 */
export const chooseSimplestPath = (
  sv: Vector,
  ev: Vector,
  pathMargin: number,
  allowedDirs = Object.values(gridDirs),
  prevSv: Vector = null,
  prevEv: Vector = null
): [Dir, Dir] => {
  // if (ev.faceDirs?.length === 1 && sv.faceDirs?.length === 1) return [sv.faceDirs[0], ev.faceDirs[0]]; // 95% of the time this will be the case

  let svAllowedDirs: Dir[] = [],
    evAllowedDirs: Dir[] = [];
  // //prefer requiredFaceDir if exists
  // let svAllowedDirs = sv.requiredFaceDir ? [sv.requiredFaceDir] : [];
  // let evAllowedDirs = ev.requiredFaceDir ? [ev.requiredFaceDir] : [];

  // //else prefer sv.faceDirs
  // if (svAllowedDirs.length === 0) svAllowedDirs.push(...sv.faceDirs);
  // if (evAllowedDirs.length === 0) evAllowedDirs.push(...ev.faceDirs);

  //else take allowedDirs of the grid
  if (svAllowedDirs.length === 0) svAllowedDirs.push(...allowedDirs);
  if (evAllowedDirs.length === 0) evAllowedDirs.push(...allowedDirs);

  let svFaceDirs = sv.faceDirs ?? allowedDirs;
  let evFaceDirs = ev.faceDirs ?? allowedDirs;
  // allow directions based on each point direction
  svAllowedDirs = svAllowedDirs.filter((d) => _.find(svFaceDirs, (d2) => d2.eq(d)));
  evAllowedDirs = evAllowedDirs.filter((d) => _.find(evFaceDirs, (d2) => d2.eq(d)));

  // do not go back nor continue prevDir
  if (prevSv) {
    let prevDir = new Vector(prevSv).sub(sv).dir;
    // let prevDir = new Vector(sv).sub(prevSv).dir;
    svAllowedDirs = svAllowedDirs.filter((d) => d.notEq(prevDir) && d.notEq(prevDir.mul(-1)));
  }
  if (prevEv) {
    let prevDir = new Vector(ev).sub(prevEv).dir;
    evAllowedDirs = evAllowedDirs.filter((d) => d.notEq(prevDir) && d.notEq(prevDir.mul(-1)));
  }

  let vse = ev.sub(sv);
  let vsex = new Vector(vse.x, 0);
  let vsey = new Vector(0, vse.y);

  // let ves = sv.sub(ev);
  // let vesx = new Vector(ves.x, 0);
  // let vesy = new Vector(0, ves.y);

  const fInwardsRect = (d) => {
    let c1 = vsex.projection(d).mul(d).size();
    let c2 = vsey.projection(d).mul(d).size();
    return c1 >= 0 && c2 >= 0 && (c1 > 0 || c2 > 0);
  };
  svAllowedDirs = svAllowedDirs.filter(fInwardsRect);
  evAllowedDirs = evAllowedDirs.filter(fInwardsRect);
  // evAllowedDirs = evAllowedDirs.filter(

  //   (d) => d.reverse().projection(vesx).size() >= 0 && d.reverse().projection(vesy).size() >= 0
  // );

  // // if no faceDir allowed and the smart grid does not allow any dir chose default strait line
  // if (svAllowedDirs.length === 0) svAllowedDirs.push(vse.dir);
  // if (evAllowedDirs.length === 0) evAllowedDirs.push(vse.dir);

  // // the dirs inwards the rectangle that connects the 2 points
  // let [evDirsIn, evDirsOut] = _.partition(
  //   evAllowedDirs,
  //   (d) => d.projection(vsex).size() >= 0 && d.projection(vsey).size() >= 0
  // );
  // let [svDirsIn, svDirsOut] = _.partition(
  //   svAllowedDirs,
  //   (d) => d.projection(vsex).size() >= 0 && d.projection(vsey).size() >= 0
  // );

  // prefer dirs with best projections on vse vector
  svAllowedDirs = _.orderBy(svAllowedDirs, (d) => vse.projection(d).size(), 'desc');
  evAllowedDirs = _.orderBy(evAllowedDirs, (d) => vse.projection(d).size(), 'desc');
  // svAllowedDirs = _.orderBy(svAllowedDirs, (d) => d.projection(vse).size(), 'desc');
  // evAllowedDirs = _.orderBy(evAllowedDirs, (d) => d.projection(vse).size(), 'desc');

  // // the rectangle vectors and dirs
  // let vf = sv.faceDirs[0].abs().mul(vse);
  // let vr = vse.sub(vf);
  // let df = new Dir(vf);
  // let dr = new Dir(vr);
  // let [evDirsIn, evDirsOut] = filterDirs(svAllowedDirs, [df, dr]);
  // let [svDirsIn, svDirsOut] = filterDirs(evAllowedDirs, [df, dr]);

  // // prefer the
  // let prevSvWithSameDir = _.find(svDirsIn, (d) => d.eq(prevSv.dir));
  // if (prevSvWithSameDir) svDirsIn = [prevSvWithSameDir];
  // let prevEvWithSameDir = _.find(evDirsIn, (d) => d.eq(prevEv.dir));
  // if (prevEvWithSameDir) svDirsIn = [prevEvWithSameDir];

  if (svAllowedDirs.length === 1 && evAllowedDirs.length === 1) return [svAllowedDirs[0], evAllowedDirs[0]]; //another 90% of time

  // let svDirs: Dir[];
  // let evDirs: Dir[];

  // // prefer inwards dirs if exists
  // if (svDirsIn.length === 0) svDirs = svDirsOut;
  // else svDirs = svDirsIn;
  // if (evDirsIn.length === 0) evDirs = evDirsOut;
  // else evDirs = evDirsIn;

  // if no start or end margin is required chose best path
  if (svAllowedDirs.length !== 0 && evAllowedDirs.length !== 0) {
    let res: [Dir, Dir] | null;

    // path can be connected directly
    // this check for performance - mostly true, will be true for normal gridDirs
    if (sv.x == ev.x || sv.y == ev.y) {
      res = checkPath(
        vse,
        svAllowedDirs,
        evAllowedDirs,
        (svD, evD, vf, vr, df, dr) => svD.eq(evD) && svD.eq(df) && sv.add(vf).eq(ev)
      );
      if (res) return res;
    }

    // prefer r curve if exists (over more complicated path like z or adding margin)
    res = checkPath(
      vse,
      svAllowedDirs,
      evAllowedDirs,
      (svD, evD, vf, vr, df, dr) =>
        svD.notEq(evD) && svD.abs().eq(evD.mirror().abs()) && vr.absSize() > pathMargin && vf.absSize() > pathMargin
    );
    if (res) return res;

    // z curve
    res = checkPath(vse, svAllowedDirs, evAllowedDirs, (svD, evD, vf, vr, df, dr) => svD.eq(evD));
    if (res) return res;
  }

  return [svAllowedDirs[0], evAllowedDirs[0]];
};

export class SmartGrid {
  sources: VectorArr = new VectorArr();
  targets: VectorArr = new VectorArr();

  length: number = 0;

  // targetDir: Dir;
  options: { zGridBreak: { abs: number; relative: number } };
  rectsManager: RectanglesManager;
  pathMargin: number;
  rects: dimensionType[];
  private allowedDirs: Dir[];
  private prevCurve = '';

  constructor(
    sv: Vector,
    ev: Vector,
    rects: dimensionType[] = [],
    pathMargin = 20,
    options = { zGridBreak: { abs: 0, relative: 0.5 } },
    allowedDirs = Object.values(gridDirs)
  ) {
    this.rectsManager = new RectanglesManager(rects);
    this.rects = rects;
    this.pathMargin = pathMargin;
    this.options = options;
    this.allowedDirs = allowedDirs;
    this.sources.push(sv);
    this.targets.push(ev);
    // handleMargin(this, pathMargin);
    // drawToTarget(this, pathMargin);
    // console.log(this.getPoints());
  }

  getSource() {
    return this.sources[this.sources.length - 1];
  }

  getTarget() {
    return this.targets[this.targets.length - 1];
  }

  getEdges() {
    return [this.getSource(), this.getTarget()];
  }

  getSources() {
    return this.sources;
  }

  getTargets() {
    return this.targets;
  }

  pushSource(v: Vector) {
    this.sources.push(v);
    return v;
  }

  pushTarget(v: Vector) {
    this.targets.push(v);
    return v;
  }

  getPoints() {
    // let a = [...this.sources.toList(), ...this.targets.rev().toList()] as const;
    // let b: Mutable<typeof a> = [...a];
    return removeReadOnly([...this.sources.toList(), ...this.targets.rev().toList()] as const);
  }

  getVectors() {
    return [...this.sources, ...this.targets.rev()] as const;
  }

  getLength(): number {
    let len = 0;
    const vectors = this.getVectors();
    for (let i = 0; i < vectors.length - 1; i++) {
      len += vectors[i + 1].sub(vectors[i]).absSize();
    }
    return len;
  }

  getPointOnGrid(len: number) {
    let lenCount = 0;
    const vectors = this.getVectors();
    for (let i = 0; i < vectors.length - 1; i++) {
      let l = new Line(vectors[i], vectors[i + 1]);
      let lineLen = l.diff.absSize();
      if (lenCount + lineLen > len) {
        return vectors[i].add(new Dir(l.diff).mul(len - lenCount));
      }
      lenCount += lineLen;
    }
    return vectors[vectors.length - 1];
  }

  /**
   * main logic to draw intuitive path to target from source
   */
  drawToTarget() {
    // s - start
    // e - end
    // p - parallel
    // o - orthogonal

    let [sv, ev] = this.getEdges();
    if (sv.eq(ev)) {
      this.sources.pop();
      return;
    }
    let svNext: Vector, svNext2: Vector;

    let prevSv = this.sources[this.sources.length - 2];
    let prevEv = this.targets[this.targets.length - 2];

    // choose best path
    let [sd, ed] = chooseSimplestPath(sv, ev, this.pathMargin, this.allowedDirs, prevSv, prevEv);
    sv = sv.setChosenDir(sd);
    ev = ev.setChosenDir(ed);
    this.sources[this.sources.length - 1] = sv;
    this.targets[this.targets.length - 1] = ev;

    let sev = ev.sub(sv);

    // if best path is different from required one - adjust
    //handle end margin
    if (!ed) {
      if (ev.faceDirs?.length > 0) {
        // console.log('end margin');
        let chosenFaceDir = _.maxBy(ev.faceDirs, (d) => sev.projection(d));
        this.pushTarget(ev.sub(chosenFaceDir.mul(this.pathMargin)));
        this.prevCurve = 'outside';
        return this.drawToTarget();
      } else ed = sev.dir;
    }
    if (!sd) {
      if (sv.faceDirs?.length > 0) {
        // console.log('start margin');
        let chosenFaceDir = _.maxBy(sv.faceDirs, (d) => sev.projection(d));
        this.pushSource(sv.add(chosenFaceDir.mul(this.pathMargin)));
        this.prevCurve = 'outside';
        return this.drawToTarget();
      } else sd = sev.dir;
    }
    //direction and vectors of rectangle
    let curve = '';
    let svf = sd.mul(sd.abs().mul(sev.abs()).size()).round();
    let svr = sev.sub(svf).round();

    let sdf = new Dir(svf);
    let sdr = new Dir(svr);
    if (sdr.x == 0 && sdr.y == 0) sdr = sdf.mirror();

    // if (!frontDir.eq(svf) && svf.absSize() > this.pathMargin) {
    // console.log('ha?', frontDir.projection(sdf).size());
    // if (frontDir.projection(sdf).size() < 0) {
    //   console.log('smallllll', frontDir, sdf);
    //   svf = sdf.mul(this.pathMargin);
    //   // svf = frontDir;
    // }

    // if (sdf.x == 0 && sdf.y == 0) sdf = sdr.mirror();

    if (!svNext && sd.eq(ed) && svr.absSize() > 0) {
      // console.log('Z curve');
      curve = 'z';
      svNext = sv.add(svf.mul(this.options.zGridBreak.relative)).add(sdf.mul(this.options.zGridBreak.abs));
      // svNext = svNext.setDirs([sdr]);
      svNext2 = svNext.add(svr);
    }

    // r curve
    if (!svNext && sd.abs().eq(ed.mirror().abs())) {
      // console.log('r curve');
      curve = 'r';
      svNext = sv.add(svf);
    }

    // path connected
    if (svr.absSize() === 0 && sd.eq(ed) && sd.eq(sdf)) {
      // console.log('handle path') ;

      // handle edge cases
      let prevDir = new Vector(ev).sub(prevEv ?? new Vector(0, 0)).dir;
      if (sdf.eq(prevDir)) {
        // console.log('add start margin');
        this.pushTarget(ev.sub(sdr.mul(this.pathMargin)));
        return this.drawToTarget();
      }
      prevDir = new Vector(prevSv ?? new Vector(0, 0)).sub(sv).dir;
      if (sdf.eq(prevDir)) {
        // console.log('add end margin');
        this.pushSource(sv.add(sdr.mul(this.pathMargin)));
        return this.drawToTarget();
      }
      // console.log('path connected');
      curve = 'connect';
      svNext = ev;
    }

    // console.log(svr.absSize(), svf.absSize());
    // too small margins
    if (curve == 'r' && svr.absSize() < this.pathMargin) {
      // console.log('end margin because small');
      this.pushTarget(ev.sub(sdr.mul(this.pathMargin)));
      return this.drawToTarget();
    }
    // if (curve == 'r' && svf.absSize() < this.pathMargin) {
    //   console.log('start margin because small');
    //   this.pushSource(sv.add(sdf.mul(this.pathMargin)));
    //   return this.drawToTarget();
    // }
    // if (this.prevCurve == 'r' && svf.absSize() < this.pathMargin * 2 && svr.absSize() > this.pathMargin * 2) {
    //   console.log('start marin because too small start vector');
    //   this.pushSource(sv.add(sdf.mul(this.pathMargin)));
    //   return this.drawToTarget();
    // }
    // too small margins //

    if (!svNext) {
      // console.log('No svNext!');
      svNext = ev;
      // return;
    }
    svNext = svNext.round();
    let l = new Line(sv, svNext);

    // small margin on first curve if needed
    if (
      l.diff.absSize() < this.pathMargin &&
      svr.absSize() > this.pathMargin &&
      (this.sources.length == 1 || this.prevCurve == 'outside')
    ) {
      // console.log('start marin because too small start vector on first curve');
      this.pushSource(sv.add(sdf.mul(this.pathMargin)));
      return this.drawToTarget();
    }

    let res = this.rectsManager.getAvoidVector(l);
    let avoidR: Rectangle, avoidL: Line, avoidV: Vector;
    if (res) [avoidR, avoidL, avoidV] = res;
    // console.log(this.rectsManager.rects);
    // if (!res && svNext2) {
    //   // res = this.rectsManager.getAvoidVector(new Line(sv, svNext2));
    //   // console.log(res);
    // }
    // if (!res && svNext2) res = rect?.getAvoidVector(new Line(sv, svNext2));
    // console.log(sv, svNext, res, this.rectsManager.rects);
    if (res && !avoidR.isInside(ev)) {
      console.log('countered avoidable rect! adjusting path ');
      // console.log(avoidV);
      // if (!svNext.eq(ev)) {
      //   this.pushSource(avoidV.setDir(sdr));
      // } else {
      // console.log(sdf);
      // let vCornerClose = avoidL.getCloserEdge(avoidV);
      let vCornerClose = avoidL.getCloserEdge(avoidV);
      // if (avoidL.getCut(new Line(sv, ev))) console.log('!#');
      // console.log(avoidL);
      // if (vCornerClose.)
      // this.sources.pop();
      let prevSv = this.sources.pop();
      if (!prevSv) {
        //if its the first line
        prevSv = sv;
      }
      let nextSG = new SmartGrid(prevSv, vCornerClose, this.rects);
      nextSG.drawToTarget();
      let arr = [...nextSG.sources, ...nextSG.targets];
      this.sources.push(...arr);
      // }
    } else {
      // console.log('push to sources', svNext, svNext2);
      this.pushSource(svNext);
      if (svNext2) this.pushSource(svNext2);
    }
    this.prevCurve = curve;

    return this.drawToTarget();
  }
}

export const calcFromStartToEnd = (
  sv: Vector,
  ev: Vector,
  rects: dimensionType[] = [],
  pathMargin = 20,
  options = { zGridBreak: { abs: 0, relative: 0.5 } },
  allowedDirs = Object.values(gridDirs)
) => {
  // if (!sv.faceDir || !ev.faceDir) console.warn('!@#!#@');
  let smartGrid = new SmartGrid(sv, ev, rects, pathMargin, options, allowedDirs);
  // smartGrid.handleMargin();
  smartGrid.drawToTarget();
  // console.log(smartGrid.getPoints());
  return smartGrid;
};

export class Rectangle {
  left: Line;
  top: Line;
  right: Line;
  bottom: Line;
  leftTop: Vector;
  rightBottom: Vector;

  constructor(leftTop: Vector, rightBottom: Vector) {
    this.leftTop = leftTop;
    this.rightBottom = rightBottom;
    this.left = new Line(leftTop, new Vector(leftTop.x, rightBottom.y));
    this.top = new Line(leftTop, new Vector(rightBottom.x, leftTop.y));
    this.right = new Line(new Vector(rightBottom.x, leftTop.y), rightBottom);
    this.bottom = new Line(new Vector(leftTop.x, rightBottom.y), rightBottom);
  }

  getCuts(l: Line) {
    let cuts: [Line, Vector][] = [];
    for (let line of [this.left, this.right, this.top, this.bottom]) {
      let vcut = line.getCut(l);
      if (vcut) cuts.push([line, vcut]);
    }
    return cuts;
  }

  // return the closer edge of the line to the given vector
  getAvoidVectorEdge(rectLine: Line, v: Vector) {
    let ll1 = new Line(v, rectLine.root);
    let ll2 = new Line(v, rectLine.end);
    let [vll1, vll2] = ll1.diff.absSize() < ll2.diff.absSize() ? [ll1.diff, ll2.diff] : [ll2.diff, ll1.diff];
    let vCornerClose = v.add(vll1);
    // let vCornerFar = v.faceDir.parallel(rectLine.dir) ? v.add(vll2) : null;
    return vCornerClose;
  }

  isInside(v: Vector) {
    return between(v.x, this.leftTop.x, this.rightBottom.x) && between(v.y, this.leftTop.y, this.rightBottom.y);
  }
}

class RectanglesManager {
  rects: Rectangle[];

  constructor(rects: dimensionType[]) {
    this.rects = rects.map(
      (r) => new Rectangle(new Vector(r.x - 10, r.y - 10), new Vector(r.right + 10, r.bottom + 10))
    );
  }

  getCuts(l: Line) {
    let cuts: [Rectangle, Line, Vector][] = [];
    //todo: search more efficiently
    for (let rect of this.rects) {
      let rectCuts = rect.getCuts(l).map(([l, v]) => [rect, l, v] as const);
      rectCuts = rectCuts.filter((cut) => !rect.isInside(l.root));
      cuts.push(...(rectCuts as [Rectangle, Line, Vector][]));
    }
    return cuts;
  }

  // returns closer line on rectangle side that a given line l is cutting and the cutting vector point
  getAvoidVector(l: Line): [Rectangle, Line, Vector] | null {
    let cuts = this.getCuts(l);
    if (cuts?.length == 0) return null;
    let chosenCut = cuts[0];
    let smallestDiff = l.dir.mul(new Line(l.root, cuts[0][2]).diff.size()).size();
    for (let cut of cuts) {
      let ll = new Line(l.root, cut[2]);
      let d = l.dir.mul(ll.diff.size()).size();
      // console.log('d', smallestDiff, d);
      if (d < smallestDiff) {
        smallestDiff = d;
        chosenCut = cut;
      }
    }
    // if (cuts.length == 2) {
    //   // choose the closer edge point on the rectangle to l.root
    //   let l1 = new Line(l.root, cuts[0][2]);
    //   let l2 = new Line(l.root, cuts[1][2]);
    //   let d1 = l1.dir.mul(l1.diff.size()).size();
    //   let d2 = l2.dir.mul(l2.diff.size()).size();
    //
    //   // now we get one side of the rect, and a point that sits on at.
    //   chosenCut = d1 < d2 ? cuts[0] : cuts[1];
    //   // we will chose to get around the the line from the direction that is closer to the edge of the line.
    // } else if (cuts.length == 1) {
    //   chosenCut = cuts[0];
    // } else return null;
    // if (!chosenCut) return null;
    let [rect, line, vect] = chosenCut;
    vect = vect.setDirs([l.dir]);
    return [rect, line, vect];
  }
}

export const points2Vector = (
  x1: number,
  y1: number,
  anchorName: anchorNamedType,
  dirNames: Exclude<_faceDirType, 'auto'>[]
): Vector => {
  let sd: Dir[];
  //if middle all dirs allowed
  let _dirNames: Exclude<_faceDirType, 'auto'>[];
  if (anchorName === 'middle') {
    _dirNames = Object.keys(gridDirs) as Array<keyof typeof gridDirs>;
  } else
    _dirNames = dirNames.map((dirName) => {
      if (dirName === 'inwards') return EAD[anchorName];
      else if (dirName === 'outwards') return SAD[anchorName];
      else return dirName;
    });
  sd = _dirNames.map((dirName) => gridDirs[dirName]);
  return new Vector(x1, y1).setDirs(sd);
};

export const pointsToLines = (points: [number, number][]) => {
  const p1 = points.splice(0, 1)[0];
  const first = `M ${p1[0]} ${p1[1]}`;
  return points.reduce((ac, cr) => ac + ` L ${cr[0]} ${cr[1]} `, first);
};

const deltaPoints = (p1: [number, number], p2: [number, number], factor = 1): [number, number] => {
  return [(p2[0] - p1[0]) * factor, (p2[1] - p1[1]) * factor];
};
export const pointsToCurves = (points: [number, number][]) => {
  const p0 = points[0];
  let path = `M ${p0[0]} ${p0[1]} `;
  if (points.length == 1) return path;
  if (points.length == 2) return path + `L ${points[1][0]} ${points[1][1]}`;

  let i;
  for (i = 1; i < points.length - 2; i++) {
    let [pdx, pdy] = deltaPoints(points[i], points[i + 1], 0.5);
    path += `Q ${points[i][0]} ${points[i][1]} ${points[i][0] + pdx} ${points[i][1] + pdy}`;
  }
  path += `Q ${points[i][0]} ${points[i][1]} ${points[i + 1][0]} ${points[i + 1][1]}`;
  return path;
};

if (require.main === module) {
} else {
}
// test();
