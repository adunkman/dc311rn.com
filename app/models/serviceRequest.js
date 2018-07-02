import timezone from "timezone"
import tzdata from "timezone/America/New_York"

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
  }

  get isClosed() { return this.attributes.STATUS_CODE === "CLOSED" }
  get number() { return this.attributes.SERVICEREQUESTID }
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
}
