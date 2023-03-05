import React, { LegacyRef } from "react";
import { IPoint } from "./types";
import { Dir, DirInitiator, Vector } from "./path";
import { RelativeSize } from "shared/types";
import { assignDefaults, getRelativeSizeValue } from "shared/utils";

export interface SvgManipulatorProps {
  children: JSX.Element; // a jsx element of type svg like <circle .../> or <path .../>

  // rotate the svg shape after normal positioning
  rotation?: DirInitiator;

  // the color of the svg shape
  // default to use always 'fill' and not 'stroke' so svg normalization would work as expected
  color?: string;

  // the size in pixels
  size?: number;

  offsetForward?: RelativeSize;
  offsetSidewards?: RelativeSize;

  containerRef?: LegacyRef<SVGGElement>; // internal
  pos?: IPoint;

  // props that will be passed to the host svg shape
  hostProps?: React.SVGProps<SVGGElement>;
}

/**
 * responsible for manipulating an svg shape
 */
const SvgManipulator = React.forwardRef<SVGGElement, SvgManipulatorProps>(function SvgManipulator(props, forwardRef) {
  // console.log("SvgManipulator");

  const propsWithDefault = assignDefaults(props, {
    pos: new Vector({ x: 0, y: 0 }),
    rotation: new Dir("0deg"),
    color: "cornflowerblue",
    size: 30,
    props: {},
    containerRef: null,
    offsetForward: "0" as RelativeSize,
    offsetSidewards: "0" as RelativeSize,
  });
  //@ts-ignore
  let { children } = props;

  propsWithDefault.rotation = new Dir(propsWithDefault.rotation);
  const { rotation, pos, color, size, containerRef, offsetForward, offsetSidewards } = propsWithDefault;

  let newpos = pos.add(rotation.mul(getRelativeSizeValue(offsetForward, size)));
  newpos = newpos.add(rotation.rotate(90).mul(getRelativeSizeValue(offsetSidewards, size)));

  let transform = `rotate(${rotation.toDegree()}deg)
  translate(${newpos.x}px,${newpos.y}px) scale(${size})`;

  // the reason there are 2 nested g elements is to allow the user to override props correctly
  return (
    <g {...props.hostProps} ref={forwardRef}>
      <g
        ref={containerRef}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: transform,
          fill: color,
          pointerEvents: "auto",
        }}
      >
        {children}
      </g>
    </g>
  );
});

export default SvgManipulator;
