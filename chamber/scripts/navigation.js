// Responsive navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn")
  const primaryNav = document.getElementById("primaryNav")

  // Toggle menu when hamburger button is clicked
  hamburgerBtn.addEventListener("click", () => {
    primaryNav.classList.toggle("open")
    hamburgerBtn.textContent = primaryNav.classList.contains("open") ? "✕" : "☰"
  })

  // Close menu when window is resized to larger view
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      primaryNav.classList.remove("open")
      hamburgerBtn.textContent = "☰"
    }
  })
})
