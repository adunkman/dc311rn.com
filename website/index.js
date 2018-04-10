import humanizeDuration from "humanize-duration"
import DC311Api from "./api/DC311Api.js"
import "./index.scss"

const serviceRequestNumber = new URL(window.location.href).searchParams.get("serviceRequestNumber")
const output = document.body

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
        status = `Completed after <time datetime="${r.closedAt().toISOString()}" title="${r.closedAt().toLocaleString()}">${duration}</time>.`
      }
      else {
        const duration = humanizeDuration(new Date() - r.requestedAt(), options)
        status = `In progress for <time datetime="${r.requestedAt().toISOString()}" title="${r.requestedAt().toLocaleString()}">${duration}</time>.`
      }

      output.innerHTML = `
        <div class="service-request">
          <h1>${r.number()}</h1>

          <div class="section status-graphic ${r.isClosed() ? "is-completed" : ""}">
            <div class="status-graphic-section requested">Requested</div>
            <div class="status-graphic-section completed">Completed</div>
          </div>

          <div class="section status-text">
            ${status}
          </div>

          <div class="section request-type">
            <div class="request-type">${r.type()}</div>
            <div class="assignee">${r.organization()}, ${r.department()}</div>
          </div>

          <div class="section map">
            ${r.hasAddress() ? '<div class="address">' + r.addressLines().join("<br>") + "</div>" : ""}

            <a href="https://www.google.com/maps/search/?${new URLSearchParams({
              api: 1,
              query: r.coordinates()
            })}" target="_blank" rel="noopener noreferrer">
              <img src="https://maps.googleapis.com/maps/api/staticmap?${new URLSearchParams({
                center: r.coordinates(),
                markers: r.coordinates(),
                size: "600x300",
                scale: 2,
                zoom: 15
              })}">
            </a>
          </div>

          <div class="section home">
            <a href="/">Find Another Service Request</a>
          </div>
        </div>
      `
    })
}
else {
  output.innerHTML = `
    <form>
      <input type="text" name="serviceRequestNumber" placeholder="18-00138559">
      <button>Search</button>
    </form>
  `
}
