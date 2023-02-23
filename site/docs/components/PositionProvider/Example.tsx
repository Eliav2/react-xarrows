import React, { useRef } from "react";
import { Box } from "@site/src/components/Box";
import { XArrow, XWrapper, XLine, AutoAnchor, PositionProvider } from "react-xarrows";

export const DemoXWrapper = () => {
  // console.log("DemoXWrapper");
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  return (
    <XWrapper>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "column",
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
      <XArrow start={box1Ref} end={box2Ref}>
        <XLine color={"red"} />
        <AutoAnchor>
          <XLine />
        </AutoAnchor>
        <PositionProvider value={{ startPoint: (prevS) => ({ ...prevS, x: prevS.x + 50 }) }}>
          <XLine color={"green"} />
        </PositionProvider>
      </XArrow>
    </XWrapper>
  );
};
