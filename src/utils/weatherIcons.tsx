import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  Wind,
  Droplets,
} from 'lucide-react';
import { WeatherCondition } from '../types';

export function getWeatherIcon(
  type: WeatherCondition,
  isNight: boolean = false,
  className: string = 'w-6 h-6'
): React.ReactElement {
  switch (type) {
    case 'sunny':
      return isNight ? (
        <Sun className={`${className} text-amber-200`} />
      ) : (
        <Sun className={`${className} text-amber-400`} />
      );
    case 'mostly_sunny':
      return <CloudSun className={`${className} text-amber-300`} />;
    case 'partly_cloudy':
      return <CloudSun className={`${className} text-sky-300`} />;
    case 'cloudy':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'rain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'heavy_rain':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'thunderstorm':
      return <CloudLightning className={`${className} text-yellow-400`} />;
    case 'snow':
      return <Snowflake className={`${className} text-cyan-200`} />;
    case 'fog':
      return <CloudFog className={`${className} text-slate-400`} />;
    case 'windy':
      return <Wind className={`${className} text-teal-300`} />;
    default:
      return <Sun className={`${className} text-amber-400`} />;
  }
}

export function formatTemp(tempC: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    return `${Math.round((tempC * 9) / 5 + 32)}°`;
  }
  return `${Math.round(tempC)}°`;
}

export function getConditionColor(type: WeatherCondition): string {
  switch (type) {
    case 'sunny':
    case 'mostly_sunny':
      return 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300';
    case 'partly_cloudy':
    case 'cloudy':
      return 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-300';
    case 'rain':
    case 'heavy_rain':
      return 'from-blue-600/25 to-indigo-600/15 border-blue-500/40 text-blue-300';
    case 'thunderstorm':
      return 'from-purple-600/25 to-amber-600/15 border-purple-500/40 text-yellow-300';
    default:
      return 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-300';
  }
}
