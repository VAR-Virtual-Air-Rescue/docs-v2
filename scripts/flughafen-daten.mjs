import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src', '.data', 'airports.json')
const apiUrl = 'https://ops.virtualairrescue.com/api/airports'

function istFlughafen(eintrag) {
  return eintrag &&
    typeof eintrag === 'object' &&
    typeof eintrag.id === 'number' &&
    typeof eintrag.icao === 'string' &&
    (typeof eintrag.iata === 'string' || eintrag.iata === null) &&
    typeof eintrag.name === 'string' &&
    (typeof eintrag.city === 'string' || eintrag.city === null) &&
    typeof eintrag.country === 'string' &&
    (typeof eintrag.lat === 'number' || eintrag.lat === null) &&
    (typeof eintrag.lng === 'number' || eintrag.lng === null) &&
    (typeof eintrag.elevationFt === 'number' || eintrag.elevationFt === null) &&
    (typeof eintrag.longestRunwayM === 'number' || eintrag.longestRunwayM === null) &&
    typeof eintrag.active === 'boolean'
}

export async function aktualisiereFlughafenDaten() {
  const response = await fetch(apiUrl, { signal: AbortSignal.timeout(30_000) })
  if (!response.ok) {
    throw new Error(`Flughafen-API antwortete mit HTTP ${response.status}`)
  }

  const airports = await response.json()
  if (!Array.isArray(airports) || airports.length === 0 || !airports.every(istFlughafen)) {
    throw new Error('Unerwartetes oder leeres Format der Flughafen-API')
  }

  await mkdir(path.dirname(dataPath), { recursive: true })
  await writeFile(dataPath, JSON.stringify(airports), 'utf8')
  console.log(`Flughafendaten aktualisiert: ${airports.length} Flughäfen`)
  return airports
}
