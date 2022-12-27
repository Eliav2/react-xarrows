import React, { useRef } from "react";
import { ProvideXContext, useXContext, XArrow, XArrowProps } from "react-xarrows/XArrow";
import { autoSelectAnchor } from "react-xarrows/useAutoSelectAnchor";
import { Dir } from "react-xarrows/path";
import XEdge, { XEdgeProps } from "react-xarrows/XEdge";
import NormalizedGSvg from "react-xarrows/NormalizedGSvg";
import XLine from "react-xarrows/XLine";

interface AutoAnchorWithHeadXArrowProps extends Pick<XArrowProps, "start" | "end"> {
  headSize?: number;
  headSharpness?: number; // 0 - 1
}

export const AutoAnchorWithHeadXArrow = (props: AutoAnchorWithHeadXArrowProps) => {
  const { headSize = 30, headSharpness = 0.25 } = props;

  return (
    <XArrow start={props.start} end={props.end}>
      <ProvideXContext>
        {(context) => {
          const { startElem, endElem } = context;
          if (!startElem || !endElem) return null;
          const {
            startPoint: { x: x1, y: y1 },
            endPoint: { x: x2, y: y2 },
          } = autoSelectAnchor({ startElem, endElem });
          const dir = new Dir(x2 - x1, y2 - y1);
          return (
            <>
              <ArrowHead pos={{ x: x2, y: y2 }} dir={dir} size={headSize} sharpness={headSharpness} />
              <XLine {...{ x1, y1, x2, y2 }} fill="transparent" stroke="white" strokeWidth={3} stripEnd={headSize * (1 - headSharpness)} />
            </>
          );
        }}
      </ProvideXContext>
    </XArrow>
  );
};

interface ArrowHead extends XEdgeProps {
  sharpness?: number;
}

export const ArrowHead = (props: ArrowHead) => {
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
