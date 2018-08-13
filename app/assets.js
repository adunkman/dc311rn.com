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

  app.use("/assets", express.static("dist/", {
    maxAge: 31536000000,
    immutable: true
  }))
}

module.exports = app
