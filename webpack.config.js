const path = require("path")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const outputDirectory = "website_dist"

module.exports = {
  entry: "./website/index.js",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: "index.[hash].js"
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, outputDirectory)]),
    new HtmlWebpackPlugin({template: path.resolve(__dirname, "website", "index.html")})
  ]
}
