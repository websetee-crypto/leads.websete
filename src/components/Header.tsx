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
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/25 ring-1 ring-white/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  LeadSite<span className="text-brand-400">Pro</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/30">
                  <Sparkles className="w-3 h-3 mr-1" /> Prospector Sem Site
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-400">
                Encontre empresas sem site ou landing page por País, Estado e Cidade
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Prospectar</span>
              {totalFoundCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-black/30 rounded-full text-[10px] font-bold">
                  {totalFoundCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'crm'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Pipeline CRM</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                crmLeadsCount > 0 ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400'
              }`}>
                {crmLeadsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Mapa</span>
            </button>

            <button
              onClick={() => setActiveTab('playbook')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'playbook'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Guia de Vendas</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {leads.length > 0 && (
              <button
                onClick={onExportCsv}
                title="Exportar para CSV (Excel)"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-brand-400" />
                <span>Exportar CSV</span>
              </button>
            )}

            <button
              onClick={onOpenSettings}
              title="Configurações e Dados da Agência"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center space-x-1.5 transition"
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
