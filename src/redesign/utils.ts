// export const cAnchorEdge = ["middle", "left", "right", "top", "bottom", "auto"] as const;
import { isPoint, IPoint, XElemRef } from "./types";

export const getElementByPropGiven = (ref: XElemRef): HTMLElement | null | IPoint => {
  if (typeof ref === "string") {
    return document.getElementById(ref);
  } else {
    if (isPoint(ref)) return ref;
    return ref?.current;
  }
};

// function that takes value and return the value if it is of type array and if not return the value in an array
export const toArray = <T>(value: T | T[]): T[] => {
  return Array.isArray(value) ? value : [value];
};
