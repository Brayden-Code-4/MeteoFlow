/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Compass, Star, History, Trash2, X } from 'lucide-react';
import { searchCities } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

export function Header({
  onSelectCity,
  onLocateUser,
  isLocating,
  favorites,
  history,
  onClearHistory,
  onSelectHistory,
  onRemoveFavorite,
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setHistoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with a simple debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setDropdownOpen(results.length > 0);
        setActiveSuggestionIndex(-1);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        handlePickCity(suggestions[activeSuggestionIndex]);
      } else if (suggestions.length > 0) {
        // Default to first suggestion
        handlePickCity(suggestions[0]);
      } else if (query.trim().length >= 2) {
        // Launch a direct search
        onSelectHistory(query.trim());
        setDropdownOpen(false);
      }
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
      setHistoryOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const handlePickCity = (city) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setDropdownOpen(false);
    setActiveSuggestionIndex(-1);
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  return (
    <header className="relative z-50 w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-lg" id="meteoflow-header">
      {/* Brand Logo & Name */}
      <div 
        onClick={() => onSelectHistory('Paris')} 
        className="flex items-center gap-3 cursor-pointer group"
        id="meteoflow-logo-container"
      >
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-md group-hover:scale-105 transition-transform duration-300">
          <Compass className="h-6 w-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-0.5 font-sans flex items-center gap-1.5">
            MeteoFlow <span className="text-[10px] font-medium tracking-widest bg-white/10 text-white/90 px-1.5 py-0.5 rounded-md uppercase border border-white/5">V1</span>
          </h1>
          <p className="text-[11px] text-zinc-300 leading-none">Météo &amp; Trajectoires fluides</p>
        </div>
      </div>

      {/* Search Input & Controls */}
      <div className="flex-1 max-w-lg w-full relative flex items-center gap-2" ref={dropdownRef} id="meteoflow-search-controls">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="w-full py-2.5 pl-11 pr-10 text-sm font-medium rounded-xl border border-white/10 bg-white/10 text-white placeholder-zinc-300/55 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 backdrop-blur-md transition-all duration-300"
            placeholder="Rechercher une ville, région ou pays..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setDropdownOpen(suggestions.length > 0);
              setHistoryOpen(history.length > 0 && query.trim().length === 0);
            }}
            onKeyDown={handleKeyDown}
            id="city-search-input"
            autoComplete="off"
          />
          
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setDropdownOpen(false);
                searchInputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-white transition-colors p-1"
              id="clear-search-button"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <div className="h-4 w-4 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin" />
            </div>
          )}

          {/* Autocomplete Suggestions dropdown */}
          <AnimatePresence>
            {dropdownOpen && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 z-40 rounded-xl border border-white/15 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-1 overflow-hidden"
                id="search-suggestions-dropdown"
              >
                <div className="text-[10px] uppercase tracking-wider text-zinc-400/80 px-3 py-1.5 font-bold border-b border-white/5">
                  Résultats suggérés
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {suggestions.map((city, index) => (
                    <div
                      key={city.id}
                      onClick={() => handlePickCity(city)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-white cursor-pointer transition-colors ${
                        index === activeSuggestionIndex
                          ? 'bg-sky-500/20 text-sky-200 border border-sky-500/20'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                      id={`suggestion-item-${city.id}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-white leading-normal">
                          {city.name}
                        </span>
                        <span className="text-[11px] text-zinc-400 mt-0.5">
                          {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-white/5 uppercase">
                        {city.country_code}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Search History dropdown */}
          <AnimatePresence>
            {historyOpen && !dropdownOpen && history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 z-40 rounded-xl border border-white/15 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-1  overflow-hidden"
                id="search-history-dropdown"
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-400 px-3 py-2 border-b border-white/5 font-bold">
                  <span className="flex items-center gap-1.5"><History className="h-3 w-3" /> Recherches récentes</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearHistory();
                      setHistoryOpen(false);
                    }}
                    className="flex items-center gap-1 hover:text-red-400 transition-colors uppercase cursor-pointer"
                  >
                    <Trash2 className="h-2.5 w-2.5" /> Effacer
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectHistory(item.cityName);
                        setQuery('');
                        setHistoryOpen(false);
                      }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 cursor-pointer transition-all border border-transparent"
                      id={`history-item-${item.id}`}
                    >
                      <span className="font-medium">{item.cityName}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(item.searchedAt).toLocaleDateString('fr-FR', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Localisation GPS Trigger */}
        <button
          onClick={onLocateUser}
          disabled={isLocating}
          className={`relative p-3 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
            isLocating
              ? 'bg-sky-400/20 border-sky-400 text-sky-400 animate-pulse'
              : 'bg-white/10 border-white/10 hover:bg-white/15 text-white hover:border-white/25 active:scale-95'
          }`}
          title="Me géolocaliser"
          id="geolocation-trigger-button"
        >
          {isLocating ? (
            <div className="h-4.5 w-4.5 rounded-full border-[2.2px] border-sky-400/30 border-t-sky-400 animate-spin" />
          ) : (
            <MapPin className="h-4.5 w-4.5" />
          )}
        </button>
      </div>

      {/* Favorites shortcuts bar */}
      {favorites.length > 0 && (
        <div className="flex items-center gap-1 md:gap-2 max-w-full overflow-x-auto scrollbar-none py-1" id="favorites-bar-shortcuts">
          <div className="text-zinc-400 shrink-0 select-none hidden lg:flex items-center gap-1 text-[11px] font-semibold uppercase pr-1">
            <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" /> Favoris:
          </div>
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="group flex items-center gap-1 pl-3.5 pr-1.5 py-1.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 backdrop-blur-md text-xs text-white transition-all cursor-pointer select-none shrink-0"
              onClick={() => onSelectCity({
                id: Number(fav.id.split('-')[0]) || Math.floor(Math.random() * 10000),
                name: fav.name,
                latitude: fav.latitude,
                longitude: fav.longitude,
                country: fav.country,
                country_code: '',
                admin1: fav.admin1,
                timezone: 'UTC'
              })}
              id={`favorite-shortcut-${fav.id}`}
            >
              <span className="font-medium pr-1">{fav.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(fav.id);
                }}
                className="opacity-40 group-hover:opacity-100 hover:text-red-400 transition-all p-0.5 rounded cursor-pointer"
                title="Supprimer ce favori"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
