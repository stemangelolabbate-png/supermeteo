import { MapStation, WeatherCondition } from '../src/types.js';

interface StationBase {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  baseTemp: number;
  baseCondition: WeatherCondition;
  conditionDesc: string;
  baseWindSpeed: number;
  windDirection: string;
  windDeg: number;
  humidity: number;
  pop: number;
  rainMm: number;
}

const REGIONAL_STATIONS: StationBase[] = [
  { id: 'roma', name: 'Roma', region: 'Lazio', lat: 41.9028, lon: 12.4964, baseTemp: 19, baseCondition: 'sunny', conditionDesc: 'Soleggiato', baseWindSpeed: 14, windDirection: 'O', windDeg: 270, humidity: 65, pop: 10, rainMm: 0 },
  { id: 'milano', name: 'Milano', region: 'Lombardia', lat: 45.4642, lon: 9.1900, baseTemp: 16, baseCondition: 'partly_cloudy', conditionDesc: 'Poco nuvoloso', baseWindSpeed: 11, windDirection: 'E', windDeg: 90, humidity: 72, pop: 20, rainMm: 0 },
  { id: 'napoli', name: 'Napoli', region: 'Campania', lat: 40.8518, lon: 14.2681, baseTemp: 21, baseCondition: 'mostly_sunny', conditionDesc: 'Prevalentemente soleggiato', baseWindSpeed: 18, windDirection: 'SO', windDeg: 225, humidity: 68, pop: 15, rainMm: 0 },
  { id: 'torino', name: 'Torino', region: 'Piemonte', lat: 45.0703, lon: 7.6869, baseTemp: 15, baseCondition: 'partly_cloudy', conditionDesc: 'Nubi sparse', baseWindSpeed: 9, windDirection: 'NE', windDeg: 45, humidity: 75, pop: 25, rainMm: 0 },
  { id: 'firenze', name: 'Firenze', region: 'Toscana', lat: 43.7696, lon: 11.2558, baseTemp: 18, baseCondition: 'sunny', conditionDesc: 'Sereno', baseWindSpeed: 12, windDirection: 'NO', windDeg: 315, humidity: 62, pop: 10, rainMm: 0 },
  { id: 'bologna', name: 'Bologna', region: 'Emilia-Romagna', lat: 44.4949, lon: 11.3426, baseTemp: 17, baseCondition: 'mostly_sunny', conditionDesc: 'Poco nuvoloso', baseWindSpeed: 13, windDirection: 'E', windDeg: 90, humidity: 68, pop: 15, rainMm: 0 },
  { id: 'genova', name: 'Genova', region: 'Liguria', lat: 44.4056, lon: 8.9463, baseTemp: 18, baseCondition: 'windy', conditionDesc: 'Ventoso / Nubi sparse', baseWindSpeed: 24, windDirection: 'SE', windDeg: 135, humidity: 70, pop: 30, rainMm: 0.2 },
  { id: 'venezia', name: 'Venezia', region: 'Veneto', lat: 45.4408, lon: 12.3155, baseTemp: 16, baseCondition: 'mostly_sunny', conditionDesc: 'Sereno o poco nuvoloso', baseWindSpeed: 15, windDirection: 'NE', windDeg: 45, humidity: 76, pop: 15, rainMm: 0 },
  { id: 'verona', name: 'Verona', region: 'Veneto', lat: 45.4384, lon: 10.9916, baseTemp: 16, baseCondition: 'partly_cloudy', conditionDesc: 'Poco nuvoloso', baseWindSpeed: 10, windDirection: 'E', windDeg: 90, humidity: 70, pop: 20, rainMm: 0 },
  { id: 'trieste', name: 'Trieste', region: 'Friuli Venezia Giulia', lat: 45.6495, lon: 13.7768, baseTemp: 17, baseCondition: 'windy', conditionDesc: 'Bora moderata', baseWindSpeed: 32, windDirection: 'ENE', windDeg: 65, humidity: 58, pop: 10, rainMm: 0 },
  { id: 'trento', name: 'Trento', region: 'Trentino-Alto Adige', lat: 46.0748, lon: 11.1217, baseTemp: 14, baseCondition: 'partly_cloudy', conditionDesc: 'Variabile sulle valli', baseWindSpeed: 8, windDirection: 'N', windDeg: 0, humidity: 68, pop: 30, rainMm: 0 },
  { id: 'bolzano', name: 'Bolzano', region: 'Trentino-Alto Adige', lat: 46.4983, lon: 11.3548, baseTemp: 15, baseCondition: 'sunny', conditionDesc: 'Soleggiato alpino', baseWindSpeed: 7, windDirection: 'N', windDeg: 0, humidity: 60, pop: 20, rainMm: 0 },
  { id: 'aosta', name: 'Aosta', region: "Valle d'Aosta", lat: 45.7371, lon: 7.3201, baseTemp: 12, baseCondition: 'partly_cloudy', conditionDesc: 'Sereno o poco nuvoloso', baseWindSpeed: 10, windDirection: 'NO', windDeg: 315, humidity: 62, pop: 20, rainMm: 0 },
  { id: 'ancona', name: 'Ancona', region: 'Marche', lat: 43.6158, lon: 13.5189, baseTemp: 17, baseCondition: 'mostly_sunny', conditionDesc: 'Lieve brezza marina', baseWindSpeed: 16, windDirection: 'E', windDeg: 90, humidity: 69, pop: 15, rainMm: 0 },
  { id: 'perugia', name: 'Perugia', region: 'Umbria', lat: 43.1107, lon: 12.3908, baseTemp: 17, baseCondition: 'sunny', conditionDesc: 'Soleggiato', baseWindSpeed: 12, windDirection: 'S', windDeg: 180, humidity: 64, pop: 10, rainMm: 0 },
  { id: 'pescara', name: 'Pescara', region: 'Abruzzo', lat: 42.4618, lon: 14.2161, baseTemp: 18, baseCondition: 'mostly_sunny', conditionDesc: 'Soleggiato con velature', baseWindSpeed: 15, windDirection: 'E', windDeg: 90, humidity: 66, pop: 15, rainMm: 0 },
  { id: 'campobasso', name: 'Campobasso', region: 'Molise', lat: 41.5604, lon: 14.6627, baseTemp: 16, baseCondition: 'partly_cloudy', conditionDesc: 'Poco nuvoloso', baseWindSpeed: 14, windDirection: 'SO', windDeg: 225, humidity: 65, pop: 20, rainMm: 0 },
  { id: 'bari', name: 'Bari', region: 'Puglia', lat: 41.1171, lon: 16.8719, baseTemp: 20, baseCondition: 'sunny', conditionDesc: 'Soleggiato', baseWindSpeed: 17, windDirection: 'NO', windDeg: 315, humidity: 62, pop: 10, rainMm: 0 },
  { id: 'potenza', name: 'Potenza', region: 'Basilicata', lat: 40.6404, lon: 15.8056, baseTemp: 15, baseCondition: 'partly_cloudy', conditionDesc: 'Fresco e ventilato', baseWindSpeed: 16, windDirection: 'O', windDeg: 270, humidity: 67, pop: 20, rainMm: 0 },
  { id: 'reggio_calabria', name: 'Reggio Calabria', region: 'Calabria', lat: 38.1113, lon: 15.6473, baseTemp: 22, baseCondition: 'mostly_sunny', conditionDesc: 'Soleggiato sullo Stretto', baseWindSpeed: 21, windDirection: 'S', windDeg: 180, humidity: 64, pop: 10, rainMm: 0 },
  { id: 'palermo', name: 'Palermo', region: 'Sicilia', lat: 38.1157, lon: 13.3615, baseTemp: 23, baseCondition: 'sunny', conditionDesc: 'Cielo limpido', baseWindSpeed: 16, windDirection: 'N', windDeg: 0, humidity: 61, pop: 5, rainMm: 0 },
  { id: 'catania', name: 'Catania', region: 'Sicilia', lat: 37.5079, lon: 15.0873, baseTemp: 23, baseCondition: 'sunny', conditionDesc: 'Caldo e soleggiato', baseWindSpeed: 14, windDirection: 'E', windDeg: 90, humidity: 59, pop: 5, rainMm: 0 },
  { id: 'cagliari', name: 'Cagliari', region: 'Sardegna', lat: 39.2238, lon: 9.1217, baseTemp: 21, baseCondition: 'mostly_sunny', conditionDesc: 'Brezza da Scirocco', baseWindSpeed: 20, windDirection: 'SE', windDeg: 135, humidity: 63, pop: 10, rainMm: 0 },
  { id: 'sassari', name: 'Sassari', region: 'Sardegna', lat: 40.7259, lon: 8.5556, baseTemp: 20, baseCondition: 'partly_cloudy', conditionDesc: 'Poco nuvoloso', baseWindSpeed: 18, windDirection: 'O', windDeg: 270, humidity: 66, pop: 15, rainMm: 0 },
  // Neighboring Mediterranean & Alpine hubs for wide map exploration
  { id: 'nizza', name: 'Nizza', region: 'Costa Azzurra', lat: 43.7102, lon: 7.2620, baseTemp: 19, baseCondition: 'sunny', conditionDesc: 'Soleggiato marittimo', baseWindSpeed: 14, windDirection: 'SO', windDeg: 225, humidity: 65, pop: 10, rainMm: 0 },
  { id: 'lugano', name: 'Lugano', region: 'Ticino', lat: 46.0037, lon: 8.9511, baseTemp: 15, baseCondition: 'partly_cloudy', conditionDesc: 'Poco nuvoloso lacustre', baseWindSpeed: 8, windDirection: 'S', windDeg: 180, humidity: 71, pop: 25, rainMm: 0 },
  { id: 'innsbruck', name: 'Innsbruck', region: 'Tirolo', lat: 47.2692, lon: 11.4041, baseTemp: 13, baseCondition: 'partly_cloudy', conditionDesc: 'Variabile alpino', baseWindSpeed: 9, windDirection: 'E', windDeg: 90, humidity: 68, pop: 30, rainMm: 0 },
];

