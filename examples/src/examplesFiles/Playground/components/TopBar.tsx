import React from "react";
import "./TopBar.css";
import MaterialIcon from "material-icons-react";

const actions = ["Add Connections", "Remove Connections", "Delete"];

const TopBar = props => {
  const handleEditAction = action => {
    switch (action) {
      case "Edit Name":
        props.setBoxes(boxes => {
          var newName = prompt("Enter new name: ");
          while ([...boxes, ...props.interfaces].map(a => a.id).includes(newName))
            newName = prompt("Name Already taken,Choose another: ");
          if (!newName) return;
          return boxes.map(box => (box.id === props.selected ? { ...box, id: newName } : box));
        });
        break;
      case "Add Connections":
        props.setActionState(action);
        break;
      case "Remove Connections":
        props.setActionState(action);
        break;
      case "Delete":
        // first remove any lines connected to the node.
        props.setLines(lines =>
          lines.filter(line => !(line.start === props.selected || line.end === props.selected))
        );
        props.setBoxes(boxes => boxes.filter(box => !(box.id === props.selected)));
        props.handleSelect(null);
        break;
      default:
    }
  };

  var returnTopBarApearnce = () => {
    let allowedActions = actions;
    let selected = props.selected;
    if (props.selected === null) selected = props.prevSelected;
    if (selected)
      if (selected.includes(":input")) {
        allowedActions = ["Add Connections", "Remove Connections"];
      } else if (selected.includes(":output")) allowedActions = [];
      else allowedActions = actions;

    switch (props.actionState) {
      case "Normal":
        return (
          <div className="actionBubbles">
            {allowedActions.map((action, i) => (
              <div className="actionBubble" key={i} onClick={() => handleEditAction(action)}>
                {action}
              </div>
            ))}
          </div>
        );
      case "Add Connections":
        return (
          <div className="actionBubbles">
            <p>To where connect new connection?</p>
            <div className="actionBubble" onClick={() => props.setActionState("Normal")}>
              finish
            </div>
          </div>
        );

      case "Remove Connections":
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
      style={{ height: props.selected === null ? "0" : "60px" }}
      onClick={e => e.stopPropagation()}
    >
      <div className="topBarLabel" onClick={() => props.handleSelect(null)}>
        <MaterialIcon
          size={30}
          icon="keyboard_arrow_up"
          className="material-icons topBarToggleIcon"
        />
        {/* <p>Edit Menu</p> */}
      </div>
      {returnTopBarApearnce()}
      {/* <div className="actionBubbles">
        {actions.map((action, i) => (
          <div className="actionBubble" key={i} onClick={() => handleEditAction(action)}>
            {action}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default TopBar;
