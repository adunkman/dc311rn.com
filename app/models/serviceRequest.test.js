import "sepia"
import DC311 from "../api/dc311"
import ServiceRequest from "./serviceRequest"

it("parses a closed service request correctly", () => {
  expect.hasAssertions()

  return DC311.getServiceRequest("18-00163260").then((sr) => {
    expect(sr.isClosed).toBe(true)
    expect(sr.number).toBe("18-00163260")
    expect(sr.type).toBe("Bulk Collection")
    expect(sr.department).toBe("SWMA- Solid Waste Management Admistration")
    expect(sr.organization).toBe("DPW")
    expect(sr.hasDetails).toBe(true)
    expect(sr.details).toBe("rm - Collected – Close SR")

    expect(sr.latitude).toBe(38.86591298)
    expect(sr.longitude).toBe(-76.98646695)
    expect(sr.coordinates).toEqual([38.86591298, -76.98646695])
    expect(sr.hasAddress).toBe(true)
    expect(sr.addressLines).toEqual(["1327 U STREET SE", "WASHINGTON, DC 20020"])
  })
})

it("does not throw error when trying to access closedAt on an open service request", () => {
  expect.hasAssertions()

  return DC311.getServiceRequest("18-00331261").then((sr) => {
    expect(sr.isClosed).toBe(false)
    expect(sr.closedAt).toBeUndefined()
  })
})

it("does not throw error when trying to access addressLines on a service request without an address", () => {
  expect.hasAssertions()

  return DC311.getServiceRequest("18-00330566").then((sr) => {
    expect(sr.hasAddress).toBe(false)
    expect(sr.addressLines).toBeUndefined()
  })
})

it("adjusts timestamps due to incorrect date format in DC311’s API", () => {
  // DC311 sends timestamps in UTC according to the time format, but they’re
  // actually in US Eastern — so we need to adjust the timestamps for them to be
  // parsed correctly.
  expect.hasAssertions()

  return DC311.getServiceRequest("18-00163260").then((sr) => {
    expect(sr.requestedAt.getTime()).toBe(Date.parse("2018-04-02T12:52:49.000Z"))
    expect(sr.dueAt.getTime()).toBe(Date.parse("2018-04-19T21:00:00.000Z"))
    expect(sr.closedAt.getTime()).toBe(Date.parse("2018-04-11T12:38:16.000Z"))
  })
})
