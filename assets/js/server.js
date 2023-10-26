import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Endpoint to get data from the Ambient Weather API
app.get("/weather/station", async (req, res) => {
  const AW_API_KEY = process.env.AW_API_KEY;
  const MAC_ADDRESS = process.env.MAC_ADDRESS;
  const APP_KEY = process.env.APP_KEY;
  const URL = `https://api.ambientweather.net/v1/devices/${MAC_ADDRESS}?apiKey=${AW_API_KEY}&applicationKey=${APP_KEY}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data." });
  }
});

// Endpoint to get sunrise-sunset data
app.get("/sun-data", async (req, res) => {
  const SUN_API_URL = `https://api.sunrise-sunset.org/json?lat=37.3856&lng=-77.6971&date=today`;

  try {
    const response = await fetch(SUN_API_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sun data." });
  }
});

// Your endpoint for Open Weather API
app.get("/weather/location", async (req, res) => {
  const API_KEY = process.env.OPEN_WEATHER_API_KEY;
  const lat = process.env.LATITUDE;
  const lon = process.env.LONGITUDE;
  // Add the rest of your implementation...

  // Example:
  const URL = `Your Open Weather API endpoint with ${lat} and ${lon}`;
  try {
    const response = await fetch(URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching open weather data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
