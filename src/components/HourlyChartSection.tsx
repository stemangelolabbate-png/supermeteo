import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { HourlyForecast, WeatherSource } from '../types';
import { getWeatherIcon, formatTemp } from '../utils/weatherIcons';
import {
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  Eye,
  ChevronDown,
  ChevronUp,
  Compass,
  Layers,
} from 'lucide-react';

interface HourlyChartSectionProps {
  hourly: HourlyForecast[];
  unit: 'C' | 'F';
  source: WeatherSource;
  comparisonHourly?: {
    twc: HourlyForecast[];
    ilmeteo: HourlyForecast[];
  };
}

export const HourlyChartSection: React.FC<HourlyChartSectionProps> = ({
  hourly,
  unit,
  source,
  comparisonHourly,
}) => {
  const [chartMode, setChartMode] = useState<'temp' | 'rain' | 'wind' | 'humidity' | 'compare'>('temp');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showFullTable, setShowFullTable] = useState<boolean>(false);

  const selectedHour = hourly[selectedIndex] || hourly[0];

  // Convert temperatures if Fahrenheit
  const chartData = hourly.map((h, index) => {
    const isCompare = comparisonHourly && comparisonHourly.twc && comparisonHourly.ilmeteo;
    const twcItem = isCompare ? comparisonHourly.twc[index] : null;
    const ilmeteoItem = isCompare ? comparisonHourly.ilmeteo[index] : null;

    const tempVal = unit === 'F' ? Math.round((h.temp * 9) / 5 + 32) : h.temp;
    const feelsLikeVal = unit === 'F' ? Math.round((h.feelsLike * 9) / 5 + 32) : h.feelsLike;
    const twcTempVal = twcItem ? (unit === 'F' ? Math.round((twcItem.temp * 9) / 5 + 32) : twcItem.temp) : tempVal;
    const ilmeteoTempVal = ilmeteoItem ? (unit === 'F' ? Math.round((ilmeteoItem.temp * 9) / 5 + 32) : ilmeteoItem.temp) : tempVal;

    return {
      time: h.time,
      hourNumber: h.hour,
      temp: tempVal,
      feelsLike: feelsLikeVal,
      pop: h.pop,
      rainAmount: h.rainAmount,
      windSpeed: h.windSpeed,
      windDirection: h.windDirection,
      humidity: h.humidity,
      dewPoint: unit === 'F' ? Math.round((h.dewPoint * 9) / 5 + 32) : h.dewPoint,
      uvIndex: h.uvIndex,
      cloudCover: h.cloudCover,
      condition: h.condition,
      conditionType: h.conditionType,
      twcTemp: twcTempVal,
      ilmeteoTemp: ilmeteoTempVal,
      original: h,
    };
  });

  const minTemp = Math.min(...chartData.map((d) => Math.min(d.temp, d.feelsLike))) - 2;
  const maxTemp = Math.max(...chartData.map((d) => Math.max(d.temp, d.feelsLike))) + 2;

  return (
    <section className="bg-[#0b1d33] border border-slate-700/80 rounded-xl p-4 sm:p-6 shadow-xl text-white">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-sky-400" />
              Previsioni e Grafici Orari Dettagliati
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-600/40">
              24 Ore
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisi meteorologica oraria ad alta risoluzione con dati ufficiali da iLMeteo.it (Modello ECMWF / ZEUS HD)
          </p>
        </div>

        {/* Chart View Switcher */}
        <div className="flex flex-wrap items-center bg-[#07192d] p-1 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setChartMode('temp')}
            className={`px-2.5 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              chartMode === 'temp'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperatura</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode('rain')}
            className={`px-2.5 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              chartMode === 'rain'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Precipitazioni</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode('wind')}
            className={`px-2.5 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              chartMode === 'wind'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Vento</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode('humidity')}
            className={`px-2.5 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
              chartMode === 'humidity'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Umidità</span>
          </button>
          {comparisonHourly && (
            <button
              type="button"
              onClick={() => setChartMode('compare')}
              className={`px-2.5 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5 ${
                chartMode === 'compare'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Confronto TWC / iLMeteo</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Active Hour Inspector Card */}
      {selectedHour && (
        <div className="bg-[#0e2747] border border-sky-500/30 rounded-xl p-3 sm:p-4 mb-4 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#081a30] border border-sky-400/30 rounded-xl">
                {getWeatherIcon(
                  selectedHour.conditionType,
                  selectedHour.hour >= 21 || selectedHour.hour <= 5,
                  'w-8 h-8'
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white tracking-wide">
                    Ore {selectedHour.time}
                  </span>
                  {selectedIndex === 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Orario Attuale (Adesso)
                    </span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded bg-sky-900/60 text-sky-200 border border-sky-500/30">
                    {selectedHour.condition}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {selectedHour.hour >= 6 && selectedHour.hour < 20 ? 'Diurno' : 'Notturno'} • Fonte:{' '}
                  <span className="font-semibold text-emerald-300">
                    iLMeteo.it (Modello ECMWF / ZEUS HD)
                  </span>
                </p>
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-[#081a30] px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Temp. &amp; Percepita</span>
                <span className="font-extrabold text-sm text-sky-300">
                  {formatTemp(selectedHour.temp, unit)}
                </span>
                <span className="text-slate-400 text-[11px] ml-1">
                  (perc. {formatTemp(selectedHour.feelsLike, unit)})
                </span>
              </div>

              <div className="bg-[#081a30] px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Prob. Pioggia</span>
                <span className="font-extrabold text-sm text-blue-300 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  {selectedHour.pop}%
                </span>
                {selectedHour.rainAmount > 0 && (
                  <span className="text-slate-400 text-[10px] block">
                    {selectedHour.rainAmount} mm/h
                  </span>
                )}
              </div>

              <div className="bg-[#081a30] px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Vento</span>
                <span className="font-extrabold text-sm text-teal-300 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-teal-400" />
                  {selectedHour.windSpeed} km/h {selectedHour.windDirection}
                </span>
              </div>

              <div className="bg-[#081a30] px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Umidità &amp; UV</span>
                <span className="font-extrabold text-sm text-indigo-300">
                  {selectedHour.humidity}%
                </span>
                <span className="text-slate-400 text-[11px] ml-1">
                  • UV {selectedHour.uvIndex}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Recharts Chart */}
      <div className="w-full h-72 sm:h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'temp' ? (
            <ComposedChart
              data={chartData}
              onClick={(e) => {
                if (e && typeof e.activeTooltipIndex === 'number') {
                  setSelectedIndex(e.activeTooltipIndex);
                }
              }}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="twcTempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="twcFeelsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={2}
              />
              <YAxis
                domain={[minTemp, maxTemp]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit="°"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#07192d] border border-sky-500/50 p-3 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-bold text-white flex items-center justify-between gap-4">
                          <span>Ore {data.time}</span>
                          <span className="text-sky-300">{data.condition}</span>
                        </p>
                        <div className="text-slate-300">
                          <span className="text-sky-400 font-bold">Temperatura:</span>{' '}
                          {data.temp}°{unit}
                        </div>
                        <div className="text-slate-300">
                          <span className="text-amber-400 font-bold">Percepita:</span>{' '}
                          {data.feelsLike}°{unit}
                        </div>
                        <div className="text-slate-300">
                          <span className="text-blue-400 font-bold">Prob. Pioggia:</span> {data.pop}%
                        </div>
                        <div className="text-slate-300">
                          <span className="text-teal-400 font-bold">Vento:</span> {data.windSpeed} km/h ({data.windDirection})
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                name="Temperatura"
                stroke="#38bdf8"
                strokeWidth={3}
                fill="url(#twcTempGradient)"
                activeDot={{ r: 6, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="feelsLike"
                name="Percepita"
                stroke="#fbbf24"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          ) : chartMode === 'rain' ? (
            <ComposedChart
              data={chartData}
              onClick={(e) => {
                if (e && typeof e.activeTooltipIndex === 'number') {
                  setSelectedIndex(e.activeTooltipIndex);
                }
              }}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={2}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#07192d] border border-blue-500/50 p-3 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-bold text-white">Ore {data.time}</p>
                        <p className="text-blue-300">Probabilità Pioggia: <span className="font-bold">{data.pop}%</span></p>
                        {data.rainAmount > 0 && (
                          <p className="text-slate-300">Accumulo stimato: {data.rainAmount} mm</p>
                        )}
                        <p className="text-slate-400">{data.condition}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="pop" name="Probabilità Pioggia (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          ) : chartMode === 'wind' ? (
            <ComposedChart
              data={chartData}
              onClick={(e) => {
                if (e && typeof e.activeTooltipIndex === 'number') {
                  setSelectedIndex(e.activeTooltipIndex);
                }
              }}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={2}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit=" km/h"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#07192d] border border-teal-500/50 p-3 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-bold text-white">Ore {data.time}</p>
                        <p className="text-teal-300">Velocità Vento: <span className="font-bold">{data.windSpeed} km/h</span></p>
                        <p className="text-slate-300">Direzione: {data.windDirection}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="windSpeed"
                stroke="#14b8a6"
                strokeWidth={2.5}
                fill="url(#windGradient)"
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          ) : chartMode === 'humidity' ? (
            <ComposedChart
              data={chartData}
              onClick={(e) => {
                if (e && typeof e.activeTooltipIndex === 'number') {
                  setSelectedIndex(e.activeTooltipIndex);
                }
              }}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={2}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#07192d] border border-indigo-500/50 p-3 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-bold text-white">Ore {data.time}</p>
                        <p className="text-indigo-300">Umidità: <span className="font-bold">{data.humidity}%</span></p>
                        <p className="text-slate-300">Punto di rugiada: {data.dewPoint}°{unit}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line type="monotone" dataKey="humidity" stroke="#6366f1" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          ) : (
            /* Compare Mode: The Weather Channel vs iLMeteo.it */
            <ComposedChart
              data={chartData}
              onClick={(e) => {
                if (e && typeof e.activeTooltipIndex === 'number') {
                  setSelectedIndex(e.activeTooltipIndex);
                }
              }}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={2}
              />
              <YAxis
                domain={[minTemp, maxTemp]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit="°"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#07192d] border border-amber-500/50 p-3 rounded-lg shadow-xl text-xs space-y-1">
                        <p className="font-bold text-white border-b border-slate-700 pb-1">
                          Confronto Modelli - Ore {data.time}
                        </p>
                        <p className="text-sky-300 font-semibold">
                          The Weather Channel: <span className="font-bold text-white">{data.twcTemp}°{unit}</span>
                        </p>
                        <p className="text-emerald-300 font-semibold">
                          iLMeteo.it: <span className="font-bold text-white">{data.ilmeteoTemp}°{unit}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 pt-1">
                          Scarto: {Math.abs(data.twcTemp - data.ilmeteoTemp)}°{unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="twcTemp"
                name="The Weather Channel"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ r: 3, fill: '#0284c7' }}
              />
              <Line
                type="monotone"
                dataKey="ilmeteoTemp"
                name="iLMeteo.it"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3, fill: '#10b981' }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-2 px-1">
        <div className="flex items-center gap-4">
          {chartMode === 'temp' && (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-sky-400 rounded"></span>
                <span>Temperatura reale</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-b border-dashed border-amber-400"></span>
                <span>Temperatura percepita</span>
              </span>
            </>
          )}
          {chartMode === 'compare' && (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#0284c7] rounded"></span>
                <span className="text-sky-300">The Weather Channel</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#10b981] rounded"></span>
                <span className="text-emerald-300">iLMeteo.it</span>
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] text-slate-500 italic">
          Clicca su qualsiasi punto o scheda oraria per ispezionare
        </span>
      </div>

      {/* Horizontal Hourly Carousel (Like The Weather Channel) */}
      <div className="mt-4 pt-4 border-t border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Sequenza Oraria Prossime 24 Ore
          </span>
          <button
            type="button"
            onClick={() => setShowFullTable(!showFullTable)}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 font-semibold"
          >
            {showFullTable ? 'Nascondi Tabella Completa' : 'Visualizza Tabella Dettagliata'}
            {showFullTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar pt-1">
          {hourly.map((h, i) => {
            const isSelected = i === selectedIndex;
            return (
              <button
                key={`${h.time}-${i}`}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`flex-shrink-0 w-20 py-2.5 px-2 rounded-xl text-center border transition-all ${
                  isSelected
                    ? 'bg-[#0e2c52] border-sky-400 ring-2 ring-sky-400/40 shadow-lg scale-105'
                    : 'bg-[#07192d] border-slate-700/80 hover:bg-[#0c2442] hover:border-slate-600'
                }`}
              >
                <span
                  className={`text-xs font-bold block ${
                    i === 0 ? 'text-emerald-300 font-extrabold' : 'text-slate-300'
                  }`}
                >
                  {i === 0 ? 'Adesso' : h.time}
                </span>
                {i === 0 && (
                  <span className="text-[10px] text-slate-400 font-medium block -mt-0.5">
                    {h.time}
                  </span>
                )}
                <div className="my-1.5 flex justify-center">
                  {getWeatherIcon(h.conditionType, h.hour >= 21 || h.hour <= 5, 'w-6 h-6')}
                </div>
                <span className="text-sm font-extrabold text-white block">
                  {formatTemp(h.temp, unit)}
                </span>
                <div className="mt-1 flex items-center justify-center gap-0.5 text-[10px] text-blue-300 font-bold">
                  <CloudRain className="w-2.5 h-2.5 text-blue-400" />
                  <span>{h.pop}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable 24-Hour Tabular Breakdown */}
      {showFullTable && (
        <div className="mt-4 border border-slate-700 rounded-lg overflow-x-auto shadow-inner bg-[#07192d]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#00172e] text-slate-400 border-b border-slate-700 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Ora</th>
                <th className="py-2.5 px-3">Condizione</th>
                <th className="py-2.5 px-3">Temp</th>
                <th className="py-2.5 px-3">Percepita</th>
                <th className="py-2.5 px-3">Pioggia %</th>
                <th className="py-2.5 px-3">Vento</th>
                <th className="py-2.5 px-3">Umidità</th>
                <th className="py-2.5 px-3">UV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {hourly.map((h, idx) => (
                <tr
                  key={`tbl-${h.time}-${idx}`}
                  onClick={() => setSelectedIndex(idx)}
                  className={`hover:bg-[#0c2747] cursor-pointer transition-colors ${
                    idx === selectedIndex ? 'bg-[#0c2747] font-semibold text-sky-200' : ''
                  }`}
                >
                  <td className="py-2 px-3 font-bold">{h.time}</td>
                  <td className="py-2 px-3 flex items-center gap-1.5">
                    {getWeatherIcon(h.conditionType, h.hour >= 21 || h.hour <= 5, 'w-4 h-4')}
                    <span>{h.condition}</span>
                  </td>
                  <td className="py-2 px-3 font-bold">{formatTemp(h.temp, unit)}</td>
                  <td className="py-2 px-3 text-slate-400">{formatTemp(h.feelsLike, unit)}</td>
                  <td className="py-2 px-3 text-blue-400 font-bold">{h.pop}%</td>
                  <td className="py-2 px-3">
                    {h.windSpeed} km/h {h.windDirection}
                  </td>
                  <td className="py-2 px-3">{h.humidity}%</td>
                  <td className="py-2 px-3">{h.uvIndex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
