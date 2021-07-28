import React, { Component, useRef, useState } from 'react';

import Xarrow from 'react-xarrows';
import Draggable from 'react-draggable';
import { create } from 'jss';
import { jssPreset, StylesProvider } from '@material-ui/styles';
import PopoutWindow from 'react-popout';
import { Button } from '@material-ui/core';

const rootStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};
const boxStyle = {
  margin: 30,
  padding: 10,
  borderRadius: 5,
  width: '30%',
  height: 20,
  background: 'darkgrey',
  color: 'white',
};
const ArrowDown = ({ from, to }) => <Xarrow className="arrow" start={from} end={to} />;

const DraggableBox = ({ forceRerender, ...props }) => {
  return (
    <Draggable onDrag={forceRerender}>
      <div style={boxStyle} {...props} />
    </Draggable>
  );
};
const Diagram = (props) => {
  const [, setState] = useState();
  const forceRerender = () => setState({});
  return (
    <div style={rootStyle} id="ancestor">
      <DraggableBox id="e1" forceRerender={forceRerender} />
      <DraggableBox id="e2" forceRerender={forceRerender} />
      <ArrowDown from={'e1'} to={'e2'} {...props} />
    </div>
  );
};

class Popout extends React.Component {
  state = {
    ready: false,
  };

  handleRef = (ref) => {
    const ownerDocument = ref ? ref.ownerDocument : null;
    ownerDocument &&
      this.setState({
        ready: true,
        jss: create({
          ...jssPreset(),
          insertionPoint: ownerDocument.querySelector('#demo-frame-jss'),
        }),
        sheetsManager: new Map(),
      });
  };

  render() {
    const children = <React.Fragment>{this.props.children}</React.Fragment>;
    const childrenWithProps = React.cloneElement(children, {
      container: this.ownerdocument,
    });

    return (
      <PopoutWindow>
        <div id="demo-frame-jss" ref={this.handleRef} />
        {this.state.ready ? (
          <StylesProvider jss={this.state.jss} sheetsManager={this.state.sheetsManager}>
            {childrenWithProps}
          </StylesProvider>
        ) : null}
      </PopoutWindow>
    );
  }
}

class PopoutTemplate extends Component {
  state = {
    menuOpen: false,
    popoutOpen: false,
  };

  handlePopoutClosing = () => {
    this.setState({
      menuOpen: false,
      popoutOpen: false,
    });
  };

  handleOpenPopoutClick = () => {
    this.setState({
      popoutOpen: true,
    });
  };

  handleMenuOpenClick = (event) => {
    this.setState({ anchorEl: event.currentTarget, menuOpen: true });
  };

  handleMenuClosing = () => {
    this.setState({ menuOpen: false });
  };

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Button color="primary" onClick={this.handleOpenPopoutClick}>
          Open Popout
        </Button>
        <Diagram />
        {this.state.popoutOpen && (
          <Popout onClosing={this.handlePopoutClosing}>
            <Diagram {...this.props} />
          </Popout>
        )}
      </div>
    );
  }
}

export const PopoutIssue = (args) => <PopoutTemplate {...args} />;

PopoutIssue.args = {
  animateDrawing: true,
};

export default {
  title: 'PopoutIssue',
  component: PopoutIssue,
};

const BretArrows = () => {
  return <div></div>;
};
