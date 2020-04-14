import { Color } from "csstype";
import { SVGProps } from "react";

export type anchorType = "auto" | "middle" | "left" | "right" | "top" | "bottom";

export type arrowStyleType = {
  color: Color;
  strokeColor: Color;
  headColor: Color;
  strokeWidth: number;
  curveness: number;
  headSize: number;
  dashness: boolean | { strokeLen?: number; nonStrokeLen?: number; animation?: boolean | number };
};

export type registerEventsType = {
  ref: refType;
  eventName: keyof GlobalEventHandlersEventMap;
  callback?: CallableFunction;
};

type reactRef = { current: null | HTMLElement };
type refType = reactRef | string;
type labelType = string | { text: string; extra: SVGProps<SVGElement> };

export type xarrowPropsType = {
  start: refType;
  end: refType;
  startAnchor: anchorType | anchorType[];
  endAnchor: anchorType | anchorType[];
  label: labelType | { start: labelType; middle: labelType; end: labelType };
  monitorDOMchanges: boolean;
  registerEvents: registerEventsType[];
  arrowStyle: arrowStyleType;
  consoleWarning: boolean;
  advance: {
    extendSVGcanvas: number;
  };
};
