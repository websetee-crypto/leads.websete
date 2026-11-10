import { Lead, SearchFilterState, ApiSettings, WebsiteStatus } from '../types';
import { COUNTRIES } from '../data/locations';
import { NICHES } from '../data/niches';

// Phone area codes by Brazilian State
const DDD_BY_STATE: Record<string, string[]> = {
  SP: ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
  RJ: ['21', '22', '24'],
  MG: ['31', '32', '33', '34', '35', '37', '38'],
  PR: ['41', '42', '43', '44', '45', '46'],
  SC: ['47', '48', '49'],
  RS: ['51', '53', '54', '55'],
  BA: ['71', '73', '74', '75', '77'],
  GO: ['62', '64'],
  PE: ['81', '87'],
  CE: ['85', '88'],
  DF: ['61'],
  ES: ['27', '28'],
  MT: ['65', '66'],
  MS: ['67'],
  AM: ['92', '97'],
  PA: ['91', '93', '94'],
  RN: ['84'],
  PB: ['83'],
  AL: ['82'],
  MA: ['98', '99'],
};

// Street prefix generators by Country
const STREET_NAMES_BR = [
  'Av. Paulista', 'Rua das Flores', 'Av. Brasil', 'Rua São João', 'Av. Getúlio Vargas',
  'Rua Sete de Setembro', 'Av. Santos Dumont', 'Rua Quinze de Novembro', 'Av. Afonso Pena',
  'Rua Tiradentes', 'Av. Presidente Kennedy', 'Rua Dom Pedro II', 'Av. Independência',
  'Rua Bela Cintra', 'Av. das Américas', 'Rua Barão do Rio Branco', 'Av. Juscelino Kubitschek'
];

const STREET_NAMES_PT = [
  'Avenida da Liberdade', 'Rua Augusta', 'Rua de Santa Catarina', 'Avenida dos Aliados',
  'Rua do Carmo', 'Avenida da República', 'Rua Ferreira Borges', 'Avenida da Boavista'
];

const STREET_NAMES_US = [
  'Main Street', 'Ocean Drive', 'Broadway', 'Sunset Boulevard', 'Fifth Avenue',
  'Market Street', 'Michigan Avenue', 'Peachtree Street', 'Park Avenue', 'Grand Avenue'
];

// Business name modifiers by niche
const NICHE_PREFIXES: Record<string, string[]> = {
  dentista: ['Clínica Odontológica', 'Dr(a).', 'Studio Dental', 'Centro de Ortodontia', 'Odonto Prime', 'Implantes & Sorrisos', 'Oral Clinic', 'Sorriso Radiante'],
  estetica: ['Studio de Beleza', 'Clínica de Estética', 'Harmonize', 'Espaço Glamour', 'Skin & Laser', 'Estética Avançada', 'Dermo Prime', 'Clínica Belleza'],
  restaurante: ['Restaurante & Bar', 'Bistrô', 'Cantina', 'Pizzaria & Forno', 'Churrascaria', 'Sabor da Terra', 'Espaço Gourmet', 'Fogão de Ouro'],
  oficina: ['Auto Center', 'Oficina Mecânica', 'Mecânica Express', 'Pit Stop', 'Centro Automotivo', 'Box 7 Auto', 'Garage Motors', 'Precision Auto'],
  advocacia: ['Advocacia & Consultoria', 'Escritório de Direito', 'Associados & Advogados', 'Jurídico Prime', 'Soluções Jurídicas', 'Lex Advocacia'],
  salao: ['Salão de Beleza', 'Barber Club', 'Studio Hair', 'Espaço Vip', 'Barbearia Vintage', 'Mega Hair Studio', 'Ateliê da Beleza'],
  construcao: ['Marcenaria & Design', 'Vidraçaria', 'Móveis Planejados', 'Construções & Reformas', 'Arte em Madeira', 'Engenharia & Obras'],
  academia: ['Academia & Fitness', 'Cross Training', 'Studio Pilates', 'Power Gym', 'Iron Fitness', 'Espaço Saúde & Movimento'],
  pet: ['Clínica Veterinária', 'Pet Shop & Estética', 'Cão & Gato', 'Hospital Animal', 'Planeta Pet', 'Amigo Fiel'],
  imobiliaria: ['Imobiliária', 'Negócios Imobiliários', 'Consultoria Imóveis', 'Prime Negócios', 'Habitar Imóveis', 'Imóveis & Lançamentos']
};

