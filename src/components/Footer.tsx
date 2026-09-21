import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-[#00172e] border-t border-[#0d3b66] text-slate-400 py-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* iLMeteo badge */}
            <div className="bg-[#1b4332] text-white font-bold text-xs px-2.5 py-1 rounded-md border border-emerald-500/50 flex items-center gap-1.5 shadow">
              <span className="w-2 h-2 rounded-full bg-red-500 ring-1 ring-white"></span>
              <span>ilmeteo<span className="text-emerald-300">.it</span></span>
            </div>
            <span className="text-slate-300 font-semibold ml-2">
              Fonte Ufficiale Esclusiva
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Dati Certificati
            </span>
            <span>Nowcasting Radar 24h</span>
            <span>Modello ECMWF / ZEUS HD</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            <strong>SuperMeteo</strong> • Piattaforma meteorologica ad alta risoluzione configurata esclusivamente con dati ufficiali da <strong>iLMeteo.it</strong> (Modello ECMWF / ZEUS HD), con nowcasting in tempo reale, grafici orari e radar interattivo.
          </p>
          <p className="whitespace-nowrap font-medium text-slate-400">
            © {new Date().getFullYear()} SuperMeteo • Powered by iLMeteo.it
          </p>
        </div>
      </div>
    </footer>
  );
};
