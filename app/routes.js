import url from "url"
import express from "express"
import humanizeDuration from "humanize-duration"
import DC311 from "./api/dc311"
import serviceRequestHelper from "./helpers/serviceRequest"

const app = express.Router()

app.get("/", (req, res) => res.render("index", {
  requestNumberPattern: serviceRequestHelper.pattern
}))

app.get("/requests/recent", (req, res, next) => {
  DC311.getServiceRequests()
    .then((requests) => res.send(requests.map((r) => r.attributes)))
    .catch(next)
})

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
      if (err instanceof DC311.ServiceRequestNotFoundError) {
        res.status(404).render("serviceRequestNotFound", {
          requestNumber,
          requestNumberPattern: serviceRequestHelper.pattern
        })
      }
      else if (err instanceof DC311.ApiUnavailableError) {
        res.status(500).render("apiError", {
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
