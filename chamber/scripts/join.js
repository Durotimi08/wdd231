// Join page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Set timestamp for the hidden field
  document.getElementById("timestamp").value = new Date().toISOString()

  // Modal functionality
  const modals = document.querySelectorAll(".modal")
  const modalButtons = document.querySelectorAll(".info-btn")
  const closeButtons = document.querySelectorAll(".close-modal")

  // Open modal when button is clicked
  modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("data-modal")
      document.getElementById(modalId).style.display = "block"
    })
  })

  // Close modal when close button is clicked
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".modal").style.display = "none"
    })
  })

  // Close modal when clicking outside the modal content
  window.addEventListener("click", (event) => {
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none"
      }
    })
  })

  // Add animation to membership cards
  const membershipCards = document.querySelectorAll(".membership-card")

  // Delay each card animation slightly for a staggered effect
  membershipCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("animate")
    }, 100 * index)
  })
})
