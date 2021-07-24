import * as React from 'react';
import './index.css';
import { render } from 'react-dom';

import ExamplePage from './ExamplePage';
import TestStrict from './TestStrict';
const rootElement = document.getElementById('root');
render(
  // <React.StrictMode>
  //   <ExamplePage />
  // </React.StrictMode>,
  // <ExamplePage />,
  <TestStrict />,
  rootElement
);
