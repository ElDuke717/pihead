const API_KEY = ''; // Replace with your API key

document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherByCoordinates();
    fetchFiveDayForecast();
    updateTime();
    setInterval(updateTime, 1000); // Update the time every second
});


function fetchWeatherByCoordinates() {
    const lat = 37.3856992;
    const lon = -77.6971656;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => console.error('Error fetching weather data by coordinates:', error));
}

function displayWeather(data) {

    // Update the temperature display to round and show both Celsius and Fahrenheit
    const currentTempF = Math.round(data.main.temp * 1.8 + 32);
    const currentTempC = Math.round(data.main.temp);
    const feelsLikeTempF = Math.round(data.main.feels_like * 1.8 + 32);
    const feelsLikeTempC = Math.round(data.main.feels_like);


    document.getElementById('city-name').innerText = data.name;
    document.getElementById('temperature-f').innerText = `${currentTempF}°F`;
    document.getElementById('temperature-c').innerText = `${currentTempC}°C`;
    document.getElementById('description').innerText = data.weather[0].description;
   
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('feels-like').innerText = `Feels Like: ${feelsLikeTempF}°F (${feelsLikeTempC}°C)`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('wind-direction').innerText = `Wind Direction: ${data.wind.deg}°`;
    document.getElementById('pressure').innerText = `Pressure: ${data.main.pressure} hPa`;
    document.getElementById('local-time-meas').innerText = `Local Time of Measurement: ${new Date().toLocaleTimeString()}`;

// Check if there's rain data
if (data.rain && data.rain["1h"]) {
    document.getElementById('rain').innerText = `Rain (last hour): ${data.rain["1h"]} mm`;
} else {
    document.getElementById('rain').innerText = `Rain: None`;
}

    // Convert sunrise and sunset from UNIX timestamp to readable time format
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    document.getElementById('sunrise').innerText = `Sunrise: ${sunrise}`;
    document.getElementById('sunset').innerText = `Sunset: ${sunset}`;
}


function updateTime() {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    document.getElementById('local-time-live').innerText = `Local Time: ${formattedTime}`;
}

// Get the 5 day forecast weather
function fetchFiveDayForecast() {
    const lat = 37.3856992;
    const lon = -77.6971656;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayFiveDayForecast(data);
        })
        .catch(error => console.error('Error fetching 5-day forecast data:', error));
}


// Display the 5 day forcast
function displayFiveDayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    
    // Clear existing forecast
    forecastContainer.innerHTML = '';
    
    // Group forecasts by date
    let groupedForecasts = {};
    
    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!groupedForecasts[date]) {
            groupedForecasts[date] = [];
        }
        groupedForecasts[date].push(forecast);
    });
    
        // Calculate desired data for each date
        for (let date in groupedForecasts) {
            let dayForecasts = groupedForecasts[date];
            let highTemp = Number.NEGATIVE_INFINITY;
            let lowTemp = Number.POSITIVE_INFINITY;
            let description = dayForecasts[0].weather[0].description;
            let rain = "No rain";
    
            dayForecasts.forEach(forecast => {
                highTemp = Math.max(highTemp, forecast.main.temp_max);
                lowTemp = Math.min(lowTemp, forecast.main.temp_min);
                if (forecast.rain && forecast.rain["3h"]) {
                    rain = `Rain: ${forecast.rain["3h"]}mm in last 3 hours`;
                }
            });
    
            // days of the week
            const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
            // get the day of the week from the date
            const forecastDate = new Date(dayForecasts[0].dt * 1000);  // Use the first forecast's date to get the weekday
            const weekday = weekdays[forecastDate.getDay()];

            // convert temperatures to Fahrenheit and round them
            const highTempF = Math.round(highTemp * 1.8 + 32);
            const lowTempF = Math.round(lowTemp * 1.8 + 32);
    
            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <h3>${weekday}, ${date}</h3>
                    <p>High: ${highTempF}°F (${Math.round(highTemp)}°C)</p>
                    <p>Low: ${lowTempF}°F (${Math.round(lowTemp)}°C)</p>
                    <p>${description}</p>
                    <p>${rain}</p>
                </div>
            `;
        }
    
}




