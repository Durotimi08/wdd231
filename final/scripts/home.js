// Home page functionality
import { RecipeAPI } from "./utils/api.js"
import { StorageManager } from "./utils/storage.js"

// Make StorageManager available globally for modal
window.StorageManager = StorageManager

class HomePage {
  constructor() {
    this.recipes = []
    this.init()
  }

  async init() {
    try {
      await this.loadRecipes()
      this.setupEventListeners()
      this.displayFeaturedRecipes()
      this.updateStats()
    } catch (error) {
      console.error("Error initializing home page:", error)
      this.showError("Failed to load recipes. Please refresh the page.")
    }
  }

  async loadRecipes() {
    this.recipes = await RecipeAPI.fetchRecipes()
  }

  setupEventListeners() {
    // Quick search functionality
    const quickSearch = document.getElementById("quickSearch")
    const searchBtn = document.getElementById("searchBtn")

    const handleSearch = () => {
      const searchTerm = quickSearch.value.trim()
      if (searchTerm) {
        window.location.href = `recipes.html?search=${encodeURIComponent(searchTerm)}`
      }
    }

    searchBtn.addEventListener("click", handleSearch)
    quickSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
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

    // Quick filter buttons
    const filterBtns = document.querySelectorAll(".filter-btn")
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filterType = btn.dataset.filter
        const filterValue = btn.dataset.value
        window.location.href = `recipes.html?${filterType}=${encodeURIComponent(filterValue)}`
      })
    })

    // Category cards
    const categoryCards = document.querySelectorAll(".category-card")
    categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const category = card.dataset.category
        window.location.href = `recipes.html?mealType=${encodeURIComponent(category)}`
      })
    })

    // Favorites link
    const favoritesLink = document.getElementById("favoritesLink")
    if (favoritesLink) {
      favoritesLink.addEventListener("click", (e) => {
        e.preventDefault()
        window.location.href = "recipes.html?favorites=true"
      })
    }

    // Recipe card clicks
    document.addEventListener("click", (e) => {
      const recipeCard = e.target.closest(".recipe-card")
      if (recipeCard && !e.target.closest(".favorite-btn")) {
        const recipeId = Number.parseInt(recipeCard.dataset.recipeId)
        window.location.href = `recipes.html?recipe=${recipeId}`
      }
    })
  }

  displayFeaturedRecipes() {
    const featuredContainer = document.getElementById("featuredRecipes")

    // Get 6 random recipes for featured section
    const shuffled = [...this.recipes].sort(() => 0.5 - Math.random())
    const featured = shuffled.slice(0, 6)

    featuredContainer.innerHTML = featured.map((recipe) => this.createRecipeCard(recipe)).join("")

    // Add click handlers for recipe cards
    featuredContainer.addEventListener("click", (e) => {
      const recipeCard = e.target.closest(".recipe-card")
      if (recipeCard) {
        const recipeId = Number.parseInt(recipeCard.dataset.recipeId)
        window.location.href = `recipes.html?recipe=${recipeId}`
      }
    })

    // Setup favorite buttons
    this.setupFavoriteButtons()
  }

  createRecipeCard(recipe) {
    const isFavorite = StorageManager.isFavorite(recipe.id)

    return `
      <div class="recipe-card" data-recipe-id="${recipe.id}">
        <img src="images/recipes/${recipe.image.replace('.jpg', '.jpeg')}" alt="${recipe.name}" loading="lazy">
        <div class="recipe-card-content">
          <h3>${recipe.name}</h3>
          <p class="recipe-description">${recipe.description}</p>
          <div class="recipe-meta">
            <span class="time">⏱️ ${recipe.totalTime} min</span>
            <span class="difficulty difficulty-${recipe.difficulty}">${recipe.difficulty}</span>
            <span class="cuisine">${recipe.cuisine}</span>
          </div>
          <div class="recipe-actions">
            <button class="favorite-btn ${isFavorite ? "favorited" : ""}" data-recipe-id="${recipe.id}" onclick="event.stopPropagation()">
              ${isFavorite ? "❤️" : "🤍"}
            </button>
            <span class="rating">★ ${recipe.rating}</span>
          </div>
        </div>
      </div>
    `
  }

  setupFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll(".favorite-btn")
    favoriteButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        const recipeId = Number.parseInt(btn.dataset.recipeId)
        const isFavorite = StorageManager.isFavorite(recipeId)

        if (isFavorite) {
          StorageManager.removeFavorite(recipeId)
          btn.textContent = "🤍"
          btn.classList.remove("favorited")
        } else {
          StorageManager.addFavorite(recipeId)
          btn.textContent = "❤️"
          btn.classList.add("favorited")
        }

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent("favoritesChanged", { detail: { recipeId } }))
      })
    })
  }

  updateStats() {
    const totalRecipes = this.recipes.length
    const totalCuisines = new Set(this.recipes.map((r) => r.cuisine)).size
    const favoriteCount = StorageManager.getFavorites().length

    document.getElementById("totalRecipes").textContent = totalRecipes
    document.getElementById("totalCuisines").textContent = totalCuisines
    document.getElementById("favoriteCount").textContent = favoriteCount
  }

  showError(message) {
    const featuredContainer = document.getElementById("featuredRecipes")
    featuredContainer.innerHTML = `
      <div class="error-message">
        <h3>Oops! Something went wrong</h3>
        <p>${message}</p>
      </div>
    `
  }
}

// Initialize home page
document.addEventListener("DOMContentLoaded", () => {
  new HomePage()
})