const FAMILY_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
  'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade',
  'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos'
];

export async function searchLeadsService(
  filter: SearchFilterState,
  apiSettings: ApiSettings
): Promise<{ leads: Lead[]; searchMode: string; totalFound: number }> {
  const country = COUNTRIES.find((c) => c.code === filter.countryCode) || COUNTRIES[0];
  const state = country.states.find((s) => s.code === filter.stateCode) || country.states[0];
  const city = filter.city || state.cities[0] || 'São Paulo';
  const niche = NICHES.find((n) => n.id === filter.category) || NICHES[0];

  // 1. Google Places API (if API Key provided)
  if (apiSettings.googlePlacesApiKey && (filter.searchSource === 'google_places' || filter.searchSource === 'auto')) {
    try {
      const googleLeads = await fetchFromGooglePlacesAPI(country.code, state.code, city, niche, filter, apiSettings);
      if (googleLeads && googleLeads.length > 0) {
        const filtered = applyPostFilters(googleLeads, filter);
        return {
          leads: filtered,
          searchMode: 'Google Places API (Empresas Reais Verificadas)',
          totalFound: filtered.length
        };
      }
    } catch (e) {
      console.warn('Google Places API search failed, falling back to OpenStreetMap:', e);
    }
  }

  // 2. OpenStreetMap Overpass Live Search (Real Registered Businesses)
  if (filter.searchSource === 'openstreetmap' || filter.searchSource === 'auto' || filter.searchSource === 'google_places') {
    try {
      const liveOsmLeads = await fetchFromOverpassAPI(country, state, city, niche, apiSettings);
      if (liveOsmLeads && liveOsmLeads.length > 0) {
        const filtered = applyPostFilters(liveOsmLeads, filter);
        return {
          leads: filtered,
          searchMode: 'OpenStreetMap (Empresas Reais ao Vivo)',
          totalFound: filtered.length
        };
      }
    } catch (e) {
      console.warn('Overpass OSM search returned no items or timed out:', e);
    }
  }

  // 3. Fallback / Generator Mode
  const generatedLeads = generateRealisticLeads(country, state, city, niche, filter);
  const filtered = applyPostFilters(generatedLeads, filter);

  return {
    leads: filtered,
    searchMode: 'Motor de Prospecção Inteligente (Modo Demonstração)',
    totalFound: filtered.length
  };
}

async function getCoordinatesForCity(
  cityName: string,
  stateName: string,
  countryName: string,
  defaultCenter: [number, number]
): Promise<[number, number]> {
  try {
    const query = encodeURIComponent(`${cityName}, ${stateName}, ${countryName}`);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LeadSitePro/1.0'
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          return [lat, lon];
        }
      }
    }
  } catch {
    // Nominatim error fallback
  }
  return defaultCenter;
}

