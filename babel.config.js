module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-flow',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development',
        importSource: '@welldone-software/why-did-you-render',
      },
    ],
  ],
};
