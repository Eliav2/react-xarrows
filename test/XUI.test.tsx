// @ts-ignore
import React, { useEffect, useRef } from "react";
import { expect, test, describe } from "vitest";
import PositionProvider, { usePositionProvider, usePositionProviderRegister } from "../src/providers/PositionProvider";
import { render } from "@testing-library/react";
import { HeadProvider } from "../src";
import XArrow from "../src/XArrow";
import useRerender from "shared/hooks/useRerender";
import { Box } from "../examples/react-xarrows-demo-vite/src/components/Box";
import XWrapper from "../src/XWrapper";
import { Button, Paper } from "@mui/material";
import XArrowEnd from "../src/XArrowEnd";
import XLine from "../src/XLine";

type DemoXWrapperProps = {
  children: (box1Ref: React.MutableRefObject<HTMLDivElement>, box2Ref: React.MutableRefObject<HTMLDivElement>) => JSX.Element;
};
describe("XLine ", () => {
  const DemoXWrapper = ({ children }: DemoXWrapperProps) => {
    // console.log("DemoXWrapper");
    const render = useRerender();
    const box1Ref = useRef<HTMLDivElement>(null);
    const box2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      console.log("DemoXWrapper useEffect");
    }, []);

    // PositionProvider -> HeadProvider -> PositionProvider
    return (
      <XWrapper>
        <Paper>
          <Button onClick={render}>render</Button>
        </Paper>
        {/* my boxes */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            // flexDirection: "column",
            height: 400,
            alignItems: "center",
          }}
        >
          <Box ref={box1Ref} id={"box1"} small>
            box1
          </Box>
          <Box ref={box2Ref} id={"box2"}>
            box2
          </Box>
        </div>
        <div style={{ height: 50 }} />
        {children(box1Ref, box2Ref)}
      </XWrapper>
    );
  };

  test("", () => {
    render(
      <PositionProvider value={{ endPoint: { x: 534, y: -271 }, startPoint: { x: 166, y: -271 } }}>
        <PositionProvider
          value={(prevPos) => {
            // console.log("prevPos", prevPos);
            if (prevPos.endPoint) prevPos.endPoint.x -= 30;
            return prevPos;
          }}
        >
          <XArrowEnd />
          <XLine color={"red"} />
        </PositionProvider>
      </PositionProvider>
    );
    // });  test("", () => {
    //   render(
    //     <DemoXWrapper>
    //       {(box1Ref, box2Ref) => {
    //         return (
    //           <XArrow start={box1Ref} end={box2Ref}>
    //             <PositionProvider
    //               value={(prevPos) => {
    //                 // console.log("prevPos", prevPos);
    //                 if (prevPos.endPoint) prevPos.endPoint.x -= 30;
    //                 return prevPos;
    //               }}
    //             >
    //               <XArrowEnd />
    //               <XLine color={"red"} />
    //             </PositionProvider>
    //           </XArrow>
    //         );
    //       }}
    //     </DemoXWrapper>
    //   );
    // });
  });
});
