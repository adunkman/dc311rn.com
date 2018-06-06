const express = require("express")
const app = express.Router()

if (process.env.NODE_ENV !== "production") {
  const config = require("../config/webpack")
  const webpack = require("webpack")
  const middleware = require("webpack-dev-middleware")

  const compiler = webpack(config)

  app.paths = {
    favicon: `${config.output.publicPath}favicon.png`,
    js: `${config.output.publicPath}client.js`,
    css: `${config.output.publicPath}styles.css`
  }

  app.use(middleware(compiler, {
    logLevel: "warn",
    publicPath: config.output.publicPath
  }))
}
else {
  const manifest = require("../dist/manifest.json")

  app.paths = {
    favicon: `https://assets.dc311rn.com/${manifest["favicon.png"]}`,
    js: `https://assets.dc311rn.com/${manifest["client.js"]}`,
    css: `https://assets.dc311rn.com/${manifest["styles.css"]}`
  }

  app.use("/cloudfront-asset-requests", express.static("dist/", {
    maxAge: 31536000000,
    immutable: true
  }))
}

module.exports = app