async function fetchFromOverpassAPI(
  country: typeof COUNTRIES[0],
  state: typeof COUNTRIES[0]['states'][0],
  cityName: string,
  niche: typeof NICHES[0],
  apiSettings: ApiSettings
): Promise<Lead[]> {
  const endpoint = apiSettings.overpassCustomEndpoint || 'https://overpass-api.de/api/interpreter';

  // Get precise coordinates for city
  const [lat, lon] = await getCoordinatesForCity(cityName, state.name, country.name, state.center);

  // Search radius in meters (22km around city center)
  const radius = 22000;

  // Map niche osmFilter to Overpass query tags
  const tags = niche.osmFilter.split('|');
  const tagQueries = tags.map((t) => {
    const [k, v] = t.split('=');
    return `node["${k}"="${v}"](around:${radius},${lat},${lon});way["${k}"="${v}"](around:${radius},${lat},${lon});`;
  }).join('');

  const query = `
    [out:json][timeout:15];
    (
      ${tagQueries}
    );
    out center 50;
  `;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: `data=${encodeURIComponent(query)}`,
    signal: controller.signal
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error('Overpass API returned status ' + response.status);
  }

  const data = await response.json();
  const elements = data.elements || [];

  if (elements.length === 0) {
    throw new Error('Nenhum resultado direto via OSM para esta consulta específica.');
  }

  const leads: Lead[] = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const tags = el.tags || {};
    
    // Only keep real named establishments
    const rawName = tags.name || tags['brand'] || tags['operator'];
    if (!rawName) continue;

    const elLat = el.lat || (el.center ? el.center.lat : lat);
    const elLng = el.lon || (el.center ? el.center.lon : lon);

    const rawWebsite = tags['website'] || tags['contact:website'] || tags['url'] || '';
    const rawPhone = tags['phone'] || tags['contact:phone'] || tags['mobile'] || '';
    const rawInstagram = tags['contact:instagram'] || tags['instagram'] || '';
    const rawFacebook = tags['contact:facebook'] || tags['facebook'] || '';

    // Classify website status
    let websiteStatus: WebsiteStatus = 'NO_WEBSITE';
    let detectedUrl: string | undefined = undefined;

    if (rawWebsite) {
      if (rawWebsite.includes('instagram.com') || rawWebsite.includes('facebook.com') || rawWebsite.includes('linktr.ee') || rawWebsite.includes('wa.me')) {
        websiteStatus = 'SOCIAL_ONLY';
        detectedUrl = rawWebsite;
      } else {
        websiteStatus = 'HAS_WEBSITE';
        detectedUrl = rawWebsite;
      }
    } else if (rawInstagram || rawFacebook) {
      websiteStatus = 'SOCIAL_ONLY';
      detectedUrl = rawInstagram ? `https://instagram.com/${rawInstagram.replace('@', '')}` : rawFacebook;
    } else {
      websiteStatus = 'NO_WEBSITE';
    }

    const rating = parseFloat((4.2 + (i % 8) * 0.1).toFixed(1));
    const reviewsCount = Math.floor(15 + (i * 7) % 180);

    const opportunityScore = calculateOpportunityScore(websiteStatus, rating, reviewsCount, Boolean(rawPhone));

    const street = tags['addr:street'] || tags['addr:place'] || `Região Central`;
    const houseNumber = tags['addr:housenumber'] ? `, ${tags['addr:housenumber']}` : '';
    const suburb = tags['addr:suburb'] || tags['addr:district'] || '';
    const address = `${street}${houseNumber}${suburb ? ' - ' + suburb : ''}, ${cityName} - ${state.code}`;

    leads.push({
      id: `osm-${el.id || i}-${Date.now()}`,
      name: rawName,
      category: niche.name,
      categoryKey: niche.id,
      country: country.name,
      countryCode: country.code,
      state: state.name,
      city: cityName,
      address,
      phone: rawPhone || undefined,
      whatsapp: rawPhone ? rawPhone.replace(/\D/g, '') : undefined,
      rating,
      reviewsCount,
      websiteStatus,
      detectedUrl,
      lat: elLat,
      lng: elLng,
      source: 'openstreetmap',
      stage: 'novo',
      opportunityScore,
      estimatedMonthlyLoss: niche.estMonthlyLoss + Math.floor(Math.random() * 1500),
      missingFeatures: niche.typicalPainPoints,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawName + ' ' + cityName)}`,
      createdAt: new Date().toISOString()
    });
  }

  if (leads.length === 0) {
    throw new Error('Nenhum estabelecimento com nome válido encontrado.');
  }

  return leads;
}

async function fetchFromGooglePlacesAPI(
  countryCode: string,
  stateCode: string,
  cityName: string,
  niche: typeof NICHES[0],
  filter: SearchFilterState,
  apiSettings: ApiSettings
): Promise<Lead[]> {
  const apiKey = apiSettings.googlePlacesApiKey;
  if (!apiKey) return [];

  const textQuery = `${niche.keywords[0]} em ${cityName}, ${stateCode}`;
  
  // Google Places API (New - Text Search)
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location,places.googleMapsUri'
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount: 20
    })
  });

  if (!response.ok) {
    throw new Error(`Google Places API returned ${response.status}`);
  }

  const data = await response.json();
  const places = data.places || [];

  return places.map((p: any, idx: number) => {
    const name = p.displayName?.text || `${niche.keywords[0]} ${idx + 1}`;
    const rawWebsite = p.websiteUri || '';
    const phone = p.nationalPhoneNumber || p.internationalPhoneNumber || '';

    let websiteStatus: WebsiteStatus = 'NO_WEBSITE';
    if (rawWebsite) {
      if (rawWebsite.includes('instagram.com') || rawWebsite.includes('facebook.com') || rawWebsite.includes('linktr.ee') || rawWebsite.includes('wa.me')) {
        websiteStatus = 'SOCIAL_ONLY';
      } else {
        websiteStatus = 'HAS_WEBSITE';
      }
    }

    const rating = p.rating || 4.5;
    const reviewsCount = p.userRatingCount || 20;
    const opportunityScore = calculateOpportunityScore(websiteStatus, rating, reviewsCount, Boolean(phone));

    return {
      id: `google-${p.id || idx}`,
      name,
      category: niche.name,
      categoryKey: niche.id,
      country: countryCode,
      countryCode,
      state: stateCode,
      city: cityName,
      address: p.formattedAddress || `${cityName} - ${stateCode}`,
      phone: phone || undefined,
      whatsapp: phone ? phone.replace(/\D/g, '') : undefined,
      rating,
      reviewsCount,
      websiteStatus,
      detectedUrl: rawWebsite || undefined,
      lat: p.location?.latitude || 0,
      lng: p.location?.longitude || 0,
      source: 'google_places' as const,
      stage: 'novo' as const,
      opportunityScore,
      estimatedMonthlyLoss: niche.estMonthlyLoss,
      missingFeatures: niche.typicalPainPoints,
      googleMapsUrl: p.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + cityName)}`,
      createdAt: new Date().toISOString()
    };
  });
}

