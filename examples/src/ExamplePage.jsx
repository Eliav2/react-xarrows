import React from "react";
import Example1 from "./examplesFiles/Example1";
import Example2 from "./examplesFiles/Example2";
// import Example4 from "./examplesFiles/Example4";
import SimpleExample from "./examplesFiles/SimpleExample";
import Playground from "./examplesFiles/Playground/Playground";
// import Zoom from "./examplesFiles/Zoom";
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
            {/*<Link to="/Example4">*/}
            {/*  <button>Example4</button>*/}
            {/*</Link>*/}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Link to="/Playground">
              <button>Playground</button>
            </Link>
          </div>
          {/*<div*/}
          {/*  style={{*/}
          {/*    display: "flex",*/}
          {/*    justifyContent: "center",*/}
          {/*    marginTop: "10px",*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Link to="/Zoom">*/}
          {/*    <button>Zoom</button>*/}
          {/*  </Link>*/}
          {/*</div>*/}
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
          {/*<Route path="/Example4">*/}
          {/*  <Example4 />*/}
          {/*</Route>*/}
          <Route path="/Playground">
            <Playground />
          </Route>
          {/*<Route path="/Zoom">*/}
          {/*  <Zoom />*/}
          {/*</Route>*/}
        </Switch>
      </Router>
    </div>
  );
};

export default ExamplePage;
