import React from 'react';
import { CurrentWeather, WeatherAlert, WeatherSource } from '../types';
import { getWeatherIcon, formatTemp, getConditionColor } from '../utils/weatherIcons';
import {
  AlertTriangle,
  Wind,
  Droplets,
  Eye,
  Sun,
  Gauge,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface CurrentCardProps {
  current: CurrentWeather;
  alert: WeatherAlert | null;
  unit: 'C' | 'F';
  source: WeatherSource;
  onSelectTab: (tab: string) => void;
}

export const CurrentCard: React.FC<CurrentCardProps> = ({
  current,
  alert,
  unit,
  source,
  onSelectTab,
}) => {
  const isNight = () => {
    const now = new Date();
    const h = now.getHours();
    return h >= 21 || h <= 5;
  };

  return (
    <div className="space-y-4">
      {/* Weather Alert Banner if present */}
      {alert && (
        <div className="bg-amber-950/80 border-l-4 border-amber-500 text-amber-100 p-4 rounded-r-xl shadow-lg flex items-start gap-3 backdrop-blur-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wide">
                {alert.title}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-900/60 border border-amber-600/40 text-amber-300 font-semibold">
                Emesso da {alert.source}
              </span>
            </div>
            <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
              {alert.description}
            </p>
            <p className="text-[11px] text-amber-400/80 mt-1 font-medium">
              Validità: {alert.validUntil}
            </p>
          </div>
        </div>
      )}

      {/* Main Hero Card in The Weather Channel signature style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0c2747] via-[#081f3a] to-[#041427] border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl text-white">
        {/* Top Location and Source Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {current.city}
              </h1>
              <span className="text-xs sm:text-sm font-medium text-slate-300">
                {current.region ? `${current.region}, ` : ''}{current.country}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggiornato alle {current.updatedAt} • Dati meteorologici in tempo reale
            </p>
          </div>

          {/* Official Source Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-[#00172e]/90 px-3 py-1.5 rounded-lg border border-emerald-500/40 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 text-[10px] block font-medium">FONTE ESCLUSIVA</span>
              <span className="font-bold text-emerald-300 text-xs">{current.sourceLabel}</span>
            </div>
          </div>
        </div>

        {/* Verified iLMeteo.it Meteorological Banner */}
        <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-950/80 via-[#07241a] to-[#041a27] border border-emerald-500/40 rounded-xl shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[11px] shadow">
                DATI ESCLUSIVI iLMeteo.it
              </span>
              <span className="text-slate-300">
                Elaborazione meteorologica con modello ad alta definizione <strong className="text-white font-bold">ECMWF / ZEUS HD</strong>
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-emerald-300">
              <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Nowcasting Attivo
              </span>
              <span className="hidden md:inline text-slate-400 text-[11px]">
                Previsioni &amp; Radar 24h
              </span>
            </div>
          </div>
        </div>

        {/* Core Temperature and Condition Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
          <div className="md:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
              {getWeatherIcon(current.conditionType, isNight(), 'w-16 h-16 sm:w-20 sm:h-20')}
            </div>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter">
                  {formatTemp(current.temp, unit)}
                </span>
                <div className="text-slate-300 text-sm">
                  <div className="font-semibold text-slate-200">
                    Percepita {formatTemp(current.feelsLike, unit)}
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1 text-slate-400">
                    <span className="flex items-center text-red-400 font-bold">
                      <ArrowUp className="w-3 h-3" /> Max {formatTemp(current.tempMax, unit)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center text-blue-400 font-bold">
                      <ArrowDown className="w-3 h-3" /> Min {formatTemp(current.tempMin, unit)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-sky-200 mt-1 capitalize">
                {current.condition}
              </p>
            </div>
          </div>

          {/* Quick Overview Tile */}
          <div className="md:col-span-5 bg-[#07192d]/80 border border-slate-700/60 rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
              <span className="text-slate-400">Punto di Rugiada</span>
              <span className="font-bold text-slate-200">{formatTemp(current.dewPoint, unit)}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
              <span className="text-slate-400">Indice UV</span>
              <span className="font-bold text-amber-300">
                {current.uvIndex} su 10 ({current.uvDescription})
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
              <span className="text-slate-400">Pressione Barometrica</span>
              <span className="font-bold text-slate-200">{current.pressure} hPa</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Qualità dell'Aria (AQI)</span>
              <span className="font-bold text-emerald-400">
                {current.airQualityIndex} • {current.airQualityDescription}
              </span>
            </div>
          </div>
        </div>

        {/* Six Metric Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4 border-t border-white/10 text-xs">
          <div className="bg-[#0b1d33] p-3 rounded-xl border border-slate-700/70">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span>Vento</span>
            </div>
            <p className="font-extrabold text-sm text-white">
              {current.windSpeed} km/h
            </p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Compass className="w-2.5 h-2.5" /> Direzione {current.windDirection}
            </p>
          </div>

          <div className="bg-[#0b1d33] p-3 rounded-xl border border-slate-700/70">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Umidità</span>
            </div>
            <p className="font-extrabold text-sm text-white">
              {current.humidity}%
            </p>
            <p className="text-[10px] text-slate-400">
              {current.humidity > 70 ? 'Elevata' : 'Ottimale'}
            </p>
          </div>

          <div className="bg-[#0b1d33] p-3 rounded-xl border border-slate-700/70">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Visibilità</span>
            </div>
            <p className="font-extrabold text-sm text-white">
              {current.visibility} km
            </p>
            <p className="text-[10px] text-slate-400">Limpida</p>
          </div>

          <div className="bg-[#0b1d33] p-3 rounded-xl border border-slate-700/70">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Alba / Tramonto</span>
            </div>
            <p className="font-extrabold text-xs text-white">
              {current.sunrise} / {current.sunset}
            </p>
            <p className="text-[10px] text-slate-400">Luce solare attiva</p>
          </div>

          <div className="bg-[#0b1d33] p-3 rounded-xl border border-slate-700/70">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
              <span>Pressione</span>
            </div>
            <p className="font-extrabold text-sm text-white">
              {current.pressure} hPa
            </p>
            <p className="text-[10px] text-slate-400">Stabile</p>
          </div>

          <div className="bg-[#0b1d33] p-3 rounded-xl border border-slate-700/70">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Qualità Aria</span>
            </div>
            <p className="font-extrabold text-sm text-emerald-400">
              AQI {current.airQualityIndex}
            </p>
            <p className="text-[10px] text-slate-400">{current.airQualityDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
