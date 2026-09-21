import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CurrentCard } from './components/CurrentCard';
import { HourlyChartSection } from './components/HourlyChartSection';
import { DailyForecastCard } from './components/DailyForecastCard';
import { RadarMapCard } from './components/RadarMapCard';
import { InteractiveWeatherMap } from './components/InteractiveWeatherMap';
import { WeatherDetailsGrid } from './components/WeatherDetailsGrid';
import { ComparisonCard } from './components/ComparisonCard';
import { Footer } from './components/Footer';
import { WeatherReport, WeatherSource } from './types';
import { fetchWeatherWithFallback } from './services/weatherService';
import {
  AlertCircle,
  MapPin,
  RefreshCw,
  Layers,
  Thermometer,
  Calendar,
  Radio,
  Activity,
} from 'lucide-react';

const POPULAR_CITIES = [
  'Roma',
  'Milano',
  'Napoli',
  'Torino',
  'Firenze',
  'Palermo',
  'Bologna',
  'Venezia',
  'Bari',
  'Catania',
  'Verona',
  'Genova',
];

export default function App() {
  const [city, setCity] = useState<string>('Roma');
  const [source, setSource] = useState<WeatherSource>('ilmeteo');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [activeTab, setActiveTab] = useState<string>('today');
  const [weatherData, setWeatherData] = useState<WeatherReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data with seamless Netlify/static hosting fallback
  const fetchWeather = async (targetCity: string, targetSource: WeatherSource) => {
    setIsLoading(true);
    setError(null);
    try {
      const now = new Date();
      const clientHour = now.getHours();
      const clientTime = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

      const data = await fetchWeatherWithFallback(targetCity, targetSource, clientHour, clientTime);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setError(err?.message || 'Si è verificato un errore.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city, source);
  }, [city, source]);

  const handleSelectCity = (newCity: string) => {
    setCity(newCity);
  };

  const handleSelectSource = (newSource: WeatherSource) => {
    setSource(newSource);
    if (newSource === 'compare') {
      setActiveTab('compare');
    }
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  return (
    <div className="min-h-screen bg-[#041221] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Header
        currentCity={city}
        source={source}
        unit={unit}
        activeTab={activeTab}
        onSelectCity={handleSelectCity}
        onSelectSource={handleSelectSource}
        onToggleUnit={handleToggleUnit}
        onSelectTab={setActiveTab}
        onRefresh={() => fetchWeather(city, source)}
        isLoading={isLoading}
      />

      {/* Quick City Quick-Pills Bar */}
      <div className="bg-[#001b36] border-b border-[#0b2b4e] py-2 px-4 sm:px-6 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 pl-1 flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            Città Principali:
          </span>
          {POPULAR_CITIES.map((c) => {
            const isCurrent = c.toLowerCase() === city.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => handleSelectCity(c)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                  isCurrent
                    ? 'bg-sky-600 text-white shadow font-bold'
                    : 'bg-[#071d36] text-slate-300 hover:bg-[#0c2a4d] hover:text-white border border-slate-700/60'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Loading Spinner */}
        {isLoading && !weatherData && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-4" />
            <p className="text-lg font-bold text-white">Caricamento bollettino meteorologico...</p>
            <p className="text-xs text-slate-400 mt-1">
              Recupero dati in corso da iLMeteo.it (Modello ECMWF / ZEUS HD)...
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/80 border-l-4 border-red-500 p-4 rounded-r-xl text-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-sm text-red-100">Errore di caricamento</h3>
              <p className="text-xs text-red-300 mt-0.5">{error}</p>
              <button
                type="button"
                onClick={() => fetchWeather(city, source)}
                className="mt-2 text-xs font-semibold text-red-200 underline hover:text-white"
              >
                Riprova caricamento
              </button>
            </div>
          </div>
        )}

        {/* Weather Content */}
        {weatherData && (
          <>
            {/* TAB: OGGI (TODAY) - Complete overview */}
            {activeTab === 'today' && (
              <div className="space-y-6">
                {/* Hero Current Conditions Card */}
                <CurrentCard
                  current={weatherData.current}
                  alert={weatherData.alert}
                  unit={unit}
                  source={source}
                  onSelectTab={setActiveTab}
                />

                {/* Detailed Hourly Graph (Centerpiece) */}
                <HourlyChartSection
                  hourly={weatherData.hourly}
                  unit={unit}
                  source={source}
                  comparisonHourly={
                    weatherData.comparison
                      ? {
                          twc: weatherData.comparison.twcHourly,
                          ilmeteo: weatherData.comparison.ilmeteoHourly,
                        }
                      : undefined
                  }
                />

                {/* 10-Day Forecast */}
                <DailyForecastCard daily={weatherData.daily} unit={unit} />

                {/* Interactive Weather Map with Zoom, Pan, Radar, Temperature and Wind */}
                <InteractiveWeatherMap
                  currentCity={city}
                  onSelectCity={handleSelectCity}
                  unit={unit}
                  defaultSource={source}
                />

                {/* Details & Health */}
                <WeatherDetailsGrid current={weatherData.current} unit={unit} />
              </div>
            )}

            {/* TAB: HOURLY (Detailed Graphs Only) */}
            {activeTab === 'hourly' && (
              <div className="space-y-6">
                <HourlyChartSection
                  hourly={weatherData.hourly}
                  unit={unit}
                  source={source}
                  comparisonHourly={
                    weatherData.comparison
                      ? {
                          twc: weatherData.comparison.twcHourly,
                          ilmeteo: weatherData.comparison.ilmeteoHourly,
                        }
                      : undefined
                  }
                />
                <WeatherDetailsGrid current={weatherData.current} unit={unit} />
              </div>
            )}

            {/* TAB: 10-DAY */}
            {activeTab === 'tenday' && (
              <div className="space-y-6">
                <DailyForecastCard daily={weatherData.daily} unit={unit} />
                <CurrentCard
                  current={weatherData.current}
                  alert={weatherData.alert}
                  unit={unit}
                  source={source}
                  onSelectTab={setActiveTab}
                />
              </div>
            )}

            {/* TAB: RADAR & MAPS */}
            {activeTab === 'radar' && (
              <div className="space-y-6">
                <InteractiveWeatherMap
                  currentCity={city}
                  onSelectCity={handleSelectCity}
                  unit={unit}
                  defaultSource={source}
                />
                <RadarMapCard
                  current={weatherData.current}
                  radarInfo={weatherData.radarSimulation}
                />
                <HourlyChartSection
                  hourly={weatherData.hourly}
                  unit={unit}
                  source={source}
                />
              </div>
            )}

            {/* TAB: DETAILS & HEALTH */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <WeatherDetailsGrid current={weatherData.current} unit={unit} />
                <DailyForecastCard daily={weatherData.daily} unit={unit} />
              </div>
            )}

            {/* TAB: COMPARE */}
            {activeTab === 'compare' && (
              <div className="space-y-6">
                <ComparisonCard
                  twcCurrent={weatherData.comparison?.twcCurrent || weatherData.current}
                  ilmeteoCurrent={weatherData.comparison?.ilmeteoCurrent || weatherData.current}
                  insights={weatherData.comparison?.insights}
                  unit={unit}
                />
                <HourlyChartSection
                  hourly={weatherData.hourly}
                  unit={unit}
                  source="compare"
                  comparisonHourly={
                    weatherData.comparison
                      ? {
                          twc: weatherData.comparison.twcHourly,
                          ilmeteo: weatherData.comparison.ilmeteoHourly,
                        }
                      : undefined
                  }
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
