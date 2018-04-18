import progressive from "./lib/progressive"
import pages from "./pages/all"

document.addEventListener("DOMContentLoaded", progressive.enhance)
document.addEventListener("DOMContentLoaded", pages.initialize)
