/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CloudRain, Sun, Wind } from 'lucide-react';
import { formatDayName, formatTemperature } from '../utils';
import { getWeatherCondition } from '../constants';
import { motion } from 'motion/react';

export function WeatherForecast({ weather }) {
  const forecastDays = weather.daily.slice(0, 5); // 5 days requested

  // Calculate global min and max over the 5 days to draw proportion indicators
  const allMaxs = forecastDays.map(d => d.tempMax);
  const allMins = forecastDays.map(d => d.tempMin);
  const globalMax = Math.max(...allMaxs);
  const globalMin = Math.min(...allMins);
  const totalRange = globalMax - globalMin || 1;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex flex-col gap-4 w-full" id="weather-forecast-section">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 select-none font-mono">
        Prévisions sur 5 jours
      </h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
        id="forecast-list"
      >
        {forecastDays.map((forecast, idx) => {
          const condition = getWeatherCondition(forecast.weatherCode);
          const Icon = condition.icon;
          
          // Calculate percentages for temperature visual bars
          const leftPercent = ((forecast.tempMin - globalMin) / totalRange) * 100;
          const rightPercent = ((globalMax - forecast.tempMax) / totalRange) * 100;
          const widthPercent = 100 - leftPercent - rightPercent;

          return (
            <motion.div
              key={forecast.date}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl transition-all duration-300"
              variants={itemVariants}
              id={`forecast-row-${idx}`}
            >
              {/* Day title & date info */}
              <div className="w-28 sm:w-36 flex flex-col shrink-0 select-none">
                <span className="text-sm font-bold text-white leading-normal">
                  {formatDayName(forecast.date)}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mt-0.5">
                  {forecast.date.split('-')[2]}/{forecast.date.split('-')[1]}
                </span>
              </div>

              {/* Icon, label and precipitation if any */}
              <div className="flex items-center gap-3 w-32 sm:w-44 shrink-0">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0 text-zinc-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col select-none">
                  <span className="text-xs font-semibold text-white leading-tight truncate max-w-28 sm:max-w-36">
                    {condition.label}
                  </span>
                  {forecast.precipitationSum > 0 && (
                    <span className="text-[10px] text-sky-300 font-medium flex items-center gap-1 mt-0.5">
                      <CloudRain className="h-2.5 w-2.5" />
                      {forecast.precipitationSum.toFixed(1)} mm
                    </span>
                  )}
                </div>
              </div>

              {/* Temperature Range Slider / Progression Bar (Apple Weather Style) */}
              <div className="flex items-center gap-3.5 flex-1 justify-end">
                {/* Min temp label */}
                <span className="text-xs font-bold text-zinc-400 w-8 text-right font-mono select-none">
                  {formatTemperature(forecast.tempMin)}
                </span>

                {/* Relative progress bar */}
                <div className="relative h-2 rounded-full flex-1 max-w-36 bg-white/10 overflow-hidden hidden sm:block">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-300"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.max(widthPercent, 8)}%`
                    }}
                  />
                </div>

                {/* Max temp label */}
                <span className="text-xs font-black text-rose-300 w-8 text-right font-mono select-none">
                  {formatTemperature(forecast.tempMax)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
