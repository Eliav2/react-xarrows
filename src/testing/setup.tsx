import React from 'react';

const mockReactXarrow = () =>
  jest.mock('react-xarrows', () => {
    return {
      __esModule: true,
      default: () => <span />,
      useXarrow: () => null,
    };
  });

export { mockReactXarrow };
