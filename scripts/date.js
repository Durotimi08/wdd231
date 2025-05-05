// Date functionality for footer
document.addEventListener("DOMContentLoaded", () => {
  // Set current year for copyright
  const currentYearElement = document.getElementById("currentYear")
  const currentYear = new Date().getFullYear()
  currentYearElement.textContent = currentYear

  // Set last modified date
  const lastModifiedElement = document.getElementById("lastModified")
  lastModifiedElement.textContent = `Last Modified: ${document.lastModified}`
})
