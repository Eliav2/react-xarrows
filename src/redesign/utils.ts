// export const cAnchorEdge = ["middle", "left", "right", "top", "bottom", "auto"] as const;
import { IPoint, isPoint, RemoveFunctions, XElemRef } from "./types";
import produce, { current } from "immer";
import { cloneDeepNoFunction } from "shared/utils";
import { AnyObj } from "shared/types";

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

/**
 * this function can be used to walk through contexts above in the tree and calculate accumulated values of a given value
 */
export const evalIfFunc = <C extends { [key in Key]: any } & { [key: string]: any }, Key extends string, V extends any>(
  context: C,
  prevContextKey: Key,
  getVal: (context: C) => V // function to get the value from the context
): RemoveFunctions<V> => {
  const val = getVal(context);
  if (typeof val === "function") {
    const res = evalIfFunc(context[prevContextKey], prevContextKey, val as any);
    // return produce(res, (draft) => {
    //   return val(draft);
    // }) as any;
    return val(res);
  }

  // stop condition (when the value is not a function)
  return val as RemoveFunctions<V>;
};

/**
 * this utility function is used to get the accumulated value of the given value from the upper contexts in the tree
 */
export const aggregateValues = <
  AggVal,
  CFields extends string,
  C extends ({ [key in CFields]: any } & { [key: string]: any }) | null,
  Key extends CFields,
  V extends AnyObj
>(
  aggVal: AggVal = {} as any,
  context: C,
  prevContextKey: Key, // the key name of the field in the context that points to the previous context
  getVal: (context: C) => V
): RemoveFunctions<V> => {
  const val = getVal(context);
  if (!context) return {} as any;
  const prevVal = aggregateValues(val, context![prevContextKey], prevContextKey, getVal);
  let newVal = aggVal;
  if (typeof aggVal === "function") {
    newVal = aggVal(prevVal);
  }
  return { ...prevVal, ...newVal } as any;
};
