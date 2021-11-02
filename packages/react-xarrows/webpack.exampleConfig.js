const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, './examples/public/index.html'),
  filename: './index.html',
});

module.exports = (env) => {
  return {
    name: 'example',
    mode: 'development',
    externals: [
      {
        react: 'react',
      },
    ],
    entry: path.join(__dirname, './examples/src/index.tsx'),
    devServer: {
      hot: true,
      port: 3000,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', 'jsx'],
    },
    plugins: [htmlWebpackPlugin],
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
          use: { loader: 'ts-loader', options: { compilerOptions: { noEmit: false } } },
        },
        {
          test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
          use: ['file-loader'],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  };
};
