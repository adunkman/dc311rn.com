const path = require("path")
const ExtractCssPlugin = require("mini-css-extract-plugin")
const AssetsManifest = require("webpack-assets-manifest")

const isStaging = process.env.NODE_ENV === "staging"
const isProduction = process.env.NODE_ENV === "production"
const isDevelopment = !isStaging && !isProduction

module.exports = {
  entry: {
    favicon: "./app/assets/images/favicon.png",
    client: "./app/assets/javascripts/client.js",
    styles: "./app/assets/stylesheets/styles.scss"
  },
  mode: !isDevelopment ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          ExtractCssPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: !isDevelopment ? "[name].[hash].[ext]" : "[name].[ext]"
            }
          },
          "image-webpack-loader"
        ]
      }
    ]
  },
  plugins: [
    new ExtractCssPlugin({
      filename: !isDevelopment ? "[name].[hash].css" : "[name].css"
    }),
    new AssetsManifest()
  ],
  output: {
    path: path.resolve("dist"),
    publicPath: isProduction ? "https://assets.dc311rn.com/" : "/assets/",
    filename: !isDevelopment ? "[name].[hash].js" : "[name].js"
  }
}
