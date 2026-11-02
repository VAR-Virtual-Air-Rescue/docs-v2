const lon0 = 2
const lon1 = 18
const lat0 = 44.5
const lat1 = 55.6
const width = 1000
const mercatorY = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))
const yTop = mercatorY(lat1)
const ySpan = yTop - mercatorY(lat0)
const height = width * ySpan / ((lon1 - lon0) * Math.PI / 180)
const excludedName = /NICHT NUTZEN|DEV[ ]*[0-9]|(^|[ ])Test([ ]|$)/i

function project(lon, lat) {
  return {
    x: (lon - lon0) / (lon1 - lon0) * width,
    y: (yTop - mercatorY(lat)) / ySpan * height
  }
}

export function stationenAufbereiten(raw, airportData) {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('Stations-API lieferte keine gültigen Datensätze')
  }
  if (!Array.isArray(airportData) || airportData.length === 0) {
    throw new Error('Flughafen-API lieferte keine gültigen Datensätze')
  }

  const airportsByIcao = new Map(airportData.map(airport => [airport.icao, airport]))
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
  if (stations.length === 0) {
    throw new Error('Stations-API enthält keine Stationen im dargestellten Einsatzraum')
  }
  return { stations, excluded, width, height: Number(height.toFixed(1)) }
}
