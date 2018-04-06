import ServiceRequest from "../models/serviceRequest"

const endpoint = "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/ServiceRequests/MapServer/9/query"

export default class DC311Api {
  static getServiceRequest(number) {
    const params = new URLSearchParams({
      where: `UPPER(SERVICEREQUESTID) like '%${number}%'`,
      outFields: "*",
      outSR: 4326,
      f: "json"
    })

    return fetch(`${endpoint}?${params}`)
      .then((response) => response.json())
      .then(({features}) => {
        if (features.length === 0) {
          throw new Error("Service request not found.");
        }
        else if (features.length > 1) {
          throw new Error("More than one service request found.");
        }
        else {
          return new ServiceRequest(features[0].attributes)
        }
      })
  }
}
