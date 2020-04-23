import React, { useState, useRef } from "react";
import { line, box, point } from "./types";
import Example1 from "./examplesFiles/Example1";
import Example2 from "./examplesFiles/Example2";
import Example3 from "./examplesFiles/Example3";
import Example4 from "./examplesFiles/Example4";
import SimpleExample from "./examplesFiles/SimpleExample";
import Playground from "./examplesFiles/Playground/Playground";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const titleStyle = {
  fontSize: "40px",
  margin: "20px 0 0 20px"
};

const ExamplePage: React.FC = () => {
  return (
    <div>
      <header style={titleStyle}>react-xarrows</header>
      <hr />
      <p style={{ textAlign: "center" }}>
        Draw arrows between components in React!
        <br />
        <br />
        I've noticed react was missing a good and relaible arrows component in npm - so i've decided
        to create on of my own and share it.
        <br />
        this component will rerender and will update the anchors position whenever needed(not like
        other similar npm libraries).
        <br />
        <br />
        no magical css traformations - just great react.
        <br />
      </p>
      <Router>
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link to="/">
              <button>home</button>
            </Link>
            <Link to="/SimpleExample">
              <button>SimpleExample</button>
            </Link>
            <Link to="/Example1">
              <button>Example1</button>
            </Link>
            <Link to="/Example2">
              <button>Example2</button>
            </Link>
            <Link to="/Example3">
              <button>Example3</button>
            </Link>
            <Link to="/Example4">
              <button>Example4</button>
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <Link to="/Playground">
              <button>Playground</button>
            </Link>
          </div>
        </div>

        <Switch>
          <Route exact path="/">
            <div style={{ textAlign: "center" }}>
              <h2>choose any example</h2>
              <h5>
                see each example file at <code>/src/examplesFiles</code>{" "}
              </h5>
            </div>
          </Route>
          <Route path="/SimpleExample">
            <SimpleExample />
          </Route>
          <Route path="/Example1">
            <Example1 />
          </Route>
          <Route path="/Example2">
            <Example2 />
          </Route>
          <Route path="/Example3">
            <Example3 />
          </Route>
          <Route path="/Example4">
            <Example4 />
          </Route>
          <Route path="/Playground">
            <Playground />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default ExamplePage;
