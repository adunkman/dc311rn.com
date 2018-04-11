import humanizeDuration from "humanize-duration"
import DC311Api from "./api/DC311Api.js"
import "./index.scss"

const serviceRequestNumberMatch = /\d{2}-\d{8}/.exec(window.location.href)
const output = document.body

if (serviceRequestNumberMatch) {
  DC311Api.getServiceRequest(serviceRequestNumberMatch[0])
    .then(function (r) {
      var status;
      var address = "";
      const options = {
        units: ["y", "mo", "d", "h", "m"],
        round: true
      }

      if (r.isClosed()) {
        const duration = humanizeDuration(r.closedAt() - r.requestedAt(), options)
        status = `<time datetime="${r.closedAt().toISOString()}" title="${r.closedAt().toLocaleString()}">${duration}</time> from request to completion.`
      }
      else {
        const duration = humanizeDuration(new Date() - r.requestedAt(), options)
        status = `<time datetime="${r.requestedAt().toISOString()}" title="${r.requestedAt().toLocaleString()}">${duration}</time> since request was opened.`
      }

      if (r.hasAddress()) {
        address = `
          <div class="section address with-icon">
            <div class="icon">📍</div>
            <div>${r.addressLines().join("<br>")}</div>
          </div>
        `
      }

      output.innerHTML = `
        <div class="service-request">
          <h1>${r.number()}</h1>

          <div class="section status-graphic ${r.isClosed() ? "is-completed" : ""}">
            <div class="status-graphic-section requested">Requested</div>
            <div class="status-graphic-section completed">Completed</div>
          </div>

          <div class="section status-text with-icon">
            <div class="icon">⏱</div>
            <div>${status}</div>
          </div>

          <div class="section request-type with-icon">
            <div class="icon">🧐</div>
            <div>
              <div class="request-type">${r.type()}</div>
              <div class="assignee">${r.organization()}, ${r.department()}</div>
            </div>
          </div>

          ${address}

          <div class="section map">
            <a href="https://www.google.com/maps/search/?${new URLSearchParams({
              api: 1,
              query: r.coordinates()
            })}" target="_blank" rel="noopener noreferrer">
              <img src="https://maps.googleapis.com/maps/api/staticmap?${new URLSearchParams({
                center: r.coordinates(),
                markers: r.coordinates(),
                size: "600x300",
                key: "AIzaSyBKs9MlfH-bo1lPMx5zS7u8gjDujY3vXO8",
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
    <h1>DC 311 Service Request Lookup</h1>

    <div class="section form">
      <form>
        <label for="serviceRequestNumber">Service Request Number</label>
        <input type="text" name="serviceRequestNumber" placeholder="18-00138559" id="serviceRequestNumber">
        <button>Search</button>
      </form>
    </div>

    <div class="section about">
      <h2>What is this?</h2>

      <p>
        DC’s <a href="https://311.dc.gov" target="_blank" rel="noopener noreferrer">311 service</a> doesn’t allow looking up service requests without knowing the original requester’s email address. This is problematic for service requests filed via Twitter, since they do not have email addresses — and therefore it’s difficult to lookup their statuses.
      </p>

      <p>
        However, DC also publishes 311 data through it’s <a href="http://opendata.dc.gov/" target="_blank" rel="noopener noreferrer">Open Data Portal</a>, which includes 311 request information in realtime. This website allows you to access that data quickly to check on the status of service requests you may be interested in.
      </p>

      <h2>How can I help?</h2>

      <p>
        If you spot an issue or you have an idea of how to make this site better, head to <a href="https://github.com/adunkman/dc311rn.com" target="_blank" rel="noopener noreferrer">GitHub</a> and open an issue. Issues and pull requests are welcome! Thanks for helping make DC a better place. ❤️
      </p>
    </div>
  `

  document.querySelector("form").addEventListener("submit", (event) => {
    if (window.location.href.indexOf("localhost") === -1) {
      event.preventDefault()
      window.location.href = `/${document.getElementById("serviceRequestNumber").value}`
    }
  })
}
