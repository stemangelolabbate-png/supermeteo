import React from 'react';
import { CurrentWeather, HourlyForecast } from '../types';
import { formatTemp } from '../utils/weatherIcons';
import { Scale, CheckCircle2, Info, ArrowRight, ShieldCheck } from 'lucide-react';

interface ComparisonCardProps {
  twcCurrent?: CurrentWeather;
  ilmeteoCurrent?: CurrentWeather;
  twcHourly?: HourlyForecast[];
  ilmeteoHourly?: HourlyForecast[];
  insights?: string;
  unit: 'C' | 'F';
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  twcCurrent,
  ilmeteoCurrent,
  insights,
  unit,
}) => {
  if (!twcCurrent || !ilmeteoCurrent) {
    return (
      <section className="bg-[#0b1d33] border border-slate-700/80 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Confronto Modelli: The Weather Channel vs iLMeteo.it</h2>
        </div>
        <p className="text-xs text-slate-300">
          Seleziona la modalità "Confronto" nella barra superiore per visualizzare il raffronto diretto tra i modelli IBM GRAF di The Weather Channel e ZEUS HD di iLMeteo.it.
        </p>
      </section>
    );
  }

  const tempDiff = Math.abs(twcCurrent.temp - ilmeteoCurrent.temp);

  return (
    <section className="bg-[#0b1d33] border border-amber-500/40 rounded-xl p-5 sm:p-7 shadow-2xl text-white">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Confronto Sinottico: The Weather Channel vs iLMeteo.it
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisi comparata dei dati meteorologici ufficiali per {twcCurrent.city}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-500/40 rounded-full text-xs text-amber-300 font-bold self-start sm:self-auto">
          <span>Scarto Termico: {tempDiff}°{unit}</span>
        </div>
      </div>

      {/* Two Column Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* The Weather Channel Card */}
        <div className="bg-[#071d36] border-2 border-[#005a9c] rounded-xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#005a9c] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                TWC
              </div>
              <span className="font-bold text-sm text-sky-200">The Weather Channel</span>
            </div>
            <span className="text-[10px] text-slate-400">Modello IBM GRAF (3km)</span>
          </div>

          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-5xl font-black text-white">
                {formatTemp(twcCurrent.temp, unit)}
              </span>
              <p className="text-sm font-semibold text-sky-300 mt-1">
                {twcCurrent.condition}
              </p>
            </div>
            <div className="text-right text-xs space-y-1">
              <p className="text-slate-400">Percepita: <span className="text-white font-bold">{formatTemp(twcCurrent.feelsLike, unit)}</span></p>
              <p className="text-slate-400">Max / Min: <span className="text-white font-bold">{formatTemp(twcCurrent.tempMax, unit)} / {formatTemp(twcCurrent.tempMin, unit)}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-slate-700/60">
            <div className="bg-[#051426] p-2 rounded text-center">
              <span className="text-[10px] text-slate-400 block">Umidità</span>
              <span className="font-bold text-white">{twcCurrent.humidity}%</span>
            </div>
            <div className="bg-[#051426] p-2 rounded text-center">
              <span className="text-[10px] text-slate-400 block">Vento</span>
              <span className="font-bold text-teal-300">{twcCurrent.windSpeed} km/h</span>
            </div>
            <div className="bg-[#051426] p-2 rounded text-center">
              <span className="text-[10px] text-slate-400 block">Indice UV</span>
              <span className="font-bold text-amber-300">UV {twcCurrent.uvIndex}</span>
            </div>
          </div>
        </div>

        {/* iLMeteo.it Card */}
        <div className="bg-[#06241a] border-2 border-[#1b4332] rounded-xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#1b4332] text-white text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/40">
                iLMeteo.it
              </div>
              <span className="font-bold text-sm text-emerald-200">iLMeteo.it</span>
            </div>
            <span className="text-[10px] text-slate-400">Modello ZEUS HD Italia</span>
          </div>

          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-5xl font-black text-white">
                {formatTemp(ilmeteoCurrent.temp, unit)}
              </span>
              <p className="text-sm font-semibold text-emerald-300 mt-1">
                {ilmeteoCurrent.condition}
              </p>
            </div>
            <div className="text-right text-xs space-y-1">
              <p className="text-slate-400">Percepita: <span className="text-white font-bold">{formatTemp(ilmeteoCurrent.feelsLike, unit)}</span></p>
              <p className="text-slate-400">Max / Min: <span className="text-white font-bold">{formatTemp(ilmeteoCurrent.tempMax, unit)} / {formatTemp(ilmeteoCurrent.tempMin, unit)}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-slate-700/60">
            <div className="bg-[#03150f] p-2 rounded text-center">
              <span className="text-[10px] text-slate-400 block">Umidità</span>
              <span className="font-bold text-white">{ilmeteoCurrent.humidity}%</span>
            </div>
            <div className="bg-[#03150f] p-2 rounded text-center">
              <span className="text-[10px] text-slate-400 block">Vento</span>
              <span className="font-bold text-teal-300">{ilmeteoCurrent.windSpeed} km/h</span>
            </div>
            <div className="bg-[#03150f] p-2 rounded text-center">
              <span className="text-[10px] text-slate-400 block">Indice UV</span>
              <span className="font-bold text-amber-300">UV {ilmeteoCurrent.uvIndex}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Insight */}
      <div className="bg-[#07192d] p-4 rounded-xl border border-slate-700/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-300">
          <span className="font-bold text-white block mb-1">
            Valutazione Comparativa e Affidabilità
          </span>
          <p>
            {insights ||
              `I modelli presentano un accordo sinottico elevato sul territorio di ${twcCurrent.city}. The Weather Channel (weather.com) ottimizza il calcolo su griglia globale ad alta risoluzione temporale, mentre iLMeteo.it adotta parametrizzazioni orografiche specifiche per la penisola italiana.`}
          </p>
        </div>
      </div>
    </section>
  );
};
