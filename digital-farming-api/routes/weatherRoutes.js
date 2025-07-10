const express = require('express');
const router = express.Router();
const { getWeatherByCity, getWeatherForecast } = require('../services/weatherService');

/**
 * @route   GET /api/weather/:city
 * @desc    Get current weather for a city in Kenya
 * @access  Public
 */
router.get('/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const weatherData = await getWeatherByCity(city);
    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

/**
 * @route   GET /api/weather/forecast/:city
 * @desc    Get weather forecast for a city in Kenya
 * @access  Public
 */
router.get('/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const forecastData = await getWeatherForecast(city);
    res.json(forecastData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
