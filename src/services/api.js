/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Searches for cities using the Open-Meteo Geocoding API.
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const encodedQuery = encodeURIComponent(query.trim());
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedQuery}&count=8&language=fr&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur serveur code: ${response.status}`);
    }
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    
    return data.results.map((item) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || item.country_code,
      country_code: item.country_code || '',
      admin1: item.admin1,
      timezone: item.timezone || 'UTC'
    }));
  } catch (error) {
    console.error('Error during city search:', error);
    throw error;
  }
}

/**
 * Fetches the current weather and 5-day forecast for a given latitude and longitude.
 */
export async function fetchWeatherData(
  latitude,
  longitude,
  cityName,
  countryName,
  countryCode,
  admin1
) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,wind_speed_10m_max,precipitation_sum&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`La météo n'a pas pu être récupérée pour cette zone (Erreur ${response.status})`);
    }
    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error("Format de données météo incorrect reçu de l'API.");
    }

    const currentUnits = data.current_units?.temperature_2m || '°C';

    const current = {
      temperature: data.current.temperature_2m,
      temperatureUnit: currentUnits,
      humidity: data.current.relative_humidity_2m,
      apparentTemperature: data.current.apparent_temperature,
      isDay: data.current.is_day === 1,
      precipitation: data.current.precipitation || 0,
      weatherCode: data.current.weather_code,
      cloudCover: data.current.cloud_cover,
      pressure: data.current.pressure_msl,
      windSpeed: data.current.wind_speed_10m,
      time: data.current.time,
    };

    const dailyForecasts = [];
    const dailyData = data.daily;
    const daysLength = dailyData.time ? dailyData.time.length : 0;

    // Use up to 7 days, but standard is 5 or 7, we'll map all of them and slice later in React
    for (let i = 0; i < daysLength; i++) {
      dailyForecasts.push({
        date: dailyData.time[i],
        weatherCode: dailyData.weather_code[i],
        tempMax: dailyData.temperature_2m_max[i],
        tempMin: dailyData.temperature_2m_min[i],
        apparentMax: dailyData.apparent_temperature_max ? dailyData.apparent_temperature_max[i] : dailyData.temperature_2m_max[i],
        apparentMin: dailyData.apparent_temperature_min ? dailyData.apparent_temperature_min[i] : dailyData.temperature_2m_min[i],
        sunrise: dailyData.sunrise ? dailyData.sunrise[i] : '',
        sunset: dailyData.sunset ? dailyData.sunset[i] : '',
        uvIndexMax: dailyData.uv_index_max ? dailyData.uv_index_max[i] : 0,
        windSpeedMax: dailyData.wind_speed_10m_max ? dailyData.wind_speed_10m_max[i] : 0,
        precipitationSum: dailyData.precipitation_sum ? dailyData.precipitation_sum[i] : 0,
      });
    }

    return {
      city: cityName,
      country: countryName,
      countryCode: countryCode,
      admin1: admin1,
      latitude,
      longitude,
      timezone: data.timezone || 'UTC',
      current,
      daily: dailyForecasts,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Performs reverse geocoding using BigDataCloud's free client.
 * Returns city name, country name, and country code.
 */
export async function reverseGeocode(latitude, longitude) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reverse geocode failed with status ${response.status}`);
    }
    const data = await response.json();
    return {
      city: data.city || data.locality || data.village || 'Position Locale',
      country: data.countryName || 'Inconnu',
      countryCode: data.countryCode || '',
      admin1: data.principalSubdivision || undefined
    };
  } catch (e) {
    console.warn('Reverse geocoding failed or offline, falling back to coordinates name:', e);
    return {
      city: `Position Locale`,
      country: 'GPS',
      countryCode: '',
    };
  }
}
