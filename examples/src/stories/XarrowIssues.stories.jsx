import React, { Component, useRef, useState } from 'react';

import Xarrow from 'react-xarrows';
import Draggable from 'react-draggable';
import PopoutWindow from 'react-popout';

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

// The popped-out window used to need a jss insertion point so that Material-UI
// styles landed in the child document. Without Material-UI there is nothing to
// inject, so this is now a thin pass-through.
const Popout = ({ children }) => <PopoutWindow>{children}</PopoutWindow>;

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
        <button onClick={this.handleOpenPopoutClick}>
          Open Popout
        </button>
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
