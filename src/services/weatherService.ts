import { WeatherReport, WeatherSource, MapStation, RadarTimestampFrame } from '../types';
import { getLiveWeatherWithGrounding } from './weatherEngine';
import {
  getAllMapStations,
  getLiveRadarTimestamps,
  reverseGeocodeLatLon,
  detectIpLocation,
} from './mapEngine';

const POPULAR_CITIES = [
  { name: 'Roma', region: 'Lazio', country: 'Italia' },
  { name: 'Milano', region: 'Lombardia', country: 'Italia' },
  { name: 'Napoli', region: 'Campania', country: 'Italia' },
  { name: 'Torino', region: 'Piemonte', country: 'Italia' },
  { name: 'Firenze', region: 'Toscana', country: 'Italia' },
  { name: 'Palermo', region: 'Sicilia', country: 'Italia' },
  { name: 'Bologna', region: 'Emilia-Romagna', country: 'Italia' },
  { name: 'Genova', region: 'Liguria', country: 'Italia' },
  { name: 'Venezia', region: 'Veneto', country: 'Italia' },
  { name: 'Bari', region: 'Puglia', country: 'Italia' },
  { name: 'Catania', region: 'Sicilia', country: 'Italia' },
  { name: 'Verona', region: 'Veneto', country: 'Italia' },
  { name: 'Cagliari', region: 'Sardegna', country: 'Italia' },
  { name: 'Trento', region: 'Trentino-Alto Adige', country: 'Italia' },
  { name: 'Trieste', region: 'Friuli Venezia Giulia', country: 'Italia' },
  { name: 'Perugia', region: 'Umbria', country: 'Italia' },
  { name: 'Ancona', region: 'Marche', country: 'Italia' },
  { name: 'Pescara', region: 'Abruzzo', country: 'Italia' },
  { name: 'Molfetta', region: 'Puglia', country: 'Italia' },
  { name: 'Bergamo', region: 'Lombardia', country: 'Italia' },
  { name: 'Brescia', region: 'Lombardia', country: 'Italia' },
  { name: 'Parma', region: 'Emilia-Romagna', country: 'Italia' },
  { name: 'Modena', region: 'Emilia-Romagna', country: 'Italia' },
  { name: 'Livorno', region: 'Toscana', country: 'Italia' },
  { name: 'Foggia', region: 'Puglia', country: 'Italia' },
  { name: 'Taranto', region: 'Puglia', country: 'Italia' },
  { name: 'Salerno', region: 'Campania', country: 'Italia' },
  { name: 'Messina', region: 'Sicilia', country: 'Italia' },
  { name: 'Siracusa', region: 'Sicilia', country: 'Italia' },
  { name: 'Sassari', region: 'Sardegna', country: 'Italia' },
  { name: 'Rimini', region: 'Emilia-Romagna', country: 'Italia' },
  { name: 'Ferrara', region: 'Emilia-Romagna', country: 'Italia' },
  { name: 'Ravenna', region: 'Emilia-Romagna', country: 'Italia' },
  { name: 'Padova', region: 'Veneto', country: 'Italia' },
  { name: 'Vicenza', region: 'Veneto', country: 'Italia' },
  { name: 'Treviso', region: 'Veneto', country: 'Italia' },
  { name: 'Udine', region: 'Friuli Venezia Giulia', country: 'Italia' },
  { name: 'Bolzano', region: 'Trentino-Alto Adige', country: 'Italia' },
  { name: 'Aosta', region: "Valle d'Aosta", country: 'Italia' },
  { name: 'Campobasso', region: 'Molise', country: 'Italia' },
  { name: 'Potenza', region: 'Basilicata', country: 'Italia' },
  { name: 'Matera', region: 'Basilicata', country: 'Italia' },
  { name: 'Catanzaro', region: 'Calabria', country: 'Italia' },
  { name: 'Cosenza', region: 'Calabria', country: 'Italia' },
  { name: 'Reggio Calabria', region: 'Calabria', country: 'Italia' },
  { name: 'Lecce', region: 'Puglia', country: 'Italia' },
  { name: 'Brindisi', region: 'Puglia', country: 'Italia' },
  { name: 'Barletta', region: 'Puglia', country: 'Italia' },
  { name: 'Andria', region: 'Puglia', country: 'Italia' },
  { name: 'Trani', region: 'Puglia', country: 'Italia' },
  { name: 'L\'Aquila', region: 'Abruzzo', country: 'Italia' },
  { name: 'Chieti', region: 'Abruzzo', country: 'Italia' },
  { name: 'Teramo', region: 'Abruzzo', country: 'Italia' },
  { name: 'Pesaro', region: 'Marche', country: 'Italia' },
  { name: 'Ascoli Piceno', region: 'Marche', country: 'Italia' },
  { name: 'Macerata', region: 'Marche', country: 'Italia' },
  { name: 'Terni', region: 'Umbria', country: 'Italia' },
  { name: 'Viterbo', region: 'Lazio', country: 'Italia' },
  { name: 'Latina', region: 'Lazio', country: 'Italia' },
  { name: 'Frosinone', region: 'Lazio', country: 'Italia' },
  { name: 'Rieti', region: 'Lazio', country: 'Italia' },
  { name: 'Pisa', region: 'Toscana', country: 'Italia' },
  { name: 'Lucca', region: 'Toscana', country: 'Italia' },
  { name: 'Arezzo', region: 'Toscana', country: 'Italia' },
  { name: 'Siena', region: 'Toscana', country: 'Italia' },
  { name: 'Grosseto', region: 'Toscana', country: 'Italia' },
  { name: 'Pistoia', region: 'Toscana', country: 'Italia' },
  { name: 'Prato', region: 'Toscana', country: 'Italia' },
  { name: 'Massa', region: 'Toscana', country: 'Italia' },
  { name: 'Carrara', region: 'Toscana', country: 'Italia' },
  { name: 'La Spezia', region: 'Liguria', country: 'Italia' },
  { name: 'Savona', region: 'Liguria', country: 'Italia' },
  { name: 'Imperia', region: 'Liguria', country: 'Italia' },
  { name: 'Sanremo', region: 'Liguria', country: 'Italia' },
  { name: 'Monza', region: 'Lombardia', country: 'Italia' },
  { name: 'Como', region: 'Lombardia', country: 'Italia' },
  { name: 'Varese', region: 'Lombardia', country: 'Italia' },
  { name: 'Pavia', region: 'Lombardia', country: 'Italia' },
  { name: 'Cremona', region: 'Lombardia', country: 'Italia' },
  { name: 'Mantova', region: 'Lombardia', country: 'Italia' },
  { name: 'Lecco', region: 'Lombardia', country: 'Italia' },
  { name: 'Lodi', region: 'Lombardia', country: 'Italia' },
  { name: 'Sondrio', region: 'Lombardia', country: 'Italia' },
  { name: 'Novara', region: 'Piemonte', country: 'Italia' },
  { name: 'Alessandria', region: 'Piemonte', country: 'Italia' },
  { name: 'Asti', region: 'Piemonte', country: 'Italia' },
  { name: 'Cuneo', region: 'Piemonte', country: 'Italia' },
  { name: 'Vercelli', region: 'Piemonte', country: 'Italia' },
  { name: 'Biella', region: 'Piemonte', country: 'Italia' },
  { name: 'Verbania', region: 'Piemonte', country: 'Italia' },
  { name: 'Piacenza', region: 'Emilia-Romagna', country: 'Italia' },
  { name: 'Reggio Emilia', region: 'Emilia-Romagna', country: 'Italia' },
  { name: 'Forlì', region: 'Emilia-Romagna', country: 'Italia' },
  { name: 'Cesena', region: 'Emilia-Romagna', country: 'Italia' },
  { name: 'Rovigo', region: 'Veneto', country: 'Italia' },
  { name: 'Belluno', region: 'Veneto', country: 'Italia' },
  { name: 'Pordenone', region: 'Friuli Venezia Giulia', country: 'Italia' },
  { name: 'Gorizia', region: 'Friuli Venezia Giulia', country: 'Italia' },
  { name: 'Caserta', region: 'Campania', country: 'Italia' },
  { name: 'Avellino', region: 'Campania', country: 'Italia' },
  { name: 'Benevento', region: 'Campania', country: 'Italia' },
  { name: 'Crotone', region: 'Calabria', country: 'Italia' },
  { name: 'Vibo Valentia', region: 'Calabria', country: 'Italia' },
  { name: 'Trapani', region: 'Sicilia', country: 'Italia' },
  { name: 'Agrigento', region: 'Sicilia', country: 'Italia' },
  { name: 'Caltanissetta', region: 'Sicilia', country: 'Italia' },
  { name: 'Enna', region: 'Sicilia', country: 'Italia' },
  { name: 'Ragusa', region: 'Sicilia', country: 'Italia' },
  { name: 'Olbia', region: 'Sardegna', country: 'Italia' },
  { name: 'Nuoro', region: 'Sardegna', country: 'Italia' },
  { name: 'Oristano', region: 'Sardegna', country: 'Italia' },
];

