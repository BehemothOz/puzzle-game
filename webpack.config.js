const path = require('path');
const outputPath = path.join(__dirname, '/public');

module.exports = {
  entry: './src/main.js',
  output: {
    path: outputPath,
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: outputPath,
    port: 5555,
    compress: true,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }]
      }
    ]
  }
}