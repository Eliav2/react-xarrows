import React, { StrictMode, useLayoutEffect, useRef, useState } from 'react';
import SimpleExample from './examplesFiles/SimpleExample';

const log = console.log;

const StrictApp = (props) => {
  log('StrictApp render');
  const [state, setState] = useState({});
  const reRender = () => setState({});
  return (
    <div>
      <h1>Strict Tree</h1>
      <button onClick={reRender}>render!</button>
      <SimpleExample />
      {/*<TestApp />*/}
    </div>
  );
};

const NonStrictApp = (props) => {
  log('NonStrictApp render');
  const [state, setState] = useState({});
  const reRender = () => setState({});
  return (
    <div>
      <h1>Non Strict Tree</h1>
      <button onClick={reRender}>render!</button>
      <SimpleExample />
    </div>
  );
};

const TestApp = () => {
  const [value, setValue] = useState(0);
  const [, setRender] = useState({});
  const reRender = () => setRender({});

  useLayoutEffect(() => {
    setValue(10);
  }, [value]);

  const shouldUpdate = useRef(false);
  if (shouldUpdate.current) {
    reRender();
    shouldUpdate.current = false;
  }

  return <div>{value}</div>;
};

const TestStrict = (props) => {
  return (
    <>
      <StrictMode>
        <StrictApp />
      </StrictMode>

      {/*<NonStrictApp />*/}
    </>
  );
};

export default TestStrict;
