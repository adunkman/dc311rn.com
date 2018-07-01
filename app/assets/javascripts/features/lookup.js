import serviceRequestHelper from "../../../helpers/serviceRequest"

export default class Lookup {
  constructor() {
    if (!(this.form = document.querySelector(".lookup-feature"))) {
      return
    }

    this.form.addEventListener("submit", this.navigateToServiceRequest)
  }

  navigateToServiceRequest(evt) {
    evt.preventDefault()
    const input = evt.currentTarget.querySelector("input[name='serviceRequestNumber']")
    const parts = serviceRequestHelper.pattern.exec(input.value)

    location.assign(`/${parts[1]}-${parts[2]}`)
  }
}
