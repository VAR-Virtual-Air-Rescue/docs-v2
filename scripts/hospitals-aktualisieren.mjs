import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src', '.data', 'hospitals.json')
const apiUrl = 'https://ops.virtualairrescue.com/api/hospitals'

const response = await fetch(apiUrl, { signal: AbortSignal.timeout(30_000) })
if (!response.ok) {
  throw new Error(`Hospitals-API antwortete mit HTTP ${response.status}`)
}

const hospitals = await response.json()
if (!Array.isArray(hospitals)) {
  throw new Error('Unerwartetes Format der Hospitals-API: Array erwartet')
}
if (hospitals.length === 0) {
  throw new Error('Hospitals-API lieferte keine Datensätze')
}
if (hospitals.some(hospital => !hospital || typeof hospital !== 'object' || hospital.id == null || !hospital.name)) {
  throw new Error('Hospitals-API enthält einen ungültigen Datensatz')
}

await writeFile(dataPath, JSON.stringify(hospitals), 'utf8')
console.log(`Hospitals-Daten aktualisiert: ${hospitals.length} Krankenhäuser`)
