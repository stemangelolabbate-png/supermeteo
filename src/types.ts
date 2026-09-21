export type WeatherCondition =
  | 'sunny'
  | 'mostly_sunny'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog'
  | 'windy';

export type WeatherSource = 'average' | 'twc' | 'ilmeteo' | 'compare';

export interface HourlyForecast {
  time: string; // '14:00'
  fullDate?: string;
  hour: number;
  temp: number;
  feelsLike: number;
  condition: string;
  conditionType: WeatherCondition;
  pop: number; // 0-100 %
  rainAmount: number; // mm
  windSpeed: number; // km/h
  windDirection: string;
  humidity: number; // %
  uvIndex: number;
  dewPoint: number;
  cloudCover: number; // %
  source: 'average' | 'twc' | 'ilmeteo';
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  conditionType: WeatherCondition;
  pop: number;
  rainAmount?: number;
  windSpeed: number;
  windDirection?: string;
  humidity: number;
  uvIndex?: number;
  narrative?: string;
}

export interface CurrentWeather {
  city: string;
  region: string;
  country: string;
  temp: number;
  feelsLike: number;
  condition: string;
  conditionType: WeatherCondition;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number; // hPa
  uvIndex: number;
  uvDescription: string;
  visibility: number; // km
  dewPoint: number;
  airQualityIndex: number;
  airQualityDescription: string;
  sunrise: string;
  sunset: string;
  moonPhase: string;
  updatedAt: string;
  source: 'average' | 'twc' | 'ilmeteo' | 'compare';
  sourceLabel: string;
  breakdown?: {
    twc: { temp: number; feelsLike: number; tempMax: number; tempMin: number; condition: string; windSpeed: number; pop: number };
    ilmeteo: { temp: number; feelsLike: number; tempMax: number; tempMin: number; condition: string; windSpeed: number; pop: number };
    deltaTemp: number;
  };
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: 'info' | 'warning' | 'severe';
  source: 'iLMeteo.it' | 'The Weather Channel' | 'The Weather Channel & iLMeteo.it';
  description: string;
  validUntil: string;
}

export interface WeatherReport {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alert: WeatherAlert | null;
  radarSimulation?: {
    intensity: 'light' | 'moderate' | 'heavy' | 'none';
    coveragePercent: number;
    cloudsPercent: number;
    nextRainExpectedInHours?: number | null;
  };
  comparison?: {
    twcCurrent: CurrentWeather;
    ilmeteoCurrent: CurrentWeather;
    averageCurrent?: CurrentWeather;
    twcHourly: HourlyForecast[];
    ilmeteoHourly: HourlyForecast[];
    averageHourly?: HourlyForecast[];
    insights: string;
  };
}

export interface MapStation {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  twc: {
    temp: number;
    feelsLike: number;
    condition: string;
    conditionType: WeatherCondition;
    windSpeed: number;
    windDirection: string;
    windDeg: number;
    humidity: number;
    pop: number;
    rainMm: number;
  };
  ilmeteo: {
    temp: number;
    feelsLike: number;
    condition: string;
    conditionType: WeatherCondition;
    windSpeed: number;
    windDirection: string;
    windDeg: number;
    humidity: number;
    pop: number;
    rainMm: number;
  };
  average: {
    temp: number;
    feelsLike: number;
    condition: string;
    conditionType: WeatherCondition;
    windSpeed: number;
    windDirection: string;
    windDeg: number;
    humidity: number;
    pop: number;
    rainMm: number;
  };
}

export interface RadarTimestampFrame {
  time: number;
  label: string;
  path: string;
  isForecast?: boolean;
}
