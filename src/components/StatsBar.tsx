import React from 'react';
import { Globe, MessageCircle, DollarSign, Flame, AlertCircle } from 'lucide-react';
import { Lead } from '../types';

interface StatsBarProps {
  leads: Lead[];
  searchMode: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({ leads, searchMode }) => {
  if (leads.length === 0) return null;

  const total = leads.length;
  const withoutWebsite = leads.filter((l) => l.websiteStatus === 'NO_WEBSITE').length;
  const noLandingPageOrSocial = leads.filter((l) => l.websiteStatus === 'NO_LANDING_PAGE' || l.websiteStatus === 'SOCIAL_ONLY').length;
  const totalNoAnySite = withoutWebsite + noLandingPageOrSocial;
  const percentNoSite = Math.round((totalNoAnySite / total) * 100);

  const totalLoss = leads.reduce((acc, l) => acc + (l.estimatedMonthlyLoss || 0), 0);
  const formattedLoss = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalLoss);

  const hotLeads = leads.filter((l) => l.opportunityScore >= 80).length;
  const withPhone = leads.filter((l) => Boolean(l.phone || l.whatsapp)).length;

  return (
    <div className="space-y-2.5">
      {/* Search mode badge */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1.5">
        <span className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium">Origem da Base: <strong className="text-slate-100">{searchMode}</strong></span>
        </span>
        <span className="font-medium">Radar Local: <strong className="text-cyan-400">{total}</strong> empresas auditadas</span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Sem Site / Sem Landing Page */}
        <div className="bg-dark-900/90 border border-red-500/20 hover:border-red-500/40 rounded-2xl p-4 relative overflow-hidden backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sem Site / LP</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-inner">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalNoAnySite}</span>
            <span className="text-[11px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
              {percentNoSite}% do nicho
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {withoutWebsite} sem domínio + {noLandingPageOrSocial} só redes sociais
          </p>
        </div>

        {/* Card 2: Oportunidades Quentes */}
        <div className="bg-dark-900/90 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-4 relative overflow-hidden backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leads Quentes</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-300">{hotLeads}</span>
            <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Score 80%+
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Boas notas no Google sem site oficial
          </p>
        </div>

        {/* Card 3: Com WhatsApp Pronto */}
        <div className="bg-dark-900/90 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 relative overflow-hidden backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contato Direto</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
              <MessageCircle className="w-4 h-4 fill-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-300">{withPhone}</span>
            <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              1-Clique
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Prontos para WhatsApp & Ligação
          </p>
        </div>

        {/* Card 4: Potencial de Perda / Faturamento */}
        <div className="bg-dark-900/90 border border-cyan-500/20 hover:border-cyan-500/40 rounded-2xl p-4 relative overflow-hidden backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perda do Nicho</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg sm:text-2xl font-black text-cyan-200">{formattedLoss}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Argumento de vendas para fechar contratos
          </p>
        </div>

      </div>
    </div>
  );
};
