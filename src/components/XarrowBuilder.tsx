import React, { FC } from 'react';
import { DelayedComponent } from './DelayedComponent';

interface XarrowNewProps {
  jsx: any;
  features: ((state) => any)[];
}

// if function will execute it passing down 'args' if a jsx will return it
const FuncOrJsx = (param, ...args) => {
  if (React.isValidElement(param)) return param;
  else if (typeof param === 'function') return param(...args);
};

const XarrowBuilder: FC<XarrowNewProps> = (props) => {
  console.log('XarrowBuilder');
  const State = {};
  for (let i = 0; i < props.features.length; i++) Object.assign(State, props.features[i](State));

  const { jsx } = props;
  if (Array.isArray(jsx)) return jsx.map((elem) => FuncOrJsx(elem, State));
  else return FuncOrJsx(jsx, State);
};

interface XarrowNewDelayedProps extends XarrowNewProps {
  delayRenders?: number;
}
const XarrowBuilderDelayed: React.FC<XarrowNewDelayedProps> = (props) => {
  console.log('XarrowBuilderDelayed');
  const { delayRenders } = props;
  return <DelayedComponent delayRenders={delayRenders}>{() => <XarrowBuilder {...props} />}</DelayedComponent>;
};

export default XarrowBuilderDelayed;
