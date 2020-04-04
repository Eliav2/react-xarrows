import React, { useRef, useEffect, useState } from "react";

const App = () => {
  const selfRef = useRef(null);
  const [startPos, setStartPos] = useState(null);
  useEffect(() => {
    // equilavent to componentDidMount
    setStartPos(selfRef.current.getBoundingClientRect());
    functionThatUsesStartPos();
  }, []);
  return <div ref={selfRef} />;
};
