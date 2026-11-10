export interface NicheCategory {
  id: string;
  name: string;
  icon: string;
  osmFilter: string; // e.g., 'amenity=dentist' or 'shop=hairdresser'
  keywords: string[];
  avgTicket: number;
  estMonthlyLoss: number;
  typicalPainPoints: string[];
}

export const NICHES: NicheCategory[] = [
  {
    id: 'dentista',
    name: 'Clínica Odontológica / Dentista',
    icon: 'Stethoscope',
    osmFilter: 'amenity=dentist|healthcare=dentist',
    keywords: ['Dentista', 'Odontologia', 'Ortodontia', 'Implantes', 'Clínica Dental'],
    avgTicket: 1200,
    estMonthlyLoss: 4800,
    typicalPainPoints: [
      'Sem agendamento online de consultas',
      'Perde pacientes que buscam no Google Maps',
      'Sem apresentação clara de tratamentos e fotos antes/depois',
      'Dependente 100% de indicações boca a boca'
    ]
  },
  {
    id: 'estetica',
    name: 'Clínica de Estética & Harmonização',
    icon: 'Sparkles',
    osmFilter: 'shop=beauty|amenity=beauty_salon',
    keywords: ['Estética', 'Harmonização', 'Depilação Laser', 'Drenagem', 'Limpeza de Pele', 'Botox'],
    avgTicket: 850,
    estMonthlyLoss: 5200,
    typicalPainPoints: [
      'Tem apenas Instagram sem link para agendamento direto',
      'Perde leads de anúncios locais que não convertem no direct',
      'Não possui catálogo detalhado de procedimentos com preços e FAQs',
      'Sem prova social estruturada com depoimentos de clientes'
    ]
  },
  {
    id: 'restaurante',
    name: 'Restaurante & Gastronomia',
    icon: 'UtensilsCrossed',
    osmFilter: 'amenity=restaurant|amenity=cafe',
    keywords: ['Restaurante', 'Bistrô', 'Churrascaria', 'Comida Japonesa', 'Pizzaria', 'Cafeteria'],
    avgTicket: 120,
    estMonthlyLoss: 3900,
    typicalPainPoints: [
      'Paga taxas abusivas (até 27%) no iFood por não ter cardápio/delivery próprio',
      'Cardápio apenas em PDF ruim ou foto borrada no Instagram',
      'Sem sistema de reserva de mesas online',
      'Não aparece em destaque nas buscas locais do Google'
    ]
  },
  {
    id: 'oficina',
    name: 'Oficina Mecânica & Funilaria',
    icon: 'Wrench',
    osmFilter: 'shop=car_repair|amenity=car_repair',
    keywords: ['Mecânica', 'Auto Center', 'Funilaria', 'Troca de Óleo', 'Injeção Eletrônica', 'Pneus'],
    avgTicket: 950,
    estMonthlyLoss: 4200,
    typicalPainPoints: [
      'Motoristas com pane buscam no Google e vão para concorrentes com site',
      'Sem botão de WhatsApp de socorro/guincho rápido',
      'Não transmite credibilidade técnica e garantias',
      'Não capta frotas ou clientes corporativos'
    ]
  },
  {
    id: 'advocacia',
    name: 'Escritório de Advocacia',
    icon: 'Scale',
    osmFilter: 'office=lawyer|amenity=lawyer',
    keywords: ['Advogado', 'Advocacia', 'Direito Trabalhista', 'Direito de Família', 'Direito Previdenciário'],
    avgTicket: 3500,
    estMonthlyLoss: 7500,
    typicalPainPoints: [
      'Clientes com problemas urgentes exigem página de alta autoridade',
      'Sem botão de triagem jurídica no WhatsApp',
      'Sem artigos de autoridade para ranquear organicamente no Google',
      'Perde contratos de alto valor por falta de presença institucional'
    ]
  },
  {
    id: 'salao',
    name: 'Salão de Beleza & Barbearia',
    icon: 'Scissors',
    osmFilter: 'shop=hairdresser',
    keywords: ['Salão de Beleza', 'Barbearia', 'Cabeleireiro', 'Manicure', 'Mega Hair', 'Barber Shop'],
    avgTicket: 80,
    estMonthlyLoss: 2800,
    typicalPainPoints: [
      'Atendimento manual no WhatsApp toma tempo da equipe',
      'Sem tabela visual de preços e horários disponíveis',
      'Sem botão rápido de "Como Chegar" e galeria de cortes',
      'Perde clientes novos que mudaram para o bairro'
    ]
  },
  {
    id: 'construcao',
    name: 'Marcenaria, Reformas & Vidraçaria',
    icon: 'Hammer',
    osmFilter: 'craft=carpenter|craft=glaziery|craft=plumber|craft=electrician',
    keywords: ['Marcenaria', 'Móveis Planejados', 'Vidraçaria', 'Gesseiro', 'Pinturas', 'Reformas'],
    avgTicket: 4500,
    estMonthlyLoss: 6500,
    typicalPainPoints: [
      'Sem portfólio profissional de projetos entregues',
      'Sem formulário rápido para solicitação de orçamento online',
      'Depende exclusivamente de indicações e corretores',
      'Concorrentes com Landing Pages de Tráfego Pago dominam a região'
    ]
  },
  {
    id: 'academia',
    name: 'Academia & Studio Fitness / Crossfit',
    icon: 'Dumbbell',
    osmFilter: 'leisure=fitness_centre|leisure=sports_centre',
    keywords: ['Academia', 'Crossfit', 'Pilates', 'Funcional', 'Personal Trainer', 'Lutas'],
    avgTicket: 160,
    estMonthlyLoss: 3400,
    typicalPainPoints: [
      'Sem landing page para agendamento de Aula Experimental Grátis',
      'Sem tour virtual da estrutura e apresentação de planos',
      'Não converte visitantes do Google que buscam "academia perto de mim"',
      'Não retém leads para campanhas de renovação e início de ano'
    ]
  },
  {
    id: 'pet',
    name: 'Clínica Veterinária & Pet Shop',
    icon: 'Dog',
    osmFilter: 'amenity=veterinary|shop=pet',
    keywords: ['Veterinária', 'Pet Shop', 'Banho e Tosa', 'Hospital Veterinário', 'Vacinas Pet'],
    avgTicket: 220,
    estMonthlyLoss: 3100,
    typicalPainPoints: [
      'Sem canal de emergência 24h evidente no Google',
      'Sem agendamento online de banho & tosa com horários',
      'Não exibe especialidades (oftalmo pet, ortopedia, exames)',
      'Perde tutores novos que procuram clínica próxima'
    ]
  },
  {
    id: 'imobiliaria',
    name: 'Imobiliária & Corretor de Imóveis',
    icon: 'Building2',
    osmFilter: 'office=estate_agent',
    keywords: ['Imobiliária', 'Corretor de Imóveis', 'Aluguel', 'Venda de Imóveis', 'Lançamentos'],
    avgTicket: 5000,
    estMonthlyLoss: 8900,
    typicalPainPoints: [
      'Sem vitrine de imóveis otimizada para celular',
      'Anúncios em portais como Zap/VivaReal custam fortunas mensais',
      'Sem página de captura para captar proprietários querendo vender',
      'Perde compradores que buscam lançamentos e condomínios no Google'
    ]
  }
];
