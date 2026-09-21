import React, { useState } from 'react';
import { DailyForecast } from '../types';
import { getWeatherIcon, formatTemp } from '../utils/weatherIcons';
import {
  Calendar,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DailyForecastCardProps {
  daily: DailyForecast[];
  unit: 'C' | 'F';
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ daily, unit }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Determine global min and max for the 10-day temperature bars
  const allMax = Math.max(...daily.map((d) => d.tempMax));
  const allMin = Math.min(...daily.map((d) => d.tempMin));
  const tempSpan = Math.max(1, allMax - allMin);

  const toggleDay = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section className="bg-[#0b1d33] border border-slate-700/80 rounded-xl p-4 sm:p-6 shadow-xl text-white">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            Previsioni a 10 Giorni
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evoluzione sinottica a medio termine in stile The Weather Channel
          </p>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Min / Max stagionali
        </span>
      </div>

      <div className="divide-y divide-slate-800">
        {daily.map((day, idx) => {
          const isExpanded = expandedIndex === idx;

          // Bar calculation for relative range positioning
          const leftPercent = Math.max(0, ((day.tempMin - allMin) / tempSpan) * 100);
          const widthPercent = Math.max(8, ((day.tempMax - day.tempMin) / tempSpan) * 100);

          return (
            <div key={`${day.date}-${idx}`} className="py-2.5 transition-colors">
              <button
                type="button"
                onClick={() => toggleDay(idx)}
                className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-lg hover:bg-[#0e2747] transition-colors group"
              >
                {/* Day name & date */}
                <div className="w-28 flex-shrink-0">
                  <span className="font-bold text-sm text-white group-hover:text-sky-300 block">
                    {day.dayName}
                  </span>
                  <span className="text-[11px] text-slate-400">{day.date}</span>
                </div>

                {/* Condition Icon and Name */}
                <div className="flex items-center gap-2 w-44 flex-shrink-0">
                  {getWeatherIcon(day.conditionType, false, 'w-6 h-6')}
                  <span className="text-xs text-slate-200 font-medium truncate">
                    {day.condition}
                  </span>
                </div>

                {/* Rain probability */}
                <div className="flex items-center gap-1 w-16 text-xs text-blue-400 font-bold">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>{day.pop}%</span>
                </div>

                {/* The Weather Channel visual temperature range bar */}
                <div className="flex-1 flex items-center gap-2 max-w-xs">
                  <span className="text-xs font-semibold text-blue-300 w-8 text-right">
                    {formatTemp(day.tempMin, unit)}
                  </span>
                  <div className="relative flex-1 h-2.5 bg-[#07192d] rounded-full overflow-hidden border border-slate-700/60">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-amber-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-amber-300 w-8">
                    {formatTemp(day.tempMax, unit)}
                  </span>
                </div>

                {/* Accordion Arrow */}
                <div className="text-slate-400 pl-2">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-sky-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Expanded details container */}
              {isExpanded && (
                <div className="mt-2 p-3.5 bg-[#07192d] border border-slate-700/60 rounded-lg text-xs space-y-2 animate-fadeIn">
                  <p className="text-slate-300 leading-relaxed font-medium">
                    {day.narrative}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-700/60 text-slate-400">
                    <div>
                      <span className="block text-[10px] uppercase">Vento stimato</span>
                      <span className="font-bold text-white text-xs flex items-center gap-1">
                        <Wind className="w-3 h-3 text-teal-400" /> {day.windSpeed} km/h
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase">Umidità media</span>
                      <span className="font-bold text-white text-xs flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-400" /> {day.humidity}%
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase">Indice UV Max</span>
                      <span className="font-bold text-amber-300 text-xs flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-400" /> UV {day.uvIndex || 5}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase">Pioggia prevista</span>
                      <span className="font-bold text-blue-300 text-xs flex items-center gap-1">
                        <CloudRain className="w-3 h-3 text-blue-400" /> {day.rainAmount ? `${day.rainAmount} mm` : 'Assente / Locale'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
