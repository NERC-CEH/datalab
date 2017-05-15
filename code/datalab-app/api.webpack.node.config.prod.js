import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import path from 'path';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
};

export default {
  bail: true,
  devtool: 'source-map',
  entry: './src/api/api.js',
  target: 'node',
  output: {
    path: path.join(__dirname, '/dist/api'),
    publicPath: '/',
    filename: 'server.js',
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.UglifyJsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src/api'),
        loader: 'babel-loader',
      },
    ],
  },
  externals: [
    nodeExternals(),
  ],
};
