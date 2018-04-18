import express from "express"
import helmet from "helmet"
import logger from "express-bunyan-logger"
import layouts from "express-ejs-layouts"

import routes from "./app/routes"
import assets from "./app/assets"

const isProduction = process.env.NODE_ENV === "production"
const app = express()

app.set("views", "app/views")
app.set("view engine", "ejs")
app.set("layout", "layouts/default")
app.locals.assets = assets.paths

app.use(logger())

app.use(helmet())
app.use(helmet.noCache())
app.use(helmet.referrerPolicy({ policy: "same-origin" }))
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'none'"],
    styleSrc: isProduction ? ["https://assets.dc311rn.com"] : ["'self'"],
    scriptSrc: isProduction ? ["https://assets.dc311rn.com"] : ["'self'", "'unsafe-eval'"],
    imgSrc: ["https://maps.googleapis.com"],
    upgradeInsecureRequests: isProduction
  },
  browserSniff: false
}))

app.use(assets)
app.use(layouts)
app.use(routes)

app.listen(process.env.PORT || 8080)
