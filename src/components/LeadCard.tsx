import React, { useState } from 'react';
import { 
  Globe, MessageCircle, MapPin, Star, Flame, 
  ExternalLink, Copy, Check, ShieldAlert, Kanban, Eye, AlertCircle
} from 'lucide-react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  onOpenPitch: (lead: Lead) => void;
  onOpenAudit: (lead: Lead) => void;
  onToggleCrm: (lead: Lead) => void;
  isSavedInCrm: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onOpenPitch,
  onOpenAudit,
  onToggleCrm,
  isSavedInCrm
}) => {
  const [copied, setCopied] = useState(false);

  const copyQuickInfo = () => {
    const text = `${lead.name} | ${lead.category} em ${lead.city}-${lead.state}\nTelefone: ${lead.phone || 'N/A'}\nStatus: ${getStatusText(lead.websiteStatus)}\nGoogle Maps: ${lead.googleMapsUrl || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedLoss = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.estimatedMonthlyLoss);

  return (
    <div className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all duration-200 relative group flex flex-col justify-between ${
      lead.opportunityScore >= 85 
        ? 'border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-amber-500/5' 
        : 'border-slate-800 hover:border-slate-700 shadow-md'
    }`}>
      
      {/* Top Header: Category & Opportunity Score */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          
          {/* Status Badge & Real Source Badge */}
          <div className="flex flex-wrap items-center gap-1.5">
            {getStatusBadge(lead.websiteStatus)}
            {lead.source === 'openstreetmap' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30" title="Estabelecimento Real Verificado no OpenStreetMap">
                🌐 Real (OSM)
              </span>
            )}
            {lead.source === 'google_places' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" title="Estabelecimento Real Verificado no Google Places">
                ⭐ Real (Google)
              </span>
            )}
            {lead.source === 'smart_generator' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700" title="Dado sintético para testes">
                🤖 Demonstração
              </span>
            )}
          </div>

          {/* Opportunity Score Pill */}
          <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
            lead.opportunityScore >= 85
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
              : lead.opportunityScore >= 70
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-300'
          }`} title="Score de Oportunidade para Venda de Site / Landing Page">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Score {lead.opportunityScore}%</span>
          </div>

        </div>

        {/* Business Name */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition line-clamp-1">
          {lead.name}
        </h3>

        {/* Category & Location */}
        <p className="text-xs font-semibold text-brand-400 mb-2">
          {lead.category}
        </p>

        {/* Rating & Reviews */}
        <div className="flex items-center space-x-2 text-xs text-slate-300 mb-3 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
          <div className="flex items-center text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
            <span>{lead.rating || '4.8'}</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">({lead.reviewsCount || 24} avaliações Google)</span>
          <span className="text-slate-600">•</span>
          <span className="text-red-400 font-semibold text-[11px]">Perde ~{formattedLoss}/mês</span>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2 text-xs text-slate-400 mb-2">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{lead.address}</span>
        </div>

        {/* Detected URL if any */}
        {lead.detectedUrl && (
          <div className="text-[11px] text-slate-500 mb-3 truncate flex items-center space-x-1">
            <Globe className="w-3 h-3 text-slate-600" />
            <span className="text-slate-400">URL:</span>
            <span className="text-slate-500 truncate">{lead.detectedUrl}</span>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 mt-2 space-y-2">
        
        {/* Main WhatsApp Pitch Button */}
        <button
          onClick={() => onOpenPitch(lead)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition transform active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4 fill-slate-950" />
          <span>Enviar Pitch no WhatsApp</span>
        </button>

        {/* Secondary Tool Buttons */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          
          {/* Audit Button */}
          <button
            onClick={() => onOpenAudit(lead)}
            title="Ver Auditoria de Falhas & Argumentos de Vendas"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1 border border-slate-700 transition"
          >
            <Eye className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Auditoria</span>
          </button>

          {/* CRM Toggle */}
          <button
            onClick={() => onToggleCrm(lead)}
            title={isSavedInCrm ? 'Salvo no CRM' : 'Adicionar ao Pipeline CRM'}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 border transition ${
              isSavedInCrm
                ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{isSavedInCrm ? 'No CRM' : 'Salvar'}</span>
          </button>

          {/* Copy Info */}
          <button
            onClick={copyQuickInfo}
            title="Copiar dados do Lead"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Google Maps link */}
          <a
            href={lead.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + lead.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir no Google Maps"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center border border-slate-700 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

        </div>

      </div>

    </div>
  );
};

function getStatusBadge(status: Lead['websiteStatus']) {
  switch (status) {
    case 'NO_WEBSITE':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
          <AlertCircle className="w-3 h-3 mr-1" /> Sem Site Oficial
        </span>
      );
    case 'NO_LANDING_PAGE':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <ShieldAlert className="w-3 h-3 mr-1" /> Sem Landing Page
        </span>
      );
    case 'SOCIAL_ONLY':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
          <Globe className="w-3 h-3 mr-1" /> Só Instagram / Redes
        </span>
      );
    case 'BROKEN_WEBSITE':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
          <AlertCircle className="w-3 h-3 mr-1" /> Site Inativo / Erro
        </span>
      );
    case 'HAS_WEBSITE':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Globe className="w-3 h-3 mr-1" /> Possui Site
        </span>
      );
    default:
      return null;
  }
}

function getStatusText(status: Lead['websiteStatus']): string {
  switch (status) {
    case 'NO_WEBSITE': return 'Sem Site Oficial (Oportunidade Ouro)';
    case 'NO_LANDING_PAGE': return 'Sem Landing Page de Conversão';
    case 'SOCIAL_ONLY': return 'Possui apenas Instagram';
    case 'BROKEN_WEBSITE': return 'Site com Erro / Inativo';
    case 'HAS_WEBSITE': return 'Possui Site';
  }
}
