import React, { LegacyRef, useEffect } from "react";

export interface Comp2Props {
  children?: React.ReactNode; // a jsx element of type svg like <circle .../> or <path .../>

  props?: any;
}

function Comp2(props) {

  useEffect(() => {
    console.log("Comp2 useEffect");
    return () => console.log("Comp2 useEffect clean");
  }, []);

  return (
    <div {...props.props} >

      {props.children}
    </div>
  );
};
export default Comp2;

