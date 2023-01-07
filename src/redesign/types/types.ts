import React from "react";
import { OneOrMore } from "./typeUtils";
import { toArray } from "../utils";
import { Dir, Vector } from "../path/vector";

/**
 * 'I' prefix stands for Interface, and these interfaces are usually simple objects that the user can choose to use
 * 'U' prefix stands for User, because the user can pass them as arguments to this lib,and these type are a union between the simpler interface and the class implementation used internally by this lib
 * 'P' prefix stands for Parsed, because these types are the result of parsing the user input, and they are used immediately by this lib
 * for example:
 *   UVector = IVector | Vector, while IVector is just object {x: number, y: number}, and Vector is the class implementation which can use IVector to construct it.
 * */

// represents a point/vector
export interface IVector {
  x: number;
  y: number;
}

export interface IPoint extends IVector {}

export interface IDir extends IVector {
  // value should be between -1 to 1
  x: number;
  // value should be  between -1 to 1
  y: number;
}

export type UVector = IVector | Vector;
export const parseUVector = (v: UVector): Vector => (v instanceof Vector ? v : new Vector(v.x, v.y));

// a direction based on a named direction
export type NamedDirection = "left" | "right" | "top" | "bottom";

// a direction based on a named direction or a given direction vector
export type Direction = NamedDirection | IDir;
const cDirectionsMap: { [key in NamedDirection]: IDir } = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
};
export const parseDirection = (dir: Direction): IDir => {
  if (typeof dir === "string") return cDirectionsMap[dir];
  return dir;
};

// A point that a line passing through it should a have specific direction
// (for example, 'left' dir   means that arrow going outside of this anchor can only go left)
export interface DirectedVector extends IVector {
  trailingDir: Direction;
}

// A point that a line passing through it should a one of the given directions
export interface PossiblyDirectedVector extends IVector {
  trailingDir?: OneOrMore<Direction>;
}

export interface PPossiblyDirectedVector extends IVector {
  trailingDir: Dir[];
}

export const parsePossiblyDirectedVector = (p: PossiblyDirectedVector): PPossiblyDirectedVector => {
  const trailingDirArr = toArray(p.trailingDir);
  return {
    x: p.x,
    y: p.y,
    trailingDir: trailingDirArr.map((dir) => new Dir(parseDirection(dir))),
  };
};

export type XElemRef = React.MutableRefObject<any> | string | IPoint;

export function isPoint(o: any): o is IPoint {
  return typeof o === "object" && o && ("x" in o || "y" in o);
}

export interface IRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface PRect extends IRect {
  width: number;
  height: number;
}
export const parseIRect = (rec: IRect): PRect => {
  const { left, top, right, bottom } = rec;
  return { left, top, right, bottom, width: right - left, height: bottom - top };
};
