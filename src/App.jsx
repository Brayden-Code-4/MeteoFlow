/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { WeatherMain } from './components/WeatherMain';
import { WeatherDetails } from './components/WeatherDetails';
import { WeatherForecast } from './components/WeatherForecast';
import { Toast } from './components/Toast';
import { useGeolocation } from './hooks/useGeolocation';
import { fetchWeatherData, reverseGeocode, searchCities } from './services/api';
import { DEFAULT_COORDINATES, getWeatherCondition } from './constants';
import { getLocalFavorites, saveLocalFavorite, removeLocalFavorite, getLocalHistory, addLocalHistory, clearLocalHistory } from './utils';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, ThermometerSun, AlertTriangle } from 'lucide-react';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [toasts, setToasts] = useState([]);

  const { requestLocation, loading: geoLoading } = useGeolocation();

  // Helper to push toasts
  const addToast = useCallback((text, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch complete weather flow
  const loadWeather = useCallback(async (
    lat,
    lon,
    cityName,
    countryName,
    countryCode,
    admin1,
    isRefresh = false
  ) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await fetchWeatherData(lat, lon, cityName, countryName, countryCode, admin1);
      setWeatherData(data);
      if (isRefresh) {
        addToast(`Météo mise à jour pour ${cityName}`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || "Impossible de récupérer les données météo.", 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast]);

  // Handle choice of target city suggestion
  const handleSelectCity = useCallback((city) => {
    addLocalHistory(city.name);
    setHistory(getLocalHistory());
    loadWeather(
      city.latitude,
      city.longitude,
      city.name,
      city.country,
      city.country_code,
      city.admin1
    );
  }, [loadWeather]);

  // Handle direct text searches or click from recent histories
  const handleSelectHistory = useCallback(async (cityName) => {
    setLoading(true);
    try {
      const suggestions = await searchCities(cityName);
      if (suggestions && suggestions.length > 0) {
        const topResult = suggestions[0];
        handleSelectCity(topResult);
      } else {
        addToast(`La ville "${cityName}" est introuvable.`, 'error');
        setLoading(false);
      }
    } catch (e) {
      addToast("Erreur de recherche. Veuillez vérifier votre connexion.", 'error');
      setLoading(false);
    }
  }, [handleSelectCity, addToast]);

  // Geolocation trigger
  const handleLocateUser = useCallback(() => {
    addToast("Recherche de votre position GPS...", "info");
    
    requestLocation(
      async (lat, lon) => {
        try {
          // get real municipal name via reverse translation
          const address = await reverseGeocode(lat, lon);
          addLocalHistory(address.city);
          setHistory(getLocalHistory());
          
          loadWeather(lat, lon, address.city, address.country, address.countryCode, address.admin1);
          addToast("Géolocalisation réussie !", "success");
        } catch (e) {
          // fallback
          loadWeather(lat, lon, "Ma Position", "GPS", "");
        }
      },
      (geoErrorMsg) => {
        addToast(geoErrorMsg, "error");
        // default fallback if was initial mount
        if (!weatherData) {
          addToast("Chargement de la ville par défaut (Paris)...", "info");
          loadWeather(
            DEFAULT_COORDINATES.latitude,
            DEFAULT_COORDINATES.longitude,
            DEFAULT_COORDINATES.name,
            DEFAULT_COORDINATES.country,
            DEFAULT_COORDINATES.countryCode
          );
        }
      }
    );
  }, [requestLocation, loadWeather, weatherData, addToast]);

  // Initial load
  useEffect(() => {
    setFavorites(getLocalFavorites());
    setHistory(getLocalHistory());

    // Proactive request for geolocation on start
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const address = await reverseGeocode(latitude, longitude);
            addLocalHistory(address.city);
            setHistory(getLocalHistory());
            loadWeather(latitude, longitude, address.city, address.country, address.countryCode, address.admin1);
          } catch (e) {
            loadWeather(latitude, longitude, "Ma Position", "GPS", "");
          }
        },
        () => {
          // coordinate fallback to Default (Paris) if blocked/error
          loadWeather(
            DEFAULT_COORDINATES.latitude,
            DEFAULT_COORDINATES.longitude,
            DEFAULT_COORDINATES.name,
            DEFAULT_COORDINATES.country,
            DEFAULT_COORDINATES.countryCode
          );
        },
        { timeout: 4000 }
      );
    } else {
      loadWeather(
        DEFAULT_COORDINATES.latitude,
        DEFAULT_COORDINATES.longitude,
        DEFAULT_COORDINATES.name,
        DEFAULT_COORDINATES.country,
        DEFAULT_COORDINATES.countryCode
      );
    }
  }, []);

  // Favorite toggle handler
  const handleToggleFavorite = useCallback(() => {
    if (!weatherData) return;
    
    const favId = `${weatherData.latitude.toFixed(3)}-${weatherData.longitude.toFixed(3)}`;
    const isCurrentFav = favorites.some(
      f => 
        (f.name.toLowerCase() === weatherData.city.toLowerCase() && 
         Math.abs(f.latitude - weatherData.latitude) < 0.05 && 
         Math.abs(f.longitude - weatherData.longitude) < 0.05)
    );

    if (isCurrentFav) {
      // Find matching ID and remove
      const matchingFav = favorites.find(
        f => 
          (f.name.toLowerCase() === weatherData.city.toLowerCase() && 
           Math.abs(f.latitude - weatherData.latitude) < 0.05 && 
           Math.abs(f.longitude - weatherData.longitude) < 0.05)
      );
      if (matchingFav) {
        removeLocalFavorite(matchingFav.id);
        addToast(`${weatherData.city} retiré des favoris.`, 'info');
      }
    } else {
      const newFav = {
        id: favId,
        name: weatherData.city,
        country: weatherData.country,
        latitude: weatherData.latitude,
        longitude: weatherData.longitude,
        admin1: weatherData.admin1,
      };
      saveLocalFavorite(newFav);
      addToast(`${weatherData.city} ajouté aux favoris !`, 'success');
    }
    
    setFavorites(getLocalFavorites());
  }, [weatherData, favorites, addToast]);

  const handleRemoveFavorite = useCallback((id) => {
    const fav = favorites.find(f => f.id === id);
    removeLocalFavorite(id);
    setFavorites(getLocalFavorites());
    if (fav) {
      addToast(`${fav.name} retiré des favoris.`, 'info');
    }
  }, [favorites, addToast]);

  const handleClearHistory = useCallback(() => {
    clearLocalHistory();
    setHistory([]);
    addToast("Historique de recherche vidé.", "info");
  }, [addToast]);

  const handleRefresh = useCallback(() => {
    if (!weatherData) return;
    loadWeather(
      weatherData.latitude,
      weatherData.longitude,
      weatherData.city,
      weatherData.country,
      weatherData.countryCode,
      weatherData.admin1,
      true
    );
  }, [weatherData, loadWeather]);

  // Determine atmospheric visual backdrop class based on current loaded weather values
  const currentCondition = weatherData ? getWeatherCondition(weatherData.current.weatherCode) : null;
  const isDay = weatherData ? weatherData.current.isDay : true;
  const bgGradient = currentCondition
    ? (isDay ? currentCondition.backgroundClass.day : currentCondition.backgroundClass.night)
    : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-rose-950/20';

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 bg-[#0A0F1E] text-white flex flex-col justify-between font-sans relative overflow-hidden" id="meteoflow-root-container">
      
      {/* Absolute Dynamic Atmospheric Overlay */}
      <div className={`absolute inset-0 transition-all duration-1000 ${bgGradient} opacity-[0.12] pointer-events-none z-0`} />

      {/* Dynamic atmospheric ambient glow balls */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] rounded-full bg-indigo-800/10 blur-[150px] pointer-events-none translate-x-1/3 z-0" />

      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 relative z-10 flex-1">
        
        {/* Modular Custom Header */}
        <Header
          onSelectCity={handleSelectCity}
          onLocateUser={handleLocateUser}
          isLocating={geoLoading}
          favorites={favorites}
          history={history}
          onClearHistory={handleClearHistory}
          onSelectHistory={handleSelectHistory}
          onRemoveFavorite={handleRemoveFavorite}
        />

        {/* Primary Main Content Area */}
        <main className="flex-1 flex flex-col gap-6" id="meteoflow-main-content">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 min-h-[400px] flex flex-col items-center justify-center gap-4 bg-white/5 border border-white/5 backdrop-blur-md rounded-3xl p-8 text-center"
                id="loading-spinner-container"
              >
                <div className="relative flex items-center justify-center h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-4 border-sky-400/20 border-t-sky-400 animate-spin" />
                  <Compass className="h-8 w-8 text-sky-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight text-white mb-1">MeteoFlow Synchronisation</h4>
                  <p className="text-xs text-zinc-300 max-w-xs leading-relaxed">
                    Connexion aux serveurs météo et affinement des prévisions en cours...
                  </p>
                </div>
              </motion.div>
            ) : weatherData ? (
              <motion.div
                key="weather-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full"
                id="weather-layout-loaded"
              >
                {/* Left Panel - Primary Weather Info and Forecasts (col-span-8) */}
                <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 w-full">
                  <WeatherMain
                    weather={weatherData}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                  />

                  <WeatherForecast weather={weatherData} />
                </div>

                {/* Right Panel - Secondary Metrics details block and status ticker (col-span-4) */}
                <div className="col-span-1 lg:col-span-4 flex flex-col gap-6 w-full">
                  <WeatherDetails weather={weatherData} />

                  {/* App Status Indicator / Live stream Active indicator */}
                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5 flex items-center justify-between gap-3 backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-blue-300 font-mono">Stream temps réel actif</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">CDG-75001</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-h-[450px] flex flex-col items-center justify-center gap-4 bg-white/5 border border-white/5 backdrop-blur-md rounded-3xl p-8 text-center"
                id="empty-weather-state"
              >
                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  <AlertTriangle className="h-10 w-10" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-xl font-bold tracking-tight text-white mb-2">Aucune donnée météo</h3>
                  <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
                    Nous n&apos;avons pas réussi à récupérer de coordonnées. Saisissez une ville dans la barre de recherche supérieure ou activez la géolocalisation pour commencer.
                  </p>
                  <button
                    onClick={handleLocateUser}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 font-semibold text-sm text-white hover:opacity-90 active:scale-95 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Compass className="h-4.5 w-4.5" /> Réessayer la géolocalisation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Global Toast Alerts Notifications overlay */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Bottom Footer block */}
      <footer className="w-full mt-10 border-t border-white/5 pt-4 text-center text-[10px] text-zinc-500 font-mono tracking-wider flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto select-none gap-2">
        <span>© 2026 METEOFLOW INC. TOUS DROITS RÉSERVÉS</span>
        <span className="flex items-center gap-1.5 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5 leading-none">
          <ThermometerSun className="h-3.5 w-3.5 text-amber-300" /> Données fournies par Open-Meteo API (Open Data)
        </span>
      </footer>
    </div>
  );
}
