import React, { useState } from "react";
import "./Box.css";
import { box, point } from "./../App";

type props = {
  key: number;
  box: box;
  boxes: box[];
  setBoxes: React.Dispatch<React.SetStateAction<box[]>>;
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
};

const Box: React.FC = (props: props) => {
  const [lastPoint, setLastPoint] = useState<point>({ x: 0, y: 0 });

  const handlDragStart = (e: React.DragEvent) => {
    setLastPoint({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e: React.DragEvent, boxId: string) => {
    let i = props.boxes.findIndex(box => box.id === boxId);
    let newBoxes = [...props.boxes];
    let newX = newBoxes[i].x + e.clientX - lastPoint.x,
      newY = newBoxes[i].y + e.clientY - lastPoint.y;
    if (newX < 0 || newY < 0) return;
    newBoxes[i].x = newX;
    newBoxes[i].y = newY;
    props.setBoxes(newBoxes);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); //so only the click event on the box will fire on not on the conainer itself
    if (props.actionState === "Normal") {
      props.handleSelect(e);
    } else if (props.actionState === "Add Connections") {
      props.setLines(lines => [...lines, { start: props.selected, end: props.box.id }]);
    } else if (props.actionState === "Remove Connections") {
      props.setLines(lines =>
        lines.filter(line => !(line.start === props.selected && line.end === props.box.id))
      );
    }
  };

  let background = null;
  if (props.selected === props.box.id) {
    background = "rgb(200, 200, 200)";
  } else if (
    (props.actionState === "Add Connections" &&
      props.lines.filter(line => line.start === props.selected && line.end === props.box.id)
        .length === 0) ||
    (props.actionState === "Remove Connections" &&
      props.lines.filter(line => line.start === props.selected && line.end === props.box.id)
        .length > 0)
  ) {
    background = "LemonChiffon";
  }
  return (
    <div
      ref={props.box.ref}
      className={props.box.shape + " absolute hoverMarker"}
      style={{
        left: props.box.x,
        top: props.box.y,
        background
      }}
      onDragStart={e => handlDragStart(e)}
      onDragEnd={e => handleDragEnd(e, props.box.id)}
      onClick={handleClick}
      id={props.box.id}
      draggable
    >
      {props.box.id}
    </div>
  );
};

export default Box;
