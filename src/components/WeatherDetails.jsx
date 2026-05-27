/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  Cloudy,
  Sun
} from 'lucide-react';
import {
  formatHumidity,
  formatPressure,
  formatTemperature,
  formatWindSpeed,
  formatTime
} from '../utils';
import { motion } from 'motion/react';

export function WeatherDetails({ weather }) {
  const current = weather.current;
  const todayForecast = weather.daily[0];

  const details = [
    {
      id: 'apparent-temperature',
      label: 'Ressenti',
      value: formatTemperature(current.apparentTemperature) + 'C',
      desc: current.apparentTemperature > current.temperature ? 'Plus chaud que réel' : 'Plus frais que réel',
      icon: Thermometer,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/10'
    },
    {
      id: 'humidity',
      label: 'Humidité',
      value: formatHumidity(current.humidity),
      desc: current.humidity > 60 ? 'Climat humide' : current.humidity < 40 ? 'Climat sec' : 'Climat équilibré',
      icon: Droplets,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/10'
    },
    {
      id: 'wind',
      label: 'Vitesse du vent',
      value: formatWindSpeed(current.windSpeed),
      desc: current.windSpeed > 25 ? 'Vent fort' : current.windSpeed > 10 ? 'Brise modérée' : 'Calme',
      icon: Wind,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/10'
    },
    {
      id: 'pressure',
      label: 'Pression',
      value: formatPressure(current.pressure),
      desc: current.pressure > 1015 ? 'Anticyclone' : current.pressure < 1009 ? 'Dépression' : 'Normale',
      icon: Gauge,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/10'
    },
    {
      id: 'sunrise',
      label: 'Lever du soleil',
      value: todayForecast ? formatTime(todayForecast.sunrise) : '--:--',
      desc: 'Début du jour',
      icon: Sunrise,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/10'
    },
    {
      id: 'sunset',
      label: 'Coucher du soleil',
      value: todayForecast ? formatTime(todayForecast.sunset) : '--:--',
      desc: 'Fin du jour',
      icon: Sunset,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/10'
    },
    {
      id: 'cloudiness',
      label: 'Couverture Nuageuse',
      value: `${current.cloudCover}%`,
      desc: current.cloudCover > 80 ? 'Ciel très couvert' : current.cloudCover > 30 ? 'Ciels couverts' : 'Ciel clair',
      icon: Cloudy,
      color: 'text-blue-300 bg-blue-400/10 border-blue-400/10'
    },
    {
      id: 'uv-index',
      label: 'Index UV Max',
      value: todayForecast ? todayForecast.uvIndexMax.toFixed(1) : '-',
      desc: todayForecast && todayForecast.uvIndexMax > 5 ? 'Protection requise' : 'Faible risque',
      icon: Sun,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/10'
    }
  ];

  return (
    <div className="flex flex-col gap-4" id="weather-details-section">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 select-none font-mono">
        Paramètres Secondaires
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3" id="weather-details-grid">
        {details.map((detail, idx) => {
          const Icon = detail.icon;
          return (
            <motion.div
              key={detail.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className={`p-4 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-xl flex flex-col justify-between gap-3 shadow-inner-white hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.99] transition-all duration-300`}
              id={`detail-card-${detail.id}`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <span className="text-xs font-medium text-slate-400 font-sans tracking-tight">
                  {detail.label}
                </span>
                <Icon className="h-4.5 w-4.5 text-slate-300 shrink-0" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-lg md:text-xl font-black text-white font-mono tracking-tight leading-none">
                  {detail.value}
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-none mt-1">
                  {detail.desc}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
