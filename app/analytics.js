import express from "express"
import bunyan from "bunyan"
import ua from "universal-analytics"

const app = express.Router()
const logger = bunyan.createLogger({ name: "Analytics" })
const key = process.env.GOOGLE_ANALYTICS_TRACKING_ID

if (key) {
  app.use((req, res, next) => {
    req.analytics = ua(key)
    req.analytics.pageview({
      anonymizeIp: true,
      dataSource: "server",
      ipOverride: req.connection.remoteAddress,
      userAgentOverride: req.get("user-agent"),
      documentReferrer: req.get("referer"),
      documentHostName: "https://www.dc311rn.com",
      documentPath: req.originalUrl,
      applicationName: "dc311rn-web",
      applicationVersion: process.env.HEROKU_SLUG_COMMIT,
    }, (err) => {
      if (err) {
        logger.error(err)
      }
    })
    next()
  })
}
else {
  logger.info("No configuration found, requests will not be reported to analytics.")
}

export default app
