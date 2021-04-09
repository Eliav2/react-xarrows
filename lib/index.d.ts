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
    tailColor?: string | null;
    strokeWidth?: number;
    showHead?: boolean;
    headSize?: number;
    showTail?: boolean;
    tailSize?: number;
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
    arrowTailProps?: React.SVGProps<SVGPathElement>;
    divContainerProps?: React.HTMLProps<HTMLDivElement>;
    SVGcanvasStyle?: React.CSSProperties;
    divContainerStyle?: React.CSSProperties;
    _extendSVGcanvas?: number;
    _debug?: boolean;
    _cpx1Offset?: number;
    _cpy1Offset?: number;
    _cpx2Offset?: number;
    _cpy2Offset?: number;
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