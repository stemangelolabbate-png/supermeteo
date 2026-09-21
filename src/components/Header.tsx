import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Globe, Check, RefreshCw, Layers, Loader2, CheckCircle2, CloudSun, Sparkles } from 'lucide-react';
import { WeatherSource } from '../types';

interface HeaderProps {
  currentCity: string;
  source: WeatherSource;
  unit: 'C' | 'F';
  activeTab: string;
  onSelectCity: (city: string) => void;
  onSelectSource: (source: WeatherSource) => void;
  onToggleUnit: () => void;
  onSelectTab: (tab: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

interface CityOption {
  name: string;
  region: string;
  country: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  source,
  unit,
  activeTab,
  onSelectCity,
  onSelectSource,
  onToggleUnit,
  onSelectTab,
  onRefresh,
  isLoading,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoNotification, setGeoNotification] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close autocomplete when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when searching
  useEffect(() => {
    if (searchInput.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/cities?q=${encodeURIComponent(searchInput)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSuggestions(data);
            setIsDropdownOpen(true);
          }
        })
        .catch(() => {});
    }, 150);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectCity(searchInput.trim());
      setIsDropdownOpen(false);
      setSearchInput('');
    }
  };

  const handleSelectCityOption = (city: CityOption) => {
    onSelectCity(city.name);
    setIsDropdownOpen(false);
    setSearchInput('');
  };

  const handleUseGeolocation = async () => {
    if (isGeolocating) return;
    setIsGeolocating(true);
    setGeoNotification(null);

    const fallbackToIp = async () => {
      try {
        const res = await fetch('/api/geolocation/ip');
        if (res.ok) {
          const data = await res.json();
          if (data && data.city) {
            onSelectCity(data.city);
            setGeoNotification(`Rilevato: ${data.city} (${data.region || 'Italia'})`);
            setTimeout(() => setGeoNotification(null), 4500);
            return;
          }
        }
      } catch (err) {
        console.warn('IP location fetch failed:', err);
      }
      setGeoNotification('Impossibile rilevare la posizione attuale.');
      setTimeout(() => setGeoNotification(null), 4500);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `/api/geolocation/reverse?lat=${latitude}&lon=${longitude}`
            );
            if (res.ok) {
              const data = await res.json();
              if (data && data.city) {
                onSelectCity(data.city);
                setGeoNotification(`Posizione GPS: ${data.city} (${data.region})`);
                setTimeout(() => setGeoNotification(null), 4500);
                setIsGeolocating(false);
                return;
              }
            }
          } catch (e) {
            console.warn('Reverse geocode error:', e);
          }
          await fallbackToIp();
          setIsGeolocating(false);
        },
        async (error) => {
          console.warn('Browser geolocation denied or error:', error.message);
          // Seamlessly fallback to IP network location so user never encounters a dead end!
          await fallbackToIp();
          setIsGeolocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 60000,
        }
      );
    } else {
      await fallbackToIp();
      setIsGeolocating(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#002244] border-b border-[#0d3b66] shadow-xl text-white">
      {/* Geolocation Toast feedback banner */}
      {geoNotification && (
        <div className="bg-sky-600/95 text-white text-xs px-4 py-1.5 flex items-center justify-between border-b border-sky-400/50 animate-fadeIn backdrop-blur-sm">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              {geoNotification}
            </span>
            <button
              type="button"
              onClick={() => setGeoNotification(null)}
              className="text-white/80 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top brand & utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logos & Branding */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* SuperMeteo Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-sky-400 to-blue-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#00172e] rounded-[10px] flex items-center justify-center">
                <CloudSun className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-black tracking-tight text-white">
                  super<span className="text-amber-400">meteo</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  HD
                </span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium">Previsioni in tempo reale</span>
            </div>
          </div>

          {/* iLMeteo.it official source badge */}
          <div className="flex items-center gap-2 border-l border-white/20 pl-3">
            <div className="bg-[#1b4332] text-white font-bold text-xs px-2.5 py-1 rounded-lg border border-emerald-500/50 shadow-sm flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 ring-1 ring-white"></span>
              <span className="text-white font-extrabold">ilmeteo<span className="text-emerald-300">.it</span></span>
            </div>
            <div className="hidden xl:block">
              <p className="text-[10px] text-slate-300 font-semibold leading-tight">Fonte Ufficiale</p>
              <p className="text-[9px] text-emerald-400 font-mono">Modello ZEUS HD</p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div ref={searchContainerRef} className="relative w-full md:max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              id="city-search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setIsDropdownOpen(true);
              }}
              placeholder="Cerca città (es. Roma, Milano, Napoli, Firenze...)"
              className="w-full bg-[#0b1d33] hover:bg-[#112a48] focus:bg-[#112a48] text-white placeholder-slate-400 text-sm pl-9 pr-24 py-2 rounded-lg border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all shadow-inner"
            />
            <button
              type="button"
              onClick={handleUseGeolocation}
              disabled={isGeolocating}
              title="Rileva automaticamente la mia posizione"
              className={`absolute right-1.5 px-2 py-1 rounded transition-colors flex items-center gap-1 text-xs font-semibold ${
                isGeolocating
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-300 hover:text-white bg-[#071d36] hover:bg-emerald-600 border border-slate-700'
              }`}
            >
              {isGeolocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-300" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="text-[11px]">
                {isGeolocating ? 'GPS...' : 'GPS'}
              </span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0b1d33] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
              <div className="px-3 py-1.5 bg-[#00172e] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Città disponibili
              </div>
              {suggestions.map((c, idx) => (
                <button
                  key={`${c.name}-${idx}`}
                  type="button"
                  onClick={() => handleSelectCityOption(c)}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#003d73] transition-colors flex items-center justify-between text-sm group"
                >
                  <span className="font-semibold text-white group-hover:text-emerald-200">
                    {c.name}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-200">
                    {c.region}, {c.country}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Source Selector & Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Active Exclusive Source Badge */}
          <div className="flex items-center bg-[#072418] px-3 py-1.5 rounded-lg border border-emerald-500/60 text-xs shadow-inner">
            <div className="flex items-center gap-1.5 text-emerald-200 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Fonte: <strong className="text-white">iLMeteo.it</strong></span>
              <span className="hidden sm:inline text-[10px] text-emerald-400/80 font-medium">(ECMWF/ZEUS)</span>
            </div>
          </div>

          {/* Temperature Unit Toggle */}
          <button
            type="button"
            id="unit-toggle-btn"
            onClick={onToggleUnit}
            className="px-2.5 py-1 bg-[#0b1d33] hover:bg-[#122e50] border border-slate-700 text-xs font-bold rounded-lg transition-colors text-emerald-300"
            title="Cambia unità di misura"
          >
            °{unit}
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            id="refresh-weather-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 bg-[#0b1d33] hover:bg-[#122e50] border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Aggiorna previsioni"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation tab strip */}
      <div className="bg-[#00172e] border-t border-[#0b2847]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar text-xs sm:text-sm font-semibold">
          {[
            { id: 'today', label: 'Oggi' },
            { id: 'hourly', label: 'Grafici Orari (24h)' },
            { id: 'tenday', label: '10 Giorni' },
            { id: 'radar', label: 'Radar & Mappe' },
            { id: 'details', label: 'Dettagli & Salute' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'border-emerald-400 text-white font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                {tab.id === 'hourly' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
