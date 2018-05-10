const express = require("express")
const config = require("../config/webpack")
const app = express.Router()

if (process.env.NODE_ENV !== "production") {
  const webpack = require("webpack")
  const middleware = require("webpack-dev-middleware")

  const compiler = webpack(config)

  app.paths = {
    js: `${config.output.publicPath}client.js`,
    css: `${config.output.publicPath}styles.css`
  }

  app.use(middleware(compiler, {
    logLevel: "warn",
    publicPath: config.output.publicPath
  }))
}
else {
  const manifest = require(`${config.output.path}/manifest.json`)

  app.paths = {
    js: `${config.output.publicPath}${manifest["client.js"]}`,
    css: `${config.output.publicPath}${manifest["styles.css"]}`
  }

  app.use("/cloudfront-asset-requests", express.static("dist/", {
    maxAge: 31536000000,
    immutable: true
  }))
}

module.exports = app
