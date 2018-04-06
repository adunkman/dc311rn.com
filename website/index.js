import DC311Api from "./api/DC311Api.js"

var serviceRequestNumber = new URL(window.location.href).searchParams.get("serviceRequestNumber");

if (serviceRequestNumber) {
  DC311Api.getServiceRequest(serviceRequestNumber)
    .then(function (r) {
      var status;

      if (r.isClosed()) {
        status = `Closed at ${r.closedAt().toLocaleString()}.`
      }
      else {
        status = `In progress, opened at ${r.requestedAt().toLocaleString()}.`
      }

      document.querySelector(".js-output").innerHTML = `
        <h1>Service Request ${r.number()}</h1>
        <p>${status}</p>
        <p>Reported to ${r.organization()}, ${r.department()} for ${r.type()}.</p>
        <p>
          ${r.hasAddress() ? r.addressLines().join("<br>") + "<br>" : ""}
          <img src="https://maps.googleapis.com/maps/api/staticmap?${new URLSearchParams({
            center: r.coordinates(),
            markers: r.coordinates(),
            size: "600x300",
            zoom: "13"
          })}">
      `
    })
}
