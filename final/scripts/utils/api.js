// API utilities for data fetching
export class RecipeAPI {
  static async fetchRecipes() {
    try {
      const response = await fetch("./data/recipes.json")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data.recipes
    } catch (error) {
      console.error("Error fetching recipes:", error)
      throw new Error("Failed to load recipes. Please try again later.")
    }
  }

  static async getRecipeById(id) {
    try {
      const recipes = await this.fetchRecipes()
      return recipes.find((recipe) => recipe.id === Number.parseInt(id))
    } catch (error) {
      console.error("Error fetching recipe by ID:", error)
      throw error
    }
  }

  static filterRecipes(recipes, filters) {
    return recipes.filter((recipe) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableText =
          `${recipe.name} ${recipe.description} ${recipe.cuisine} ${recipe.ingredients.join(" ")}`.toLowerCase()
        if (!searchableText.includes(searchTerm)) {
          return false
        }
      }

      // Cuisine filter
      if (filters.cuisine && recipe.cuisine !== filters.cuisine) {
        return false
      }

      // Meal type filter
      if (filters.mealType && recipe.mealType !== filters.mealType) {
        return false
      }

      // Dietary filter
      if (filters.dietary && !recipe.dietary.includes(filters.dietary)) {
        return false
      }

      // Difficulty filter
      if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
        return false
      }

      return true
    })
  }

  static sortRecipes(recipes, sortBy) {
    const sortedRecipes = [...recipes]

    switch (sortBy) {
      case "name":
        return sortedRecipes.sort((a, b) => a.name.localeCompare(b.name))
      case "prepTime":
        return sortedRecipes.sort((a, b) => a.totalTime - b.totalTime)
      case "difficulty":
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
        return sortedRecipes.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
      case "cuisine":
        return sortedRecipes.sort((a, b) => a.cuisine.localeCompare(b.cuisine))
      default:
        return sortedRecipes
    }
  }
}
