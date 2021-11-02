module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
  ],
  typescript: {
    reactDocgen: "none",
  },

  webpack: (config) => {
    const { oneOf } = config.module.rules[5];
    const babelLoader = oneOf.find(({ test }) => new RegExp(test).test(".ts"));
    babelLoader.include = undefined;
    babelLoader.options.presets.push(
      "@babel/preset-typescript",
      "@babel/preset-react",
      "@babel/preset-env"
    );
    babelLoader.options.plugins.push(
      "@babel/plugin-proposal-logical-assignment-operators"
    );
    return config;
  },
};
