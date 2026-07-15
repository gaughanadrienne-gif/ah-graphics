import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../garden-conditions-data.json', import.meta.url);
const NOW = new Date();
const TIMEZONE = 'America/Los_Angeles';
const USER_AGENT = 'AmbitiousHarvestGardenConditions/1.0 (https://www.ambitiousharvest.com/garden-conditions)';
const ZONES = [
  { id: 'santa-cruz', name: 'Santa Cruz', latitude: 36.9741, longitude: -122.0308 },
  { id: 'slv', name: 'San Lorenzo Valley', latitude: 37.1261, longitude: -122.1222 },
  { id: 'watsonville', name: 'Watsonville', latitude: 36.9102, longitude: -121.7569 }
];

async function fetchJson(url, attempts = 2) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': USER_AGENT, accept: 'application/geo+json, application/json' },
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (i + 1 < attempts) await new Promise(resolve => setTimeout(resolve, 750));
    }
  }
  throw lastError;
}

function compass(degrees) {
  if (!Number.isFinite(degrees)) return '';
  return ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(degrees / 22.5) % 16];
}

function weatherLabel(code) {
  if (code === 0) return 'Clear';
  if ([1, 2].includes(code)) return 'Partly cloudy';
  if (code === 3) return 'Cloudy';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([95, 96, 99].includes(code)) return 'Thunderstorms';
  return 'Current conditions';
}

function sum(values) {
  return values.reduce((total, value) => total + (Number(value) || 0), 0);
}

function dailyRows(daily) {
  return daily.time.map((date, index) => ({
    date,
    high: daily.temperature_2m_max[index],
    low: daily.temperature_2m_min[index],
    precipitation: daily.precipitation_sum[index] || 0,
    precipitationProbability: daily.precipitation_probability_max[index] || 0,
    uvIndex: daily.uv_index_max[index],
    evapotranspiration: daily.et0_fao_evapotranspiration[index],
    windGust: daily.wind_gusts_10m_max[index]
  }));
}

function relevantAlerts(payload) {
  return (payload.features || []).map(feature => feature.properties || {}).filter(a => a.status !== 'Test').map(a => ({
    event: a.event,
    headline: a.headline,
    severity: a.severity,
    urgency: a.urgency,
    description: a.description,
    instruction: a.instruction,
    expires: a.expires,
    source_url: a['@id'] || a.id || 'https://www.weather.gov/'
  }));
}

async function nwsData(zone) {
  const point = await fetchJson(`https://api.weather.gov/points/${zone.latitude},${zone.longitude}`);
  const [forecast, alerts] = await Promise.all([
    fetchJson(point.properties.forecast),
    fetchJson(`https://api.weather.gov/alerts/active?point=${zone.latitude},${zone.longitude}`)
  ]);
  return {
    forecast: (forecast.properties?.periods || []).map(period => ({
      name: period.name,
      startTime: period.startTime,
      endTime: period.endTime,
      temperature: period.temperature,
      temperatureUnit: period.temperatureUnit,
      conditions: period.shortForecast,
      detailedForecast: period.detailedForecast,
      icon: period.icon,
      isDaytime: period.isDaytime,
      precipitation: period.probabilityOfPrecipitation?.value || 0,
      wind: period.windSpeed,
      windDirection: period.windDirection
    })),
    alerts: relevantAlerts(alerts)
  };
}

