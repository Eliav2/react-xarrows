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
    path?: "smooth" | "grid" | "straight";
    curveness?: number;
    dashness?: boolean | {
        strokeLen?: number;
        nonStrokeLen?: number;
        animation?: boolean | number;
    };
    passProps?: React.SVGProps<SVGPathElement>;
    SVGcanvasProps?: React.SVGAttributes<SVGSVGElement>;
    arrowBodyProps?: React.SVGProps<SVGPathElement>;
    arrowHeadProps?: React.SVGProps<SVGPathElement>;
    divContainerProps?: React.HTMLProps<HTMLDivElement>;
    SVGcanvasStyle?: React.CSSProperties;
    divContainerStyle?: React.CSSProperties;
    extendSVGcanvas?: number;
};
export declare type anchorType = anchorPositionType | anchorCustomPositionType;
export declare type anchorPositionType = "middle" | "left" | "right" | "top" | "bottom" | "auto";
export declare type anchorCustomPositionType = {
    position: anchorPositionType;
    offset: {
        rightness?: number;
        bottomness?: number;
    };
};
export declare type refType = React.MutableRefObject<any> | string;
export declare type labelsType = {
    start?: labelType;
    middle?: labelType;
    end?: labelType;
};
export declare type labelType = JSX.Element | string;
export declare type domEventType = keyof GlobalEventHandlersEventMap;
declare const Xarrow: React.FC<xarrowPropsType>;
export default Xarrow;
//# sourceMappingURL=index.d.ts.map