import serviceRequestHelper from "../helpers/serviceRequest"

test("the regular expression does not have state", () => {
  // Regular expressions with the “g” flag set have internal state, causing
  // multiple calls to  `.test` to return different results.

  const requestNumber = "18-00138559"
  expect(serviceRequestHelper.pattern.test(requestNumber)).toBe(true)
  expect(serviceRequestHelper.pattern.test(requestNumber)).toBe(true)
})
