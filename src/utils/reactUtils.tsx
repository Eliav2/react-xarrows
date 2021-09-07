import React from 'react';

export const appendPropsToChildren = (children: React.ReactNode, props: Object) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });
};

export const isDev = process.env.NODE_ENV === 'development';
