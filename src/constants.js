/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
} from 'lucide-react';

export const DEFAULT_COORDINATES = {
  name: 'Paris',
  country: 'France',
  countryCode: 'FR',
  latitude: 48.8566,
  longitude: 2.3522,
};

// World Meteorological Organization (WMO) Weather Interpretation Codes (WW)
export const WEATHER_CONDITIONS = {
  0: {
    label: 'Ciel dégagé',
    iconName: 'Sun',
    icon: Sun,
    backgroundClass: {
      day: 'bg-gradient-to-br from-sky-400 via-blue-500 to-amber-100',
      night: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-rose-950/20'
    }
  },
  1: {
    label: 'Principalement dégagé',
    iconName: 'CloudSun',
    icon: CloudSun,
    backgroundClass: {
      day: 'bg-gradient-to-br from-sky-400 via-blue-400 to-slate-200',
      night: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-zinc-900'
    }
  },
  2: {
    label: 'Partiellement nuageux',
    iconName: 'CloudSun',
    icon: CloudSun,
    backgroundClass: {
      day: 'bg-gradient-to-br from-blue-400 via-sky-300 to-slate-300',
      night: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    }
  },
  3: {
    label: 'Couvert',
    iconName: 'Cloud',
    icon: Cloud,
    backgroundClass: {
      day: 'bg-gradient-to-br from-slate-400 via-blue-300 to-slate-500',
      night: 'bg-gradient-to-br from-zinc-900 via-slate-900 to-slate-950'
    }
  },
  45: {
    label: 'Brouillard',
    iconName: 'CloudFog',
    icon: CloudFog,
    backgroundClass: {
      day: 'bg-gradient-to-br from-slate-300 via-zinc-300 to-blue-200',
      night: 'bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-900'
    }
  },
  48: {
    label: 'Brouillard givrant',
    iconName: 'CloudFog',
    icon: CloudFog,
    backgroundClass: {
      day: 'bg-gradient-to-br from-slate-200 via-blue-100 to-zinc-300',
      night: 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-900'
    }
  },
  51: {
    label: 'Bruine légère',
    iconName: 'CloudDrizzle',
    icon: CloudDrizzle,
    backgroundClass: {
      day: 'bg-gradient-to-br from-cyan-400 via-blue-400 to-slate-400',
      night: 'bg-gradient-to-br from-slate-900 via-blue-955 to-neutral-950'
    }
  },
  53: {
    label: 'Bruine modérée',
    iconName: 'CloudDrizzle',
    icon: CloudDrizzle,
    backgroundClass: {
      day: 'bg-gradient-to-br from-blue-300 via-slate-400 to-slate-600',
      night: 'bg-gradient-to-br from-slate-900 via-zinc-90 w-slate-950'
    }
  },
  55: {
    label: 'Bruine dense',
    iconName: 'CloudDrizzle',
    icon: CloudDrizzle,
    backgroundClass: {
      day: 'bg-gradient-to-br from-blue-400 via-slate-500 to-slate-700',
      night: 'bg-gradient-to-br from-zinc-900 via-slate-955 to-slate-955'
    }
  },
  56: {
    label: 'Bruine verglaçante légère',
    iconName: 'CloudDrizzle',
    icon: CloudDrizzle,
    backgroundClass: {
      day: 'bg-gradient-to-br from-blue-100 via-sky-300 to-slate-400',
      night: 'bg-gradient-to-br from-slate-900 via-neutral-900 to-sky-955/20'
    }
  },
  57: {
    label: 'Bruine verglaçante dense',
    iconName: 'CloudDrizzle',
    icon: CloudDrizzle,
    backgroundClass: {
      day: 'bg-gradient-to-br from-blue-200 via-sky-400 to-slate-500',
      night: 'bg-gradient-to-br from-zinc-900 via-zinc-955 to-blue-955/30'
    }
  },
  61: {
    label: 'Pluie faible',
    iconName: 'CloudRain',
    icon: CloudRain,
    backgroundClass: {
      day: 'bg-gradient-to-br from-sky-400 via-blue-500 to-slate-500',
      night: 'bg-gradient-to-br from-neutral-900 via-blue-955 to-slate-955'
    }
  },
  63: {
    label: 'Pluie modérée',
    iconName: 'CloudRain',
    icon: CloudRain,
    backgroundClass: {
      day: 'bg-gradient-to-br from-blue-400 via-blue-600 to-slate-600',
      night: 'bg-gradient-to-br from-slate-900 via-blue-955 to-slate-955'
    }
  },
  65: {
    label: 'Pluie forte',
    iconName: 'CloudRainWind',
    icon: CloudRainWind,
    backgroundClass: {
      day: 'bg-gradient-to-br from-indigo-400 via-blue-700 to-slate-700',
      night: 'bg-gradient-to-br from-stone-955 via-slate-955 to-blue-955'
    }
  },
  66: {
    label: 'Pluie verglaçante légère',
    iconName: 'CloudRain',
    icon: CloudRain,
    backgroundClass: {
      day: 'bg-gradient-to-br from-indigo-300 via-cyan-400 to-slate-400',
      night: 'bg-gradient-to-br from-zinc-955 via-slate-900 to-indigo-955/20'
    }
  },
  67: {
    label: 'Pluie verglaçante forte',
    iconName: 'CloudRainWind',
    icon: CloudRainWind,
    backgroundClass: {
      day: 'bg-gradient-to-br from-indigo-400 via-cyan-600 to-slate-600',
      night: 'bg-gradient-to-br from-stone-955 via-violet-955/40 to-cyan-955/20'
    }
  },
  71: {
    label: 'Chutes de neige faibles',
    iconName: 'CloudSnow',
    icon: CloudSnow,
    backgroundClass: {
      day: 'bg-gradient-to-br from-teal-100 via-sky-300 to-blue-300',
      night: 'bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-955/20'
    }
  },
  73: {
    label: 'Chutes de neige modérées',
    iconName: 'CloudSnow',
    icon: CloudSnow,
    backgroundClass: {
      day: 'bg-gradient-to-br from-teal-50 via-sky-200 to-slate-300',
      night: 'bg-gradient-to-br from-zinc-900 via-zinc-805 to-zinc-955'
    }
  },
  75: {
    label: 'Chutes de neige fortes',
    iconName: 'CloudSnow',
    icon: CloudSnow,
    backgroundClass: {
      day: 'bg-gradient-to-br from-white via-sky-100 to-slate-400',
      night: 'bg-gradient-to-br from-neutral-900 via-slate-900 to-white/10'
    }
  },
  77: {
    label: 'Grains de neige',
    iconName: 'CloudSnow',
    icon: CloudSnow,
    backgroundClass: {
      day: 'bg-gradient-to-br from-sky-100 via-slate-200 to-blue-200',
      night: 'bg-gradient-to-br from-neutral-900 via-neutral-955 to-blue-955'
    }
  },
  80: {
    label: 'Averses de pluie faibles',
    iconName: 'CloudRain',
    icon: CloudRain,
    backgroundClass: {
      day: 'bg-gradient-to-br from-sky-400 via-blue-500 to-zinc-400',
      night: 'bg-gradient-to-br from-zinc-900 via-blue-900/60 to-slate-955'
    }
  },
  81: {
    label: 'Averses de pluie modérées',
    iconName: 'CloudRain',
    icon: CloudRain,
    backgroundClass: {
      day: 'bg-gradient-to-br from-cyan-400 via-blue-600 to-slate-500',
      night: 'bg-gradient-to-br from-stone-900 via-indigo-955 to-slate-955'
    }
  },
  82: {
    label: 'Averses de pluie violentes',
    iconName: 'CloudRainWind',
    icon: CloudRainWind,
    backgroundClass: {
      day: 'bg-gradient-to-br from-blue-500 via-slate-700 to-indigo-955',
      night: 'bg-gradient-to-br from-stone-955 via-blue-955 to-neutral-955'
    }
  },
  85: {
    label: 'Averses de neige faibles',
    iconName: 'CloudSnow',
    icon: CloudSnow,
    backgroundClass: {
      day: 'bg-gradient-to-br from-sky-100 via-teal-100 to-slate-300',
      night: 'bg-gradient-to-br from-neutral-900 via-neutral-955 to-slate-955'
    }
  },
  86: {
    label: 'Averses de neige fortes',
    iconName: 'CloudSnow',
    icon: CloudSnow,
    backgroundClass: {
      day: 'bg-gradient-to-br from-slate-100 via-blue-100 to-slate-400',
      night: 'bg-gradient-to-br from-neutral-955 via-indigo-955/20 to-neutral-955'
    }
  },
  95: {
    label: 'Orage faible ou modéré',
    iconName: 'CloudLightning',
    icon: CloudLightning,
    backgroundClass: {
      day: 'bg-gradient-to-br from-slate-600 via-purple-700 to-stone-900',
      night: 'bg-gradient-to-br from-neutral-955 via-purple-955/40 to-stone-955'
    }
  },
  96: {
    label: 'Orage faible avec grêle',
    iconName: 'CloudLightning',
    icon: CloudLightning,
    backgroundClass: {
      day: 'bg-gradient-to-br from-slate-700 via-purple-800 to-stone-900',
      night: 'bg-gradient-to-br from-neutral-955 via-purple-955 to-neutral-955'
    }
  },
  99: {
    label: 'Orage violent avec grêle',
    iconName: 'CloudLightning',
    icon: CloudLightning,
    backgroundClass: {
      day: 'bg-gradient-to-br from-purple-800 via-stone-900 to-black',
      night: 'bg-gradient-to-br from-black via-fuchsia-955/20 to-black'
    }
  }
};

