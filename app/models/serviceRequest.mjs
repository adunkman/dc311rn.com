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

  get isClosed() { return this.attributes.STATUS_CODE === "CLOSED" }
  get number() { return this.attributes.SERVICEREQUESTID }
  get type() { return this.attributes.SERVICECODEDESCRIPTION }
  get department() { return this.attributes.SERVICETYPECODEDESCRIPTION }
  get organization() { return this.attributes.ORGANIZATIONACRONYM }

  get requestedAt() { return toDate(this.attributes.SERVICEORDERDATE) }
  get dueAt() { return toDate(this.attributes.SERVICEDUEDATE) }
  get closedAt() { return toDate(this.attributes.RESOLUTIONDATE) }

  get coordinates() { return [ this.attributes.LATITUDE, this.attributes.LONGITUDE ] }
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
