import React from "react";
export declare type xarrowPropsType = {
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
    consoleWarning?: boolean;
    passProps?: React.SVGProps<SVGPathElement>;
    advanced?: {
        extendSVGcanvas?: number;
        passProps?: {
            SVGcanvas?: React.SVGAttributes<SVGSVGElement>;
            arrowBody?: React.SVGProps<SVGPathElement>;
            arrowHead?: React.SVGProps<SVGPathElement>;
        };
    };
    monitorDOMchanges?: boolean;
    registerEvents?: registerEventsType[];
};
export declare type anchorType = anchorPositionType | anchorCustomPositionType;
export declare type anchorPositionType = "middle" | "left" | "right" | "top" | "bottom" | "auto";
export declare type anchorCustomPositionType = {
    position: anchorPositionType;
    offset: {
        rightness: number;
        bottomness: number;
    };
};
export declare type reactRefType = {
    current: null | HTMLElement;
};
export declare type refType = reactRefType | string;
export declare type labelsType = {
    start?: labelType;
    middle?: labelType;
    end?: labelType;
};
export declare type labelPropsType = {
    text: string;
    extra?: React.SVGAttributes<SVGTextElement>;
};
export declare type labelType = string | labelPropsType;
export declare type domEventType = keyof GlobalEventHandlersEventMap;
export declare type registerEventsType = {
    ref: refType;
    eventName: domEventType;
    callback?: CallableFunction;
};
declare const Xarrow: React.FC<xarrowPropsType>;
export default Xarrow;
//# sourceMappingURL=index.d.ts.map