export function getWeatherCondition(code) {
  return WEATHER_CONDITIONS[code] || {
    label: 'Conditions inconnues',
    iconName: 'Cloud',
    icon: Cloud,
    backgroundClass: {
      day: 'bg-gradient-to-br from-slate-400 via-sky-400 to-slate-500',
      night: 'bg-gradient-to-br from-zinc-900 via-slate-900 to-zinc-955'
    }
  };
}

export const COUNTRY_NAMES = {
  FR: 'France',
  BE: 'Belgique',
  CH: 'Suisse',
  CA: 'Canada',
  US: 'États-Unis',
  GB: 'Royaume-Uni',
  DE: 'Allemagne',
  IT: 'Italie',
  ES: 'Espagne',
  PT: 'Portugal',
  NL: 'Pays-Bas',
  MA: 'Maroc',
  TN: 'Tunisie',
  DZ: 'Algérie',
  SN: 'Sénégal',
  CI: 'Côte d\'Ivoire',
  MG: 'Madagascar',
  JP: 'Japon',
  CN: 'Chine',
  BR: 'Brésil',
  RU: 'Russie',
  AU: 'Australie',
  NZ: 'Nouvelle-Zélande',
  ZA: 'Afrique du Sud'
};

export function getCountryName(code) {
  return COUNTRY_NAMES[code.toUpperCase()] || code;
}
