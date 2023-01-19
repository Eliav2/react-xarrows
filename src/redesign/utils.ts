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

export const evalIfFunc = <C extends { [key in Key]: any } & { [key: string]: any }, Key extends string, V extends any>(
  context: C,
  prevContextKey: Key,
  getVal: (context: C) => V // function to get the value from the context
): RemoveFunctions<V> => {
  const val = getVal(context);
  if (typeof val === "function") {
    const res = evalIfFunc(context[prevContextKey], prevContextKey, val as any);
    return val(res);
  }

  // stop condition (when the value is not a function)
  return val as RemoveFunctions<V>;
};

type RemoveFunctions<T> = Exclude<T, Function>;
