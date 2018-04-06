const toDate = (apiTimeFormat) => {
  if (!apiTimeFormat) {
    return
  }

  const originalTimezoneOffset = new Date(apiTimeFormat).getTimezoneOffset()
  const date = new Date(apiTimeFormat + originalTimezoneOffset * 60000)

  if (date.getTimezoneOffset() !== originalTimezoneOffset) {
    return new Date(apiTimeFormat + date.getTimezoneOffset() * 60000)
  }
  else {
    return date
  }
}

export default class ServiceRequest {
  constructor(attributes) {
    this.attributes = attributes
  }

  isClosed() { return this.attributes.STATUS_CODE === "CLOSED" }
  number() { return this.attributes.SERVICEREQUESTID }
  type() { return this.attributes.SERVICECODEDESCRIPTION }
  department() { return this.attributes.SERVICETYPECODEDESCRIPTION }
  organization() { return this.attributes.ORGANIZATIONACRONYM }

  requestedAt() { return toDate(this.attributes.SERVICEORDERDATE) }
  dueAt() { return toDate(this.attributes.SERVICEDUEDATE) }
  closedAt() { return toDate(this.attributes.RESOLUTIONDATE) }

  coordinates() { return [ this.attributes.LATITUDE, this.attributes.LONGITUDE ] }
  hasAddress() { return !!this.attributes.STREETADDRESS }
  addressLines() {
    if (this.hasAddress()) {
      return [
        this.attributes.STREETADDRESS,
        `${this.attributes.CITY}, ${this.attributes.STATE} ${this.attributes.ZIPCODE}`
      ]
    }
  }
}
