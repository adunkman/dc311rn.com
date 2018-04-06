import humanizeDuration from "humanize-duration"
import DC311Api from "./api/DC311Api.js"

var serviceRequestNumber = new URL(window.location.href).searchParams.get("serviceRequestNumber");

if (serviceRequestNumber) {
  DC311Api.getServiceRequest(serviceRequestNumber)
    .then(function (r) {
      var status;
      const options = {
        units: ["y", "mo", "d", "h", "m"],
        round: true
      }

      if (r.isClosed()) {
        const duration = humanizeDuration(r.closedAt() - r.requestedAt(), options)
        status = `Closed after ${duration} at ${r.closedAt().toLocaleString()}.`
      }
      else {
        const duration = humanizeDuration(new Date() - r.requestedAt(), options)
        status = `In progress, opened ${duration} ago at ${r.requestedAt().toLocaleString()}.`
      }

      document.querySelector(".js-output").innerHTML = `
        <h1>Service Request ${r.number()}</h1>
        <p>${status}</p>
        <p>Reported to ${r.organization()}, ${r.department()} for ${r.type()}.</p>
        <p>
          ${r.hasAddress() ? r.addressLines().join("<br>") + "<br>" : ""}
          <a href="https://www.google.com/maps/search/?${new URLSearchParams({
            api: 1,
            query: r.coordinates()
          })}" target="_blank" rel="noopener noreferrer">
            <img src="https://maps.googleapis.com/maps/api/staticmap?${new URLSearchParams({
              center: r.coordinates(),
              markers: r.coordinates(),
              size: "600x300",
              zoom: "15"
            })}">
          </a>
        </p>
      `
    })
}
