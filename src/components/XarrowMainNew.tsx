import React, { FC, useEffect, useRef, useState } from 'react';
import XarrowBuilder from './XarrowBuilder';
import { UnionToIntersection } from '../privateTypes';
import { useElement } from '../hooks/useElement';
import { getPosition } from './XarrowBasicPath';

interface XarrowMainNewProps {
  [prop: string]: any;
}

// type MyArr = ((state) => any)[];
// type RetTypes<T extends ((...arg: any) => any)[]> = UnionToIntersection<ReturnType<T[number]>>;
// const myArr = [() => ({ age: 25 }), () => ({ name: 'eliav' }), (state) => {}];
// type t = RetTypes<typeof myArr>;

const XarrowMainNew: FC<XarrowMainNewProps> = (props) => {
  return (
    <XarrowBuilder
      features={[
        //  save positions to state
        () => {
          const rootDivRef = useRef<HTMLDivElement>(null);

          const startElem = useElement(props.start);
          const endElem = useElement(props.end);
          const rootElem = useElement(rootDivRef);

          // on mount
          const [, setRender] = useState({});
          const forceRerender = () => setRender({});
          useEffect(() => {
            // set all props on first render
            const monitorDOMchanges = () => {
              window.addEventListener('resize', forceRerender);
              return () => {
                window.removeEventListener('resize', forceRerender);
              };
            };

            const cleanMonitorDOMchanges = monitorDOMchanges();
            return () => {
              cleanMonitorDOMchanges();
            };
          }, []);

          const getPathState = getPosition(startElem, endElem, rootElem);
          const arrowBodySvg = <path d={getPathState()} stroke="black" />;
          return { startElem, endElem, rootElem, rootDivRef, arrowBodySvg };
        },
        () => ({ name: 'eliav' }),
        () => ({ age: 25 }),
      ]}
      jsx={[
        (state) => {
          console.log(state);
          return (
            <div
              ref={state.rootDivRef}
              style={{ position: 'absolute', pointerEvents: 'none' }}
              {...props.divContainerProps}>
              <svg
                style={{
                  position: 'absolute',
                  fill: 'transparent',
                  overflow: 'visible',
                  ...props.SVGcanvasStyle,
                }}>
                {state.arrowBodySvg}
              </svg>
            </div>
          );
        },
      ]}
    />
  );
};

export default XarrowMainNew;
