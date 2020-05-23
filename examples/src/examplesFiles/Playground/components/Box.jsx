import React from "react";
import "./Box.css";
import Draggable from "react-draggable";

const Box = (props) => {
  const handleDrag = (e, boxId) => {
    let newBoxes = [...props.boxes];
    props.setBoxes(newBoxes);
  };
  const handleClick = (e) => {
    e.stopPropagation(); //so only the click event on the box will fire on not on the conainer itself
    if (props.actionState === "Normal") {
      props.handleSelect(e);
    } else if (props.actionState === "Add Connections" && props.selected.id !== props.box.id) {
      props.setLines((lines) => [...lines, { start: props.selected.id, end: props.box.id }]);
    } else if (props.actionState === "Remove Connections") {
      props.setLines((lines) =>
        lines.filter((line) => !(line.start === props.selected.id && line.end === props.box.id))
      );
    }
  };

  let background = null;
  if (props.selected && props.selected.id === props.box.id) {
    background = "rgb(200, 200, 200)";
  } else if (
    (props.actionState === "Add Connections" &&
      // props.sidePos !== "right" &&
      props.lines.filter((line) => line.start === props.selected.id && line.end === props.box.id).length === 0) ||
    (props.actionState === "Remove Connections" &&
      props.lines.filter((line) => line.start === props.selected.id && line.end === props.box.id).length > 0)
  ) {
    background = "LemonChiffon";
  }
  return (
    <Draggable
      onStart={() => (props.position === "static" ? false : true)}
      bounds="parent"
      onDrag={(e) => handleDrag(e, props.box.id)}
    >
      <div
        ref={props.box.ref}
        className={`${props.box.shape} ${props.position} hoverMarker`}
        style={{
          left: props.box.x,
          top: props.box.y,
          background,
          // border: "black solid 2px",
        }}
        onClick={handleClick}
        id={props.box.id}
      >
        {props.box.name ? props.box.name : props.box.id}
        {/* <div style={{ textAlign: "center" }}> {props.box.id}</div>
      <img src={SwitchIcon} alt="SwitchIcon" className={"switchIcon"} id={props.box.id} /> */}
      </div>
    </Draggable>
  );
};

export default Box;
