import url from "url"
import express from "express"
import humanizeDuration from "humanize-duration"
import DC311 from "./api/dc311"
import serviceRequestHelper from "./helpers/serviceRequest"

const app = express.Router()

app.get("/", (req, res) => res.render("index", {
  requestNumberPattern: serviceRequestHelper.pattern
}))

app.get(serviceRequestHelper.pattern, (req, res, next) => {
  const requestNumber = `${req.params[0]}-${req.params[1]}`

  DC311.getServiceRequest(requestNumber)
    .then((request) => res.render("serviceRequest", {
      request,
      URLSearchParams: url.URLSearchParams,
      humanizeDuration: humanizeDuration.humanizer({
        units: ["y", "mo", "d", "h", "m"],
        round: true
      })
    }))
    .catch((err) => {
      if (err instanceof DC311.ServiceRequestNotFound) {
        res.status(404).render("serviceRequestNotFound", {
          requestNumber,
          requestNumberPattern: serviceRequestHelper.pattern
        })
      }
      else {
        next(err)
      }
    })
})

export default app
