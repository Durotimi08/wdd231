class ThankYouPage {
  constructor() {
    this.init()
  }

  init() {
    this.displaySubmissionDetails()
    this.setupEventListeners()
  }

  displaySubmissionDetails() {
    const params = new URLSearchParams(window.location.search)
    const summaryContainer = document.getElementById("submissionSummary")

    // Check if we have the required parameters
    if (!params.has("recipeName") || !params.has("submitterName")) {
      summaryContainer.innerHTML = `
        <div class="error-message">
          <p>No submission details found.</p>
          <p><a href="submit.html">Return to submission form</a></p>
        </div>
      `
      return
    }

    // Parse ingredients and instructions
    let ingredients = []
    let instructions = []
    let dietary = []

    try {
      if (params.get("ingredients")) {
        ingredients = JSON.parse(params.get("ingredients"))
      }
    } catch (e) {
      console.warn("Could not parse ingredients")
    }

    try {
      if (params.get("instructions")) {
        instructions = JSON.parse(params.get("instructions"))
      }
    } catch (e) {
      console.warn("Could not parse instructions")
    }

    if (params.get("dietary")) {
      dietary = params
        .get("dietary")
        .split(",")
        .filter((d) => d.trim())
    }

    // Format timestamp
    const timestamp = params.get("timestamp")
    let formattedDate = "Not available"
    let formattedTime = ""

    if (timestamp) {
      try {
        const date = new Date(timestamp)
        formattedDate = date.toLocaleDateString()
        formattedTime = date.toLocaleTimeString()
      } catch (e) {
        console.warn("Could not parse timestamp")
      }
    }

    // Calculate total time
    const prepTime = Number.parseInt(params.get("prepTime")) || 0
    const cookTime = Number.parseInt(params.get("cookTime")) || 0
    const totalTime = prepTime + cookTime

    // Generate summary HTML
    summaryContainer.innerHTML = `
      <div class="submission-summary">
        <div class="recipe-overview">
          <h3>${params.get("recipeName")}</h3>
          <p class="recipe-description">${params.get("description") || "No description provided"}</p>

          <div class="recipe-details">
            <div class="detail-row">
              <span class="label">Cuisine:</span>
              <span class="value">${this.capitalize(params.get("cuisine"))}</span>
            </div>
            <div class="detail-row">
              <span class="label">Meal Type:</span>
              <span class="value">${this.capitalize(params.get("mealType"))}</span>
            </div>
            <div class="detail-row">
              <span class="label">Difficulty:</span>
              <span class="value">${this.capitalize(params.get("difficulty"))}</span>
            </div>
            <div class="detail-row">
              <span class="label">Prep Time:</span>
              <span class="value">${prepTime} minutes</span>
            </div>
            <div class="detail-row">
              <span class="label">Cook Time:</span>
              <span class="value">${cookTime} minutes</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Time:</span>
              <span class="value">${totalTime} minutes</span>
            </div>
            <div class="detail-row">
              <span class="label">Servings:</span>
              <span class="value">${params.get("servings")}</span>
            </div>
            ${dietary.length > 0
        ? `
              <div class="detail-row">
                <span class="label">Dietary:</span>
                <span class="value">${dietary.map((d) => this.capitalize(d)).join(", ")}</span>
              </div>
            `
        : ""
      }
          </div>
        </div>

        ${ingredients.length > 0
        ? `
          <div class="ingredients-summary">
            <h4>Ingredients (${ingredients.length})</h4>
            <ul>
              ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>
        `
        : ""
      }

        ${instructions.length > 0
        ? `
          <div class="instructions-summary">
            <h4>Instructions (${instructions.length} steps)</h4>
            <ol>
              ${instructions.map((instruction) => `<li>${instruction}</li>`).join("")}
            </ol>
          </div>
        `
        : ""
      }

        <div class="submitter-info">
          <h4>Submitted by</h4>
          <div class="detail-row">
            <span class="label">Name:</span>
            <span class="value">${params.get("submitterName")}</span>
          </div>
          <div class="detail-row">
            <span class="label">Email:</span>
            <span class="value">${params.get("submitterEmail")}</span>
          </div>
          <div class="detail-row">
            <span class="label">Submitted:</span>
            <span class="value">${formattedDate} ${formattedTime ? `at ${formattedTime}` : ""}</span>
          </div>
        </div>
      </div>
    `

    // Store submission in localStorage for user's reference
    this.storeSubmission(params)
  }

  setupEventListeners() {
    // Favorites link
    const favoritesLink = document.getElementById("favoritesLink")
    if (favoritesLink) {
      favoritesLink.addEventListener("click", (e) => {
        e.preventDefault()
        window.location.href = "recipes.html?favorites=true"
      })
    }
  }

  storeSubmission(params) {
    try {
      const submissions = JSON.parse(localStorage.getItem("culinaryCanvas_submissions") || "[]")
      const submission = {
        id: Date.now(),
        recipeName: params.get("recipeName"),
        submitterName: params.get("submitterName"),
        submittedAt: params.get("timestamp") || new Date().toISOString(),
        status: "pending",
      }

      submissions.push(submission)

      // Keep only last 10 submissions
      if (submissions.length > 10) {
        submissions.splice(0, submissions.length - 10)
      }

      localStorage.setItem("culinaryCanvas_submissions", JSON.stringify(submissions))
    } catch (error) {
      console.warn("Could not store submission:", error)
    }
  }

  capitalize(str) {
    if (!str) return ""
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}

// Initialize thank you page
document.addEventListener("DOMContentLoaded", () => {
  new ThankYouPage()
})
