/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function formatTemperature(temp) {
  return `${Math.round(temp)}°`;
}

export function formatWindSpeed(speed) {
  return `${Math.round(speed)} km/h`;
}

export function formatPressure(hpa) {
  return `${Math.round(hpa)} hPa`;
}

export function formatHumidity(pct) {
  return `${Math.round(pct)}%`;
}

export function formatDayName(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui";
  }

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return "Demain";
  }

  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  const formatted = date.toLocaleDateString('fr-FR', options);
  // Cap first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatTime(timeStr) {
  try {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (e) {
    // Fallback if string is just "HH:MM" already
    if (timeStr && timeStr.includes(':')) {
      const parts = timeStr.split('T');
      const timePart = parts.length > 1 ? parts[1] : parts[0];
      return timePart.substring(0, 5);
    }
    return '--:--';
  }
}

export function getLocalFavorites() {
  try {
    const favs = localStorage.getItem('meteoflow_favorites');
    return favs ? JSON.parse(favs) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalFavorite(item) {
  try {
    const favs = getLocalFavorites();
    if (!favs.some(f => f.id === item.id)) {
      favs.push(item);
      localStorage.setItem('meteoflow_favorites', JSON.stringify(favs));
    }
  } catch (e) {
    console.error(e);
  }
}

export function removeLocalFavorite(id) {
  try {
    const favs = getLocalFavorites();
    const updated = favs.filter(f => f.id !== id);
    localStorage.setItem('meteoflow_favorites', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

export function getLocalHistory() {
  try {
    const history = localStorage.getItem('meteoflow_history');
    return history ? JSON.parse(history) : [];
  } catch (e) {
    return [];
  }
}

export function addLocalHistory(cityName) {
  try {
    const history = getLocalHistory();
    // remove existing duplicate if search matches
    const filtered = history.filter(h => h.cityName.toLowerCase() !== cityName.toLowerCase());
    
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      cityName,
      searchedAt: new Date().toISOString()
    };
    
    // limit to 6 recent items
    const updated = [newItem, ...filtered].slice(0, 6);
    localStorage.setItem('meteoflow_history', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

export function clearLocalHistory() {
  try {
    localStorage.removeItem('meteoflow_history');
  } catch (e) {
    console.error(e);
  }
}
