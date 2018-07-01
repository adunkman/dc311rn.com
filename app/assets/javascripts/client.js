import progressive from "./lib/progressive"
import LookupFeature from "./features/lookup"
import OutdatedFeature from "./features/outdated"

document.addEventListener("DOMContentLoaded", () => {
  progressive.enhance()
  new LookupFeature()
  new OutdatedFeature()
})
