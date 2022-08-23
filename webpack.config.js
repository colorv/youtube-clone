const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_PATH = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_PATH + "index.js",
    videoPlayer: BASE_PATH + "videoPlayer.js",
    recorder: BASE_PATH + "recorder.js",
    videoComment: BASE_PATH + "videoComment.js",
  },
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
