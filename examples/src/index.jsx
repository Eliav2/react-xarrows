import * as React from 'react';
import './index.css';
import { render } from 'react-dom';

import ExamplePage from './ExamplePage';

const rootElement = document.getElementById('root');
render(
  // <React.StrictMode>
  //   <ExamplePage />
  // </React.StrictMode>,
  <ExamplePage />,

  rootElement
);
