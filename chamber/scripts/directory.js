// Directory page functionality
document.addEventListener("DOMContentLoaded", async () => {
  // DOM elements
  const gridBtn = document.getElementById("gridBtn")
  const listBtn = document.getElementById("listBtn")
  const membersContainer = document.getElementById("members-container")

  // Add Material Icons for view toggle buttons
  const linkElement = document.createElement("link")
  linkElement.rel = "stylesheet"
  linkElement.href = "https://fonts.googleapis.com/icon?family=Material+Icons"
  document.head.appendChild(linkElement)

  // Event listeners for view toggle
  gridBtn.addEventListener("click", () => {
    membersContainer.className = "grid"
    gridBtn.classList.add("active")
    listBtn.classList.remove("active")
  })

  listBtn.addEventListener("click", () => {
    membersContainer.className = "list"
    listBtn.classList.add("active")
    gridBtn.classList.remove("active")
  })

  // Fetch member data from JSON file
  try {
    const response = await fetch("data/members.json")
    if (!response.ok) {
      throw new Error("Failed to fetch member data")
    }
    const data = await response.json()
    displayMembers(data.members)
  } catch (error) {
    console.error("Error loading member data:", error)
    membersContainer.innerHTML = '<p class="error">Error loading member data. Please try again later.</p>'
  }

  // Function to display members
  function displayMembers(members) {
    membersContainer.innerHTML = ""

    members.forEach((member) => {
      const memberCard = document.createElement("div")
      memberCard.className = "member-card"

      // Determine membership level text
      let levelText = "Member"
      let levelClass = "level-1"

      if (member.membershipLevel === 2) {
        levelText = "Silver Member"
        levelClass = "level-2"
      } else if (member.membershipLevel === 3) {
        levelText = "Gold Member"
        levelClass = "level-3"
      }

      // Create HTML structure based on current view
      if (membersContainer.className === "list") {
        memberCard.innerHTML = `
                    <img src="images/${member.image}" alt="${member.name} logo">
                    <div class="member-details">
                        <h3>${member.name}</h3>
                        <p>${member.address}</p>
                        <p>${member.phone}</p>
                        <a href="${member.website}" class="website" target="_blank">Website</a>
                        <span class="member-level ${levelClass}">${levelText}</span>
                    </div>
                `
      } else {
        memberCard.innerHTML = `
                    <img src="images/${member.image}" alt="${member.name} logo">
                    <h3>${member.name}</h3>
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <a href="${member.website}" class="website" target="_blank">Website</a>
                    <div>
                        <span class="member-level ${levelClass}">${levelText}</span>
                    </div>
                `
      }

      membersContainer.appendChild(memberCard)
    })
  }
})
