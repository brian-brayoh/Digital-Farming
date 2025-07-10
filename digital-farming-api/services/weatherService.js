const axios = require('axios');
require('dotenv').config();

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get weather data for a specific location in Kenya
 * @param {string} city - City name in Kenya (e.g., 'Nairobi', 'Mombasa')
 * @returns {Promise<Object>} Weather data
 */
const getWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: `${city},KE`, // KE is the country code for Kenya
        appid: WEATHER_API_KEY,
        units: 'metric', // Get temperature in Celsius
      },
    });
    
    // Format the response to include only necessary data
    return {
      location: response.data.name,
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      wind_speed: response.data.wind.speed,
      weather: response.data.weather[0].main,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

/**
 * Get weather forecast for a specific location in Kenya
 * @param {string} city - City name in Kenya
 * @returns {Promise<Array>} Weather forecast data for next 5 days
 */
const getWeatherForecast = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: `${city},KE`,
        appid: WEATHER_API_KEY,
        units: 'metric',
        cnt: 5, // Get forecast for next 5 days
      },
    });

    return response.data.list.map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      weather: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw new Error('Failed to fetch weather forecast');
  }
};

module.exports = {
  getWeatherByCity,
  getWeatherForecast,
};
