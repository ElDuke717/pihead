function getWeatherStationData() {
  fetch("weather/station")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok: ${response.status} - ${response.statusText}`
        );
      }
      return response.json(); // This returns a promise
    })
    .then((data) => {
      console.log("Weather Data:", data);
      // Do something with the data, like sending it to the client
      displayWeatherStationData(data);
      getSunData();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function getSunData() {
  fetch("/sun-data")
    .then((response) => response.json())
    .then((data) => {
      displaySunData(data);
    })
    .catch((error) => console.error("Error fetching sun data:", error));
}

// Determine wind direction based on degrees
function degreesToCardinal(degrees) {
  const cardinalDirections = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round((degrees % 360) / 22.5);
  return cardinalDirections[index];
}

function convertUTCToLocal(utcTimeStr, offset) {
  // Extract hours and minutes from the UTC time string
  const [hourStr, minuteStr] = utcTimeStr.split(":");
  let hour = parseInt(hourStr, 10);
  let minute = parseInt(minuteStr, 10);

  // Calculate local time by adding the timezone offset
  hour += offset;

  // Handle overflows and underflows
  if (hour >= 24) {
    hour -= 24;
  } else if (hour < 0) {
    hour += 24;
  }

  // Return the local time as a string
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function displayWeatherStationData(data) {
  const wsData = data[0]; // Assuming data is an array and you want the first object
  const wsDataContainer = document.getElementById("home-weather-data");

  // Calculate days since last rain
  const lastRainDate = new Date(wsData.lastRain);
  const currentDate = new Date();
  const timeDifference = currentDate - lastRainDate;
  const daysSinceLastRain = Math.floor(timeDifference / (1000 * 3600 * 24));

  // Determine if it's time to water the yard
  let waterYardMessage = "";
  if (daysSinceLastRain >= 7) {
    waterYardMessage =
      "<div id='water-message'>It's been 7 or more days since the last rainfall. Make sure the yard and plants have been adequately watered!</div>";
  }

  // dynamically add weather data of interest
  wsDataContainer.innerHTML = `
    <div class="weather-data">
      <h1 class="section-heading">Station Weather Data</h1>
      ${waterYardMessage}
      <p><strong>Time of Measurement:</strong> <span class="data-value">${new Date(
        wsData.date
      ).toLocaleDateString("en-US", {
        timeZone: "America/New_York",
      })}, ${new Date(wsData.date).toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
  })}</span></p>

      <h2 class="section-heading">Temperature</h2>
      <p><strong>Outdoor:</strong> <span class="data-value">${
        wsData.tempf
      }°F / ${Math.round((wsData.tempf - 32) * 0.5556)}°C</span></p>
      <p><strong>Feels Like (Outdoor):</strong> <span class="data-value">${
        wsData.feelsLike
      }°F</span></p>
      <p><strong>Feels Like (Indoor):</strong> <span class="data-value">${
        wsData.feelsLikein
      }°F</span></p>

      <h2 class="section-heading">Humidity</h2>
      <p><strong>Outdoor:</strong> <span class="data-value">${
        wsData.humidity
      }%</span></p>
      <p><strong>Indoor:</strong> <span class="data-value">${
        wsData.humidityin
      }%</span></p>

      <h2 class="section-heading">Wind</h2>
      <p><strong>Direction:</strong> <span class="data-value">${
        wsData.winddir
      }° / ${degreesToCardinal(wsData.winddir)}</span></p>
      <p><strong>Speed:</strong> <span class="data-value">${
        wsData.windspeedmph
      } mph</span></p>
      <p><strong>Max Daily Gust:</strong> <span class="data-value">${
        wsData.maxdailygust
      } mph</span></p>

      <h2 class="section-heading">Rain</h2>
      <p><strong>Hourly:</strong> <span class="data-value">${
        wsData.hourlyrainin
      } in</span></p>
      <p><strong>Daily:</strong> <span class="data-value">${
        wsData.dailyrainin
      } in</span></p>
      <p><strong>Weekly:</strong> <span class="data-value">${
        wsData.weeklyrainin
      } in</span></p>
      <p><strong>Monthly Rainfall:</strong> <span class="data-value">${
        wsData.monthlyrainin
      } in</span></p>
      <p><strong>Last Rainfall:</strong> <span class="data-value">${new Date(
        wsData.lastRain
      ).toLocaleDateString()}</span></p>

      <h2 class="section-heading">Other Information</h2>
      <p><strong>UV Index:</strong> <span class="data-value">${
        wsData.uv
      }</span></p>
      <p><strong>Solar Radiation:</strong> <span class="data-value">${
        wsData.solarradiation
      } W/m²</span></p>
      <p><strong>Barometric Pressure (Relative):</strong> <span class="data-value">${
        wsData.baromrelin
      } inHg</span></p>
      <p><strong>Barometric Pressure (Absolute):</strong> <span class="data-value">${
        wsData.baromabsin
      } inHg</span></p>
    </div>
  `;
}

// Get the correct time offset
function getNYCurrentOffset() {
  // Set a date object to New York time
  const dateNY = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const nyDate = new Date(dateNY);

  // Get the timezone offset in minutes and convert it to hours
  const offsetMinutes = nyDate.getTimezoneOffset();
  const offsetHours = offsetMinutes / 60;

  return -offsetHours; // Negate the value because getTimezoneOffset() returns the value as a difference from local time to UTC, and we want it the other way around
}

function displaySunData(data) {
  const sunDataContainer = document.getElementById("home-sun-data");

  // Assuming an offset of -5 for Eastern Standard Time
  const offset = getNYCurrentOffset(); // Change this to your actual timezone offset

  const sunriseLocal = convertUTCToLocal(data.results.sunrise, offset);
  const sunsetLocal = convertUTCToLocal(data.results.sunset, offset);

  sunDataContainer.innerHTML = `
    <h2 class="section-heading">Sun Data</h2>
    <p><strong>Sunrise:</strong> <span class="data-value">${sunriseLocal} am</span></p>
    <p><strong>Sunset:</strong> <span class="data-value">${sunsetLocal} pm</span></p>
    <p><strong>Day Length:</strong> <span class="data-value">${data.results.day_length}</span></p>
  `;
}

// load data immediately
getWeatherStationData();

// Update weather every 1 minute
setInterval(() => getWeatherStationData(), 60000);
