import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Opt out of anonymous usage reporting on behalf of contributors.
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    // On Pages the demo owns /react-xarrows/ and Storybook is nested one level
    // deeper, so it needs its own base or every asset URL resolves a level up.
    if (process.env.GITHUB_PAGES === 'true') {
      config.base = '/react-xarrows/storybook/';
    }
    return config;
  },
};

export default config;
