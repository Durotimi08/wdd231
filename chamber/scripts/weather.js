document.addEventListener("DOMContentLoaded", async () => {

  // DOM elements
  const temperatureElement = document.getElementById("temperature")
  const descriptionElement = document.getElementById("description")
  const weatherIconElement = document.getElementById("weather-icon")
  const forecastContainer = document.getElementById("forecast-container")

  // Function to fetch current weather data
  async function fetchCurrentWeather() {
    try {
      const weatherData = {
        main: {
          temp: 78.5,
        },
        weather: [
          {
            description: "partly cloudy",
            icon: "02d",
          },
        ],
      }

      // Update DOM with weather data
      temperatureElement.textContent = `${Math.round(weatherData.main.temp)}°F`
      descriptionElement.textContent = weatherData.weather[0].description
      weatherIconElement.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
      weatherIconElement.alt = weatherData.weather[0].description
    } catch (error) {
      console.error("Error fetching current weather:", error)
      temperatureElement.textContent = "Error"
      descriptionElement.textContent = "Could not load weather data"
    }
  }

  // Function to fetch forecast data
  async function fetchForecast() {
    try {
      const forecastData = {
        list: [
          {
            dt: Date.now() / 1000 + 86400, // tomorrow
            main: {
              temp: 80.2,
            },
            weather: [
              {
                description: "sunny",
                icon: "01d",
              },
            ],
          },
          {
            dt: Date.now() / 1000 + 172800, // day after tomorrow
            main: {
              temp: 76.8,
            },
            weather: [
              {
                description: "scattered clouds",
                icon: "03d",
              },
            ],
          },
          {
            dt: Date.now() / 1000 + 259200, // two days after tomorrow
            main: {
              temp: 82.4,
            },
            weather: [
              {
                description: "clear sky",
                icon: "01d",
              },
            ],
          },
        ],
      }

      // Clear previous forecast
      forecastContainer.innerHTML = ""

      // Process and display forecast data (one entry per day)
      const dailyForecasts = forecastData.list.slice(0, 3) // Get first 3 days

      dailyForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000)
        const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)

        const forecastDay = document.createElement("div")
        forecastDay.className = "forecast-day"
        forecastDay.innerHTML = `
          <p class="day">${dayName}</p>
          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
          <p class="temp">${Math.round(forecast.main.temp)}°F</p>
        `

        forecastContainer.appendChild(forecastDay)
      })
    } catch (error) {
      console.error("Error fetching forecast:", error)
      forecastContainer.innerHTML = "<p>Could not load forecast data</p>"
    }
  }

  // Fetch weather data
  await fetchCurrentWeather()
  await fetchForecast()
})
