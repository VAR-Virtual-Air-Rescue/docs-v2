<script setup lang="ts">
// Spricht angemeldete Nutzer im Titel der Startseite mit Vornamen an. Den Namen liefert das Gateway
// (server/gateway.mjs, /auth/me). Ohne Namen bleiben Titel und Untertitel wie im Frontmatter von
// src/index.md. Die Komponente zeigt selbst nichts an, sie ersetzt nur hero.text und hero.tagline.
import { onMounted } from "vue";
import { useRoute } from "vitepress";

// Lokale Vorschau (npm run dev) hat kein Gateway: dort ein Beispielname, damit man die Begrüßung sieht
const DEV_NAME = "Max";

const route = useRoute();

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Die Seitendaten der Route sind schreibgeschützt (dev) bzw. nicht reaktiv (Build). Deshalb nicht den
// Titel ändern, sondern route.data durch eine Kopie mit neuem Titel ersetzen: Das zeichnet den Hero neu.
const greet = (name: string) => {
  const data = route.data;
  const hero = data.frontmatter?.hero;
  if (!hero?.text || hero.greeted) return;
  route.data = {
    ...data,
    frontmatter: {
      ...data.frontmatter,
      hero: {
        ...hero,
        text: `<span class="home-greeting">Hallo ${escapeHtml(name)},</span><br>bereit für deinen nächsten Einsatz?`,
        tagline:
          "Von der ersten Statusmeldung bis zur Zielklinik — hier findest du alles, was du zum Fliegen und Disponieren brauchst.",
        greeted: true,
      },
    },
  };
};

onMounted(async () => {
  try {
    const res = await fetch("/auth/me", { credentials: "same-origin", redirect: "error" });
    if (res.ok) {
      const data = await res.json();
      if (typeof data?.firstname === "string" && data.firstname) greet(data.firstname);
      return;
    }
  } catch {
    // kein Gateway oder nicht angemeldet
  }
  if (import.meta.env.DEV) greet(DEV_NAME);
});
</script>

<template></template>
