import './App.css';
import { Xline, Xarrow } from 'react-xarrows/src/redesign/mock';
import React from 'react';

interface BoxProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
}

const Box = ({ children, style, ...props }: BoxProps) => {
  return (
    <div
      style={{
        border: '1px solid',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        ...style,
      }}
      {...props}>
      {children}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Box id={'box1'}>box1</Box>
        <Box id={'box2'}>box2</Box>
      </div>
      <Xarrow start={'box1'} end={'box2'}>
        <Xline />
        {/*<Xline x={'0%'} y={'0%'}/>*/}
        {/*<path d="M10 10" />*/}
        {/*<path d="M 10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black" />*/}
      </Xarrow>


    </div>
  );
}

export default App;
