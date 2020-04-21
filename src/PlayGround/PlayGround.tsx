import React, { useState, useRef } from "react";
import "./PlayGround.css";
import Xarrow, { xarrowPropsType } from "./../Xarrow";
import Box from "./components/Box";
import TopBar from "./components/TopBar";

type actionState = "Normal" | "Add Connections" | "Remove Connections";
// export type line : xarrowPropsType;
export type point = { x: number; y: number };
export type interfaceType = {
  id: string;
  refIn: { current: null | HTMLElement };
  refOut: { current: null | HTMLElement };
};
const shapes = ["wideBox", "tallBox"] as const;
export type shapes = typeof shapes;
export type box = { id: string; x: number; y: number; shape: shapes };

const PlayGround: React.FC = () => {
  const [interfaces, setInterfaces] = useState<interfaceType[]>([
    {
      id: "ens33",
      refIn: useRef(null),
      refOut: useRef(null)
    },
    {
      id: "s1-eth1",
      refIn: useRef(null),
      refOut: useRef(null)
    },
    {
      id: "s1-eth2",
      refIn: useRef(null),
      refOut: useRef(null)
    }
  ]);

  const [boxes, setBoxes] = useState<box[]>([
    { id: "box1", x: 0, y: 120, shape: "wideBox" },
    { id: "box2", x: 320, y: 200, shape: "tallBox" }
    // { id: "box3", x: 220, y: 100, shape: "triangle" }
  ]);

  const [lines, setLines] = useState<xarrowPropsType[]>([
    {
      start: "box1",
      end: "box2",
      headSize: 10,
      startAnchor: "auto",
      endAnchor: "top",
      curveness: 3,
      label: {
        start: "start",
        middle: "middle",
        end: "end"
      }
    }
  ]);

  const [selected, setSelected] = useState<string | null>(null);
  const [prevSelected, setPrevSelected] = useState<string | null>(null);

  const [actionState, setActionState] = useState<actionState>("Normal");

  const handleInterfaceClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); //so only the click event on the box will fire on not on the conainer itself
    let id = e.target.id;
    if (actionState === "Normal") {
      handleSelect(e);
    } else if (
      actionState === "Add Connections" &&
      id.includes(":output") &&
      lines.filter(line => line.start === selected && line.end === id).length === 0
    ) {
      setLines(lines => [...lines, { start: selected, end: id }]);
    } else if (actionState === "Remove Connections") {
      setLines(lines => lines.filter(line => !(line.start === selected && line.end === id)));
    }
  };

  const handleSelect = e => {
    setPrevSelected(selected);
    if (e === null) {
      setSelected(null);
      setActionState("Normal");
    } else setSelected(e.target.id);
  };

  const handleDrop = e => {
    let shape = e.dataTransfer.getData("shape");
    if (shapes.includes(shape)) {
      let l = boxes.length;
      while (boxes.map(b => b.id).includes("box" + l)) l++;
      let { x, y } = e.target.getBoundingClientRect();
      var newName = prompt("Enter box name: ", "box" + l);
      let newBox = { id: newName, x: e.clientX - x, y: e.clientY - y, shape };
      setBoxes([...boxes, newBox]);
    }
  };

  // console.log(lines);

  return (
    <div className="App">
      <header className="titleStyle">Ryu SDN GUI</header>
      <hr />

      <div className="canvasContainerStyle">
        <div className="canvasStyle" id="canvas" onClick={() => handleSelect(null)}>
          <div className="toolboxMenu">
            <div className="toolboxTitle">Toolbox menu</div>
            <hr />
            <div className="toolboxContainer">
              {shapes.map(boxType => (
                <div
                  key={boxType}
                  className={boxType}
                  draggable
                  onDragStart={e => e.dataTransfer.setData("shape", boxType)}
                >
                  {boxType}
                </div>
              ))}
              {/* <div
                className="toolboxWideBox"
                draggable
                onDragStart={e => e.dataTransfer.setData("shape", "box")}
              >
                wideBox
              </div> */}
            </div>
          </div>
          <div className="interfacesBarStyle">
            <u className="interfaceTitleStyle">inputs</u>
            {interfaces.map(itr => {
              let itrId = itr.id + ":input";
              let background = null;
              if (selected === itrId) {
                background = "rgb(200, 200, 200)";
              }
              return (
                <div
                  key={itrId}
                  id={itrId}
                  ref={itr.refIn}
                  className="fixedBoxStyle"
                  onClick={handleInterfaceClick}
                  style={{ background }}
                >
                  {itr.id}
                </div>
              );
            })}
          </div>
          <div className="boxesContainer" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
            <TopBar
              setBoxes={setBoxes}
              selected={selected}
              prevSelected={prevSelected}
              handleSelect={handleSelect}
              setPrevSelected={setPrevSelected}
              actionState={actionState}
              setActionState={setActionState}
              setLines={setLines}
              interfaces={interfaces}
            />

            {boxes.map(box => (
              <Box
                key={box.id}
                box={box}
                boxes={boxes}
                setBoxes={setBoxes}
                selected={selected}
                handleSelect={handleSelect}
                prevSelected={prevSelected}
                setPrevSelected={setPrevSelected}
                actionState={actionState}
                setLines={setLines}
                lines={lines}
              />
            ))}
          </div>
          <div className="interfacesBarStyle">
            <u className="interfaceTitleStyle">outputs</u>
            {interfaces.map(itr => {
              let itrId = itr.id + ":output";

              let background = null;
              if (selected === itrId) {
                background = "rgb(200, 200, 200)";
              } else if (
                (actionState === "Add Connections" &&
                  lines.filter(line => line.start === selected && line.end === itrId).length ===
                    0) ||
                (actionState === "Remove Connections" &&
                  lines.filter(line => line.start === selected && line.end === itrId).length > 0)
              ) {
                background = "LemonChiffon";
              }

              return (
                <div
                  key={itrId}
                  id={itrId}
                  ref={itr.refIn}
                  className="fixedBoxStyle"
                  onClick={handleInterfaceClick}
                  style={{ background }}
                >
                  {itr.id}
                </div>
              );
            })}
          </div>
          {lines.map(line => (
            <Xarrow key={line.start + "-" + line.end} {...line} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayGround;
