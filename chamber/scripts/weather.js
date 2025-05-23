document.addEventListener("DOMContentLoaded", async () => {

  // DOM elements
  const temperatureElement = document.getElementById("temperature")
  const descriptionElement = document.getElementById("description")
  const weatherIconElement = document.getElementById("weather-icon")
  const forecastContainer = document.getElementById("forecast-container")

  // Location configuration
  const LATITUDE = 40.2338 // Provo, UT coordinates
  const LONGITUDE = -111.6585
  const TIMEZONE = "America/Denver"

  // Function to get weather icon based on WMO code
  function getWeatherIcon(wmoCode) {
    const icons = {
      0: "01d", // Clear sky
      1: "02d", // Mainly clear
      2: "03d", // Partly cloudy
      3: "04d", // Overcast
      45: "50d", // Foggy
      48: "50d", // Depositing rime fog
      51: "09d", // Light drizzle
      53: "09d", // Moderate drizzle
      55: "09d", // Dense drizzle
      61: "10d", // Slight rain
      63: "10d", // Moderate rain
      65: "10d", // Heavy rain
      71: "13d", // Slight snow
      73: "13d", // Moderate snow
      75: "13d", // Heavy snow
      77: "13d", // Snow grains
      80: "09d", // Slight rain showers
      81: "09d", // Moderate rain showers
      82: "09d", // Violent rain showers
      85: "13d", // Slight snow showers
      86: "13d", // Heavy snow showers
      95: "11d", // Thunderstorm
      96: "11d", // Thunderstorm with slight hail
      99: "11d", // Thunderstorm with heavy hail
    }
    return icons[wmoCode] || "01d"
  }

  // Function to fetch current weather data
  async function fetchCurrentWeather() {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weathercode&timezone=${TIMEZONE}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const weatherData = await response.json()
      const current = weatherData.current

      // Update DOM with weather data
      temperatureElement.textContent = `${Math.round(current.temperature_2m)}°F`
      descriptionElement.textContent = getWeatherDescription(current.weathercode)
      const iconCode = getWeatherIcon(current.weathercode)
      weatherIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
      weatherIconElement.alt = getWeatherDescription(current.weathercode)
    } catch (error) {
      console.error("Error fetching current weather:", error)
      temperatureElement.textContent = "Error"
      descriptionElement.textContent = "Could not load weather data"
    }
  }

  // Function to get weather description based on WMO code
  function getWeatherDescription(wmoCode) {
    const descriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    }
    return descriptions[wmoCode] || "Unknown"
  }

  // Function to fetch forecast data
  async function fetchForecast() {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=weathercode,temperature_2m_max&timezone=${TIMEZONE}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const forecastData = await response.json()

      // Clear previous forecast
      forecastContainer.innerHTML = ""

      // Process and display forecast data (one entry per day)
      const dailyForecasts = forecastData.daily.time.slice(0, 3).map((date, index) => ({
        dt: new Date(date).getTime() / 1000,
        main: {
          temp: forecastData.daily.temperature_2m_max[index]
        },
        weather: [{
          description: getWeatherDescription(forecastData.daily.weathercode[index]),
          icon: getWeatherIcon(forecastData.daily.weathercode[index])
        }]
      }))

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
