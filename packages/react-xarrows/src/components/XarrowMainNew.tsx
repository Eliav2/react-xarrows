import React, { FC, useContext } from 'react';
import XarrowBuilder, { createFeatures } from './XarrowBuilder';
import Core from '../features/Core';
import { DelayedComponent } from './DelayedComponent';
import { XarrowContext } from '../Xwrapper';
import Anchors from '../features/Anchors';
import Path from '../features/Path';
import PathPro from '../features/PathPro';
import Edges from '../features/Edges';

// each feature is implemented separately
const features = createFeatures([
  Core, //
  Anchors,
  Edges,
  // Path,
  PathPro,
  //  todo:
  //    Labels
  //    dashness
  //    custom svg shapes
  //
] as const);

export type Features = typeof features;

const XarrowCustom = XarrowBuilder(features);
export type XarrowProps = typeof XarrowCustom extends React.FC<infer P> ? P : {};

export interface XarrowMainNewProps extends XarrowProps {
  delayRenders?: number;
}

const XarrowMainNew: FC<XarrowMainNewProps> = (props) => {
  useContext(XarrowContext);
  const { delayRenders = 1 } = props;
  return <DelayedComponent delayRenders={delayRenders}>{() => <XarrowCustom {...props} />}</DelayedComponent>;
};

export default XarrowMainNew;
