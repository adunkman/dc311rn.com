const path = require("path")
const ExtractCssPlugin = require("mini-css-extract-plugin")
const AssetsManifest = require("webpack-assets-manifest")

const isProduction = process.env.NODE_ENV === "production"

module.exports = {
  entry: {
    client: "./app/assets/javascripts/client.mjs",
    styles: "./app/assets/stylesheets/styles.scss"
  },
  mode: isProduction ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          ExtractCssPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new ExtractCssPlugin({
      filename: isProduction ? "[name].[hash].css" : "[name].css"
    }),
    new AssetsManifest()
  ],
  output: {
    path: path.resolve("dist"),
    publicPath: isProduction ? "https://assets.dc311rn.com/" : "/assets/",
    filename: isProduction ? "[name].[hash].js" : "[name].js"
  }
}
