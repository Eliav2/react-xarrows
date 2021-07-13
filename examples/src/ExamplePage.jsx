import React from 'react';

import examples from './examplesFiles';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export const canvasStyle = {
  width: '100%',
  height: '40vh',
  background: 'white',
  overflow: 'auto',
  display: 'flex',
};

export const boxContainerStyle = {
  position: 'relative',
  overflow: 'auto',
  width: '120%',
  height: '120%',
  background: 'white',
  color: 'black',
  border: 'black solid 1px',
};

export const boxStyle = {
  position: 'absolute',
  border: '1px #999 solid',
  borderRadius: '10px',
  textAlign: 'center',
  width: '100px',
  height: '30px',
};

const titleStyle = {
  fontSize: '40px',
  margin: '20px 0 0 20px',
};

const ExamplePage = () => {
  return (
    <div>
      <header style={titleStyle}>react-xarrows</header>
      <hr />
      <p style={{ textAlign: 'center' }}>
        Draw arrows between components in React!
        <br />
        <br />
        <a href="https://github.com/Eliav2/react-xarrows" target="_blank" rel="noopener noreferrer">
          View on Github
        </a>
        <br />
        <a href="https://www.npmjs.com/package/react-xarrows" target="_blank" rel="noopener noreferrer">
          View on npm
        </a>
        <br />
        <a href="https://eliav2.github.io/react-xarrows/" target="_blank" rel="noopener noreferrer">
          Home page
        </a>
        <br />
        <br />
        Just great react.
        <br />
      </p>
      <Router>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
            <Link to="/">
              <button>home</button>
            </Link>
            {Object.keys(examples).map((exampleName) => (
              <Link to={'/' + exampleName} key={exampleName}>
                <button>{exampleName}</button>
              </Link>
            ))}
          </div>
        </div>

        <Switch>
          <Route exact path="/">
            <div style={{ textAlign: 'center' }}>
              <h2>choose any example</h2>
              <h5>
                see each example file at <code>/src/examplesFiles</code>{' '}
              </h5>
            </div>
          </Route>
          {Object.keys(examples).map((exampleName) => {
            const Component = examples[exampleName].component;
            return (
              <Route path={'/' + exampleName} key={exampleName}>
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
