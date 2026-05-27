/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, RefreshCw, Calendar, MapPin } from 'lucide-react';
import { getWeatherCondition, getCountryName } from '../constants';
import { formatTemperature } from '../utils';
import { motion } from 'motion/react';

export function WeatherMain({
  weather,
  favorites,
  onToggleFavorite,
  onRefresh,
  isRefreshing,
}) {
  const currentCondition = getWeatherCondition(weather.current.weatherCode);
  const IconComponent = currentCondition.icon;
  
  // Check if current loaded city is saved as a favorite
  const isFavorite = favorites.some(
    f => 
      (f.name.toLowerCase() === weather.city.toLowerCase() && 
       Math.abs(f.latitude - weather.latitude) < 0.05 && 
       Math.abs(f.longitude - weather.longitude) < 0.05)
  );

  const formattedDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 shadow-xl text-white flex flex-col justify-between min-h-[320px]"
      id="weather-main-card"
    >
      {/* Absolute top decoration or glare */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

      {/* Top row: City information and Action icons */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sky-300 animate-bounce" />
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" id="weather-location-title">
              {weather.city}
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white/10 border border-white/5 text-zinc-200 mt-1 w-fit rounded-lg tracking-wide uppercase font-mono">
            {weather.admin1 ? `${weather.admin1}, ` : ''}{getCountryName(weather.country)}
          </span>
        </div>

        {/* Favorite toggle and Refresh icon button group */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 cursor-pointer`}
            title="Rafraîchir les données"
            id="refresh-weather-button"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${isRefreshing ? 'animate-spin text-sky-300' : 'text-white'}`} />
          </button>
          <button
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
              isFavorite
                ? 'bg-amber-400/20 border-amber-400/30 text-amber-300 hover:bg-amber-400/30'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-zinc-300 hover:text-white'
            }`}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            id="favorite-weather-button"
          >
            <Star className={`h-4.5 w-4.5 ${isFavorite ? 'fill-amber-300' : ''}`} />
          </button>
        </div>
      </div>

      {/* Middle row: Large Temp and visual status */}
      <div className="flex flex-col md:flex-row items-baseline md:items-center justify-between gap-6 my-6">
        <div className="flex items-baseline select-none">
          <span className="text-7xl md:text-8xl font-black tracking-tighter" id="weather-temperature-display">
            {formatTemperature(weather.current.temperature)}
          </span>
          <span className="text-xl md:text-2xl font-bold ml-1 text-slate-300 shrink-0">°C</span>
        </div>

        {/* Current Weather Condition details visual */}
        <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 shadow-inner flex items-center justify-center pointer-events-none mb-1">
            <IconComponent className="h-14 w-14 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" />
          </div>
          <p className="text-lg font-bold tracking-tight text-white leading-normal" id="weather-description">
            {currentCondition.label}
          </p>
          <p className="text-xs text-zinc-300 font-medium">
            Ressenti {formatTemperature(weather.current.apparentTemperature)}C — Humidité {weather.current.humidity}%
          </p>
        </div>
      </div>

      {/* Bottom row: Time/Date and Coordinates */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 font-medium select-none">
        <div className="flex items-center gap-2 leading-none">
          <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
          <span className="capitalize">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 bg-black/10 px-2 py-1 rounded-md border border-white/5">
          <span>Lat: {weather.latitude.toFixed(4)}</span>
          <span className="text-white/20">•</span>
          <span>Lon: {weather.longitude.toFixed(4)}</span>
        </div>
      </div>
    </motion.div>
  );
}
