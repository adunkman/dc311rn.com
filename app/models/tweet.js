import serviceRequestHelper from "../helpers/serviceRequest"

export default class Tweet {
  constructor(attributes) {
    this.attributes = attributes
  }

  get id() { return this.attributes.id_str }
  get text() { return this.attributes.full_text }
  get inReplyToTweet() { return this.attributes.in_reply_to_status_id_str }
  get hasServiceRequestNumber() { return serviceRequestHelper.pattern.test(this.text) }
  get createdAt() { return new Date(Date.parse(this.attributes.created_at)) }
  get serviceRequestNumbers() {
    const numbers = []
    const pattern = new RegExp(serviceRequestHelper.pattern, "g")
    let matches

    while (matches = pattern.exec(this.text)) {
      numbers.push(`${matches[1]}-${matches[2]}`)
    }

    return numbers
  }
}
