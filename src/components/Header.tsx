import React from 'react';
import { Search, Kanban, MapPin, BookOpen, Download, Settings, Sparkles, Building2 } from 'lucide-react';
import { Lead } from '../types';

interface HeaderProps {
  activeTab: 'search' | 'crm' | 'map' | 'playbook';
  setActiveTab: (tab: 'search' | 'crm' | 'map' | 'playbook') => void;
  crmLeadsCount: number;
  totalFoundCount: number;
  onOpenSettings: () => void;
  onExportCsv: () => void;
  leads: Lead[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  crmLeadsCount,
  totalFoundCount,
  onOpenSettings,
  onExportCsv,
  leads
}) => {
  return (
    <header className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5 cursor-pointer group" onClick={() => setActiveTab('search')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/30 ring-1 ring-white/30 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  LeadSite<span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">Pro</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/10 text-brand-300 border border-brand-500/30 shadow-sm shadow-brand-500/10">
                  <Sparkles className="w-3 h-3 mr-1 text-cyan-400" /> Sem Site Scanner
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 font-medium">
                Varredura de empresas sem presença digital para prospecção ativa
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-dark-900/80 p-1.5 rounded-2xl border border-white/[0.08] backdrop-blur-xl shadow-inner">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Prospectar</span>
              {totalFoundCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-black/40 rounded-full text-[10px] font-black text-cyan-300">
                  {totalFoundCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'crm'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Pipeline CRM</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                crmLeadsCount > 0 ? 'bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-400/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {crmLeadsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'map'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Mapa</span>
            </button>

            <button
              onClick={() => setActiveTab('playbook')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'playbook'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Playbook</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {leads.length > 0 && (
              <button
                onClick={onExportCsv}
                title="Exportar para CSV (Excel)"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-dark-850 hover:bg-dark-800 text-slate-200 border border-white/[0.08] hover:border-white/20 shadow-md transition"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Exportar CSV</span>
              </button>
            )}

            <button
              onClick={onOpenSettings}
              title="Configurações e Dados da Agência"
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-dark-850 hover:bg-dark-800 text-slate-200 border border-white/[0.08] hover:border-white/20 flex items-center space-x-1.5 shadow-md transition"
            >
              <Settings className="w-4 h-4 text-slate-300" />
              <span className="hidden md:inline">Configurações</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
