import React, { useState } from "react";
import Xarrow from "react-xarrows";

export default ({ line, setSelected, selected }) => {
  const [state, setState] = useState({ color: "coral" });
  const props = {
    consoleWarning: false,
    passProps: {
      className: "xarrow",
      onMouseEnter: () => setState({ color: "IndianRed" }),
      onMouseLeave: () => setState({ color: "coral" }),
      onClick: (e) => {
        e.stopPropagation(); //so only the click event on the box will fire on not on the conainer itself
        setSelected({ id: { start: line.start, end: line.end }, type: "arrow" });
      },
      cursor: "pointer",
    },
  };
  let color = state.color;
  if (selected && selected.type === "arrow" && selected.id.start === line.start && selected.id.end === line.end)
    color = "red";
  return <Xarrow {...{ ...props, ...line, ...state, color }} />;
};
