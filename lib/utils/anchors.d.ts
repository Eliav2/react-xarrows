/**
 * utility functions for preparing `startAnchor` and `endAnchor` to accept the diffrent types that can be passed.
 */
import { anchorPositionType } from "../index";
export declare const prepareAnchorLines: (anchor: any, anchorPos: any) => {
    x: any;
    y: any;
    anchorPosition: anchorPositionType;
}[];
declare type t1 = {
    x: number;
    y: number;
    anchorPosition: anchorPositionType;
};
export declare const getShortestLine: (sPoints: t1[], ePoints: t1[]) => {
    startPointObj: t1;
    endPointObj: t1;
};
export {};
//# sourceMappingURL=anchors.d.ts.map