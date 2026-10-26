<script setup>
import daten from '../../../src/.data/stationen.json'

const oesterreich = daten.laender.find(land => land.iso === 'AT')
if (!oesterreich) {
  throw new Error('Umriss von Österreich fehlt in den Stationsdaten')
}
</script>

<template>
  <svg
    viewBox="460 665 500 315"
    role="img"
    aria-label="Umrisskarte von Österreich"
    style="display: block; width: 100%; max-width: 560px; height: auto; margin: 1.5rem auto;"
  >
    <path
      :d="oesterreich.d"
      fill="#e8edf2"
      stroke="#1b344a"
      stroke-width="2"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
