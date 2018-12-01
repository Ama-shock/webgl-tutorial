
module.exports = {
    entry: './demo/app.ts',
    output: {
      path: __dirname
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader'
        },
        {
          test: /\.js$/,
          use: 'script-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.ts']
    }
};
