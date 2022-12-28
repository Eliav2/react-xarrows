// export const cAnchorEdge = ["middle", "left", "right", "top", "bottom", "auto"] as const;
import { IPoint, isPoint, XElemRef } from "./types";

export const getElementByPropGiven = (ref: XElemRef): HTMLElement | null | IPoint => {
  if (typeof ref === "string") {
    return document.getElementById(ref);
  } else {
    if (isPoint(ref)) return ref;
    return ref?.current;
  }
};

// function that takes value and return the value if it is of type array and if not return the value in an array
export const toArray = <T>(value: T | T[]): [T] extends [undefined] ? [] : Array<NonNullable<T>> => {
  if (typeof value === "undefined") return [] as any;
  return (Array.isArray(value) ? value : [value]) as any;
};
export const omitAttrs = <T, K extends keyof T>(Class: new () => T, keys: K[]): new () => Omit<T, typeof keys[number]> => Class;
