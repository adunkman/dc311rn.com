import humanizeDuration from "humanize-duration"
import ServiceRequest from "../../../models/serviceRequest"

const oneHourInMilliseconds = 3600000

export default class Lookup {
  constructor() {
    if (!(this.container = document.querySelector(".outdated-feature"))) {
      return
    }

    this.fetchAndRender()
  }

  async fetchAndRender() {
    const response = await fetch("/requests/recent")
    const body = await response.json()
    this.render(new ServiceRequest(body[0]))
  }

  render(request) {
    const timeSinceLastRequest = new Date() - request.requestedAt;

    if (timeSinceLastRequest > oneHourInMilliseconds) {
      this.container.hidden = false
      this.container.innerHTML = `
        <details>
          <summary><strong>DC’s 311 OpenData database appears to be outdated.</strong></summary>

          <p>It has been longer than usual since the last service request has been added — they are typically added every few minutes, but it has been <strong>${humanizeDuration(timeSinceLastRequest, { units: ["y", "mo", "d", "h", "m"], round: true })}</strong> since the last new service request.</p>

          <p>This doesn’t mean there’s anything wrong with 311 — we as citizens have access to a different database than the one that is internally used by 311 in order to protect the privacy of those requesting city services. Sometimes it seems to lag behind — and it means that the data you see on this website is out of date.</p>

          <p>If you know the email address associated with your service request, you can look it up directly in <a href="https://311.dc.gov" target="_blank" rel="noopener noreferrer">311’s database</a>.</p>
        </details>
      `
    }
  }
}
