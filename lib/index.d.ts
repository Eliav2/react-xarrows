import React from "react";
declare type xarrowPropsType = {
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
    dashness?: boolean | {
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
declare type anchorType = anchorMethodType | anchorPositionType;
declare type anchorMethodType = "auto";
declare type anchorPositionType = "middle" | "left" | "right" | "top" | "bottom";
declare type reactRefType = {
    current: null | HTMLElement;
};
declare type refType = reactRefType | string;
declare type labelsType = {
    start?: labelType;
    middle?: labelType;
    end?: labelType;
};
declare type labelPropsType = {
    text: string;
    extra?: React.SVGProps<SVGElement>;
};
declare type labelType = string | labelPropsType;
declare type domEventType = keyof GlobalEventHandlersEventMap;
declare type registerEventsType = {
    ref: refType;
    eventName: domEventType;
    callback?: CallableFunction;
};
declare const Xarrow: React.FC<xarrowPropsType>;
export type { xarrowPropsType, anchorType, anchorMethodType, anchorPositionType, reactRefType, refType, labelsType, labelPropsType, labelType, domEventType, registerEventsType, };
export default Xarrow;
//# sourceMappingURL=index.d.ts.map