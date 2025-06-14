// Modal component for recipe details
export class RecipeModal {
  constructor() {
    this.modal = document.getElementById("recipeModal")
    this.modalContent = document.getElementById("modalContent")
    this.closeBtn = this.modal.querySelector(".modal-close")

    this.init()
  }

  init() {
    // Close modal when clicking close button
    this.closeBtn.addEventListener("click", () => this.close())

    // Close modal when clicking outside
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close()
      }
    })

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.style.display === "block") {
        this.close()
      }
    })
  }

  open(recipe) {
    this.modalContent.innerHTML = this.generateRecipeHTML(recipe)
    this.modal.style.display = "block"
    this.modal.setAttribute("aria-hidden", "false")
    document.body.style.overflow = "hidden"

    // Focus management for accessibility
    this.closeBtn.focus()

    // Add favorite functionality to the modal
    this.setupFavoriteButton(recipe.id)
  }

  close() {
    this.modal.style.display = "none"
    this.modal.setAttribute("aria-hidden", "true")
    document.body.style.overflow = "auto"
  }

  generateRecipeHTML(recipe) {
    const { StorageManager } = window
    const isFavorite = StorageManager.isFavorite(recipe.id)

    return `
      <div class="recipe-detail">
        <div class="recipe-header">
          <img src="images/recipes/${recipe.image.replace('.jpg', '.jpeg')}" alt="${recipe.name}" class="recipe-image" loading="lazy">
          <div class="recipe-info">
            <h2 id="modalTitle">${recipe.name}</h2>
            <p class="recipe-description">${recipe.description}</p>
            <div class="recipe-meta">
              <span class="cuisine-tag">${recipe.cuisine.charAt(0).toUpperCase() + recipe.cuisine.slice(1)}</span>
              <span class="meal-type-tag">${recipe.mealType.charAt(0).toUpperCase() + recipe.mealType.slice(1)}</span>
              <span class="difficulty-tag difficulty-${recipe.difficulty}">${recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}</span>
            </div>
            <div class="recipe-stats">
              <div class="stat">
                <span class="stat-label">Prep Time</span>
                <span class="stat-value">${recipe.prepTime} min</span>
              </div>
              <div class="stat">
                <span class="stat-label">Cook Time</span>
                <span class="stat-value">${recipe.cookTime} min</span>
              </div>
              <div class="stat">
                <span class="stat-label">Total Time</span>
                <span class="stat-value">${recipe.totalTime} min</span>
              </div>
              <div class="stat">
                <span class="stat-label">Servings</span>
                <span class="stat-value">${recipe.servings}</span>
              </div>
            </div>
            <button class="favorite-btn ${isFavorite ? "favorited" : ""}" data-recipe-id="${recipe.id}">
              ${isFavorite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        <div class="recipe-content">
          <div class="ingredients-section">
            <h3>Ingredients</h3>
            <ul class="ingredients-list">
              ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>

          <div class="instructions-section">
            <h3>Instructions</h3>
            <ol class="instructions-list">
              ${recipe.instructions.map((instruction) => `<li>${instruction}</li>`).join("")}
            </ol>
          </div>
        </div>

        ${recipe.dietary.length > 0
        ? `
          <div class="dietary-info">
            <h4>Dietary Information</h4>
            <div class="dietary-tags">
              ${recipe.dietary.map((diet) => `<span class="dietary-tag">${diet}</span>`).join("")}
            </div>
          </div>
        `
        : ""
      }

        <div class="recipe-footer">
          <p class="recipe-author">Recipe by ${recipe.author}</p>
          <div class="recipe-rating">
            <span class="rating-stars">${"★".repeat(Math.floor(recipe.rating))}${"☆".repeat(5 - Math.floor(recipe.rating))}</span>
            <span class="rating-value">${recipe.rating}/5</span>
          </div>
        </div>
      </div>
    `
  }

  setupFavoriteButton(recipeId) {
    const favoriteBtn = this.modalContent.querySelector(".favorite-btn")
    if (favoriteBtn) {
      favoriteBtn.addEventListener("click", () => {
        const { StorageManager } = window
        const isFavorite = StorageManager.isFavorite(recipeId)

        if (isFavorite) {
          StorageManager.removeFavorite(recipeId)
          favoriteBtn.textContent = "🤍 Add to Favorites"
          favoriteBtn.classList.remove("favorited")
        } else {
          StorageManager.addFavorite(recipeId)
          favoriteBtn.textContent = "❤️ Remove from Favorites"
          favoriteBtn.classList.add("favorited")
        }

        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent("favoritesChanged", { detail: { recipeId } }))
      })
    }
  }
}
