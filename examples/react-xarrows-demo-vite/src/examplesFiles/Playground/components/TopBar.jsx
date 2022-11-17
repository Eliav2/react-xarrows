import React from 'react';
import './TopBar.css';
// import MaterialIcon from "material-icons-react";

const actions = {
  box: ['Add Connections', 'Remove Connections', 'Delete'],
  arrow: ['Edit Properties', 'Remove Connection'],
};

const TopBar = (props) => {
  const handleEditAction = (action) => {
    switch (action) {
      case 'Edit Name':
        props.setBoxes((boxes) => {
          var newName = prompt('Enter new name: ');
          while ([...boxes, ...props.interfaces].map((a) => a.id).includes(newName))
            newName = prompt('Name Already taken,Choose another: ');
          if (!newName) return;
          return boxes.map((box) => (box.id === props.selected.id ? { ...box, id: newName } : box));
        });
        break;
      case 'Add Connections':
        props.setActionState(action);
        break;
      case 'Remove Connections':
        props.setActionState(action);
        break;
      case 'Remove Connection':
        props.setLines((lines) =>
          lines.filter(
            (line) => !(line.props.root === props.selected.id.root && line.props.end === props.selected.id.end)
          )
        );
        break;
      case 'Edit Properties':
        props.setLines((lines) =>
          lines.map((line) =>
            line.props.root === props.selected.id.root && line.props.end === props.selected.id.end
              ? {
                  ...line,
                  menuWindowOpened: true,
                }
              : line
          )
        );
        break;
      case 'Delete':
        if (window.confirm(`are you sure you want to delete ${props.selected.id}?`)) {
          // first remove any lines connected to the node.
          props.setLines((lines) => {
            return lines.filter(
              (line) => !(line.props.root === props.selected.id || line.props.end === props.selected.id)
            );
          });
          // if its a box remove from boxes
          if (props.boxes.map((box) => box.id).includes(props.selected.id)) {
            props.setBoxes((boxes) => boxes.filter((box) => !(box.id === props.selected.id)));
          }
          // if its a interface remove from interfaces
          else if (props.interfaces.map((itr) => itr.id).includes(props.selected.id)) {
            props.setInterfaces((itrs) => itrs.filter((itr) => !(itr.id === props.selected.id)));
          }
          props.handleSelect(null);
        }
        break;
      default:
    }
  };

  var returnTopBarApearnce = () => {
    let allowedActions = [];
    if (props.selected) allowedActions = actions[props.selected.type];
    switch (props.actionState) {
      case 'Normal':
        return (
          <div className="actionBubbles">
            {allowedActions.map((action, i) => (
              <div className="actionBubble" key={i} onClick={() => handleEditAction(action)}>
                {action}
              </div>
            ))}
          </div>
        );
      case 'Add Connections':
        return (
          <div className="actionBubbles">
            <p>To where connect new connection?</p>
            <div className="actionBubble" onClick={() => props.setActionState('Normal')}>
              finish
            </div>
          </div>
        );

      case 'Remove Connections':
        return (
          <div className="actionBubbles">
            <p>Which connection to remove?</p>
          </div>
        );
      default:
    }
  };

  return (
    <div
      className="topBarStyle"
      style={{ height: props.selected === null ? '0' : '60px' }}
      onClick={(e) => e.stopPropagation()}>
      <div className="topBarLabel" onClick={() => props.handleSelect(null)}>
        {/*<MaterialIcon*/}
        {/*  size={30}*/}
        {/*  icon="keyboard_arrow_up"*/}
        {/*  className="material-icons topBarToggleIcon"*/}
        {/*/>*/}
        {/* <p>Edit Menu</p> */}
      </div>
      {returnTopBarApearnce()}
    </div>
  );
};

export default TopBar;