/**
 * Robust weather fetcher:
 * 1. Tries backend `/api/weather` (works on Cloud Run / Docker / dev server).
 * 2. If `/api/weather` returns 404 or HTML (as on static hosts like Netlify),
 *    smoothly runs the client-side meteorological engine via Open-Meteo with 0 errors!
 */
export async function fetchWeatherWithFallback(
  targetCity: string,
  targetSource: WeatherSource,
  clientHour?: number,
  clientTime?: string
): Promise<WeatherReport> {
  try {
    const res = await fetch(
      `/api/weather?city=${encodeURIComponent(targetCity)}&source=${targetSource}&clientHour=${clientHour}&clientTime=${encodeURIComponent(clientTime || '')}`
    );
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.current && data.hourly && data.daily) {
        return data;
      }
    }
  } catch (err) {
    console.info('[SuperMeteo] Server API offline or static hosting detected, running in client mode.');
  }

  // Seamless fallback for Netlify, GitHub Pages, or offline mode
  return await getLiveWeatherWithGrounding(targetCity, targetSource, { clientHour, clientTime });
}

/**
 * City autocomplete with fallback for static hosts
 */
export async function searchCitiesWithFallback(
  query: string
): Promise<Array<{ name: string; region: string; country: string }>> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // 1. Try server endpoint
  try {
    const res = await fetch(`/api/cities?q=${encodeURIComponent(q)}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    // ignore, fall through to client search
  }

  // 2. Client-side local list filter
  const localMatches = POPULAR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q)
  );

  if (localMatches.length > 0) {
    return localMatches.slice(0, 8);
  }

  // 3. Fallback to Open-Meteo Geocoding in browser
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=it`
    );
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData?.results && Array.isArray(geoData.results)) {
        return geoData.results.map((r: any) => ({
          name: r.name,
          region: r.admin1 || r.country || 'Italia',
          country: r.country || 'Italia',
        }));
      }
    }
  } catch (e) {
    // fallback
  }

  return [{ name: query.trim(), region: 'Città', country: 'Italia' }];
}

