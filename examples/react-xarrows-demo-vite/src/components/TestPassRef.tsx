import React, { forwardRef, useRef } from "react";
import {
  XArrow,
  XArrowProps,
  autoSelectAnchor,
  Anchor,
  useXArrow,
  XWrapper,
  XLine,
  AutoSelectAnchor,
  PositionProvider,
  XHead,
  NormalizedGSvg,
  BasicHeadShape1,
  XPath,
  BestPath,
  HeadProvider,
} from "react-xarrows";
import { Box } from "./Box";

function Comp({ children }) {
  const ref = useRef(123);
  // console.log(children);
  console.log(ref);
  return <>{React.cloneElement(children, { ref })}</>;
}

const ChildComp = forwardRef<any, SVGTextElement>((props, forwardRef) => {
  // console.log("ChildComp", forwardRef, props);
  return (
    <text ref={forwardRef} fill={"red"} x="65" y="55" className="Rrrrr">
      Grumpy!
    </text>
  );
});
// const ChildComp = (props) => {
//   console.log("ChildComp");
//   return (
//     <text fill={"red"} x="65" y="55" className="Rrrrr">
//       Grumpy!
//     </text>
//   );
// };

const TestPassRef = () => {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  return (
    <XArrow start={box1Ref} end={box2Ref}>
      <Box ref={box1Ref} small>
        box1
      </Box>
      <Box ref={box2Ref}>box2</Box>

      <Comp>
        <AutoSelectAnchor>
          {/*{<ChildComp />}*/}
          {/*{<ChildComp />}*/}
          {/*{ChildComp}*/}
          {ChildComp}
        </AutoSelectAnchor>
      </Comp>
    </XArrow>
  );
};
export default TestPassRef;
