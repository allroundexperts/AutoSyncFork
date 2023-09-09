const path = require("path");
const RunNodeWebpackPlugin = require("@allroundexperts/run-node-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const commonConfig = {
  entry: "./src/index.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  externals: [nodeExternals()],
  target: "node",
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      fetch: path.join(path.resolve(__dirname, "node_modules"), "whatwg-fetch", "fetch.js"),
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};

const devConfig = {
  ...commonConfig,
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new RunNodeWebpackPlugin({
      scriptToRun: "./dist/bundle.js",
    })
  ],
};

const localConfig = {
  ...commonConfig,
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new RunNodeWebpackPlugin({
      scriptToRun: "./dist/bundle.js",
      processArgs: {
        execArgv:['--inspect-brk']
      }
    })
  ],
};

module.exports = () => {
  switch(process.env.NODE_ENV) {
    case "local":
      return localConfig;
    case "dev":
      return devConfig;
    default:
      return commonConfig;
  }
}
