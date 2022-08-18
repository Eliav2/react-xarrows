const path = require('path');
// const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {
  const { mode } = argv;
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  return {
    name: 'lib',
    mode: mode,
    target: ['web', 'es5'],
    externals: [
      {
        react: 'react',
        'prop-types': 'prop-types',
      },
      // nodeExternals(),
    ],
    // externalsPresets: { node: true },
    devtool: false,
    entry: path.resolve(__dirname, './src/index.tsx'),

    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, `lib`),
      clean: true,
      // library
      library: { name: 'reactXarrow', type: 'umd', umdNamedDefine: true },
      globalObject: 'this',
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
                compilerOptions: isProd ? { sourceMap: false, declarationMap: false } : {},
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
