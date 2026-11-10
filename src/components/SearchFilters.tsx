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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        
        {/* Main Location & Niche Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          
          {/* 1. Country Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Globe2 className="w-3.5 h-3.5 text-brand-400" />
              <span>1. País</span>
            </label>
            <div className="relative">
              <select
                value={filters.countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition appearance-none cursor-pointer"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <Globe2 className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </div>

          {/* 2. State / UF Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Map className="w-3.5 h-3.5 text-indigo-400" />
              <span>2. Estado / Província</span>
            </label>
            <div className="relative">
              <select
                value={filters.stateCode}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition appearance-none cursor-pointer"
              >
                {currentCountry.states.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <Map className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </div>

          {/* 3. City Selector (Dropdown + Custom toggle) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Cidade</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomCityMode(!customCityMode)}
                className="text-[11px] text-brand-400 hover:text-brand-300 underline font-medium"
              >
                {customCityMode ? 'Escolher da lista' : 'Digitar outra cidade'}
              </button>
            </div>

            {customCityMode ? (
              <input
                type="text"
                placeholder="Ex: Santos, Bauru, Cascavel..."
                value={filters.city}
                onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
              />
            ) : (
              <div className="relative">
                <select
                  value={filters.city}
                  onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition appearance-none cursor-pointer"
                >
                  {currentState.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                  <Navigation className="w-4 h-4 opacity-50" />
                </div>
              </div>
            )}
          </div>

          {/* 4. Niche / Segment Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              <span>4. Nicho / Segmento</span>
            </label>
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition appearance-none cursor-pointer"
              >
                {NICHES.map((niche) => (
                  <option key={niche.id} value={niche.id}>
                    {niche.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </div>

        </div>

        {/* Secondary Row: Website Presence Filter & Quick Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-slate-800/80">
          
          {/* Website Status Specificity Filter */}
          <div className="md:col-span-6 lg:col-span-5">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Status da Presença Digital:</span>
            </label>
            <select
              value={filters.statusFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, statusFilter: e.target.value as any }))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-amber-300 font-semibold focus:ring-2 focus:ring-amber-500 outline-none transition cursor-pointer"
            >
              <option value="WITHOUT_ANY_SITE">⚡ Sem Nenhum Site ou Landing Page (Recomendado)</option>
              <option value="NO_WEBSITE">🔴 100% Sem Domínio / Sem Site</option>
              <option value="NO_LANDING_PAGE">🟠 Sem Landing Page (Apenas Perfil/Linktree)</option>
              <option value="SOCIAL_ONLY">🟣 Apenas Redes Sociais (Instagram/Facebook)</option>
              <option value="ALL">⚪ Todos os Estabelecimentos</option>
            </select>
          </div>

          {/* Quick Keyword & Toggles */}
          <div className="md:col-span-6 lg:col-span-4 flex items-center space-x-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Palavra-chave (opcional):
              </label>
              <input
                type="text"
                placeholder="Ex: Centro, Bairro, Prime, Dr..."
                value={filters.customKeyword}
                onChange={(e) => setFilters((prev) => ({ ...prev, customKeyword: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 outline-none transition"
              />
            </div>

            <div className="pt-5">
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, onlyWithPhone: !prev.onlyWithPhone }))}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition ${
                  filters.onlyWithPhone
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Filtrar apenas empresas que possuem telefone cadastrado"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Com Telefone</span>
              </button>
            </div>
          </div>

          {/* Search Trigger Button */}
          <div className="md:col-span-12 lg:col-span-3 pt-2 lg:pt-5">
            <button
              onClick={onSearch}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
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
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold whitespace-nowrap flex items-center">
            <Sparkles className="w-3 h-3 text-brand-400 mr-1" /> Nichos Rápidos:
          </span>
          {NICHES.slice(0, 6).map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: n.id }));
              }}
              className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap font-medium ${
                filters.category === n.id
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {n.name.split('/')[0]}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
