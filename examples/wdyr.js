import React from 'react';
import { XSimpleArrow } from '../src/Xarrow/XarrowCore';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    // trackExtraHooks: ['useElement'],
  });
}
