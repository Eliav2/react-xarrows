import { MATH_PRECISION, Vector } from '../classes/classes';

export const math_operators = {
  add: (x, y) => x + y,
  sub: (x, y) => x - y,
  mul: (x, y) => x * y,
  dev: (x, y) => x / y,
  greater: (x, y) => x > y,
  greaterEqual: (x, y) => x >= y,
  smaller: (x, y) => x < y,
  smallerEqual: (x, y) => x <= y,
};

export const operatorFunc = <T extends Vector>(p: T, p2: Vector | number, operator, self = false): Vector => {
  let _p2;
  if (typeof p2 === 'number') _p2 = { x: p2, y: p2 };
  else _p2 = p2;
  // let v = new T(operator(p.x, _p2.x), operator(p.y, _p2.y));
  // let v = new (p.constructor as any)(operator(p.x, _p2.x), operator(p.y, _p2.y));
  if (self) {
    const n = new Vector(operator(p.x, _p2.x), operator(p.y, _p2.y)) as any;
    p.x = n.x;
    p.y = n.y;
  }
  let v = new Vector(operator(p.x, _p2.x), operator(p.y, _p2.y));
  // handle 0/0 = NaN instead of 0
  if (isNaN(v.x)) v.x = 0;
  if (isNaN(v.y)) v.y = 0;
  return v;
};

export const between = (num: number, a: number, b: number, inclusiveA = true, inclusiveB = true): boolean => {
  if (a > b) [a, b, inclusiveA, inclusiveB] = [b, a, inclusiveB, inclusiveA];
  if (a == b && (inclusiveA || inclusiveB)) [inclusiveA, inclusiveB] = [true, true];
  return (inclusiveA ? num >= a : num > a) && (inclusiveB ? num <= b : num < b);
};

export const deg2Rad = (deg: number) => (deg / 180) * Math.PI;
// const roundTo = (num: number, level = MATH_PRECISION + 1) => parseFloat(num.toFixed(level));
// const round = (num: number, level = MATH_PRECISION + 1) => Math.round();
export const round = (num: number, level = MATH_PRECISION) => {
  return Math.round((num + Number.EPSILON) * 10 ** level) / 10 ** level;
  // return Math.round((num + Number.EPSILON) * 1000) / 1000;
};
