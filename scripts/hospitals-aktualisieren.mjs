import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src', '.data', 'hospitals.json')
const austriaMapDataPath = path.join(root, 'src', '.data', 'oesterreich-spitaeler.json')
const apiUrl = 'https://ops.virtualairrescue.com/api/hospitals'

const lon0 = 2
const lon1 = 18
const lat0 = 44.5
const lat1 = 55.6
const width = 1000
const mercatorY = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))
const yTop = mercatorY(lat1)
const ySpan = yTop - mercatorY(lat0)
const height = width * ySpan / ((lon1 - lon0) * Math.PI / 180)
const heliportTypes = new Set(['GROUND', 'ROOF', 'NEARBY'])
const hospitalCategory = hospital => hospital.isUniversity
  ? 'UNIVERSITY'
  : hospital.careLevel === 'SPECIALIST'
    ? 'SPECIALIST'
    : 'HOSPITAL'

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

const austriaHospitals = hospitals
  .filter(hospital => hospital.country === 'AT' && heliportTypes.has(hospital.helipad))
  .map(hospital => {
    if (!Number.isFinite(hospital.lat) || !Number.isFinite(hospital.lng) ||
        hospital.lat < lat0 || hospital.lat > lat1 ||
        hospital.lng < lon0 || hospital.lng > lon1) {
      throw new Error(`Ungültige Koordinaten für österreichisches Spital "${hospital.name}"`)
    }
    return {
      id: hospital.id,
      name: hospital.name,
      city: hospital.city,
      state: hospital.state,
      helipad: hospital.helipad,
      helipadNight: hospital.helipadNight,
      operatorName: hospital.operatorName,
      category: hospitalCategory(hospital),
      x: Number(((hospital.lng - lon0) / (lon1 - lon0) * width).toFixed(1)),
      y: Number(((yTop - mercatorY(hospital.lat)) / ySpan * height).toFixed(1))
    }
  })
if (austriaHospitals.length === 0) {
  throw new Error('Hospitals-API enthält keine österreichischen Spitäler')
}

await writeFile(dataPath, JSON.stringify(hospitals), 'utf8')
await writeFile(austriaMapDataPath, JSON.stringify(austriaHospitals), 'utf8')
console.log(`Hospitals-Daten aktualisiert: ${hospitals.length} Krankenhäuser, ${austriaHospitals.length} in Österreich`)
