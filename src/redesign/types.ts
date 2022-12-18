import React from "react";
import { Contains } from "./typeUtils";

export type Point = Contains<{ x: number; y: number }>;
export type XElemRef = React.MutableRefObject<any> | string | Point;

export function isPoint(o: any): o is Point {
  return typeof o === "object" && o && ("x" in o || "y" in o);
}