function generateRealisticLeads(
  country: typeof COUNTRIES[0],
  state: typeof COUNTRIES[0]['states'][0],
  city: string,
  niche: typeof NICHES[0],
  filter: SearchFilterState
): Lead[] {
  const count = 25 + Math.floor(Math.random() * 15);
  const leads: Lead[] = [];
  const baseLat = state.center[0] || -23.5505;
  const baseLng = state.center[1] || -46.6333;

  const prefixes = NICHE_PREFIXES[niche.id] || ['Empresa & Serviços', 'Centro de Atendimento', 'Espaço Prime'];

  const statusOptions: WebsiteStatus[] = [
    'NO_WEBSITE',
    'NO_WEBSITE',
    'NO_WEBSITE',
    'NO_LANDING_PAGE',
    'NO_LANDING_PAGE',
    'SOCIAL_ONLY',
    'SOCIAL_ONLY',
    'BROKEN_WEBSITE'
  ];

  for (let i = 0; i < count; i++) {
    const prefix = prefixes[i % prefixes.length];
    const family = FAMILY_NAMES[(i * 3) % FAMILY_NAMES.length];
    const subName = (i % 2 === 0) ? `${prefix} ${family}` : `${prefix} ${city}`;
    const name = filter.customKeyword ? `${prefix} ${filter.customKeyword} ${family}` : subName;

    // Distribute randomly around city center
    const latOffset = (Math.random() - 0.5) * 0.08;
    const lngOffset = (Math.random() - 0.5) * 0.08;

    const websiteStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];

    let detectedUrl: string | undefined = undefined;
    if (websiteStatus === 'SOCIAL_ONLY' || websiteStatus === 'NO_LANDING_PAGE') {
      detectedUrl = `https://instagram.com/${slugify(name)}`;
    } else if (websiteStatus === 'BROKEN_WEBSITE') {
      detectedUrl = `http://www.${slugify(name)}.com.br (Erro 404 / Não Seguro)`;
    }

    const rating = parseFloat((4.0 + Math.random() * 1.0).toFixed(1));
    const reviewsCount = Math.floor(12 + Math.random() * 240);
    const phone = generateFakePhone(country.code, state.code);
    const whatsapp = phone.replace(/\D/g, '');

    const streets = country.code === 'PT' ? STREET_NAMES_PT : (country.code === 'US' ? STREET_NAMES_US : STREET_NAMES_BR);
    const street = streets[i % streets.length];
    const number = Math.floor(40 + Math.random() * 2100);
    const address = `${street}, ${number} - ${city}, ${state.code} - ${country.name}`;

    const opportunityScore = calculateOpportunityScore(websiteStatus, rating, reviewsCount, true);

    leads.push({
      id: `gen-${i}-${Date.now()}`,
      name,
      category: niche.name,
      categoryKey: niche.id,
      country: country.name,
      countryCode: country.code,
      state: state.name,
      city,
      address,
      phone,
      whatsapp,
      rating,
      reviewsCount,
      websiteStatus,
      detectedUrl,
      lat: baseLat + latOffset,
      lng: baseLng + lngOffset,
      source: 'smart_generator',
      stage: 'novo',
      opportunityScore,
      estimatedMonthlyLoss: niche.estMonthlyLoss + Math.floor(Math.random() * 1800),
      missingFeatures: niche.typicalPainPoints,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + city)}`,
      createdAt: new Date().toISOString()
    });
  }

  return leads;
}

function calculateOpportunityScore(status: WebsiteStatus, rating: number, reviews: number, hasPhone: boolean): number {
  let score = 50;
  if (status === 'NO_WEBSITE') score += 35;
  if (status === 'NO_LANDING_PAGE') score += 28;
  if (status === 'SOCIAL_ONLY') score += 25;
  if (status === 'BROKEN_WEBSITE') score += 32;

  if (rating >= 4.5) score += 10;
  else if (rating >= 4.0) score += 6;

  if (reviews > 50) score += 8;
  else if (reviews > 20) score += 4;

  if (hasPhone) score += 5;

  return Math.min(99, score);
}

function generateFakePhone(countryCode: string, stateCode: string): string {
  if (countryCode === 'BR') {
    const ddds = DDD_BY_STATE[stateCode] || ['11'];
    const ddd = ddds[Math.floor(Math.random() * ddds.length)];
    const p1 = '9' + Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    return `+55 (${ddd}) ${p1}-${p2}`;
  } else if (countryCode === 'PT') {
    const p = Math.floor(910000000 + Math.random() * 80000000);
    return `+351 ${p}`;
  } else if (countryCode === 'US') {
    const area = Math.floor(200 + Math.random() * 700);
    const p1 = Math.floor(200 + Math.random() * 700);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    return `+1 (${area}) ${p1}-${p2}`;
  }
  return `+55 (11) 98765-${Math.floor(1000 + Math.random() * 9000)}`;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 18);
}

function applyPostFilters(leads: Lead[], filter: SearchFilterState): Lead[] {
  return leads.filter((l) => {
    // Status filter
    if (filter.statusFilter === 'NO_WEBSITE' && l.websiteStatus !== 'NO_WEBSITE') return false;
    if (filter.statusFilter === 'NO_LANDING_PAGE' && l.websiteStatus !== 'NO_LANDING_PAGE') return false;
    if (filter.statusFilter === 'SOCIAL_ONLY' && l.websiteStatus !== 'SOCIAL_ONLY') return false;
    if (filter.statusFilter === 'WITHOUT_ANY_SITE' && l.websiteStatus === 'HAS_WEBSITE') return false;

    // Phone filter
    if (filter.onlyWithPhone && !l.phone) return false;

    // Rating filter
    if (filter.minRating > 0 && (l.rating || 0) < filter.minRating) return false;

    // Custom keyword filter
    if (filter.customKeyword) {
      const kw = filter.customKeyword.toLowerCase();
      const match = l.name.toLowerCase().includes(kw) || l.address.toLowerCase().includes(kw);
      if (!match) return false;
    }

    return true;
  });
}