export function getAllMapStations(): MapStation[] {
  return REGIONAL_STATIONS.map((st) => {
    // Model difference simulation: TWC (IBM GRAF) vs iLMeteo (ZEUS HD)
    // Small natural scientific variance between models: -1 to +1 deg, small humidity/wind difference
    const tempDelta = ((st.name.charCodeAt(0) * 7) % 3) - 1; // -1, 0, or +1
    const twcTemp = st.baseTemp;
    const ilmeteoTemp = st.baseTemp + tempDelta;

    const windDelta = ((st.name.charCodeAt(1) * 3) % 5) - 2;
    const twcWind = Math.max(5, st.baseWindSpeed);
    const ilmeteoWind = Math.max(5, st.baseWindSpeed + windDelta);

    const popDelta = ((st.name.charCodeAt(2) * 5) % 10) - 5;
    const twcPop = Math.min(100, Math.max(0, st.pop));
    const ilmeteoPop = Math.min(100, Math.max(0, st.pop + popDelta));

    return {
      id: st.id,
      name: st.name,
      region: st.region,
      lat: st.lat,
      lon: st.lon,
      twc: {
        temp: twcTemp,
        feelsLike: twcTemp + (st.humidity > 70 ? 1 : 0),
        condition: st.conditionDesc,
        conditionType: st.baseCondition,
        windSpeed: twcWind,
        windDirection: st.windDirection,
        windDeg: st.windDeg,
        humidity: st.humidity,
        pop: twcPop,
        rainMm: st.rainMm,
      },
      ilmeteo: {
        temp: ilmeteoTemp,
        feelsLike: ilmeteoTemp + (st.humidity > 70 ? 1 : 0),
        condition: tempDelta > 0 ? `${st.conditionDesc} (mite)` : st.conditionDesc,
        conditionType: st.baseCondition,
        windSpeed: ilmeteoWind,
        windDirection: st.windDirection,
        windDeg: (st.windDeg + 5) % 360,
        humidity: Math.min(100, st.humidity + tempDelta * 2),
        pop: ilmeteoPop,
        rainMm: st.rainMm,
      },
      average: {
        temp: Math.round((twcTemp + ilmeteoTemp) / 2),
        feelsLike: Math.round(((twcTemp + (st.humidity > 70 ? 1 : 0)) + (ilmeteoTemp + (st.humidity > 70 ? 1 : 0))) / 2),
        condition: st.conditionDesc,
        conditionType: st.baseCondition,
        windSpeed: Math.round((twcWind + ilmeteoWind) / 2),
        windDirection: st.windDirection,
        windDeg: st.windDeg,
        humidity: Math.round((st.humidity + Math.min(100, st.humidity + tempDelta * 2)) / 2),
        pop: Math.round((twcPop + ilmeteoPop) / 2),
        rainMm: st.rainMm,
      },
    };
  });
}

