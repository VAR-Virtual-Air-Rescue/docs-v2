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

export function spitaelerFuerKarte(hospitals, country) {
  if (!Array.isArray(hospitals)) {
    throw new Error('Unerwartetes Format der Hospitals-API: Array erwartet')
  }

  const mapHospitals = hospitals
    .filter(hospital => hospital.country === country && heliportTypes.has(hospital.helipad))
    .map(hospital => {
      if (!Number.isFinite(hospital.lat) || !Number.isFinite(hospital.lng) ||
          hospital.lat < lat0 || hospital.lat > lat1 ||
          hospital.lng < lon0 || hospital.lng > lon1) {
        throw new Error(`Ungültige Koordinaten für Spital "${hospital.name}" (${country})`)
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

  if (mapHospitals.length === 0) {
    throw new Error(`Hospitals-API enthält keine Spitäler mit Landeplatz (${country})`)
  }
  return mapHospitals
}
