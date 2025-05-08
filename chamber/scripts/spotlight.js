// Business spotlight functionality for home page
document.addEventListener("DOMContentLoaded", async () => {
  // DOM elements
  const spotlightContainer = document.getElementById("spotlight-container")

  // Function to fetch member data
  async function fetchMembers() {
    try {
      const response = await fetch("data/members.json")
      if (!response.ok) {
        throw new Error("Failed to fetch member data")
      }
      const data = await response.json()
      return data.members
    } catch (error) {
      console.error("Error loading member data:", error)
      spotlightContainer.innerHTML = '<p class="error">Error loading member data. Please try again later.</p>'
      return []
    }
  }

  // Function to filter gold and silver members
  function filterPremiumMembers(members) {
    return members.filter((member) => member.membershipLevel >= 2) // Level 2 (silver) or 3 (gold)
  }

  // Function to randomly select members for spotlight
  function selectRandomMembers(members, count) {
    // Shuffle array
    const shuffled = [...members]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Return the first 'count' members
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  // Function to display spotlight members
  function displaySpotlights(members) {
    spotlightContainer.innerHTML = ""

    members.forEach((member) => {
      const spotlight = document.createElement("div")
      spotlight.className = "spotlight-card"

      // Determine membership level text
      const levelText = member.membershipLevel === 3 ? "Gold Member" : "Silver Member"
      const levelClass = member.membershipLevel === 3 ? "level-3" : "level-2"

      spotlight.innerHTML = `
        <img src="images/${member.image}" alt="${member.name} logo" class="spotlight-logo">
        <h3>${member.name}</h3>
        <p class="spotlight-desc">${member.description}</p>
        <hr>
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <a href="${member.website}" class="spotlight-link" target="_blank">Visit Website</a>
        <span class="member-level ${levelClass}">${levelText}</span>
      `

      spotlightContainer.appendChild(spotlight)
    })
  }

  // Main function to load and display spotlights
  async function loadSpotlights() {
    const allMembers = await fetchMembers()
    const premiumMembers = filterPremiumMembers(allMembers)

    // Determine how many spotlights to show (2 or 3 based on screen size)
    const spotlightCount = window.innerWidth >= 1024 ? 3 : 2

    const selectedMembers = selectRandomMembers(premiumMembers, spotlightCount)
    displaySpotlights(selectedMembers)
  }

  // Load spotlights initially
  await loadSpotlights()

  // Refresh spotlights when window is resized between breakpoints
  let previousWidth = window.innerWidth
  window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth
    const breakpoint = 1024

    // Check if we've crossed the breakpoint
    if (
      (previousWidth < breakpoint && currentWidth >= breakpoint) ||
      (previousWidth >= breakpoint && currentWidth < breakpoint)
    ) {
      loadSpotlights()
    }

    previousWidth = currentWidth
  })
})
