import React, { useContext } from 'react';
import { XarrowContext } from '../Xwrapper';
import { DelayedComponent } from './DelayedComponent';
import XarrowAnchors from './XarrowAnchors';

const XarrowMain: React.FC<XarrowAnchors> = (props) => {
  const { _delayRenders = 1 } = props;
  // console.log('DelayedXArrow');
  useContext(XarrowContext);
  // return <DelayedComponent delay={_delayRenders} componentCB={() => <XarrowAnchors {...props} />} />;
  return <DelayedComponent delay={_delayRenders}>{() => <XarrowAnchors {...props} />}</DelayedComponent>;
};

export default XarrowMain;