// In-memory cache for RainViewer live radar timestamps
let radarCache: { data: any; expiresAt: number } | null = null;

export async function getLiveRadarTimestamps() {
  const now = Date.now();
  if (radarCache && radarCache.expiresAt > now) {
    return radarCache.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'TheWeatherChannel-iLMeteo-App/1.0',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const host = data.host || 'https://tilecache.rainviewer.com';
      const past = (data.radar?.past || []).slice(-4); // Last 4 past frames
      const nowcast = (data.radar?.nowcast || []).slice(0, 3); // Next 3 predictive frames

      const frames = [
        ...past.map((p: any, idx: number) => {
          const d = new Date(p.time * 1000);
          const minutes = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
          const diffMin = Math.round((p.time * 1000 - now) / 60000);
          return {
            time: p.time,
            label: `${minutes} (${diffMin}m)`,
            path: p.path,
            isPast: true,
            isNow: idx === past.length - 1 && nowcast.length === 0,
          };
        }),
        ...nowcast.map((n: any, idx: number) => {
          const d = new Date(n.time * 1000);
          const minutes = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
          const diffMin = Math.round((n.time * 1000 - now) / 60000);
          return {
            time: n.time,
            label: idx === 0 ? `ADESSO (${minutes})` : `+${diffMin}m Prev.`,
            path: n.path,
            isForecast: true,
            isNow: idx === 0,
          };
        }),
      ];

      const result = {
        host,
        generated: data.generated,
        frames: frames.length > 0 ? frames : getDefaultRadarFrames(),
      };

      radarCache = {
        data: result,
        expiresAt: now + 60000, // cache for 1 minute
      };
      return result;
    }
  } catch (e) {
    console.warn('Could not fetch RainViewer API, falling back to local frames:', e);
  }

  const fallback = {
    host: 'https://tilecache.rainviewer.com',
    generated: Math.floor(now / 1000),
    frames: getDefaultRadarFrames(),
  };
  return fallback;
}

