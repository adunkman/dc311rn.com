const retrieveServiceRequest = (serviceRequestId) => {
  const endpoint = "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/ServiceRequests/MapServer/9/query"
  const params = {
    where: `UPPER(SERVICEREQUESTID) like '%${serviceRequestId}%'`,
    outFields: "*",
    outSR: 4326,
    f: "json"
  }
  const qs = Object
    .keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&")

  return fetch(`${endpoint}?${qs}`)
    .then((response) => response.json())
    .then(({features}) => {
      if (features.length === 0) {
        throw new Error("Service request not found.");
      }
      else if (features.length > 1) {
        throw new Error("More than one service request found.");
      }
      else {
        return features[0].attributes
      }
    })
};

const serviceRequestNumber = new URL(window.location.href).searchParams.get("serviceRequestNumber");

if (serviceRequestNumber) {
  retrieveServiceRequest(serviceRequestNumber)
    .then((serviceRequest) => {
      document.querySelector("pre").innerText = JSON.stringify(serviceRequest, null, 2)
    })
}
