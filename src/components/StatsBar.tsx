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
    <div className="space-y-2">
      {/* Search mode badge */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Fonte de Dados: <strong className="text-slate-200">{searchMode}</strong></span>
        </span>
        <span>Mostrando <strong className="text-brand-300">{total}</strong> empresas auditadas</span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Sem Site / Sem Landing Page */}
        <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-3.5 sm:p-4 relative overflow-hidden group hover:border-red-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Sem Site / Landing Page</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalNoAnySite}</span>
            <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
              {percentNoSite}% do mercado
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {withoutWebsite} sem domínio + {noLandingPageOrSocial} só redes sociais
          </p>
        </div>

        {/* Card 2: Oportunidades Quentes */}
        <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-3.5 sm:p-4 relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Oportunidades Quentes</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">{hotLeads}</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Score 80+
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Alta nota no Google + sem site oficial
          </p>
        </div>

        {/* Card 3: Com WhatsApp Pronto */}
        <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-3.5 sm:p-4 relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Com WhatsApp / Telefone</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{withPhone}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              1-Clique
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Prontos para envio de mensagem e pitch
          </p>
        </div>

        {/* Card 4: Potencial de Perda / Faturamento */}
        <div className="bg-slate-900 border border-indigo-500/20 rounded-2xl p-3.5 sm:p-4 relative overflow-hidden group hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Perda Estimada do Nicho</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg sm:text-2xl font-extrabold text-indigo-200">{formattedLoss}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Argumento forte de vendas para fechar contratos
          </p>
        </div>

      </div>
    </div>
  );
};
