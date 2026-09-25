import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import Stationskarte from "./components/Stationskarte.vue";
import "./uniform.css";
import "./custom.css";

// Catppuccin Mocha Lavender ist raus. Die Oberflaeche steht jetzt auf den
// VAR-Farben, gesetzt auf VitePress' eigenen Variablen in custom.css --
// vorher lagen zwei Farbsysteme uebereinander und arbeiteten gegeneinander.
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // In jeder Markdown-Seite als <Stationskarte /> verwendbar.
    app.component("Stationskarte", Stationskarte);
  },
} satisfies Theme;
