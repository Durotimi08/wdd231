// Recipes page functionality
import { RecipeAPI } from "./utils/api.js"
import { StorageManager } from "./utils/storage.js"
import { RecipeModal } from "./components/modal.js"

// Make StorageManager available globally for modal
window.StorageManager = StorageManager

class RecipesPage {
  constructor() {
    this.recipes = []
    this.filteredRecipes = []
    this.modal = new RecipeModal()
    this.currentFilters = {
      search: "",
      cuisine: "",
      mealType: "",
      dietary: "",
      difficulty: "",
    }
    this.currentSort = "name"
    this.showingFavorites = false

    this.init()
  }

  async init() {
    try {
      this.showLoading(true)
      await this.loadRecipes()
      this.setupEventListeners()
      this.parseURLParams()
      this.populateFilterOptions()
      this.applyFiltersAndSort()
      this.showLoading(false)
    } catch (error) {
      console.error("Error initializing recipes page:", error)
      this.showError("Failed to load recipes. Please refresh the page.")
      this.showLoading(false)
    }
  }

  async loadRecipes() {
    this.recipes = await RecipeAPI.fetchRecipes()
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById("recipeSearch")
    const searchBtn = document.getElementById("searchBtn")

    const handleSearch = () => {
      this.currentFilters.search = searchInput.value.trim()
      this.applyFiltersAndSort()
    }

    searchBtn.addEventListener("click", handleSearch)
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    })

    // Filter dropdowns
    const filterElements = ["cuisineFilter", "mealTypeFilter", "dietaryFilter", "difficultyFilter"]
    filterElements.forEach((filterId) => {
      const element = document.getElementById(filterId)
      element.addEventListener("change", () => {
        const filterType = filterId.replace("Filter", "")
        this.currentFilters[filterType] = element.value
        this.applyFiltersAndSort()
      })
    })

    // Sort dropdown
    const sortSelect = document.getElementById("sortBy")
    sortSelect.addEventListener("change", () => {
      this.currentSort = sortSelect.value
      this.applyFiltersAndSort()
    })

    // Clear filters button
    const clearFiltersBtn = document.getElementById("clearFilters")
    clearFiltersBtn.addEventListener("click", () => {
      this.clearAllFilters()
    })

    // Show favorites button
    const showFavoritesBtn = document.getElementById("showFavorites")
    showFavoritesBtn.addEventListener("click", () => {
      this.toggleFavorites()
    })

    // Listen for favorites changes
    window.addEventListener("favoritesChanged", () => {
      if (this.showingFavorites) {
        this.applyFiltersAndSort()
      }
      this.updateFavoriteButtons()
    })
  }

  parseURLParams() {
    const params = new URLSearchParams(window.location.search)

    // Set filters from URL parameters
    if (params.get("search")) {
      this.currentFilters.search = params.get("search")
      document.getElementById("recipeSearch").value = this.currentFilters.search
    }

    if (params.get("cuisine")) {
      this.currentFilters.cuisine = params.get("cuisine")
    }

    if (params.get("mealType")) {
      this.currentFilters.mealType = params.get("mealType")
    }

    if (params.get("dietary")) {
      this.currentFilters.dietary = params.get("dietary")
    }

    if (params.get("difficulty")) {
      this.currentFilters.difficulty = params.get("difficulty")
    }

    if (params.get("favorites") === "true") {
      this.showingFavorites = true
      document.getElementById("showFavorites").textContent = "Show All Recipes"
      document.getElementById("showFavorites").classList.add("active")
    }

    // Handle direct recipe link
    if (params.get("recipe")) {
      const recipeId = Number.parseInt(params.get("recipe"))
      setTimeout(() => {
        const recipe = this.recipes.find((r) => r.id === recipeId)
        if (recipe) {
          this.modal.open(recipe)
        }
      }, 100)
    }
  }

  populateFilterOptions() {
    // Populate cuisine filter
    const cuisines = [...new Set(this.recipes.map((r) => r.cuisine))].sort()
    const cuisineFilter = document.getElementById("cuisineFilter")
    cuisines.forEach((cuisine) => {
      const option = document.createElement("option")
      option.value = cuisine
      option.textContent = cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
      cuisineFilter.appendChild(option)
    })

    // Set filter values from current filters
    document.getElementById("cuisineFilter").value = this.currentFilters.cuisine
    document.getElementById("mealTypeFilter").value = this.currentFilters.mealType
    document.getElementById("dietaryFilter").value = this.currentFilters.dietary
    document.getElementById("difficultyFilter").value = this.currentFilters.difficulty
  }

  applyFiltersAndSort() {
    let recipesToShow = [...this.recipes]

    // Apply favorites filter first
    if (this.showingFavorites) {
      const favorites = StorageManager.getFavorites()
      recipesToShow = recipesToShow.filter((recipe) => favorites.includes(recipe.id))
    }

    // Apply other filters
    this.filteredRecipes = RecipeAPI.filterRecipes(recipesToShow, this.currentFilters)

    // Apply sorting
    this.filteredRecipes = RecipeAPI.sortRecipes(this.filteredRecipes, this.currentSort)

    // Display results
    this.displayRecipes()
    this.updateResultsCount()
  }

  displayRecipes() {
    const recipeGrid = document.getElementById("recipeGrid")
    const noResults = document.getElementById("noResults")

    if (this.filteredRecipes.length === 0) {
      recipeGrid.innerHTML = ""
      noResults.style.display = "block"
      return
    }

    noResults.style.display = "none"
    recipeGrid.innerHTML = this.filteredRecipes.map((recipe) => this.createRecipeCard(recipe)).join("")

    // Add click handlers for recipe cards
    recipeGrid.addEventListener("click", (e) => {
      const recipeCard = e.target.closest(".recipe-card")
      if (recipeCard && !e.target.closest(".favorite-btn")) {
        const recipeId = Number.parseInt(recipeCard.dataset.recipeId)
        const recipe = this.recipes.find((r) => r.id === recipeId)
        if (recipe) {
          this.modal.open(recipe)
        }
      }
    })

    // Setup favorite buttons
    this.setupFavoriteButtons()
  }

  createRecipeCard(recipe) {
    const isFavorite = StorageManager.isFavorite(recipe.id)

    return `
      <div class="recipe-card card" data-recipe-id="${recipe.id}">
        <img src="images/recipes/${recipe.image.replace('.jpg', '.jpeg')}" alt="${recipe.name}" loading="lazy">
        <div class="recipe-card-content">
          <h3>${recipe.name}</h3>
          <p class="recipe-description">${recipe.description}</p>
          <div class="recipe-meta">
            <span class="time">⏱️ ${recipe.totalTime} min</span>
            <span class="difficulty difficulty-${recipe.difficulty}">${recipe.difficulty}</span>
            <span class="cuisine">${recipe.cuisine}</span>
            <span class="servings">👥 ${recipe.servings}</span>
          </div>
          ${recipe.dietary.length > 0
        ? `
            <div class="dietary-tags">
              ${recipe.dietary.map((diet) => `<span class="dietary-tag">${diet}</span>`).join("")}
            </div>
          `
        : ""
      }
          <div class="recipe-actions">
            <button class="favorite-btn ${isFavorite ? "favorited" : ""}" data-recipe-id="${recipe.id}" onclick="event.stopPropagation()">
              ${isFavorite ? "❤️" : "🤍"}
            </button>
            <span class="rating">★ ${recipe.rating}</span>
            <span class="author">by ${recipe.author}</span>
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

        // If showing favorites, refresh the view
        if (this.showingFavorites) {
          setTimeout(() => this.applyFiltersAndSort(), 100)
        }
      })
    })
  }

  updateFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll(".favorite-btn")
    favoriteButtons.forEach((btn) => {
      const recipeId = Number.parseInt(btn.dataset.recipeId)
      const isFavorite = StorageManager.isFavorite(recipeId)
      btn.textContent = isFavorite ? "❤️" : "🤍"
      btn.classList.toggle("favorited", isFavorite)
    })
  }

  updateResultsCount() {
    const resultsCount = document.getElementById("resultsCount")
    const count = this.filteredRecipes.length
    const total = this.showingFavorites ? StorageManager.getFavorites().length : this.recipes.length

    if (this.showingFavorites) {
      resultsCount.textContent = `${count} favorite recipe${count !== 1 ? "s" : ""} found`
    } else {
      resultsCount.textContent = `${count} of ${total} recipe${count !== 1 ? "s" : ""} found`
    }
  }

  clearAllFilters() {
    // Reset all filters
    this.currentFilters = {
      search: "",
      cuisine: "",
      mealType: "",
      dietary: "",
      difficulty: "",
    }

    // Reset form elements
    document.getElementById("recipeSearch").value = ""
    document.getElementById("cuisineFilter").value = ""
    document.getElementById("mealTypeFilter").value = ""
    document.getElementById("dietaryFilter").value = ""
    document.getElementById("difficultyFilter").value = ""

    // Reset favorites view
    this.showingFavorites = false
    document.getElementById("showFavorites").textContent = "Show Favorites"
    document.getElementById("showFavorites").classList.remove("active")

    // Apply filters
    this.applyFiltersAndSort()

    // Update URL
    window.history.replaceState({}, "", window.location.pathname)
  }

  toggleFavorites() {
    this.showingFavorites = !this.showingFavorites
    const btn = document.getElementById("showFavorites")

    if (this.showingFavorites) {
      btn.textContent = "Show All Recipes"
      btn.classList.add("active")
    } else {
      btn.textContent = "Show Favorites"
      btn.classList.remove("active")
    }

    this.applyFiltersAndSort()
  }

  showLoading(show) {
    const loadingIndicator = document.getElementById("loadingIndicator")
    const recipeGrid = document.getElementById("recipeGrid")

    if (show) {
      loadingIndicator.style.display = "block"
      recipeGrid.style.display = "none"
    } else {
      loadingIndicator.style.display = "none"
      recipeGrid.style.display = "grid"
    }
  }

  showError(message) {
    const recipeGrid = document.getElementById("recipeGrid")
    recipeGrid.innerHTML = `
      <div class="error-message">
        <h3>Oops! Something went wrong</h3>
        <p>${message}</p>
      </div>
    `
  }
}

// Initialize recipes page
document.addEventListener("DOMContentLoaded", () => {
  new RecipesPage()
})
