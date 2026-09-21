import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Layers, MapPin, CloudRain, Radio } from 'lucide-react';
import { CurrentWeather } from '../types';

interface RadarMapCardProps {
  current: CurrentWeather;
  radarInfo?: {
    intensity: 'light' | 'moderate' | 'heavy' | 'none';
    coveragePercent: number;
    cloudsPercent: number;
    nextRainExpectedInHours?: number | null;
  };
}

export const RadarMapCard: React.FC<RadarMapCardProps> = ({ current, radarInfo }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [frameIndex, setFrameIndex] = useState<number>(3); // 0 to 5 frames
  const [activeLayer, setActiveLayer] = useState<'radar' | 'clouds' | 'wind'>('radar');

  const frames = [
    { label: '-60 min', isPast: true },
    { label: '-40 min', isPast: true },
    { label: '-20 min', isPast: true },
    { label: 'ADESSO', isPast: false, isNow: true },
    { label: '+20 min (Previsione)', isPast: false, isFuture: true },
    { label: '+40 min (Previsione)', isPast: false, isFuture: true },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  const hasRain = radarInfo?.intensity && radarInfo.intensity !== 'none';

  return (
    <section className="bg-[#0b1d33] border border-slate-700/80 rounded-xl p-4 sm:p-6 shadow-xl text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Radar Meteorologico Interattivo Doppler
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracciamento precipitazioni in tempo reale e previsione a breve termine (Nowcasting)
          </p>
        </div>

        {/* Layer selector */}
        <div className="flex items-center bg-[#07192d] p-1 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setActiveLayer('radar')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              activeLayer === 'radar' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Radar Pioggia
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('clouds')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              activeLayer === 'clouds' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Copertura Nubi
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('wind')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              activeLayer === 'wind' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Flussi Vento
          </button>
        </div>
      </div>

      {/* Radar Map Canvas Simulation Area */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-slate-700/90 bg-[#020d1a] shadow-inner">
        {/* Geographic Map Vector Grid Background */}
        <div className="absolute inset-0 opacity-25">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />
          </svg>
        </div>

        {/* Simulated Topography & Coastline Contours */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
            <path
              d="M 50 120 Q 180 80 320 150 T 480 200 T 650 180 T 780 260"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <path
              d="M 100 320 Q 250 280 400 340 T 550 310 T 720 380"
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Dynamic Radar Reflectivity Blobs based on frame index */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {activeLayer === 'radar' && (
            <div
              className="relative w-72 h-72 rounded-full transition-transform duration-1000 ease-in-out"
              style={{
                transform: `scale(${1 + frameIndex * 0.08}) translate(${
                  (frameIndex - 2) * 12
                }px, ${(frameIndex - 2) * -6}px)`,
              }}
            >
              {hasRain ? (
                <>
                  {/* Outer weak precipitation (Green) */}
                  <div className="absolute inset-4 rounded-full bg-emerald-500/30 blur-2xl animate-pulse" />
                  {/* Moderate core (Yellow/Orange) */}
                  <div className="absolute inset-14 rounded-full bg-amber-500/40 blur-xl" />
                  {/* Intense core (Red/Violet) */}
                  <div className="absolute inset-24 rounded-full bg-red-600/45 blur-lg" />
                </>
              ) : (
                <div className="absolute inset-16 rounded-full bg-sky-500/10 blur-3xl" />
              )}
            </div>
          )}

          {activeLayer === 'clouds' && (
            <div
              className="absolute inset-0 bg-gradient-to-tr from-slate-200/10 via-slate-100/25 to-slate-300/5 blur-3xl transition-opacity duration-700"
              style={{ opacity: 0.4 + frameIndex * 0.08 }}
            />
          )}

          {activeLayer === 'wind' && (
            <div className="absolute inset-0 flex items-center justify-center text-teal-400/40 text-xs font-mono">
              <div className="animate-spin duration-10000 w-64 h-64 border border-dashed border-teal-500/30 rounded-full" />
            </div>
          )}
        </div>

        {/* Center Target City Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-sky-400 animate-ping opacity-75"></span>
            <div className="relative bg-red-600 text-white p-1 rounded-full shadow-lg border-2 border-white">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1 bg-[#00172e]/90 px-2.5 py-0.5 rounded-full border border-sky-400/40 shadow-lg text-[11px] font-bold text-white whitespace-nowrap">
            {current.city} ({current.temp}°C)
          </div>
        </div>

        {/* Top Floating Status Box */}
        <div className="absolute top-3 left-3 bg-[#07192d]/90 border border-slate-700/80 rounded-lg p-2.5 shadow-xl text-xs backdrop-blur-sm z-10 max-w-xs">
          <div className="flex items-center gap-1.5 text-sky-300 font-bold">
            <CloudRain className="w-4 h-4" />
            <span>
              {hasRain
                ? 'Rovesci attivi nel raggio di 30 km'
                : 'Nessuna precipitazione rilevata in zona'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            {hasRain
              ? 'Transito di cellule temporalesche da Ovest a Est.'
              : 'Condizioni atmosferiche stabili per le prossime 2 ore.'}
          </p>
        </div>

        {/* Top Right Radar Legend */}
        <div className="absolute top-3 right-3 bg-[#07192d]/90 border border-slate-700/80 rounded-lg p-2 shadow-xl text-[10px] backdrop-blur-sm z-10 hidden sm:block">
          <span className="text-slate-400 font-semibold block mb-1 uppercase">
            Intensità dBZ
          </span>
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-2 bg-emerald-500 rounded-xs" title="Debole (15-30 dBZ)" />
            <div className="w-3.5 h-2 bg-yellow-400 rounded-xs" title="Moderata (30-45 dBZ)" />
            <div className="w-3.5 h-2 bg-orange-500 rounded-xs" title="Forte (45-55 dBZ)" />
            <div className="w-3.5 h-2 bg-red-600 rounded-xs" title="Intensa (55-65 dBZ)" />
            <div className="w-3.5 h-2 bg-purple-600 rounded-xs" title="Estrema / Grandine" />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
            <span>Debole</span>
            <span>Grandine</span>
          </div>
        </div>

        {/* Bottom Time Controls Toolbar */}
        <div className="absolute bottom-3 left-3 right-3 bg-[#07192d]/95 border border-slate-700/90 rounded-xl p-2 sm:p-3 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-bold transition-colors flex items-center gap-1 text-xs"
              title={isPlaying ? 'Pausa animazione' : 'Avvia animazione'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pausa' : 'Play'}</span>
            </button>
            <button
              type="button"
              onClick={() => setFrameIndex(3)}
              className="p-2 bg-[#0b1d33] hover:bg-[#112a48] border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-xs"
              title="Torna ad ADESSO"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-extrabold text-sky-300 pl-1">
              {frames[frameIndex].label}
            </span>
          </div>

          {/* Stepper Buttons for Frames */}
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {frames.map((f, i) => {
              const isCurr = i === frameIndex;
              return (
                <button
                  key={`frame-${i}`}
                  type="button"
                  onClick={() => {
                    setFrameIndex(i);
                    setIsPlaying(false);
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all whitespace-nowrap ${
                    isCurr
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-[#0b1d33] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
