declare module "react-xarrows" {
  import { SVGProps } from "react";

  type xarrowPropsType = {
    start: refType;
    end: refType;
    startAnchor?: anchorType | anchorType[];
    endAnchor?: anchorType | anchorType[];
    label?: labelType | labelsType;
    color?: string;
    lineColor?: string | null;
    headColor?: string | null;
    strokeWidth?: number;
    headSize?: number;
    curveness?: number;
    dashness?:
      | boolean
      | {
          strokeLen?: number;
          nonStrokeLen?: number;
          animation?: boolean | number;
        };
    monitorDOMchanges?: boolean;
    registerEvents?: registerEventsType[];
    consoleWarning?: boolean;
    advanced?: {
      extendSVGcanvas?: number;
    };
  };
  type anchorType = anchorMethodType | anchorPositionType;
  type anchorMethodType = "auto";
  type anchorPositionType = "middle" | "left" | "right" | "top" | "bottom";
  type reactRefType = {
    current: null | HTMLElement;
  };
  type refType = reactRefType | string;
  type labelsType = {
    start?: labelType;
    middle?: labelType;
    end?: labelType;
  };
  type labelPropsType = {
    text: string;
    extra?: SVGProps<SVGElement>;
  };
  type labelType = string | labelPropsType;
  type domEventType = keyof GlobalEventHandlersEventMap;
  type registerEventsType = {
    ref: refType;
    eventName: domEventType;
    callback?: CallableFunction;
  };
  const Xarrow: React.FC<xarrowPropsType>;
  export type {
    xarrowPropsType,
    anchorType,
    anchorMethodType,
    anchorPositionType,
    reactRefType,
    refType,
    labelsType,
    labelPropsType,
    labelType,
    domEventType,
    registerEventsType,
  };
  export default Xarrow;
}
