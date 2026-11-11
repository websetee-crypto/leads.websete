import React, { useState } from 'react';
import {
  Globe, MessageCircle, MapPin, Star, Flame,
  Instagram, ExternalLink, Copy, Check, ShieldAlert, Kanban, Eye, AlertCircle,
  Clock, PhoneCall, Sparkles
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
    const text = `${lead.name} | ${lead.category} em ${lead.city}-${lead.state}\nTelefone: ${lead.phone || 'N/A'}\nHorário: ${lead.closingHours || 'Horário Comercial'}\nStatus: ${getStatusText(lead.websiteStatus)}\nGoogle Maps: ${lead.googleMapsUrl || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    const cleanPhone = (lead.whatsapp || lead.phone || '').replace(/\D/g, '');
    const defaultPitch = `Olá, tudo bem? Notei que a ${lead.name} tem ótimas avaliações em ${lead.city}, mas ainda não possui um site oficial ou landing page para captar clientes do Google. Vocês têm interesse em criar uma página profissional de alta conversão?`;
    const encoded = encodeURIComponent(defaultPitch);
    
    if (cleanPhone) {
      const fullNum = cleanPhone.startsWith('55') || cleanPhone.startsWith('351') || cleanPhone.startsWith('1') ? cleanPhone : '55' + cleanPhone;
      window.open(`https://wa.me/${fullNum}?text=${encoded}`, '_blank');
    } else {
      onOpenPitch(lead);
    }
  };

  const formattedLoss = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(lead.estimatedMonthlyLoss);

  return (
    <div className={`glass-card rounded-3xl p-5 sm:p-6 transition-all duration-300 relative group flex flex-col justify-between hover:-translate-y-1 ${
      lead.opportunityScore >= 85
        ? 'border-amber-500/30 hover:border-amber-400/60 shadow-xl shadow-amber-500/5 hover:shadow-amber-500/15'
        : 'border-white/[0.08] hover:border-brand-500/50 shadow-xl'
    }`}>
      
      {/* Top Header: Category & Opportunity Score */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          
          {/* Status Badge & Real Source Badge */}
          <div className="flex flex-wrap items-center gap-1.5">
            {getStatusBadge(lead.websiteStatus)}
            {lead.source === 'openstreetmap' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10" title="Estabelecimento Real Verificado no OpenStreetMap">
                🌐 Real (OSM)
              </span>
            )}
            {lead.source === 'google_places' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10" title="Estabelecimento Real Verificado no Google Places">
                ⭐ Real (Google)
              </span>
            )}
            {lead.source === 'smart_generator' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-dark-950 text-slate-400 border border-white/[0.08]" title="Dado sintético para testes">
                🤖 Demonstração
              </span>
            )}
          </div>

          {/* Opportunity Score Pill */}
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black shadow-inner ${
            lead.opportunityScore >= 85
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-amber-500/10'
              : lead.opportunityScore >= 70
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-dark-950 text-slate-300 border border-white/[0.08]'
          }`} title="Score de Oportunidade para Venda de Site / Landing Page">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Score {lead.opportunityScore}%</span>
          </div>

        </div>

        {/* Business Name */}
        <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors duration-200 line-clamp-1 tracking-tight">
          {lead.name}
        </h3>

        {/* Category & Location */}
        <p className="text-xs font-bold text-brand-400 mb-3 uppercase tracking-wider">
          {lead.category}
        </p>

        {/* Rating, Reviews & Loss */}
        <div className="flex items-center space-x-2 text-xs text-slate-300 mb-2.5 bg-dark-950/70 p-2.5 rounded-2xl border border-white/[0.06] shadow-inner">
          <div className="flex items-center text-amber-400 font-black">
            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
            <span>{lead.rating || '4.8'}</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 font-medium">({lead.reviewsCount || 24} avaliações)</span>
          <span className="text-slate-600">•</span>
          <span className="text-red-400 font-bold text-[11px]">Perde ~{formattedLoss}/mês</span>
        </div>

        {/* Closing Hours Badge */}
        <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold mb-2.5 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-2xl shadow-sm">
          <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{lead.closingHours || 'Aberto • Horário Comercial'}</span>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2 text-xs text-slate-400 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{lead.address}</span>
        </div>

        {/* Contact Channels Grid: WhatsApp, Telefone & Instagram */}
        <div className="space-y-1.5 mb-2">
          
          {/* 1. WhatsApp Box */}
          <div className="bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-2 flex items-center justify-between text-xs transition">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-400" />
              </div>
              <div className="truncate">
                <span className="text-slate-400 font-medium text-[11px] block">WhatsApp:</span>
                <span className="font-mono text-emerald-300 font-bold truncate">
                  {lead.phone || lead.whatsapp || 'Disponível no Google'}
                </span>
              </div>
            </div>

            <button
              onClick={handleDirectWhatsApp}
              className="text-[11px] font-extrabold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ml-1 shadow-sm transition"
              title="Abrir WhatsApp com pitch"
            >
              <span>Chamar</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          {/* 2. Telefone Box */}
          <div className="bg-blue-950/30 hover:bg-blue-950/50 border border-blue-500/30 rounded-xl p-2 flex items-center justify-between text-xs transition">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-5 h-5 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="text-slate-400 font-medium text-[11px] block">Telefone Fixo / Celular:</span>
                {lead.phone ? (
                  <span className="font-mono text-blue-300 font-bold truncate">
                    {lead.phone}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px] truncate">
                    Ver ficha no Maps
                  </span>
                )}
              </div>
            </div>

            {lead.phone ? (
              <a
                href={`tel:${lead.phone.replace(/\D/g, '')}`}
                className="text-[11px] font-extrabold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ml-1 shadow-sm transition"
                title="Ligar agora"
              >
                <span>Ligar</span>
              </a>
            ) : (
              <a
                href={lead.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + lead.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ml-1 transition"
                title="Buscar no Google Maps"
              >
                <span>Maps ↗</span>
              </a>
            )}
          </div>

          {/* 3. Instagram Box */}
          <div className="bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-indigo-950/40 hover:from-pink-900/50 hover:to-indigo-900/50 border border-pink-500/30 rounded-xl p-2 flex items-center justify-between text-xs transition">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0">
                <Instagram className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="text-slate-400 font-medium text-[11px] block">Instagram:</span>
                <span className="text-pink-300 font-semibold truncate">
                  {(lead.instagramUrl || `https://www.instagram.com/${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}/`)
                    .replace('https://www.instagram.com/', '@')
                    .replace('https://instagram.com/', '@')
                    .replace(/\/$/, '')}
                </span>
              </div>
            </div>

            <a
              href={lead.instagramUrl || `https://www.instagram.com/${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-extrabold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ml-1 shadow-sm transition"
              title="Abrir perfil no Instagram"
            >
              <span>Abrir</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 mt-2 space-y-2">
        
        {/* Main Action Buttons Grid: Direct WhatsApp & Call */}
        <div className="grid grid-cols-2 gap-2">
          
          {/* Direct WhatsApp Call */}
          <button
            onClick={handleDirectWhatsApp}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs py-3 px-3.5 rounded-2xl flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20 ring-1 ring-white/30 transition-all transform active:scale-[0.98] cursor-pointer"
            title="Abrir conversa direta no WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>WhatsApp Direto</span>
          </button>

          {/* Direct Call or Custom Pitch */}
          {lead.phone ? (
            <a
              href={`tel:${lead.phone.replace(/\D/g, '')}`}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs py-3 px-3.5 rounded-2xl flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-600/20 ring-1 ring-white/20 transition-all transform active:scale-[0.98]"
              title="Ligar agora para o estabelecimento"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Ligar Agora</span>
            </a>
          ) : (
            <button
              onClick={() => onOpenPitch(lead)}
              className="bg-dark-850 hover:bg-dark-800 text-slate-200 font-bold text-xs py-3 px-3.5 rounded-2xl flex items-center justify-center space-x-1.5 border border-white/[0.08] hover:border-white/20 transition"
              title="Ver Modelos de Pitch"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ver Pitch</span>
            </button>
          )}

        </div>

        {/* Secondary Tool Buttons */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          
          {/* Pitch Editor Modal Button */}
          <button
            onClick={() => onOpenPitch(lead)}
            title="Modelos de Mensagem e Pitch"
            className="p-2.5 rounded-2xl bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs font-bold flex items-center justify-center space-x-1 border border-white/[0.08] hover:border-white/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Pitch</span>
          </button>

          {/* Audit Button */}
          <button
            onClick={() => onOpenAudit(lead)}
            title="Ver Auditoria de Falhas & Argumentos de Vendas"
            className="p-2.5 rounded-2xl bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs font-bold flex items-center justify-center space-x-1 border border-white/[0.08] hover:border-white/20 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Auditoria</span>
          </button>

          {/* Instagram Button */}
          <a
            href={lead.instagramUrl || `https://www.instagram.com/${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}/`}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir Instagram"
            className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-950/40 to-purple-950/40 hover:from-pink-900/60 hover:to-purple-900/60 text-pink-300 text-xs font-bold flex items-center justify-center border border-pink-500/30 hover:border-pink-500/60 transition"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
          </a>

          {/* Google Maps link */}
          <a
            href={lead.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + lead.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir no Google Maps"
            className="p-2.5 rounded-2xl bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs font-bold flex items-center justify-center border border-white/[0.08] hover:border-white/20 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* CRM Toggle */}
          <button
            onClick={() => onToggleCrm(lead)}
            title={isSavedInCrm ? 'Salvo no CRM' : 'Adicionar ao Pipeline CRM'}
            className={`p-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1 border transition cursor-pointer ${
              isSavedInCrm
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white border-brand-400/50 shadow-md shadow-brand-500/20'
                : 'bg-dark-850 hover:bg-dark-800 text-slate-300 border-white/[0.08] hover:border-white/20'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-cyan-400" />
          </button>

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
