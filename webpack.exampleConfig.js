const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'src/index.html'),
  filename: './index.html',
});

module.exports = (env) => {
  return {
    name: 'example',
    mode: 'development',
    target: ['web'],
    externals: [
      {
        react: 'react',
      },
    ],
    entry: './src/examples/src/index.jsx',
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
          use: ['ts-loader'],
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
