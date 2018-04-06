var retrieveServiceRequest = function (serviceRequestId) {
  var endpoint = "https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/ServiceRequests/MapServer/9/query"
  var params = {
    where: "UPPER(SERVICEREQUESTID) like '%" + serviceRequestId + "%'",
    outFields: "*",
    outSR: 4326,
    f: "json"
  }
  var qs = Object
    .keys(params)
    .map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) })
    .join("&")

  return fetch(endpoint + "?" + qs)
    .then(function (response) { return response.json() })
    .then(function (body) {
      var features = body.features

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

var serviceRequestNumber = new URL(window.location.href).searchParams.get("serviceRequestNumber");

if (serviceRequestNumber) {
  retrieveServiceRequest(serviceRequestNumber)
    .then(function (serviceRequest) {
      document.querySelector("pre").innerText = JSON.stringify(serviceRequest, null, 2)
    })
}
