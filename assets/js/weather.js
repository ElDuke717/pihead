
// load data immediately
document.addEventListener("DOMContentLoaded", () => {
  fetchWeatherByLocation();
  getForecastData();
  updateTime();
  setInterval(updateTime, 1000); // Update the time every second
});

const BASE_URL = "https://api.weather.gov";

function fetchWeatherByLocation() {
  const url = `https://api.weather.gov/gridpoints/AKQ/37,69/forecast/hourly`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) =>
      console.error("Error fetching weather data by gridpoint:", error)
    );
}

function getForecastData() {
  const forecastURL = `https://api.weather.gov/gridpoints/AKQ/37,69/forecast`;

  fetch(forecastURL)
    .then((response) => response.json())
    .then((data) => {
      displayForecastData(data);
    })
    .catch((error) =>
      console.error("Error fetching weather forecast data:", error)
    );
}

function displayWeather(data) {
  const todayForecast = data.properties.periods[0];

  // get temp in degrees F and convert to Celcius
  let temperatureF = todayForecast.temperature;
  let temperatureC = Math.round((temperatureF - 32) * (5 / 9));

  document.getElementById("city-name").innerText = "Chesterfield, VA"; // NOAA doesn't provide city name, so we hardcode it.
  document.getElementById(
    "temperature-f"
  ).innerText = `${todayForecast.temperature}°${todayForecast.temperatureUnit}`;
  document.getElementById("temperature-c").innerText = `${Math.round(
    temperatureC
  )}°C`;
  document.getElementById("description").innerText =
    todayForecast.shortForecast;
  document.getElementById(
    "humidity"
  ).innerText = `Humidity: ${todayForecast.relativeHumidity.value}%`;
  document.getElementById(
    "wind-speed"
  ).innerText = `Wind Speed: ${todayForecast.windSpeed}`;
  document.getElementById(
    "wind-direction"
  ).innerText = `Wind Direction: ${todayForecast.windDirection}`;

  // NOAA doesn't provide a 'feels like' temperature or rain amount directly, so these are omitted
}

function updateTime() {
  const currentTime = new Date();
  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();
  document.getElementById(
    "local-time-live"
  ).innerText = `Local Date: ${formattedDate}, Local Time: ${formattedTime}`;
}

const forecastURL = `https://api.weather.gov/gridpoints/AKQ/37,69/forecast`;

function displayForecastData(data) {
  periods = data.properties.periods;

  const forecastContainer = document.getElementById("forecast-container");

  // Clear existing forecast
  forecastContainer.innerHTML = "";

  periods.forEach((period) => {
    forecastContainer.innerHTML += `
            <div class="forecast-day">
                <h3>${period.name}</h3>
                <p>${period.temperature}°${period.temperatureUnit}</p>
                <p>${period.shortForecast}</p>
                <p>Wind: ${period.windSpeed} ${period.windDirection}</p>
                <img class="weather-img" src="${period.icon}" alt="${period.shortForecast}" width="100">
            </div>
        `;
  });
}

// This is all wrong right now, come back and fix later.
