// Local Storage utilities
export class StorageManager {
  static getFavorites() {
    const favorites = localStorage.getItem("culinaryCanvas_favorites")
    return favorites ? JSON.parse(favorites) : []
  }

  static addFavorite(recipeId) {
    const favorites = this.getFavorites()
    if (!favorites.includes(recipeId)) {
      favorites.push(recipeId)
      localStorage.setItem("culinaryCanvas_favorites", JSON.stringify(favorites))
    }
  }

  static removeFavorite(recipeId) {
    const favorites = this.getFavorites()
    const updatedFavorites = favorites.filter((id) => id !== recipeId)
    localStorage.setItem("culinaryCanvas_favorites", JSON.stringify(updatedFavorites))
  }

  static isFavorite(recipeId) {
    return this.getFavorites().includes(recipeId)
  }

  static getPreferences() {
    const prefs = localStorage.getItem("culinaryCanvas_preferences")
    return prefs
      ? JSON.parse(prefs)
      : {
          theme: "light",
          defaultServings: 4,
          measurementUnit: "imperial",
        }
  }

  static savePreferences(preferences) {
    localStorage.setItem("culinaryCanvas_preferences", JSON.stringify(preferences))
  }

  static getDraft() {
    const draft = localStorage.getItem("culinaryCanvas_draft")
    return draft ? JSON.parse(draft) : null
  }

  static saveDraft(formData) {
    localStorage.setItem("culinaryCanvas_draft", JSON.stringify(formData))
  }

  static clearDraft() {
    localStorage.removeItem("culinaryCanvas_draft")
  }
}
