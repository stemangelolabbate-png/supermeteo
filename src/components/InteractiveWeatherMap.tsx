import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  Thermometer,
  Wind,
  CloudRain,
  MapPin,
  RefreshCw,
  Clock,
  Maximize2,
  Minimize2,
  Eye,
  Info,
  Compass,
  CheckCircle2,
  Radio,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { MapStation, RadarTimestampFrame, WeatherSource } from '../types';
import { formatTemp } from '../utils/weatherIcons';
import { getMapStationsWithFallback, getRadarTimestampsWithFallback } from '../services/weatherService';

interface InteractiveWeatherMapProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  unit: 'C' | 'F';
  defaultSource?: WeatherSource;
}

type MapLayerType = 'radar' | 'temp' | 'wind' | 'all';
type AutoRefreshInterval = 0 | 30 | 60 | 300; // seconds (0 = off)

export const InteractiveWeatherMap: React.FC<InteractiveWeatherMapProps> = ({
  currentCity,
  onSelectCity,
  unit,
  defaultSource = 'ilmeteo',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const radarTileLayerRef = useRef<L.TileLayer | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // States
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('all');
  const [selectedSource, setSelectedSource] = useState<'average' | 'twc' | 'ilmeteo' | 'compare'>('ilmeteo');
  const [stations, setStations] = useState<MapStation[]>([]);
  const [radarFrames, setRadarFrames] = useState<RadarTimestampFrame[]>([]);
  const [radarHost, setRadarHost] = useState<string>('https://tilecache.rainviewer.com');
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [radarOpacity, setRadarOpacity] = useState<number>(0.75);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [refreshInterval, setRefreshInterval] = useState<AutoRefreshInterval>(60);
  const [countdown, setCountdown] = useState<number>(60);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedStation, setSelectedStation] = useState<MapStation | null>(null);

  // Helper to color-code temperature
  const getTempColor = (t: number) => {
    if (t <= 5) return '#3b82f6'; // cold blue
    if (t <= 12) return '#06b6d4'; // cyan
    if (t <= 17) return '#10b981'; // emerald green
    if (t <= 22) return '#f59e0b'; // amber/orange
    return '#ef4444'; // warm red
  };

  // Helper to color-code wind
  const getWindColor = (spd: number) => {
    if (spd < 15) return '#10b981';
    if (spd < 25) return '#f59e0b';
    return '#ef4444';
  };

  // Fetch Stations & Radar Data (with Netlify/client fallback)
  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [stationData, rData] = await Promise.all([
        getMapStationsWithFallback(),
        getRadarTimestampsWithFallback(),
      ]);

      if (stationData && stationData.length > 0) {
        setStations(stationData);
      }

      if (rData) {
        setRadarHost(rData.host || 'https://tilecache.rainviewer.com');
        const frames: RadarTimestampFrame[] = rData.frames || [];
        setRadarFrames(frames);
        // Default to the "now" frame
        const nowIdx = frames.findIndex((f) => (f as any).isNow);
        if (nowIdx !== -1) {
          setFrameIndex(nowIdx);
        } else if (frames.length > 0) {
          setFrameIndex(frames.length - 1);
        }
      }

      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCountdown(refreshInterval);
    } catch (err) {
      console.error('Error fetching map data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshInterval]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval timer
  useEffect(() => {
    if (refreshInterval === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchData();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, fetchData]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on Italy
    const map = L.map(mapContainerRef.current, {
      center: [42.1, 12.6],
      zoom: 6,
      minZoom: 5,
      maxZoom: 14,
      zoomControl: false,
    });

    // Elegant Dark Matter CartoDB tiles fitting The Weather Channel dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);
    markerGroupRef.current = markerGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Radar Layer on frame or opacity change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (radarTileLayerRef.current) {
      map.removeLayer(radarTileLayerRef.current);
      radarTileLayerRef.current = null;
    }

    if (activeLayer === 'temp' || activeLayer === 'wind') {
      return; // Radar disabled
    }

    if (radarFrames.length > 0 && radarFrames[frameIndex]) {
      const curr = radarFrames[frameIndex];
      const radarUrl = `${radarHost}${curr.path}/256/{z}/{x}/{y}/2/1_1.png`;

      const newRadarLayer = L.tileLayer(radarUrl, {
        opacity: radarOpacity,
        zIndex: 200,
        maxZoom: 16,
      });

      newRadarLayer.addTo(map);
      radarTileLayerRef.current = newRadarLayer;
    }
  }, [frameIndex, radarFrames, radarHost, radarOpacity, activeLayer]);

  // Animation Loop for Radar
  useEffect(() => {
    if (!isPlaying || radarFrames.length === 0) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % radarFrames.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, radarFrames.length]);

  // Render Weather Station Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();

    // If only radar is requested without station overlays
    if (activeLayer === 'radar') return;

    stations.forEach((st) => {
      const isCurrentCity = st.name.toLowerCase() === currentCity.toLowerCase();
      const twc = st.twc;
      const ilmeteo = st.ilmeteo;

      const activeData =
        selectedSource === 'ilmeteo'
          ? ilmeteo
          : selectedSource === 'twc'
          ? twc
          : (st.average || {
              temp: Math.round((twc.temp + ilmeteo.temp) / 2),
              feelsLike: Math.round((twc.feelsLike + ilmeteo.feelsLike) / 2),
              condition: twc.condition,
              conditionType: twc.conditionType,
              windSpeed: Math.round((twc.windSpeed + ilmeteo.windSpeed) / 2),
              windDirection: twc.windDirection,
              windDeg: twc.windDeg,
              humidity: Math.round((twc.humidity + ilmeteo.humidity) / 2),
              pop: Math.round((twc.pop + ilmeteo.pop) / 2),
              rainMm: twc.rainMm,
            });

      const deltaTemp = Math.abs(twc.temp - ilmeteo.temp);
      const tempColor = getTempColor(activeData.temp);
      const windColor = getWindColor(activeData.windSpeed);

      // Build custom HTML DivIcon
      let markerHtml = '';

      if (selectedSource === 'compare') {
        // Dual Comparison Marker
        markerHtml = `
          <div class="relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110 group ${
            isCurrentCity ? 'ring-2 ring-sky-400 rounded-lg p-0.5' : ''
          }">
            <div class="flex items-center gap-1 bg-[#00172e] border-2 border-slate-600 rounded-lg px-2 py-1 shadow-2xl text-white font-sans text-xs">
              <span class="font-black px-1 rounded bg-[#005a9c] text-white" title="TWC">
                ${formatTemp(twc.temp, unit)}
              </span>
              <span class="text-[10px] text-slate-400">vs</span>
              <span class="font-bold px-1 rounded bg-[#1b4332] text-white border border-emerald-400/40" title="iLMeteo">
                ${formatTemp(ilmeteo.temp, unit)}
              </span>
              ${
                deltaTemp > 0
                  ? `<span class="text-[9px] font-bold text-amber-300 px-1 py-0.2 bg-amber-950 rounded">Δ${deltaTemp}°</span>`
                  : ''
              }
            </div>
            <div class="bg-[#0b1d33]/90 text-[10px] font-bold text-slate-200 px-1.5 py-0.5 rounded shadow mt-0.5 whitespace-nowrap border border-slate-700">
              ${st.name}
            </div>
          </div>
        `;
      } else if (activeLayer === 'wind') {
        // Wind Focus Marker
        markerHtml = `
          <div class="flex flex-col items-center cursor-pointer transition-transform hover:scale-110 ${
            isCurrentCity ? 'scale-110' : ''
          }">
            <div class="flex items-center gap-1 px-2 py-1 rounded-full text-white font-bold text-xs shadow-xl border-2 border-white/80" style="background-color: ${windColor}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="transform: rotate(${activeData.windDeg}deg)">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
              <span>${activeData.windSpeed} km/h</span>
            </div>
            <span class="text-[10px] font-bold text-slate-900 bg-white/90 px-1 rounded shadow mt-0.5">${st.name}</span>
          </div>
        `;
      } else {
        // Standard Temperature Pill Marker
        markerHtml = `
          <div class="flex flex-col items-center cursor-pointer transition-transform hover:scale-110 ${
            isCurrentCity ? 'scale-115 z-30' : ''
          }">
            <div class="flex items-center gap-1 px-2 py-1 rounded-lg text-white font-black text-xs shadow-xl border-2 ${
              isCurrentCity ? 'border-sky-300 ring-2 ring-sky-500' : 'border-white/80'
            }" style="background-color: ${tempColor}">
              <span>${formatTemp(activeData.temp, unit)}</span>
              ${activeData.pop > 30 ? `<span class="text-[10px] text-blue-200">🌧</span>` : ''}
            </div>
            <span class="text-[10px] font-bold text-slate-900 bg-white/95 px-1.5 py-0.5 rounded shadow mt-0.5 border border-slate-300">${st.name}</span>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-weather-marker',
        iconSize: [80, 42],
        iconAnchor: [40, 21],
      });

      const marker = L.marker([st.lat, st.lon], { icon: customIcon });

      // Click listener: select station & popup
      marker.on('click', () => {
        setSelectedStation(st);
      });

      marker.addTo(markerGroup);
    });
  }, [stations, selectedSource, activeLayer, unit, currentCity]);

  // Center map on active city
  const handleCenterOnActiveCity = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const found = stations.find((s) => s.name.toLowerCase() === currentCity.toLowerCase());
    if (found) {
      map.flyTo([found.lat, found.lon], 9, { duration: 1.2 });
      setSelectedStation(found);
    } else {
      // Default to center of Italy
      map.flyTo([42.1, 12.6], 6, { duration: 1.2 });
    }
  };

  // Reset to full view of Italy
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([42.1, 12.6], 6, { duration: 1 });
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 300);
  };

  return (
    <section
      className={`bg-[#0b1d33] border border-slate-700/80 rounded-xl shadow-2xl text-white overflow-hidden transition-all duration-300 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'relative'
      }`}
    >
      {/* Header bar */}
      <div className="bg-[#001f3f] border-b border-slate-700/80 px-4 py-3 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600 rounded-lg text-white shadow-md">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Mappa Meteorologica Interattiva &amp; Radar
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-wide">
                Live Nowcast
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Zoom, trascinamento e sovrapposizioni meteorologiche in tempo reale per l'Italia e il Mediterraneo
            </p>
          </div>
        </div>

        {/* Official Source Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#072418] px-3 py-1.5 rounded-lg border border-emerald-500/60 text-xs shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
            <span className="text-slate-300 font-medium mr-1">Rete Dati:</span>
            <strong className="text-white font-bold">iLMeteo.it</strong>
            <span className="text-emerald-400 text-[10px] ml-1.5 font-semibold">(Modello ECMWF / ZEUS HD)</span>
          </div>
        </div>
      </div>

      {/* Secondary Controls Bar: Layer Selector, Refresh Interval & Map Tools */}
      <div className="bg-[#07192d] border-b border-slate-700/60 px-4 py-2 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Layer Filters */}
        <div className="flex items-center gap-1 bg-[#0b1d33] p-1 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => setActiveLayer('all')}
            className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
              activeLayer === 'all'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Tutti i Livelli
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('radar')}
            className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
              activeLayer === 'radar'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Solo Radar Pioggia
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('temp')}
            className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
              activeLayer === 'temp'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Temperature
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('wind')}
            className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
              activeLayer === 'wind'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Vento &amp; Raffiche
          </button>
        </div>

        {/* Refresh & Map Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Auto Refresh dropdown */}
          <div className="flex items-center gap-1 bg-[#0b1d33] px-2 py-1 rounded-lg border border-slate-700 text-slate-300">
            <Clock className="w-3 h-3 text-sky-400" />
            <span className="text-[11px] font-medium hidden sm:inline">Auto-sync:</span>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value) as AutoRefreshInterval)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value={30} className="bg-[#0b1d33] text-white">30s</option>
              <option value={60} className="bg-[#0b1d33] text-white">1 min</option>
              <option value={300} className="bg-[#0b1d33] text-white">5 min</option>
              <option value={0} className="bg-[#0b1d33] text-white">Manuale</option>
            </select>
            {refreshInterval > 0 && (
              <span className="text-[10px] text-sky-300 font-mono pl-1 border-l border-slate-700">
                {countdown}s
              </span>
            )}
          </div>

          {/* Manual Refresh Button */}
          <button
            type="button"
            onClick={fetchData}
            disabled={isRefreshing}
            className="p-1.5 bg-[#0b1d33] hover:bg-[#112a48] border border-slate-700 rounded-lg text-slate-200 hover:text-white transition-all flex items-center gap-1"
            title="Aggiorna dati mappa ora"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            <span className="hidden md:inline">Aggiorna</span>
          </button>

          {/* Center on current city */}
          <button
            type="button"
            onClick={handleCenterOnActiveCity}
            className="p-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded-lg transition-colors flex items-center gap-1 font-semibold"
            title={`Centra mappa su ${currentCity}`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentCity}</span>
          </button>

          {/* Reset Italy view */}
          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 bg-[#0b1d33] hover:bg-[#112a48] border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="Vista intera Italia"
          >
            Italia
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 bg-[#0b1d33] hover:bg-[#112a48] border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Riduci schermo' : 'Schermo intero'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 w-full min-h-[480px] sm:min-h-[560px] bg-[#020d1a]">
        {/* Leaflet Mount Point */}
        <div ref={mapContainerRef} className="absolute inset-0 z-0" />

        {/* Top-Left Floating Info Badge */}
        <div className="absolute top-3 left-3 z-10 bg-[#00172e]/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl max-w-xs pointer-events-auto">
          <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-1.5 mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Radar Doppler &amp; Stazioni
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {lastUpdated || 'In aggiornamento...'}
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-snug">
            Trascina la mappa per navigare, usa lo scroll per zoomare e clicca sui bollettini per ispezionare le città.
          </p>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Precipitazioni rilevate via radar TWC / RainViewer</span>
          </div>
        </div>

        {/* Top-Right Radar dBZ Color Legend */}
        {(activeLayer === 'all' || activeLayer === 'radar') && (
          <div className="absolute top-3 right-12 z-10 bg-[#00172e]/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 shadow-2xl text-[10px] hidden sm:block pointer-events-auto">
            <div className="font-extrabold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Riflettività Radar</span>
              <span className="text-sky-300">dBZ</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2.5 bg-emerald-500 rounded-xs" title="Debole (15-30 dBZ)" />
              <div className="w-4 h-2.5 bg-yellow-400 rounded-xs" title="Moderata (30-45 dBZ)" />
              <div className="w-4 h-2.5 bg-orange-500 rounded-xs" title="Forte (45-55 dBZ)" />
              <div className="w-4 h-2.5 bg-red-600 rounded-xs" title="Intensa (55-65 dBZ)" />
              <div className="w-4 h-2.5 bg-purple-600 rounded-xs" title="Estrema / Grandine" />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>Pioviggine</span>
              <span>Grandine</span>
            </div>

            {/* Opacity slider */}
            <div className="mt-2 pt-2 border-t border-slate-700 flex items-center justify-between gap-2">
              <span className="text-[9px] text-slate-400">Opacità Radar:</span>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={radarOpacity}
                onChange={(e) => setRadarOpacity(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>
          </div>
        )}

        {/* Bottom Time Scrubber & Player Bar (when Radar is active) */}
        {(activeLayer === 'all' || activeLayer === 'radar') && radarFrames.length > 0 && (
          <div className="absolute bottom-4 left-3 right-3 sm:left-6 sm:right-6 z-10 bg-[#00172e]/95 backdrop-blur-md border border-slate-700/90 rounded-xl p-3 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-auto">
            {/* Play/Pause and Reset */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-lg shadow transition-colors flex items-center gap-1.5 text-xs"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pausa' : 'Riproduci'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const nowIdx = radarFrames.findIndex((f) => (f as any).isNow);
                  if (nowIdx !== -1) setFrameIndex(nowIdx);
                  setIsPlaying(false);
                }}
                className="p-1.5 bg-[#07192d] hover:bg-[#0c2a4d] border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-xs"
                title="Vai a frame ADESSO"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="pl-2 border-l border-slate-700">
                <span className="text-[11px] text-slate-400 block leading-none">Frame Attivo</span>
                <span className="text-xs font-black text-sky-300">
                  {radarFrames[frameIndex]?.label || 'Radar Attuale'}
                </span>
              </div>
            </div>

            {/* Stepper Buttons for Radar Timeline */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar">
              {radarFrames.map((f, idx) => {
                const isCurrent = idx === frameIndex;
                const isNow = (f as any).isNow;
                const isForecast = (f as any).isForecast;

                return (
                  <button
                    key={`${f.time}-${idx}`}
                    type="button"
                    onClick={() => {
                      setFrameIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-sky-500 text-white shadow-lg ring-1 ring-white'
                        : isNow
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900'
                        : isForecast
                        ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900'
                        : 'bg-[#07192d] text-slate-300 hover:bg-[#0f2d52] border border-slate-700/60'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Station Popover Modal / Drawer */}
        {selectedStation && (
          <div className="absolute top-16 right-3 sm:right-6 z-20 w-80 sm:w-96 bg-[#001f3f]/95 backdrop-blur-md border border-sky-400/50 rounded-xl p-4 shadow-2xl text-white pointer-events-auto animate-fadeIn">
            <div className="flex items-start justify-between border-b border-slate-700/80 pb-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base text-white">{selectedStation.name}</h3>
                  <span className="text-xs text-sky-300 font-semibold">
                    ({selectedStation.region})
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Lat: {selectedStation.lat.toFixed(2)} • Lon: {selectedStation.lon.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStation(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* iLMeteo Official Station Detail */}
            <div className="bg-[#06241a] p-3 rounded-xl border border-emerald-500/50 mb-3 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Previsione Ufficiale iLMeteo.it
                </span>
                <span className="bg-[#1b4332] text-white px-1.5 py-0.5 rounded text-[10px] border border-emerald-400/40 font-bold">
                  ECMWF / ZEUS
                </span>
              </div>
              <div className="flex items-center justify-between my-2">
                <div>
                  <div className="text-3xl font-black text-white">
                    {formatTemp(selectedStation.ilmeteo.temp, unit)}
                  </div>
                  <p className="text-xs font-semibold text-emerald-200">
                    {selectedStation.ilmeteo.condition}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-300">
                  <span className="text-[11px] text-slate-400 block">Percepita</span>
                  <span className="font-bold text-white text-sm">
                    {formatTemp(selectedStation.ilmeteo.feelsLike, unit)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-emerald-900/80 text-[11px] text-slate-300">
                <div className="bg-black/30 p-1.5 rounded">
                  <span className="text-[10px] text-slate-400 block">Vento</span>
                  <span className="font-bold text-white">
                    {selectedStation.ilmeteo.windSpeed} km/h {selectedStation.ilmeteo.windDirection}
                  </span>
                </div>
                <div className="bg-black/30 p-1.5 rounded">
                  <span className="text-[10px] text-slate-400 block">Pioggia</span>
                  <span className="font-bold text-emerald-300">
                    {selectedStation.ilmeteo.pop}%
                  </span>
                </div>
                <div className="bg-black/30 p-1.5 rounded">
                  <span className="text-[10px] text-slate-400 block">Umidità</span>
                  <span className="font-bold text-white">
                    {selectedStation.ilmeteo.humidity}%
                  </span>
                </div>
              </div>
            </div>

            {/* Set as active city button */}
            <button
              type="button"
              onClick={() => {
                onSelectCity(selectedStation.name);
                setSelectedStation(null);
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-xs text-white transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Imposta {selectedStation.name} come Città Principale</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Info strip */}
      <div className="bg-[#00172e] border-t border-slate-700/80 px-4 py-2.5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Fonte meteorologica esclusiva: iLMeteo.it (Modello Orografico ZEUS HD ed ECMWF)
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Aggiornamento radar e stazioni in tempo reale
        </div>
      </div>
    </section>
  );
};