function getDefaultRadarFrames() {
  const now = Date.now();
  const intervals = [-40, -20, -10, 0, 15, 30];
  return intervals.map((offset, i) => {
    const timeMs = now + offset * 60000;
    const d = new Date(timeMs);
    const label =
      offset === 0
        ? 'ADESSO'
        : offset < 0
        ? `${offset} min`
        : `+${offset} min Prev.`;
    return {
      time: Math.floor(timeMs / 1000),
      label: `${label} (${d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })})`,
      path: `/v2/radar/frame_${i}`,
      isPast: offset < 0,
      isNow: offset === 0,
      isForecast: offset > 0,
    };
  });
}

// Reverse Geocoding with reliable fallbacks
export async function reverseGeocodeLatLon(lat: number, lon: number): Promise<{ city: string; region: string; country: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=it`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'WeatherExperienceApp/1.0',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.county ||
        data.name ||
        'Posizione Rilevata';
      const region = addr.state || addr.region || 'Italia';
      const country = addr.country || 'Italia';

      return { city, region, country };
    }
  } catch (e) {
    console.warn('Reverse geocode error:', e);
  }

  // Fallback to closest known station
  let closest = REGIONAL_STATIONS[0];
  let minDistance = Infinity;
  for (const st of REGIONAL_STATIONS) {
    const d = Math.hypot(st.lat - lat, st.lon - lon);
    if (d < minDistance) {
      minDistance = d;
      closest = st;
    }
  }
  return { city: closest.name, region: closest.region, country: 'Italia' };
}

// IP-based Location detection fallback
export async function detectIpLocation(clientIp?: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('http://ip-api.com/json/', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'WeatherExperienceApp/1.0',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && data.city) {
        return {
          city: data.city,
          region: data.regionName || data.region || 'Italia',
          country: data.country || 'Italia',
          lat: data.lat || 41.9028,
          lon: data.lon || 12.4964,
          source: 'ip',
        };
      }
    }
  } catch (e) {
    console.warn('IP geolocation error:', e);
  }

  return {
    city: 'Roma',
    region: 'Lazio',
    country: 'Italia',
    lat: 41.9028,
    lon: 12.4964,
    source: 'fallback',
  };
}
