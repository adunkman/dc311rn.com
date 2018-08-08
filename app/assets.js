const express = require("express")
const app = express.Router()

const isStaging = process.env.NODE_ENV === "staging"
const isProduction = process.env.NODE_ENV === "production"
const isDevelopment = !isStaging && !isProduction

if (isDevelopment) {
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
  const path = isProduction ? "https://assets.dc311rn.com" : "/assets"

  app.paths = {
    favicon: `${path}/${manifest["favicon.png"]}`,
    js: `${path}/${manifest["client.js"]}`,
    css: `${path}/${manifest["styles.css"]}`
  }

  const middleware = express.static("dist/", {
    maxAge: 31536000000,
    immutable: true
  })

  app.use("/assets", middleware)

  // Transition from cloudfront-* path to assets to simplify staging setup.
  // Once cloudfront configuration has fully propogated, this path can be removed.
  app.use("/cloudfront-asset-requests", middleware)
}

module.exports = app
