import React from "react";
import { ProvideXContext, XArrow, XArrowProps } from "react-xarrows/XArrow";
import { autoSelectAnchor } from "react-xarrows/useAutoSelectAnchor";
import { Dir } from "react-xarrows/path";
import XLine from "react-xarrows/XLine";
import { ArrowHead } from "./ArrowHead";

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
          const { startRect, endRect } = context;
          if (!startRect || !endRect) return null;
          const {
            startPoint: { x: x1, y: y1 },
            endPoint: { x: x2, y: y2 },
          } = autoSelectAnchor(startRect, endRect);
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
