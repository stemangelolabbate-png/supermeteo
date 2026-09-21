import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getLiveWeatherWithGrounding } from './server/weatherEngine.js';
import {
  getAllMapStations,
  getLiveRadarTimestamps,
  reverseGeocodeLatLon,
  detectIpLocation,
} from './server/mapEngine.js';
import { WeatherSource } from './src/types.js';

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Autocomplete popular Italian & global cities
  app.get('/api/cities', (req, res) => {
    const query = ((req.query.q as string) || '').trim().toLowerCase();
    const list = [
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
      { name: 'Londra', region: 'Greater London', country: 'Regno Unito' },
      { name: 'Parigi', region: 'Île-de-France', country: 'Francia' },
      { name: 'New York', region: 'New York', country: 'USA' },
    ];

    if (!query) {
      return res.json(list.slice(0, 6));
    }

    const filtered = list.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.region.toLowerCase().includes(query) ||
        c.country.toLowerCase().includes(query)
    );
    res.json(filtered.length > 0 ? filtered : [{ name: req.query.q as string, region: 'Città', country: 'Mondo' }]);
  });

  // Weather endpoint strictly from iLMeteo.it
  app.get('/api/weather', async (req, res) => {
    try {
      const city = ((req.query.city as string) || 'Roma').trim();
      const rawSource = (req.query.source as string) || 'ilmeteo';
      const source: WeatherSource =
        rawSource === 'twc' || rawSource === 'compare' || rawSource === 'average' ? rawSource : 'ilmeteo';

      const clientHour = req.query.clientHour !== undefined && req.query.clientHour !== ''
        ? parseInt(req.query.clientHour as string, 10)
        : undefined;
      const clientTime = (req.query.clientTime as string) || undefined;

      const weatherReport = await getLiveWeatherWithGrounding(city, source, { clientHour, clientTime });
      res.json(weatherReport);
    } catch (err: any) {
      console.error('Error fetching weather data:', err);
      res.status(500).json({ error: 'Errore nel recupero delle informazioni meteo', details: err?.message });
    }
  });

  // Reverse Geocoding endpoint
  app.get('/api/geolocation/reverse', async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Coordinate lat/lon non valide' });
      }
      const geo = await reverseGeocodeLatLon(lat, lon);
      res.json(geo);
    } catch (err: any) {
      console.error('Reverse geocode route error:', err);
      res.status(500).json({ error: 'Errore durante la geolocalizzazione inversa' });
    }
  });

  // IP Geolocation fallback endpoint
  app.get('/api/geolocation/ip', async (req, res) => {
    try {
      const location = await detectIpLocation();
      res.json(location);
    } catch (err: any) {
      console.error('IP geocode route error:', err);
      res.json({ city: 'Roma', region: 'Lazio', country: 'Italia', lat: 41.9028, lon: 12.4964 });
    }
  });

  // Meteorological Stations for Interactive Map (TWC + iLMeteo)
  app.get('/api/map/stations', (req, res) => {
    try {
      const stations = getAllMapStations();
      res.json(stations);
    } catch (err: any) {
      console.error('Stations route error:', err);
      res.status(500).json({ error: 'Errore nel caricamento delle stazioni meteo' });
    }
  });

  // Radar Doppler Tile Timestamps (from RainViewer with cache)
  app.get('/api/radar-timestamps', async (req, res) => {
    try {
      const timestamps = await getLiveRadarTimestamps();
      res.json(timestamps);
    } catch (err: any) {
      console.error('Radar timestamps error:', err);
      res.status(500).json({ error: 'Errore nel caricamento delle coordinate radar' });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather Channel & iLMeteo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