async function openMeteoData(zone) {
  const params = new URLSearchParams({
    latitude: String(zone.latitude), longitude: String(zone.longitude), timezone: TIMEZONE,
    temperature_unit: 'fahrenheit', wind_speed_unit: 'mph', precipitation_unit: 'inch',
    past_days: '30', forecast_days: '8',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    hourly: 'soil_temperature_0cm,soil_temperature_6cm,soil_moisture_9_to_27cm,vapour_pressure_deficit,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,et0_fao_evapotranspiration,wind_gusts_10m_max'
  });
  return fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`);
}

async function buildZone(zone) {
  const [meteo, nws] = await Promise.all([openMeteoData(zone), nwsData(zone)]);
  const rows = dailyRows(meteo.daily);
  const todayIndex = rows.findIndex(row => row.date === String(meteo.current.time).slice(0, 10));
  const throughToday = rows.slice(0, Math.max(todayIndex + 1, 1));
  const hourlyIndex = Math.max(0, meteo.hourly.time.findLastIndex(time => time <= meteo.current.time));
  const soilTemp = meteo.hourly.soil_temperature_6cm[hourlyIndex] ?? meteo.hourly.soil_temperature_0cm[hourlyIndex];
  const alerts = nws.alerts;
  const firstDaytime = nws.forecast.find(period => period.isDaytime);
  return {
    updated: NOW.toISOString(), zone: zone.id, zoneName: zone.name,
    location: { latitude: zone.latitude, longitude: zone.longitude },
    current: {
      temperature: Math.round(meteo.current.temperature_2m), temperatureUnit: 'F',
      apparentTemperature: Math.round(meteo.current.apparent_temperature),
      conditions: firstDaytime?.conditions || weatherLabel(meteo.current.weather_code),
      detailedForecast: firstDaytime?.detailedForecast || '',
      wind: `${Math.round(meteo.current.wind_speed_10m)} mph`,
      windSpeed: meteo.current.wind_speed_10m,
      windGust: meteo.current.wind_gusts_10m,
      windDirection: compass(meteo.current.wind_direction_10m),
      precipitation: meteo.current.precipitation || 0,
      soilTemp: Number.isFinite(soilTemp) ? Math.round(soilTemp) : null,
      soilMoisture: meteo.hourly.soil_moisture_9_to_27cm[hourlyIndex],
      humidity: meteo.current.relative_humidity_2m,
      vapourPressureDeficit: meteo.hourly.vapour_pressure_deficit[hourlyIndex],
      precipitationProbability: meteo.hourly.precipitation_probability[hourlyIndex]
    },
    rainfall: {
      today: throughToday.at(-1)?.precipitation || 0,
      last7Days: sum(throughToday.slice(-7).map(row => row.precipitation)),
      last30Days: sum(throughToday.slice(-30).map(row => row.precipitation)),
      dailyData: throughToday.slice(-30).map(row => ({ date: row.date, amount: row.precipitation }))
    },
    gardenMetrics: {
      today: rows[todayIndex] || rows[0],
      upcoming: rows.slice(Math.max(todayIndex, 0), Math.max(todayIndex, 0) + 7)
    },
    forecast: nws.forecast,
    hasActiveAlerts: alerts.length > 0,
    alerts
  };
}

let previous = { zones: {} };
try { previous = JSON.parse(await readFile(FILE, 'utf8')); } catch {}

const warnings = [];
const zones = {};
for (const zone of ZONES) {
  try {
    zones[zone.id] = await buildZone(zone);
  } catch (error) {
    warnings.push(`${zone.name}: ${error.message}`);
    if (previous.zones?.[zone.id]) zones[zone.id] = { ...previous.zones[zone.id], stale: true };
  }
}

if (Object.keys(zones).length !== ZONES.length) throw new Error('No complete prior snapshot exists for a failed zone.');
const output = {
  version: 2,
  timezone: TIMEZONE,
  updated_at: NOW.toISOString(),
  sources: [
    { name: 'National Weather Service', url: 'https://www.weather.gov/', role: 'official forecasts and alerts' },
    { name: 'Open-Meteo', url: 'https://open-meteo.com/', role: 'localized model data, rainfall, soil estimates, UV and evapotranspiration' }
  ],
  zones,
  warnings
};
await writeFile(FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Updated garden conditions for ${Object.keys(zones).length} zones${warnings.length ? ` with ${warnings.length} warning(s)` : ''}.`);
