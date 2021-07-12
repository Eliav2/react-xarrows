const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'index.html'),
  filename: './index.html',
});

module.exports = (env) => {
  const mode = process.env.NODE_ENV || (env['production'] ? 'production' : null) || 'development';
  const outputFolder = mode === 'production' ? 'dist' : 'dist';
  const conf = {
    mode: `${mode}`,
    target: ['web', 'es5'],
    externals: [
      {
        react: 'react',
      },
    ],
    entry: './src/index.tsx',
    devServer: {
      hot: true,
      contentBase: './dist',
      port: 8080,
      writeToDisk: true,
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, `${outputFolder}`),
      clean: true,
      library: 'reactXarrow',
      libraryTarget: 'umd',
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
          use: ['ts-loader'],
        },
        {
          test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
          use: ['file-loader'],
        },
      ],
    },
  };
  if (mode === 'development') {
    conf['devtool'] = 'inline-source-map';
  }
  return conf;
};
