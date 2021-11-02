import React, { FC, useContext } from 'react';
import XarrowBuilder from './XarrowBuilder';
import Core from '../features/Core';
import { DelayedComponent } from './DelayedComponent';
import { XarrowContext } from '../Xwrapper';
import Anchors from '../features/Anchors';
import Path from '../features/Path';
// import Edges from '../features/Edges' ;

// each feature is implemented separately
const features = [
  Core, //
  Anchors,
  // Edges,
  Path,
];

const XarrowCustom = XarrowBuilder(features);
type Props = typeof XarrowCustom extends React.FC<infer P> ? P : {};

export interface XarrowMainNewProps extends Props {
  delayRenders?: number;
}

const XarrowMainNew: FC<XarrowMainNewProps> = (props) => {
  useContext(XarrowContext);
  const { delayRenders = 1 } = props;
  return <DelayedComponent delayRenders={delayRenders}>{() => <XarrowCustom {...props} />}</DelayedComponent>;
};

export default XarrowMainNew;