/**
 * Reverse geocoding with fallback for static hosts
 */
export async function reverseGeocodeWithFallback(
  lat: number,
  lon: number
): Promise<{ city: string; region: string; country: string }> {
  try {
    const res = await fetch(`/api/geolocation/reverse?lat=${lat}&lon=${lon}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.city) return data;
    }
  } catch (e) {
    // fallback
  }

  return await reverseGeocodeLatLon(lat, lon);
}

/**
 * IP Location detection with fallback for static hosts
 */
export async function detectIpLocationWithFallback(): Promise<{
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}> {
  try {
    const res = await fetch('/api/geolocation/ip');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.city) return data;
    }
  } catch (e) {
    // fallback
  }

  return await detectIpLocation();
}

/**
 * Map stations with fallback for static hosts
 */
export async function getMapStationsWithFallback(): Promise<MapStation[]> {
  try {
    const res = await fetch('/api/map/stations');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    // fallback
  }

  return getAllMapStations();
}

/**
 * Radar frames with fallback for static hosts
 */
export async function getRadarTimestampsWithFallback(): Promise<{
  host: string;
  generated: number;
  frames: RadarTimestampFrame[];
}> {
  try {
    const res = await fetch('/api/radar-timestamps');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && Array.isArray(data.frames)) return data;
    }
  } catch (e) {
    // fallback
  }

  return await getLiveRadarTimestamps();
}
