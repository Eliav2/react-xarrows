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
    // Storybook is always published one level under the demo, so it needs its
    // own base or every asset URL resolves a level up. The demo owns
    // /react-xarrows/ on Pages and the root on Netlify deploy previews.
    config.base = `${process.env.GITHUB_PAGES === 'true' ? '/react-xarrows' : ''}/storybook/`;
    return config;
  },
};

export default config;
