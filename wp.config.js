// this file is to configure webpack
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  // mode development makes the compact file by webpack readable and not minified
  mode: 'production', // you can set it to development later 👴
  entry: './src/index.js', // where to start from. you can change the default to whatever you wish
  plugins: [
    new CleanWebpackPlugin(),
  ],
  output: {
    filename: 'login1.js',
    // resolve an absolute path to the file dist for each user defiantly
    path: path.resolve(__dirname, 'dist') // if you change path end the filename other than the default (dist) it will creat a new one with the new name
  },
  module: {
    rules: [
      {
        test: /\.m?js$/, // if you fined js files
        exclude: /(node_modules|bower_components)/, // ignore node_modules
        use: {
          loader: 'babel-loader', // use babel-loader
          options: {
            presets: ['@babel/preset-env'],
            // plugins: ['@babel/plugin-transform-runtime']
          }
        },
      },
    ]
  },
  // watch: true // to keep watching for saved changes and rebuild
}
