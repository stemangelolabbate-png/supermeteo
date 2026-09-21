import React from 'react';
import { CurrentWeather } from '../types';
import { formatTemp } from '../utils/weatherIcons';
import {
  Sun,
  ShieldCheck,
  Compass,
  Droplets,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Moon,
  Activity,
} from 'lucide-react';

interface WeatherDetailsGridProps {
  current: CurrentWeather;
  unit: 'C' | 'F';
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({ current, unit }) => {
  return (
    <section className="bg-[#0b1d33] border border-slate-700/80 rounded-xl p-4 sm:p-6 shadow-xl text-white">
      <div className="border-b border-slate-700/60 pb-3 mb-5">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-400" />
          Dettagli Meteorologici e Salute
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Parametri fisici e indici ambientali per {current.city}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* UV Index Tile */}
        <div className="bg-[#07192d] p-4 rounded-xl border border-slate-700/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              Indice UV
            </span>
            <span className="font-bold text-amber-300">{current.uvDescription}</span>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{current.uvIndex} <span className="text-xs text-slate-400 font-normal">/ 10</span></div>
            {/* UV Meter */}
            <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden flex">
              <div className="w-1/4 bg-emerald-500" />
              <div className="w-1/4 bg-yellow-400" />
              <div className="w-1/4 bg-orange-500" />
              <div className="w-1/4 bg-red-600" />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {current.uvIndex > 5
                ? 'Protezione solare raccomandata nelle ore centrali.'
                : 'Livello di radiazione solare sicuro.'}
            </p>
          </div>
        </div>

        {/* Air Quality Tile */}
        <div className="bg-[#07192d] p-4 rounded-xl border border-slate-700/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Qualità dell'Aria
            </span>
            <span className="font-bold text-emerald-400">{current.airQualityDescription}</span>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-300">AQI {current.airQualityIndex}</div>
            <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                style={{ width: `${Math.min(100, current.airQualityIndex * 1.5)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Valori ottimali per attività all'aria aperta e sport.
            </p>
          </div>
        </div>

        {/* Wind & Compass Tile */}
        <div className="bg-[#07192d] p-4 rounded-xl border border-slate-700/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-400" />
              Vento e Raffiche
            </span>
            <span className="font-bold text-teal-300">{current.windDirection}</span>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{current.windSpeed} <span className="text-xs text-slate-400 font-normal">km/h</span></div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-2">
              <span className="px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/40">
                Raffiche fino a {Math.round(current.windSpeed * 1.4)} km/h
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Brezza moderata da {current.windDirection}.
            </p>
          </div>
        </div>

        {/* Humidity & Dew Point Tile */}
        <div className="bg-[#07192d] p-4 rounded-xl border border-slate-700/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" />
              Umidità
            </span>
            <span className="font-bold text-blue-300">
              Punto rugiada {formatTemp(current.dewPoint, unit)}
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{current.humidity}%</div>
            <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${current.humidity}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Livello di vapore acqueo atmosferico.
            </p>
          </div>
        </div>

        {/* Atmospheric Pressure Tile */}
        <div className="bg-[#07192d] p-4 rounded-xl border border-slate-700/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-purple-400" />
              Pressione
            </span>
            <span className="font-bold text-slate-300">1013 hPa Standard</span>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{current.pressure} <span className="text-xs text-slate-400 font-normal">hPa</span></div>
            <p className="text-[11px] text-slate-400 mt-3">
              {current.pressure >= 1015
                ? 'Campo anticiclonico stabile.'
                : 'Circolazione debolmente depressionaria.'}
            </p>
          </div>
        </div>

        {/* Visibility Tile */}
        <div className="bg-[#07192d] p-4 rounded-xl border border-slate-700/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-400" />
              Visibilità
            </span>
            <span className="font-bold text-sky-300">Ottima</span>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{current.visibility} <span className="text-xs text-slate-400 font-normal">km</span></div>
            <p className="text-[11px] text-slate-400 mt-3">
              Nessuna presenza di nebbia o foschie dense sulla viabilità.
            </p>
          </div>
        </div>

        {/* Sunrise & Sunset Arc Tile */}
        <div className="bg-[#07192d] p-4 rounded-xl border border-slate-700/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <Sunrise className="w-4 h-4 text-amber-400" />
              Sole
            </span>
            <span className="font-bold text-slate-300">Arco Diurno</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Alba
              </span>
              <span className="font-extrabold text-sm text-white">{current.sunrise}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sunset className="w-3.5 h-3.5 text-orange-400" /> Tramonto
              </span>
              <span className="font-extrabold text-sm text-white">{current.sunset}</span>
            </div>
          </div>
        </div>

        {/* Moon Phase Tile */}
        <div className="bg-[#07192d] p-4 rounded-xl border border-slate-700/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-300" />
              Luna
            </span>
            <span className="font-bold text-slate-300">Ephemerides</span>
          </div>
          <div>
            <div className="text-lg font-bold text-white mt-1">{current.moonPhase}</div>
            <p className="text-[11px] text-slate-400 mt-2">
              Illuminazione lunare ~45%. Cielo notturno ideale per osservazioni.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
