// Submit page functionality
import { StorageManager } from "./utils/storage.js"

class SubmitPage {
  constructor() {
    this.ingredients = []
    this.instructions = []
    this.formSubmitted = false
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.loadDraft()
    this.setTimestamp()
  }

  setupEventListeners() {
    // Ingredient management
    const addIngredientBtn = document.getElementById("addIngredient")
    const ingredientInput = document.getElementById("ingredientInput")

    addIngredientBtn.addEventListener("click", () => this.addIngredient())
    ingredientInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        this.addIngredient()
      }
    })

    // Instruction management
    const addInstructionBtn = document.getElementById("addInstruction")
    const instructionInput = document.getElementById("instructionInput")

    addInstructionBtn.addEventListener("click", () => this.addInstruction())
    instructionInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault()
        this.addInstruction()
      }
    })

    // Form submission
    const form = document.getElementById("recipeForm")
    form.addEventListener("submit", (e) => this.handleSubmit(e))

    // Save as draft
    const saveAsDraftBtn = document.getElementById("saveAsDraft")
    saveAsDraftBtn.addEventListener("click", () => this.saveDraft())

    // Real-time validation
    this.setupValidation()

    // Auto-save draft every 30 seconds
    setInterval(() => this.autoSaveDraft(), 30000)
  }

  setupValidation() {
    const requiredFields = [
      "recipeName",
      "description",
      "cuisine",
      "mealType",
      "prepTime",
      "cookTime",
      "servings",
      "difficulty",
      "submitterName",
      "submitterEmail",
    ]

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId)
      if (field) {
        field.addEventListener("blur", () => this.validateField(field))
        field.addEventListener("input", () => this.clearError(field))
      }
    })
  }

  validateField(field) {
    const value = field.value.trim()
    const fieldName = field.name || field.id
    let isValid = true
    let errorMessage = ""

    // Required field validation
    if (field.required && !value) {
      isValid = false
      errorMessage = "This field is required"
    }

    // Specific field validations
    switch (fieldName) {
      case "recipeName":
        if (value && value.length < 3) {
          isValid = false
          errorMessage = "Recipe name must be at least 3 characters"
        }
        break

      case "description":
        if (value && value.length < 10) {
          isValid = false
          errorMessage = "Description must be at least 10 characters"
        }
        break

      case "prepTime":
      case "cookTime":
        if (value && (Number.parseInt(value) < 1 || Number.parseInt(value) > 480)) {
          isValid = false
          errorMessage = "Time must be between 1 and 480 minutes"
        }
        break

      case "servings":
        if (value && (Number.parseInt(value) < 1 || Number.parseInt(value) > 20)) {
          isValid = false
          errorMessage = "Servings must be between 1 and 20"
        }
        break

      case "submitterEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (value && !emailRegex.test(value)) {
          isValid = false
          errorMessage = "Please enter a valid email address"
        }
        break
    }

    this.showFieldError(field, isValid ? "" : errorMessage)
    return isValid
  }

  showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}Error`)
    if (errorElement) {
      if (message) {
        errorElement.textContent = message
        errorElement.style.display = 'block'
        field.classList.add('error')
      } else {
        errorElement.textContent = ''
        errorElement.style.display = 'none'
        field.classList.remove('error')
      }
    }
  }

  clearError(field) {
    const errorElement = document.getElementById(`${field.id}Error`)
    if (errorElement) {
      errorElement.textContent = ''
      errorElement.style.display = 'none'
      field.classList.remove('error')
    }
  }

  addIngredient() {
    const input = document.getElementById("ingredientInput")
    const ingredient = input.value.trim()

    if (!ingredient) {
      this.showFieldError(input, "Please enter an ingredient")
      return
    }

    if (ingredient.length > 100) {
      this.showFieldError(input, "Ingredient must be less than 100 characters")
      return
    }

    this.ingredients.push(ingredient)
    this.updateIngredientsList()
    input.value = ""
    this.clearError(input)
    this.updateHiddenField("ingredients", this.ingredients)
  }

  removeIngredient(index) {
    this.ingredients.splice(index, 1)
    this.updateIngredientsList()
    this.updateHiddenField("ingredients", this.ingredients)
  }

  updateIngredientsList() {
    const list = document.getElementById("ingredientsList")
    list.innerHTML = this.ingredients
      .map(
        (ingredient, index) => `
    <li>
      ${ingredient}
      <button type="button" class="remove-btn" onclick="submitPage.removeIngredient(${index})">Remove</button>
    </li>
  `,
      )
      .join("")

    // Update validation - only show error if form has been submitted or user tried to submit
    const errorElement = document.getElementById("ingredientsError")
    if (errorElement) {
      if (this.ingredients.length === 0 && this.formSubmitted) {
        errorElement.textContent = "Please add at least one ingredient"
        errorElement.style.display = 'block'
      } else {
        errorElement.textContent = ""
        errorElement.style.display = 'none'
      }
    }
  }

  addInstruction() {
    const input = document.getElementById("instructionInput")
    const instruction = input.value.trim()

    if (!instruction) {
      this.showFieldError(input, "Please enter an instruction")
      return
    }

    if (instruction.length > 300) {
      this.showFieldError(input, "Instruction must be less than 300 characters")
      return
    }

    this.instructions.push(instruction)
    this.updateInstructionsList()
    input.value = ""
    this.clearError(input)
    this.updateHiddenField("instructions", this.instructions)
  }

  removeInstruction(index) {
    this.instructions.splice(index, 1)
    this.updateInstructionsList()
    this.updateHiddenField("instructions", this.instructions)
  }

  updateInstructionsList() {
    const list = document.getElementById("instructionsList")
    list.innerHTML = this.instructions
      .map(
        (instruction, index) => `
    <li>
      ${instruction}
      <button type="button" class="remove-btn" onclick="submitPage.removeInstruction(${index})">Remove</button>
    </li>
  `,
      )
      .join("")

    // Update validation - only show error if form has been submitted or user tried to submit
    const errorElement = document.getElementById("instructionsError")
    if (errorElement) {
      if (this.instructions.length === 0 && this.formSubmitted) {
        errorElement.textContent = "Please add at least one instruction"
        errorElement.style.display = 'block'
      } else {
        errorElement.textContent = ""
        errorElement.style.display = 'none'
      }
    }
  }

  updateHiddenField(fieldName, array) {
    const hiddenField = document.getElementById(fieldName)
    hiddenField.value = JSON.stringify(array)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.formSubmitted = true

    // Validate all fields
    let isFormValid = true
    const form = e.target
    const formData = new FormData(form)

    // Validate required fields
    const requiredFields = form.querySelectorAll("[required]")
    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isFormValid = false
      }
    })

    // Validate ingredients and instructions
    if (this.ingredients.length === 0) {
      document.getElementById("ingredientsError").textContent = "Please add at least one ingredient"
      isFormValid = false
    }

    if (this.instructions.length === 0) {
      document.getElementById("instructionsError").textContent = "Please add at least one instruction"
      isFormValid = false
    }

    if (!isFormValid) {
      // Scroll to first error
      const firstError = document.querySelector(".error, .error-message:not(:empty)")
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    // Add dietary preferences
    const dietaryCheckboxes = form.querySelectorAll('input[name="dietary"]:checked')
    const dietary = Array.from(dietaryCheckboxes).map((cb) => cb.value)
    formData.set("dietary", dietary.join(","))

    // Update timestamp
    this.setTimestamp()

    // Clear draft on successful submission
    StorageManager.clearDraft()

    // Submit form
    form.submit()
  }

  saveDraft() {
    const formData = this.getFormData()
    StorageManager.saveDraft(formData)

    // Show success message
    this.showSuccessMessage("Draft saved successfully!")
  }

  autoSaveDraft() {
    const formData = this.getFormData()
    if (this.hasFormData(formData)) {
      StorageManager.saveDraft(formData)
      console.log("Auto-saved draft")
    }
  }

  getFormData() {
    const form = document.getElementById("recipeForm")
    const formData = new FormData(form)
    const data = {}

    for (const [key, value] of formData.entries()) {
      data[key] = value
    }

    // Add ingredients and instructions
    data.ingredients = this.ingredients
    data.instructions = this.instructions

    // Add dietary preferences
    const dietaryCheckboxes = form.querySelectorAll('input[name="dietary"]:checked')
    data.dietary = Array.from(dietaryCheckboxes).map((cb) => cb.value)

    return data
  }

  hasFormData(data) {
    return (
      data.recipeName || data.description || data.cuisine || this.ingredients.length > 0 || this.instructions.length > 0
    )
  }

  loadDraft() {
    const draft = StorageManager.getDraft()
    if (!draft) return

    // Ask user if they want to load the draft
    if (confirm("You have a saved draft. Would you like to load it?")) {
      // Fill form fields
      Object.keys(draft).forEach((key) => {
        const field = document.getElementById(key)
        if (field && typeof draft[key] === "string") {
          field.value = draft[key]
        }
      })

      // Load ingredients and instructions
      if (draft.ingredients && Array.isArray(draft.ingredients)) {
        this.ingredients = draft.ingredients
        this.updateIngredientsList()
        this.updateHiddenField("ingredients", this.ingredients)
      }

      if (draft.instructions && Array.isArray(draft.instructions)) {
        this.instructions = draft.instructions
        this.updateInstructionsList()
        this.updateHiddenField("instructions", this.instructions)
      }

      // Load dietary preferences
      if (draft.dietary && Array.isArray(draft.dietary)) {
        draft.dietary.forEach((diet) => {
          const checkbox = document.querySelector(`input[name="dietary"][value="${diet}"]`)
          if (checkbox) {
            checkbox.checked = true
          }
        })
      }

      this.showSuccessMessage("Draft loaded successfully!")
    }
  }

  setTimestamp() {
    document.getElementById("timestamp").value = new Date().toISOString()
  }

  showSuccessMessage(message) {
    // Create and show success message
    const successDiv = document.createElement("div")
    successDiv.className = "success-message"
    successDiv.textContent = message
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: var(--success-color);
      color: white;
      padding: 1rem;
      border-radius: var(--border-radius);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `

    document.body.appendChild(successDiv)

    // Remove after 3 seconds
    setTimeout(() => {
      successDiv.remove()
    }, 3000)
  }
}

// Make submitPage available globally for remove buttons
let submitPage

// Initialize submit page
document.addEventListener("DOMContentLoaded", () => {
  submitPage = new SubmitPage()
  window.submitPage = submitPage
})
