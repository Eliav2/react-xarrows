const path = require('path');
// const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {
  const { mode } = argv;
  const isDev = mode === 'development';
  return {
    name: 'lib',
    mode: mode,
    target: ['web', 'es5'],
    externals: [
      {
        react: 'react',
        'lodash.isequal': 'lodash.isequal',
        'lodash.omit': 'lodash.omit',
        'lodash.pick': 'lodash.pick',
        'prop-types': 'prop-types',
      },
      // nodeExternals(),
    ],
    // externalsPresets: { node: true },
    devtool: false,
    entry: path.resolve(__dirname, './src/index.tsx'),
    // optimization: { splitChunks: { cacheGroups: { default: false } }, chunkIds: 'named' },
    // optimization: {
    //   //   minimize: true,
    //   //   removeAvailableModules: true,
    //   //   flagIncludedChunks: true,
    //   //   usedExports: true,
    //   //   concatenateModules: true,
    //   sideEffects: true,
    // },

    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, `lib`),
      clean: true,
      // library
      library: 'reactXarrow',
      libraryTarget: 'umd',
      globalObject: 'this',
      umdNamedDefine: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', 'jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: isDev ? { sourceMap: true, declarationMap: true } : {},
              },
            },
          ],
        },
        {
          test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
          use: ['file-loader'],
        },
      ],
    },
  };
};
