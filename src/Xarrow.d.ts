import { Color } from "csstype";

export type anchorType = "auto" | "middle" | "left" | "right" | "top" | "bottom";

export type arrowStyleType = {
  color: Color;
  strokeColor: Color;
  headColor: Color;
  strokeWidth: number;
  curveness: number;
  headSize: number;
};

export type registerEventsType = {
  ref: refType;
  eventName: keyof GlobalEventHandlersEventMap;
  callback?: CallableFunction;
};

type reactRef = { current: null | HTMLElement };
type refType = reactRef | string;

export type xarrowPropsType = {
  start: refType;
  end: refType;
  startAnchor: anchorType | anchorType[];
  endAnchor: anchorType | anchorType[];
  monitorDOMchanges: boolean;
  registerEvents: registerEventsType[];
  arrowStyle: arrowStyleType;
  consoleWarning: boolean;
};
