import { refType } from "../index";

type extendedJtypes =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function"
  | "null"
  | "array";

export const getElementByPropGiven = (ref: refType): HTMLElement => {
  let myRef;
  if (typeof ref === "string") {
    myRef = document.getElementById(ref);
  } else myRef = ref.current;
  return myRef;
};

export const typeOf = (arg: any): extendedJtypes => {
  let type: extendedJtypes = typeof arg;
  if (type === "object") {
    if (arg === null) type = "null";
    else if (Array.isArray(arg)) type = "array";
  }
  return type;
};
