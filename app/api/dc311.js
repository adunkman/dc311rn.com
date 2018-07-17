import ServiceRequest from "../models/serviceRequest"
import fetch from "node-fetch"
import url from "url"

const URLSearchParams = url.URLSearchParams

const endpoint = "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/ServiceRequests/MapServer/9/query"

class ServiceRequestNotFoundError extends Error {
  constructor(...args) {
    super(...args)
    this.constructor = ServiceRequestNotFoundError
    this.__proto__ = this.constructor.prototype
    Error.captureStackTrace(this, this.constructor)
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
      throw new ServiceRequestNotFoundError("No service request was found with that request number.")
    }
    else if (features.length > 1) {
      throw new Error("More than one service request found.");
    }
    else {
      return new ServiceRequest(features[0].attributes)
    }
  }

  static async getServiceRequests(since) {
    const params = {
      orderByFields: "ADDDATE desc",
      f: "json"
    }

    if (!since) {
      since = new Date()
      since.setDate(since.getDate() - 7)
    }

    const ids = await this.getIds(Object.assign({
      where: `ADDDATE > date '${since.toISOString().split("T")[0]}'`
    }, params))

    const qs = new URLSearchParams(Object.assign({
      objectIds: ids.join(),
      outFields: "*"
    }, params))

    const response = await fetch(`${endpoint}?${qs}`)
    const { features } = await response.json()

    return features.map((f) => new ServiceRequest(f.attributes))
  }

  static async getIds(options) {
    const params = new URLSearchParams(Object.assign({
      returnIdsOnly: true
    }, options))

    const response = await fetch(`${endpoint}?${params}`)
    const { objectIds } = await response.json()

    return objectIds.slice(0, 10)
  }
}

Object.assign(DC311, { ServiceRequestNotFoundError })
