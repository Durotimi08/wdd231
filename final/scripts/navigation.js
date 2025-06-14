document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn")
  const primaryNav = document.getElementById("primaryNav")
  const favoritesCountElement = document.getElementById("headerFavoritesCount")

  // Toggle menu when hamburger button is clicked
  hamburgerBtn.addEventListener("click", () => {
    const isOpen = primaryNav.classList.contains("open")

    primaryNav.classList.toggle("open")

    // Update button text and aria-expanded
    hamburgerBtn.textContent = isOpen ? "☰ MENU" : "✕ CLOSE"
    hamburgerBtn.setAttribute("aria-expanded", !isOpen)
  })

  // Close menu when window is resized to larger view
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      primaryNav.classList.remove("open")
      hamburgerBtn.textContent = "☰ MENU"
      hamburgerBtn.setAttribute("aria-expanded", "false")
    }
  })

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest("nav") && primaryNav.classList.contains("open")) {
      primaryNav.classList.remove("open")
      hamburgerBtn.textContent = "☰ MENU"
      hamburgerBtn.setAttribute("aria-expanded", "false")
    }
  })

  // Add smooth scroll effect when clicking nav links
  const navLinks = document.querySelectorAll("nav a")
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      // Close mobile menu when link is clicked
      if (primaryNav.classList.contains("open")) {
        primaryNav.classList.remove("open")
        hamburgerBtn.textContent = "☰ MENU"
        hamburgerBtn.setAttribute("aria-expanded", "false")
      }

      // Add click animation
      link.style.transform = "scale(0.95)"
      setTimeout(() => {
        link.style.transform = ""
      }, 150)
    })
  })

  // Header search functionality
  const headerSearch = document.getElementById("headerSearch")
  const headerSearchBtn = document.getElementById("headerSearchBtn")

  if (headerSearch && headerSearchBtn) {
    const handleHeaderSearch = () => {
      const searchTerm = headerSearch.value.trim()
      if (searchTerm) {
        window.location.href = `recipes.html?search=${encodeURIComponent(searchTerm)}`
      }
    }

    headerSearchBtn.addEventListener("click", handleHeaderSearch)
    headerSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleHeaderSearch()
      }
    })
  }

  // Favorites count functionality
  if (favoritesCountElement) {
    // Add click handler to go to favorites (only once)
    favoritesCountElement.addEventListener("click", () => {
      window.location.href = "recipes.html?favorites=true"
    })

    // Update favorites count
    const updateFavoritesCount = () => {
      const favorites = JSON.parse(localStorage.getItem("culinaryCanvas_favorites") || "[]")
      favoritesCountElement.textContent = `❤️ ${favorites.length}`

      // Add visual feedback when count changes
      favoritesCountElement.classList.add('favorites-updated')
      setTimeout(() => {
        favoritesCountElement.classList.remove('favorites-updated')
      }, 300)
    }

    // Update favorites count on page load
    updateFavoritesCount()

    // Listen for favorites changes
    window.addEventListener("favoritesChanged", updateFavoritesCount)

    // Listen for changes from other tabs
    window.addEventListener("storage", (e) => {
      if (e.key === "culinaryCanvas_favorites") {
        updateFavoritesCount()
      }
    })
  }

  // Initialize hamburger button text
  hamburgerBtn.textContent = "☰ MENU"
  hamburgerBtn.setAttribute("aria-expanded", "false")
})
