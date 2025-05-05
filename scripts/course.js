// Course information and filtering functionality
document.addEventListener("DOMContentLoaded", () => {
  // Course data array
  const courses = [
    {
      code: "CIT 111",
      name: "Introduction to Databases",
      description:
        "Introduction to database design and management. Includes database normalization, and SQL programming.",
      credits: 3,
      completed: false,
      type: "CSE",
    },
    {
      code: "WDD 130",
      name: "Web Fundamentals",
      description: "Introduction to web design and development. Includes HTML, CSS, and JavaScript.",
      credits: 3,
      completed: true,
      type: "WDD",
    },
    {
      code: "WDD 230",
      name: "Web Frontend Development I",
      description: "Frontend web development using HTML, CSS, and JavaScript.",
      credits: 3,
      completed: false,
      type: "WDD",
    },
    {
      code: "WDD 231",
      name: "Web Frontend Development II",
      description: "Advanced frontend web development using HTML, CSS, and JavaScript.",
      credits: 3,
      completed: false,
      type: "WDD",
    },
    {
      code: "CSE 121B",
      name: "JavaScript Language",
      description: "Introduction to JavaScript programming.",
      credits: 3,
      completed: false,
      type: "CSE",
    },
    {
      code: "CSE 170",
      name: "Introduction to Computer Programming",
      description: "Introduction to programming using Python.",
      credits: 3,
      completed: false,
      type: "CSE",
    },
  ]

  // DOM elements
  const courseCardsContainer = document.getElementById("courseCards")
  const totalCreditsElement = document.getElementById("totalCredits")
  const allCoursesBtn = document.getElementById("allCoursesBtn")
  const wddCoursesBtn = document.getElementById("wddCoursesBtn")
  const cseCoursesBtn = document.getElementById("cseCoursesBtn")

  // Filter buttons functionality
  allCoursesBtn.addEventListener("click", () => {
    setActiveButton(allCoursesBtn)
    displayCourses(courses)
  })

  wddCoursesBtn.addEventListener("click", () => {
    setActiveButton(wddCoursesBtn)
    const wddCourses = courses.filter((course) => course.type === "WDD")
    displayCourses(wddCourses)
  })

  cseCoursesBtn.addEventListener("click", () => {
    setActiveButton(cseCoursesBtn)
    const cseCourses = courses.filter((course) => course.type === "CSE")
    displayCourses(cseCourses)
  })

  // Helper function to set active button
  function setActiveButton(activeButton) {
    // Remove active class from all buttons
    ;[allCoursesBtn, wddCoursesBtn, cseCoursesBtn].forEach((button) => {
      button.classList.remove("active")
    })

    // Add active class to the clicked button
    activeButton.classList.add("active")
  }

  // Function to display courses
  function displayCourses(coursesToDisplay) {
    // Clear previous courses
    courseCardsContainer.innerHTML = ""

    // Calculate total credits using reduce
    const totalCredits = coursesToDisplay.reduce((total, course) => total + course.credits, 0)
    totalCreditsElement.textContent = totalCredits

    // Display each course
    coursesToDisplay.forEach((course) => {
      const courseCard = document.createElement("div")
      courseCard.className = `course-card ${course.completed ? "completed" : ""}`

      courseCard.innerHTML = `
                <h3>${course.name}</h3>
                <p class="course-code">${course.code}</p>
                <p>${course.description}</p>
                <p class="credits">Credits: ${course.credits}</p>
                ${course.completed ? '<span class="completed-badge">Completed</span>' : ""}
            `

      courseCardsContainer.appendChild(courseCard)
    })
  }

  // Initial display - show all courses
  displayCourses(courses)
})
