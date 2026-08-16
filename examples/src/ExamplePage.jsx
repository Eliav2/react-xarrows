import React from 'react';

import examples from './examplesFiles';

import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';

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

// Every deploy publishes Storybook one level under the demo, so BASE_URL covers
// both the /react-xarrows/ base on Pages and the root base on Netlify previews.
// The dev server is the exception: `pnpm storybook` runs it as its own server.
const storybookUrl = import.meta.env.DEV ? 'http://localhost:6006' : `${import.meta.env.BASE_URL}storybook/`;

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
        <a href={storybookUrl} target="_blank" rel="noopener noreferrer">
          Storybook
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

        <Routes>
          <Route
            path="/"
            element={
              <div style={{ textAlign: 'center' }}>
                <h2>choose any example</h2>
                <h5>
                  see each example file at <code>/src/examplesFiles</code>{' '}
                </h5>
              </div>
            }
          />
          {Object.keys(examples).map((exampleName) => {
            const Component = examples[exampleName].component;
            return <Route path={'/' + exampleName} key={exampleName} element={<Component />} />;
          })}
        </Routes>
      </Router>
    </div>
  );
};

export default ExamplePage;
