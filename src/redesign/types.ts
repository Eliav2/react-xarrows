import React from "react";
import { Contains } from "./typeUtils";
import { AnchorDirection } from "./useAutoSelectAnchor";
import { RelativeSize } from "shared/types";

export interface Vector {
  x: number;
  y: number;
}
export interface Point extends Vector {}
export interface Dir extends Vector {
  // value should be between -1 to 1
  x: number;
  // value should be  between -1 to 1
  y: number;
}

// a direction based on a named direction
export type NamedDirection = "left" | "right" | "top" | "bottom";

// a direction based on a named direction or a given direction vector
export type Direction = NamedDirection | Dir;

// A point that a line passing through it should a have specific direction
// (for example, 'left' dir   means that arrow going outside of this anchor can only go left)
export interface DirectedPoint extends Point {
  dir: Direction;
}

export type XElemRef = React.MutableRefObject<any> | string | Point;

export function isPoint(o: any): o is Point {
  return typeof o === "object" && o && ("x" in o || "y" in o);
}
