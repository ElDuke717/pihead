
// Add precise latitude and longitude for location
const lat = 37.3856992;
const lon = -77.6971656;

document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherByCoordinates();
    fetchSunriseSunset(lat, lon);
    getForecastData();
    updateTime();
    setInterval(updateTime, 1000); // Update the time every second
});

const BASE_URL = 'https://api.weather.gov';

function fetchWeatherByCoordinates() {
    
    const url = `https://api.weather.gov/gridpoints/AKQ/37,69/forecast/hourly`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => console.error('Error fetching weather data by gridpoint:', error));
}


function getForecastData() {
    
    const forecastURL = `https://api.weather.gov/gridpoints/AKQ/37,69/forecast`

    fetch(forecastURL)
    .then(response => response.json())
        .then(data => {
            displayForecastData(data);
        })
        .catch(error => console.error('Error fetching weather forecast data:', error));
}

function displayWeather(data) {
    const todayForecast = data.properties.periods[0];

    // get temp in degrees F and convert to Celcius
    let temperatureF = todayForecast.temperature;
    let temperatureC = (temperatureF - 32) * (5/9);


    document.getElementById('city-name').innerText = "Chesterfield, VA"; // NOAA doesn't provide city name, so we hardcode it.
    document.getElementById('temperature-f').innerText = `${todayForecast.temperature}°${todayForecast.temperatureUnit}`;
    document.getElementById("temperature-c").innerText = `${temperatureC.toFixed(2)}°C`;
    document.getElementById('description').innerText = todayForecast.shortForecast;
    document.getElementById('humidity').innerText = `Humidity: ${todayForecast.relativeHumidity.value}%`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${todayForecast.windSpeed}`;
    document.getElementById('wind-direction').innerText = `Wind Direction: ${todayForecast.windDirection}`;
    document.getElementById('local-time-meas').innerText = `Local Time of Measurement: ${new Date().toLocaleTimeString()}`;
    // NOAA doesn't provide a 'feels like' temperature or rain amount directly, so these are omitted
}

function updateTime() {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    document.getElementById('local-time-live').innerText = `Local Time: ${formattedTime}`;
}

const forecastURL = `https://api.weather.gov/gridpoints/AKQ/37,69/forecast`

function displayForecastData(data) {
    
    
    periods = data.properties.periods;

    const forecastContainer = document.getElementById('forecast-container');

    // Clear existing forecast
    forecastContainer.innerHTML = '';
    
    periods.forEach(period => {
        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <h3>${period.name}</h3>
                <p>Temperature: ${period.temperature}°${period.temperatureUnit}</p>
                <p>${period.shortForecast}</p>
                <p>Wind: ${period.windSpeed} ${period.windDirection}</p>
                <img src="${period.icon}" alt="${period.shortForecast}" width="100">
            </div>
        `;
    });
}

function fetchSunriseSunset(lat, lon) {
    fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=today`)
        .then(response => response.json())
        .then(data => {
            const sunrise = data.results.sunrise;
            const sunset = data.results.sunset;

            document.getElementById("sunrise").innerText = `Sunrise: ${sunrise}`;
            document.getElementById("sunset").innerText = `Sunset: ${sunset}`;
        });
}






