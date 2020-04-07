import React, { useState, useRef } from "react";
import { line, box, point } from "./types";
import Xarrows from "../src/Xarrow";
import Example1 from "./Example1";
import Example2 from "./Example2";
import Example3 from "./Example3";
import Example4 from "./Example4";
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
        no magical css traformations - just great react.
        <br />
      </p>
      <Router>
        <table align="center">
          <tbody>
            <tr>
              <td>
                <Link to="/Example1">
                  <button>Example1</button>
                </Link>
              </td>
              <td>
                <Link to="/Example2">
                  <button>Example2</button>
                </Link>
              </td>
              <td>
                <Link to="/Example3">
                  <button>Example3</button>
                </Link>
              </td>
              <td>
                <Link to="/Example4">
                  <button>Example4</button>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>

        {/* <Example1 />
        <Example2 /> */}

        <Switch>
          <Route exact path="/">
            <h2 style={{ textAlign: "center" }}>choose any example</h2>
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
        </Switch>
      </Router>
    </div>
  );
};

export default ExamplePage;
