import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './MenuWindow.css';

export default ({ setLines, line: { props: lineProp } }) => {
  const [pos, setPos] = useState({ width: 200, height: 200 });

  //   const d = {
  //     startAnchor: ["middle", "left", "right", "top", "bottom", "auto"],
  //     endAnchor:  ["middle", "left", "right", "top", "bottom", "auto"],
  //     label: { text: "", extra?: {}},
  //     color: "CornflowerBlue",
  //     lineColor: null,
  //     headColor: null,
  //     strokeWidth: 4,
  //     headSize: 6,
  //     curveness: 0.8,
  //     dashness: false,
  //     consoleWarning: false,
  //     passProps: {},
  //     advanced: { extendSVGcanvas: 0, passProps: { arrowBody: {}, arrowHead: {}, SVGcanvas: {} } },
  //     monitorDOMchanges: true,
  //     registerEvents: [],
  //   };

  //   const [state, setState] = useState<xarrowPropsType>({
  //     startAnchor: "auto",
  //     endAnchor: "auto",
  //     label: null,
  //     color: "CornflowerBlue",
  //     lineColor: null,
  //     headColor: null,
  //     strokeWidth: 4,
  //     headSize: 6,
  //     curveness: 0.8,
  //     dashness: false,
  //     consoleWarning: false,
  //     passProps: {},
  //     advanced: { extendSVGcanvas: 0, passProps: { arrowBody: {}, arrowHead: {}, SVGcanvas: {} } },
  //     monitorDOMchanges: true,
  //     registerEvents: [],
  //   });

  //   console.log(typeof state);

  const handleClose = () =>
    setLines((lines) =>
      lines.map((line) =>
        line.props.root === lineProp.root && line.props.end === lineProp.end
          ? {
              ...line,
              menuWindowOpened: false,
            }
          : line
      )
    );

  return (
    <Draggable>
      <div className="menuWindowContainer">
        <div className={'header'}>{`${lineProp.root}->${lineProp.end}`}</div>
        <hr style={{ width: '80%' }} />
        {/*<MaterialIcon*/}
        {/*  size={30}*/}
        {/*  icon="close"*/}
        {/*  className="material-icons closeButton"*/}
        {/*  onClick={handleClose}*/}
        {/*/>*/}
        <div style={{ width: '80%', margin: 'auto' }}>
          you are welcome to edit this example and add UI for editing the properties dynamically. PRs are very welcomed.
        </div>
      </div>
    </Draggable>
  );
};

// <Popup trigger={<button className="button"> Open Modal </button>} modal>
//   {close => (
//     <div className="modal">
//       <a className="close" onClick={close}>
//         &times;
//       </a>
//       <div className="header"> Modal Title</div>
//       <div className="content">
//       </div>
//       <div className="actions">
//         <Popup
//           trigger={<button className="button"> Trigger </button>}
//           position="top center"
//           closeOnDocumentClick
//         >
//         <span>
//           </span>
//         </Popup>
//         <button
//           className="button"
//           onClick={() => {
//             close();
//           }}
//         >
//           close modal
//         </button>
//       </div>
//     </div>
//   )}
// </Popup>
