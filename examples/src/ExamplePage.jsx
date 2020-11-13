import React from "react";
// import Example1 from "./examplesFiles/Example1";
// import Example2 from "./examplesFiles/Example2";
// import ZindexExample from "./examplesFiles/ZindexExample";
// // import Example4 from "./examplesFiles/Example4";
//
// import SimpleExample from "./examplesFiles/SimpleExample";
// import Playground from "./examplesFiles/Playground/Playground";

import examples from "./examplesFiles";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const titleStyle = {
  fontSize: "40px",
  margin: "20px 0 0 20px",
};

const ExamplePage = () => {
  return (
    <div>
      <header style={titleStyle}>react-xarrows</header>
      <hr />
      <p style={{ textAlign: "center" }}>
        Draw arrows between components in React!
        <br />
        <br />
        <a
          href="https://github.com/Eliav2/react-xarrows"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Github
        </a>
        <br />
        <a
          href="https://www.npmjs.com/package/react-xarrows"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on npm
        </a>
        <br />
        <a
          href="https://eliav2.github.io/react-xarrows/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Home page
        </a>
        <br />
        <br />
        no magical css traformations - just great react.
        <br />
      </p>
      <Router>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link to="/">
              <button>home</button>
            </Link>
            {Object.keys(examples).map((exampleName) => (
              <Link to={"/" + exampleName}>
                <button>{exampleName}</button>
              </Link>
            ))}
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
          {Object.keys(examples).map((exampleName) => {
            const Component = examples[exampleName].component;
            return (
              <Route path={"/" + exampleName}>
                <Component />
              </Route>
            );
          })}
        </Switch>
      </Router>
    </div>
  );
};

export default ExamplePage;
