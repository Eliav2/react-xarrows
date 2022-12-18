// export const cAnchorEdge = ["middle", "left", "right", "top", "bottom", "auto"] as const;
import { isPoint, Point, XElemRef } from "./types";

export const getElementByPropGiven = (ref: XElemRef): HTMLElement | null | Point => {
  if (typeof ref === "string") {
    return document.getElementById(ref);
  } else {
    if (isPoint(ref)) return ref;
    return ref?.current;
  }
};
