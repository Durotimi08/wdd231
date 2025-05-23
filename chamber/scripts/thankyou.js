// Thank you page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Get URL parameters
  const params = new URLSearchParams(window.location.search)
  const applicationSummary = document.getElementById("applicationSummary")

  // Create a formatted summary of the application
  if (applicationSummary) {
    // Check if required parameters exist
    if (
      params.has("firstName") &&
      params.has("lastName") &&
      params.has("email") &&
      params.has("phone") &&
      params.has("businessName") &&
      params.has("timestamp")
    ) {
      // Format the timestamp
      const timestamp = new Date(params.get("timestamp"))
      const formattedDate = timestamp.toLocaleDateString()
      const formattedTime = timestamp.toLocaleTimeString()

      // Get membership level text
      let membershipLevel = params.get("membershipLevel")
      switch (membershipLevel) {
        case "np":
          membershipLevel = "NP Membership (Non-profit)"
          break
        case "bronze":
          membershipLevel = "Bronze Membership"
          break
        case "silver":
          membershipLevel = "Silver Membership"
          break
        case "gold":
          membershipLevel = "Gold Membership"
          break
        default:
          membershipLevel = "Not specified"
      }

      // Create HTML for the application summary
      applicationSummary.innerHTML = `
        <div class="summary-item">
          <span class="label">Name:</span>
          <span class="value">${params.get("firstName")} ${params.get("lastName")}</span>
        </div>
        <div class="summary-item">
          <span class="label">Email:</span>
          <span class="value">${params.get("email")}</span>
        </div>
        <div class="summary-item">
          <span class="label">Phone:</span>
          <span class="value">${params.get("phone")}</span>
        </div>
        <div class="summary-item">
          <span class="label">Business:</span>
          <span class="value">${params.get("businessName")}</span>
        </div>
        <div class="summary-item">
          <span class="label">Membership:</span>
          <span class="value">${membershipLevel}</span>
        </div>
        <div class="summary-item">
          <span class="label">Submitted:</span>
          <span class="value">${formattedDate} at ${formattedTime}</span>
        </div>
      `
    } else {
      // If required parameters are missing
      applicationSummary.innerHTML = `
        <p class="error">Error: Missing application information.</p>
        <p>Please return to the <a href="join.html">application form</a> and try again.</p>
      `
    }
  }
})
