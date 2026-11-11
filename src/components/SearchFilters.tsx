import React, { useState } from 'react';
import { Search, Globe2, Map, Navigation, Briefcase, Filter, Phone, Star, Sparkles, RefreshCw } from 'lucide-react';
import { SearchFilterState } from '../types';
import { COUNTRIES } from '../data/locations';
import { NICHES } from '../data/niches';

interface SearchFiltersProps {
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  setFilters,
  onSearch,
  isLoading
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customCityMode, setCustomCityMode] = useState(false);

  const currentCountry = COUNTRIES.find((c) => c.code === filters.countryCode) || COUNTRIES[0];
  const currentState = currentCountry.states.find((s) => s.code === filters.stateCode) || currentCountry.states[0];

  const handleCountryChange = (code: string) => {
    const newCountry = COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
    const newState = newCountry.states[0];
    const newCity = newState.cities[0] || '';
    setFilters((prev) => ({
      ...prev,
      countryCode: code,
      stateCode: newState.code,
      city: newCity
    }));
  };

  const handleStateChange = (code: string) => {
    const newState = currentCountry.states.find((s) => s.code === code) || currentCountry.states[0];
    const newCity = newState.cities[0] || '';
    setFilters((prev) => ({
      ...prev,
      stateCode: code,
      city: newCity
    }));
  };

  return (
    <div className="bg-dark-900/90 border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      {/* Decorative cyber ambient glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        
        {/* Main Location & Niche Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          
          {/* 1. Country Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. País</span>
            </label>
            <div className="relative">
              <select
                value={filters.countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-dark-950 border border-white/[0.08] hover:border-brand-500/40 focus:border-brand-500 rounded-2xl px-4 py-3 text-sm text-slate-100 font-bold focus:ring-2 focus:ring-brand-500/30 outline-none transition appearance-none cursor-pointer shadow-inner"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code} className="bg-dark-900">
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-slate-400">
                <Globe2 className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </div>

          {/* 2. State / UF Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Map className="w-3.5 h-3.5 text-indigo-400" />
              <span>2. Estado / Região</span>
            </label>
            <div className="relative">
              <select
                value={filters.stateCode}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-dark-950 border border-white/[0.08] hover:border-brand-500/40 focus:border-brand-500 rounded-2xl px-4 py-3 text-sm text-slate-100 font-bold focus:ring-2 focus:ring-brand-500/30 outline-none transition appearance-none cursor-pointer shadow-inner"
              >
                {currentCountry.states.map((st) => (
                  <option key={st.code} value={st.code} className="bg-dark-900">
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-slate-400">
                <Map className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </div>

          {/* 3. City Selector (Dropdown + Custom toggle) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Cidade</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomCityMode(!customCityMode)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold transition underline"
              >
                {customCityMode ? 'Escolher da lista' : 'Digitar outra'}
              </button>
            </div>

            {customCityMode ? (
              <input
                type="text"
                placeholder="Ex: São Paulo, Santos, Lisboa..."
                value={filters.city}
                onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full bg-dark-950 border border-white/[0.08] hover:border-brand-500/40 focus:border-brand-500 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 font-bold focus:ring-2 focus:ring-brand-500/30 outline-none transition shadow-inner"
              />
            ) : (
              <div className="relative">
                <select
                  value={filters.city}
                  onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-dark-950 border border-white/[0.08] hover:border-brand-500/40 focus:border-brand-500 rounded-2xl px-4 py-3 text-sm text-slate-100 font-bold focus:ring-2 focus:ring-brand-500/30 outline-none transition appearance-none cursor-pointer shadow-inner"
                >
                  {currentState.cities.map((city) => (
                    <option key={city} value={city} className="bg-dark-900">
                      {city}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-slate-400">
                  <Navigation className="w-4 h-4 opacity-50" />
                </div>
              </div>
            )}
          </div>

          {/* 4. Niche / Segment Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              <span>4. Nicho / Segmento</span>
            </label>
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-dark-950 border border-white/[0.08] hover:border-brand-500/40 focus:border-brand-500 rounded-2xl px-4 py-3 text-sm text-slate-100 font-bold focus:ring-2 focus:ring-brand-500/30 outline-none transition appearance-none cursor-pointer shadow-inner"
              >
                {NICHES.map((niche) => (
                  <option key={niche.id} value={niche.id} className="bg-dark-900">
                    {niche.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </div>

        </div>

        {/* Secondary Row: Website Presence Filter & Quick Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-3 border-t border-white/[0.06]">
          
          {/* Website Status Specificity Filter */}
          <div className="md:col-span-6 lg:col-span-5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Status da Presença Digital:</span>
            </label>
            <select
              value={filters.statusFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, statusFilter: e.target.value as any }))}
              className="w-full bg-dark-950 border border-white/[0.08] hover:border-brand-500/40 focus:border-brand-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-amber-300 font-bold focus:ring-2 focus:ring-amber-500/30 outline-none transition cursor-pointer shadow-inner"
            >
              <option value="WITHOUT_ANY_SITE" className="bg-dark-900">⚡ Sem Nenhum Site ou Landing Page (Recomendado)</option>
              <option value="NO_WEBSITE" className="bg-dark-900">🔴 100% Sem Domínio / Sem Site</option>
              <option value="NO_LANDING_PAGE" className="bg-dark-900">🟠 Sem Landing Page (Apenas Perfil/Linktree)</option>
              <option value="SOCIAL_ONLY" className="bg-dark-900">🟣 Apenas Redes Sociais (Instagram/Facebook)</option>
              <option value="ALL" className="bg-dark-900">⚪ Todos os Estabelecimentos</option>
            </select>
          </div>

          {/* Quick Keyword & Toggles */}
          <div className="md:col-span-6 lg:col-span-4 flex items-center space-x-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Palavra-chave (opcional):
              </label>
              <input
                type="text"
                placeholder="Ex: Centro, Bairro, Prime, Dr..."
                value={filters.customKeyword}
                onChange={(e) => setFilters((prev) => ({ ...prev, customKeyword: e.target.value }))}
                className="w-full bg-dark-950 border border-white/[0.08] hover:border-brand-500/40 focus:border-brand-500 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 font-bold focus:ring-2 focus:ring-brand-500/30 outline-none transition shadow-inner"
              />
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, onlyWithPhone: !prev.onlyWithPhone }))}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border flex items-center space-x-1.5 transition ${
                  filters.onlyWithPhone
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-md shadow-emerald-500/10'
                    : 'bg-dark-950 text-slate-400 border-white/[0.08] hover:text-slate-200'
                }`}
                title="Filtrar apenas empresas que possuem telefone cadastrado"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Com Telefone</span>
              </button>
            </div>
          </div>

          {/* Search Trigger Button */}
          <div className="md:col-span-12 lg:col-span-3 pt-2 lg:pt-6">
            <button
              onClick={onSearch}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black py-3 px-5 rounded-2xl shadow-xl shadow-emerald-500/25 ring-1 ring-white/30 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Escaneando Empresas...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Buscar Empresas Sem Site</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Niche quick tags */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold whitespace-nowrap flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 mr-1.5" /> Atalhos:
          </span>
          {NICHES.slice(0, 9).map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: n.id }));
              }}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap font-bold text-xs ${
                filters.category === n.id
                  ? 'bg-brand-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/10'
                  : 'bg-dark-950 text-slate-400 hover:text-slate-200 border border-white/[0.08] hover:border-white/20'
              }`}
            >
              {n.id === 'todos_comercios' ? '🌟 Todos os Nichos' : n.name.split('/')[0].replace('🏬 ', '').replace('🌟 ', '')}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
