import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src', '.data', 'stationen.json')
const apiUrl = 'https://ops.virtualairrescue.com/api/stations'
const airportsUrl = 'https://ops.virtualairrescue.com/api/airports'
const southTyrolUrl = 'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/ITA/ADM3/geoBoundaries-ITA-ADM3.geojson'

const lon0 = 2
const lon1 = 18
const lat0 = 44.5
const lat1 = 55.6
const width = 1000
const mercatorY = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))
const yTop = mercatorY(lat1)
const yBottom = mercatorY(lat0)
const ySpan = yTop - yBottom
const height = width * ySpan / ((lon1 - lon0) * Math.PI / 180)
const excludedName = /NICHT NUTZEN|DEV[ ]*[0-9]|(^|[ ])Test([ ]|$)/i

function project(lon, lat) {
  return {
    x: (lon - lon0) / (lon1 - lon0) * width,
    y: (yTop - mercatorY(lat)) / ySpan * height
  }
}

function simplify(points, tolerance = 0.75) {
  const keep = new Uint8Array(points.length)
  const pending = [[0, points.length - 1]]
  keep[0] = 1
  keep[points.length - 1] = 1

  while (pending.length) {
    const [start, end] = pending.pop()
    const [ax, ay] = points[start]
    const [bx, by] = points[end]
    const dx = bx - ax
    const dy = by - ay
    const length = Math.hypot(dx, dy)
    let farthest = tolerance
    let farthestIndex = -1

    for (let i = start + 1; i < end; i++) {
      const [x, y] = points[i]
      const distance = length === 0
        ? Math.hypot(x - ax, y - ay)
        : Math.abs(dy * x - dx * y + bx * ay - by * ax) / length
      if (distance > farthest) {
        farthest = distance
        farthestIndex = i
      }
    }

    if (farthestIndex !== -1) {
      keep[farthestIndex] = 1
      pending.push([start, farthestIndex], [farthestIndex, end])
    }
  }

  return points.filter((_, index) => keep[index])
}

const response = await fetch(apiUrl, { signal: AbortSignal.timeout(30_000) })
if (!response.ok) {
  throw new Error(`Stations-API antwortete mit HTTP ${response.status}`)
}

const raw = await response.json()
if (!Array.isArray(raw)) {
  throw new Error('Unerwartetes Format der Stations-API: Array erwartet')
}
if (raw.length === 0) {
  throw new Error('Stations-API lieferte keine Datensätze')
}

const airportResponse = await fetch(airportsUrl, { signal: AbortSignal.timeout(30_000) })
if (!airportResponse.ok) {
  throw new Error(`Flughafen-API antwortete mit HTTP ${airportResponse.status}`)
}

const airportData = await airportResponse.json()
if (!Array.isArray(airportData)) {
  throw new Error('Unerwartetes Format der Flughafen-API: Array erwartet')
}
const airportsByIcao = new Map(airportData.map(airport => [airport.icao, airport]))

const boundaryResponse = await fetch(southTyrolUrl, { signal: AbortSignal.timeout(30_000) })
if (!boundaryResponse.ok) {
  throw new Error(`Südtirol-Grenzdaten antworteten mit HTTP ${boundaryResponse.status}`)
}

const boundaryData = await boundaryResponse.json()
const southTyrolFeature = boundaryData.features?.find(feature => feature.properties?.shapeName === 'Bolzano')
if (southTyrolFeature?.geometry?.type !== 'Polygon') {
  throw new Error('Südtirol-Grenze fehlt oder hat ein unerwartetes Format')
}

const southTyrolRing = southTyrolFeature.geometry.coordinates?.[0]
if (!Array.isArray(southTyrolRing) || southTyrolRing.length < 4) {
  throw new Error('Südtirol-Grenze enthält keinen gültigen Außenring')
}

const southTyrolPath = simplify(
  southTyrolRing.map(([lon, lat]) => {
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      throw new Error('Südtirol-Grenze enthält ungültige Koordinaten')
    }
    const { x, y } = project(lon, lat)
    return [x, y]
  })
).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

const existing = JSON.parse(await readFile(dataPath, 'utf8'))
const stations = []
const excluded = []

for (const station of raw) {
  const name = station.bosCallsign || station.bosCallsignShort
  const ambulanzjet = (station.bosCallsign || station.bosCallsignShort || '').trim().endsWith('#')
  const homeAirport = ambulanzjet
    ? airportsByIcao.get(station.HomeAirport?.icao)
    : null
  if (ambulanzjet && !homeAirport) {
    throw new Error(`Heimatflughafen ${station.HomeAirport?.icao || '(unbekannt)'} für "${name || '?'}" nicht gefunden`)
  }

  const latitude = homeAirport?.lat ?? station.latitude
  const longitude = homeAirport?.lng ?? station.longitude
  if (latitude == null || longitude == null) {
    excluded.push({ name, grund: 'ohne Koordinate' })
    continue
  }

  if (excludedName.test(`${station.bosCallsign || ''} ${station.bosCallsignShort || ''}`)) {
    excluded.push({ name, grund: 'Platzhalter oder Testeintrag' })
    continue
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error(`Ungültige Koordinate für Station "${name || '?'}"`)
  }
  if (!(lat0 <= latitude && latitude <= lat1 && lon0 <= longitude && longitude <= lon1)) {
    excluded.push({
      name,
      grund: `liegt ausserhalb des Einsatzraums (${latitude.toFixed(2)} N, ${longitude.toFixed(2)} O)`
    })
    continue
  }

  const { x, y } = project(longitude, latitude)
  const atcCallsignSpoken = station.atcCallsignSpoken?.trim()
  stations.push({
    id: station.id,
    name: ambulanzjet && atcCallsignSpoken ? atcCallsignSpoken : name || '?',
    kurz: station.bosCallsignShort ?? null,
    ambulanzjet,
    land: homeAirport?.country ?? station.country ?? null,
    region: homeAirport?.name ?? station.locationState ?? null,
    funkbereich: station.bosRadioArea ?? null,
    betreiber: station.operator ?? null,
    muster: station.aircraft ?? null,
    icao: station.aircraftIcao ?? null,
    kennung: station.aircraftRegistration ?? null,
    einsatzart: station.bosUse ?? null,
    winde: Boolean(station.hasWinch),
    tau: Boolean(station.hasRope),
    nvg: Boolean(station.hasNvg),
    rund: Boolean(station.is24h),
    lat: Number(latitude.toFixed(5)),
    lon: Number(longitude.toFixed(5)),
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1))
  })
}

stations.sort((a, b) => (a.land || '').localeCompare(b.land || '') || a.name.localeCompare(b.name))

const updated = {
  ...existing,
  stand: new Date().toISOString().slice(0, 10),
  quelle: apiUrl,
  ausschnitt: { lon: [lon0, lon1], lat: [lat0, lat1] },
  breite: width,
  hoehe: Number(height.toFixed(1)),
  suedtirol: {
    name: 'Südtirol',
    d: `M${southTyrolPath}Z`,
    quelle: 'geoBoundaries, Italy ADM3 (Bolzano), CC BY 4.0'
  },
  ausgelassen: excluded,
  stationen: stations
}

await writeFile(dataPath, JSON.stringify(updated), 'utf8')
console.log(`Stationsdaten aktualisiert: ${stations.length} Stationen (${updated.stand})`)
