import { Contains } from '../privateTypes';
import React, { useRef } from 'react';
import usePosition from "shared/hooks/usePosition"

type XElemRefType = React.MutableRefObject<any> | string | Contains<{ x: number; y: number }>;

interface XarrowProps {
  children: React.ReactNode;

  start: XElemRefType;
  end: XElemRefType;

  divWrapperProps?: React.HTMLProps<HTMLDivElement>;
  svgCanvasProps?: React.SVGProps<SVGSVGElement>;
}

export const Xarrow = (props: XarrowProps) => {
  const rootDivRef = useRef<HTMLDivElement>(null);
  const svgCanvasRef = useRef<SVGSVGElement>(null);
  return (
    <div
      ref={rootDivRef}
      style={{ position: 'absolute', pointerEvents: 'none', ...props.divWrapperProps?.style }}
      {...props.divWrapperProps}>
      <svg
        style={{
          position: 'absolute',
          fill: 'transparent',
          overflow: 'visible',
          ...props.svgCanvasProps?.style,
        }}
        ref={svgCanvasRef}
        {...props.svgCanvasProps}>
        {props.children}

      </svg>
    </div>
  );
};

interface XlineProps {}

export const Xline = (props: XlineProps) => {
  return <div>Xline</div>;
};
