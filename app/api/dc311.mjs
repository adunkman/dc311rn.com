import ServiceRequest from "../models/serviceRequest"
import fetch from "node-fetch"
import url from "url"

const URLSearchParams = url.URLSearchParams

const endpoint = "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/ServiceRequests/MapServer/9/query"

class ServiceRequestNotFound extends Error {
  constructor(...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default class DC311 {
  static async getServiceRequest(number) {
    const params = new URLSearchParams({
      where: `UPPER(SERVICEREQUESTID) like '%${number}%'`,
      outFields: "*",
      outSR: 4326,
      f: "json"
    })

    const response = await fetch(`${endpoint}?${params}`)
    const { features } = await response.json()

    if (features.length === 0) {
      throw new ServiceRequestNotFound("No service request was found with that request number.")
    }
    else if (features.length > 1) {
      throw new Error("More than one service request found.");
    }
    else {
      return new ServiceRequest(features[0].attributes)
    }
  }
}

Object.assign(DC311, { ServiceRequestNotFound })
