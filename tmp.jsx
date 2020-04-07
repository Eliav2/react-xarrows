Xarrow.defaultProps = {
  startAnchor: "auto",
  endAnchor: "auto",
  arrowStyle: {
    color: "CornflowerBlue",
    strokeColor: null,
    headColor: null,
    curveness: 0.8,
    strokeWidth: 4,
    headSize: 6
  },
  monitorDOMchanges: true,
  registerEvents: []
};

let headColor = props.arrowStyle.headColor ? props.arrowStyle.headColor : props.arrowStyle.color;
let strokeColor = props.arrowStyle.strokeColor
  ? props.arrowStyle.strokeColor
  : props.arrowStyle.color;
