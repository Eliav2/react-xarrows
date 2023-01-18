import React from "react";
import { NormalizedGSvg, XHead, XHeadProps } from "react-xarrows";
interface ArrowHeadProps extends XHeadProps {
  sharpness?: number; // 0 - 1
}

export const ArrowHead = (props: ArrowHeadProps) => {
  return (
    <XHead {...props}>
      <NormalizedGSvg>
        <path d={`M 0 0 L 1 0.5 L 0 1 L ${props.sharpness} 0.5 z`} />
      </NormalizedGSvg>
    </XHead>
  );
};
ArrowHead.defaultProps = {
  sharpness: 0.25,
};
