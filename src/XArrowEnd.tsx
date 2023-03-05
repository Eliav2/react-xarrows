import React from "react";
import { Dir, DirInitiator, Vector } from "./path";
import SvgManipulator, { SvgManipulatorProps } from "./SvgManipulator";
import { useLocatorProvider } from "./providers";
import { BasicHeadShape1 } from "./shapes";
import XLocator, { XLocatorProps } from "./XLocator";
import SvgNormalizer from "./SvgNormalizer";

export interface XArrowEndProps extends Omit<SvgManipulatorProps, "children"> {
  children?: JSX.Element; // a jsx element of type svg like <circle .../> or <path .../>
  rotation?: DirInitiator;
  pos?: Vector;

  location?: XLocatorProps["location"];
  size?: number;
}

/**
 * responsible for manipulating a svg shape
 */
const XArrowEnd = React.forwardRef<SVGGElement, XArrowEndProps>(function XArrowEnd(props, forwardRef) {
  // const { getLocation } = useLocatorProvider();
  let { children = (<BasicHeadShape1 />) as any } = props;

  const { rotation, pos } = props;
  const { location = "100%" } = props;
  const { size } = props;

  // todo: should do?; if react element is passed, pass the props, so it can be used in the children
  // children = React.cloneElement(children, propsWithDefault.props);

  return (
    <XLocator location={location}>
      <SvgManipulator {...{ rotation, pos, size }} ref={forwardRef}>
        <SvgNormalizer>{children}</SvgNormalizer>
      </SvgManipulator>
    </XLocator>
  );
});

export default XArrowEnd;
