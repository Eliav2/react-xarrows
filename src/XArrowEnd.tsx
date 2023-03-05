import React from "react";
import SvgManipulator, { SvgManipulatorProps } from "./SvgManipulator";
import { BasicHeadShape1 } from "./shapes";
import XLocator, { XLocatorProps } from "./XLocator";
import SvgNormalizer from "./SvgNormalizer";

export interface XArrowEndProps extends Omit<SvgManipulatorProps, "children"> {
  children?: JSX.Element; // a jsx element of type svg like <circle .../> or <path .../>
  location?: XLocatorProps["location"];
  size?: number;

  // normalize the svg shape to be in the centered around 0,0 and with size of 1 pixel
  disableNormalizeSvg?: boolean;
}

/**
 * responsible for manipulating a svg shape
 */
const XArrowEnd = React.forwardRef<SVGGElement, XArrowEndProps>(function XArrowEnd(props, forwardRef) {
  // const { getLocation } = useLocatorProvider();
  const { children = (<BasicHeadShape1 />) as any, disableNormalizeSvg = false, location = "100%", ...svgManipulatorProps } = props;

  // todo: should do?; if react element is passed, pass the props, so it can be used in the children
  // children = React.cloneElement(children, propsWithDefault.props);

  return (
    <XLocator location={location}>
      <SvgManipulator {...svgManipulatorProps} ref={forwardRef}>
        {disableNormalizeSvg ? children : <SvgNormalizer>{children}</SvgNormalizer>}
      </SvgManipulator>
    </XLocator>
  );
});

export default XArrowEnd;
