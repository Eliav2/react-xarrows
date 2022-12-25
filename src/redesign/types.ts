import React from "react";
import { OneOrMore } from "./typeUtils";
import { Vector } from "./path";

/**
 * 'I' prefix stands for Interface, and these interfaces are usually simple objects that the user can choose to use
 * 'U' prefix stands for User, and these type are a union between the simpler interface and the class implementation used internally by this lib
 * for example:
 *   UVector = IVector | Vector, while IVector is just object {x: number, y: number},
 *   and Vector is the class implementation which can use IVector to construct it.
 * */

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
export interface DirectedPoint extends IPoint {
  dir: Direction;
}

// A point that a line passing through it should a one of the given directions
export interface PossiblyDirectedPoint extends IPoint {
  dir?: OneOrMore<Direction>;
}

export type XElemRef = React.MutableRefObject<any> | string | IPoint;

export function isPoint(o: any): o is IPoint {
  return typeof o === "object" && o && ("x" in o || "y" in o);
}
