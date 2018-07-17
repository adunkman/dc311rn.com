import "sepia"
import DC311 from "./dc311"
import ServiceRequest from "../models/serviceRequest"

describe("getServiceRequest", () => {
  test("a service request which does not exist throws ServiceRequestNotFound", () => {
    expect.hasAssertions()

    return DC311.getServiceRequest("18-00163257").catch((err) => {
      expect(err.toString()).toMatch("No service request was found")
      //expect(err).toBeInstanceOf(DC311.ServiceRequestNotFound)
    })
  })

  test("if more than one service request is found, it returns an error", () => {
    expect.hasAssertions()

    return DC311.getServiceRequest("18-0016325").catch((err) => {
      expect(err.toString()).toMatch("More than one service request found")
    })
  })

  test("it returns a ServiceRequest object", () => {
    expect.hasAssertions()

    return DC311.getServiceRequest("18-00163260").then((obj) => {
      expect(obj).toBeInstanceOf(ServiceRequest)
    })
  })
})

describe("getServiceRequests", () => {
  test("it returns 10 service requests", () => {
    expect.hasAssertions()

    return DC311.getServiceRequests(new Date(1531771015504)).then((objs) => {
      expect(objs).toHaveLength(10)
    })
  })
})
