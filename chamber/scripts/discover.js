document.addEventListener("DOMContentLoaded", async () => {
  // Handle visit tracking
  handleVisitTracking()

  // Load and display attractions
  await loadAttractions()
})

// Visit tracking functionality
function handleVisitTracking() {
  const visitMessageElement = document.getElementById("visitMessage")
  const lastVisit = localStorage.getItem("lastVisit")
  const currentDate = Date.now()

  let message = ""

  if (!lastVisit) {
    // First visit
    message = "Welcome! Let us know if you have any questions."
  } else {
    // Calculate days between visits
    const daysBetween = Math.floor((currentDate - Number.parseInt(lastVisit)) / (1000 * 60 * 60 * 24))

    if (daysBetween < 1) {
      message = "Back so soon! Awesome!"
    } else if (daysBetween === 1) {
      message = "You last visited 1 day ago."
    } else {
      message = `You last visited ${daysBetween} days ago.`
    }
  }

  // Display the message
  visitMessageElement.innerHTML = `
    <div class="visit-content">
      <p>${message}</p>
      <button class="close-visit-message" onclick="closeVisitMessage()">×</button>
    </div>
  `

  // Store current visit date
  localStorage.setItem("lastVisit", currentDate.toString())
}

// Close visit message
function closeVisitMessage() {
  const visitMessageElement = document.getElementById("visitMessage")
  visitMessageElement.style.display = "none"
}

// Load attractions from JSON
async function loadAttractions() {
  try {
    const response = await fetch("data/attractions.json")
    if (!response.ok) {
      throw new Error("Failed to fetch attractions data")
    }
    const data = await response.json()
    displayAttractions(data.attractions)
  } catch (error) {
    console.error("Error loading attractions:", error)
    document.getElementById("attractionsGrid").innerHTML =
      '<p class="error">Error loading attractions. Please try again later.</p>'
  }
}

// Display attractions in grid
function displayAttractions(attractions) {
  const attractionsGrid = document.getElementById("attractionsGrid")
  attractionsGrid.innerHTML = ""

  attractions.forEach((attraction, index) => {
    const attractionCard = document.createElement("div")
    attractionCard.className = "attraction-card"
    attractionCard.style.gridArea = `card${index + 1}`

    attractionCard.innerHTML = `
      <h2>${attraction.name}</h2>
      <figure>
        <img src="images/attractions/${attraction.image}"
             alt="${attraction.name}"
             loading="lazy">
      </figure>
      <address>${attraction.address}</address>
      <p>${attraction.description}</p>
      <button class="learn-more-btn">Learn More</button>
    `

    attractionsGrid.appendChild(attractionCard)
  })
}
