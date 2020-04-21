import React, { useState } from "react";
import PlayGround from "./PlayGround/PlayGround";
import Example1 from "./Example1";
import Example2 from "./Example2";
import Example3 from "./Example3";

const ExamplePage: React.FC = () => {
  const [showMe, setShowMe] = useState(true);

  const [choosedExample, setChoosedExample] = useState("");
  return (
    <div>
      <button style={{ margin: "auto", display: "block" }} onClick={() => setShowMe(!showMe)}>
        toggle
      </button>
      {showMe ? (
        <div>
          <button onClick={() => setChoosedExample("Example1")}>Example1</button>
          <button onClick={() => setChoosedExample("Example2")}>Example2</button>
          <button onClick={() => setChoosedExample("Example3")}>Example3</button>
          <button onClick={() => setChoosedExample("PlayGround")}>PlayGround</button>
          <div>
            {choosedExample === "Example1" ? <Example1 /> : null}
            {choosedExample === "Example2" ? <Example2 /> : null}
            {choosedExample === "Example3" ? <Example3 /> : null}
            {choosedExample === "PlayGround" ? <PlayGround /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExamplePage;
