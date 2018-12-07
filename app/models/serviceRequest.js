import timezone from "timezone"
import tzdata from "timezone/America/New_York"
import services from "../../db/static/services"

const tz = timezone(tzdata)

// Unfortunately, the DC311 API gives unix timestamps that are not in UTC — they
// represent the time in either EST or EDT, depending on the time of year.
const toDate = (localizedUnixTimestamp) => {
  if (!localizedUnixTimestamp) {
    return
  }

  const isoTimestampWithoutTimezone = new Date(localizedUnixTimestamp).toISOString().split("Z")[0]
  const unixTimestamp = tz(isoTimestampWithoutTimezone, "America/New_York")

  return new Date(unixTimestamp)
}

export default class ServiceRequest {
  constructor(attributes) {
    this.attributes = attributes
    this.service = services.find((s) => {
      return (
        s.agency === this.organization &&
        s.service_code === this.code &&
        s.service_name === this.type
      )
    })
  }

  get isClosed() { return this.attributes.STATUS_CODE === "CLOSED" }
  get number() { return this.attributes.SERVICEREQUESTID }
  get code() { return this.attributes.SERVICECODE }
  get type() { return this.attributes.SERVICECODEDESCRIPTION }
  get department() { return this.attributes.SERVICETYPECODEDESCRIPTION }
  get organization() { return this.attributes.ORGANIZATIONACRONYM }
  get hasDetails() { return !!this.details }
  get details() { return this.attributes.DETAILS }

  get requestedAt() { return toDate(this.attributes.SERVICEORDERDATE) }
  get dueAt() { return toDate(this.attributes.SERVICEDUEDATE) }
  get closedAt() { return toDate(this.attributes.RESOLUTIONDATE) }

  get latitude() { return this.attributes.LATITUDE }
  get longitude() { return this.attributes.LONGITUDE }
  get coordinates() { return [ this.latitude, this.longitude ] }
  get hasAddress() { return !!this.attributes.STREETADDRESS }
  get addressLines() {
    if (this.hasAddress) {
      return [
        this.attributes.STREETADDRESS,
        `${this.attributes.CITY}, ${this.attributes.STATE} ${this.attributes.ZIPCODE}`
      ]
    }
  }

  get hasEstimate() { return this.service && this.service.sla }
  get estimate() {
    if (this.hasEstimate) {
      return `${this.service.sla} ${this.service.sla_type}`.toLowerCase()
    }
  }
}
