import { SVGProps, CSSProperties } from "react";

export type anchorType = "auto" | "middle" | "left" | "right" | "top" | "bottom";
export type reactRefType = { current: null | HTMLElement };
export type refType = reactRefType | string;
export type labelType = string | { text: string; extra: SVGProps<SVGElement> };
export type domEventType = keyof GlobalEventHandlersEventMap;
export type registerEventsType = {
  ref: refType;
  eventName: domEventType;
  callback?: CallableFunction;
};

export type xarrowPropsType = {
  start: refType;
  end: refType;
  startAnchor: anchorType | anchorType[];
  endAnchor: anchorType | anchorType[];
  label: labelType | { start?: labelType; middle?: labelType; end?: labelType };
  color: string;
  lineColor: string | null;
  headColor: string | null;
  strokeWidth: number;
  headSize: number;
  curveness: number;
  dashness: boolean | { strokeLen?: number; nonStrokeLen?: number; animation?: boolean | number };
  monitorDOMchanges: boolean;
  registerEvents: registerEventsType[];
  consoleWarning: boolean;
  advanced: {
    extendSVGcanvas: number;
  };
};
