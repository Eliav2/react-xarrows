import React from "react";
import { NormalizedGSvg, XArrowEnd, XArrowEndProps } from "react-xarrows";
interface ArrowHeadProps extends XArrowEndProps {
  sharpness?: number; // 0 - 1
}

export const ArrowHead = (props: ArrowHeadProps) => {
  return (
    <XArrowEnd {...props}>
      <NormalizedGSvg>
        <path d={`M 0 0 L 1 0.5 L 0 1 L ${props.sharpness} 0.5 z`} />
      </NormalizedGSvg>
    </XArrowEnd>
  );
};
ArrowHead.defaultProps = {
  sharpness: 0.25,
};
