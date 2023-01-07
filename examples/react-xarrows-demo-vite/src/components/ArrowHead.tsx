import React from "react";
import { NormalizedGSvg, XEdge, XEdgeProps } from "react-xarrows";
interface ArrowHeadProps extends XEdgeProps {
  sharpness?: number; // 0 - 1
}

export const ArrowHead = (props: ArrowHeadProps) => {
  return (
    <XEdge {...props}>
      <NormalizedGSvg>
        <path d={`M 0 0 L 1 0.5 L 0 1 L ${props.sharpness} 0.5 z`} />
      </NormalizedGSvg>
    </XEdge>
  );
};
ArrowHead.defaultProps = {
  sharpness: 0.25,
};
