import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "VAR Knowledgebase",
    description: "How To's und mehr zu Virtual Air Rescue",
    srcDir: "src",
    themeConfig: {
        logo: "/var_logo.png",
        search: {
            provider: "local",
        },
        lastUpdated: {
            text: "Letzte Änderung",
            formatOptions: {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            },
        },
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "Startseite", link: "/" },
            {
                text: "How-To's",
                items: [
                    { text: "Wie werde ich Pilot?", link: "/pilotenbereich/how-to-pilot" },
                    { text: "Wie werde ich Disponent?", link: "/disponentenbereich/how-to-disponent" },
                    {
                        text: "Wie verbinde ich meinen Discord Account?",
                        link: "/allgemein/var-systeme/hub/how-to-discord",
                    },
                ],
            },
            { text: "FAQ", link: "/faq" },
        ],

        footer: {
            message:
                "<a href='https://virtualairrescue.com/impressum/'>Impressum</a> | <a href='https://virtualairrescue.com/datenschutz/'>Datenschutzerklärung</a> | <a href='https://docs.virtualairrescue.com/fair-play/'>VAR FAIR PLAY</a>"
        },

        sidebar: [
            {
                text: "Pilotenbereich",
                collapsed: true,
                items: [
                    { text: "How-To Pilot", link: "/pilotenbereich/how-to-pilot" },
                    { text: "Addons", link: "/pilotenbereich/addons" },
                    { 	text: "Allgemeine Luftfahrt",
						collapsed: true,
						items: [
							{ text: "Standardplatzrunde", link: "/pilotenbereich/allgemeineluftfahrt/Standardplatzrunde" },
							{ text: "Luftraumstruktur", link: "/pilotenbereich/allgemeineluftfahrt/Luftraumstruktur" },
							{ text: "Navigation", link: "/pilotenbereich/allgemeineluftfahrt/Navigation" },
							{ text: "Meteorologie", link: "/pilotenbereich/allgemeineluftfahrt/Meteorologie" },
							{ text: "Reichweite", link: "pilotenbereich/allgemeineluftfahrt/Endurance"}
						]
					
					},
                    { text: "Steuerorgane Hubschrauber", link: "/pilotenbereich/Steuerorgane" },
                    {
                        text: "Prozeduren (SOP)",
                        collapsed: true,
                        items: [
                            { text: "Über SOPs & dieses Kapitel", link: "/pilotenbereich/procedures/sops.md"},
                            { text: "H145 Checkliste", link: "/pilotenbereich/procedures/H145_checklist.md"},
                        ]
                    },
                ],
            },
            {
                text: "Disponentenbereich",
                collapsed: true,
                items: [
                    { text: "How-To Disponent", link: "/disponentenbereich/how-to-disponent" },
                    { text: "Disposition", link: "/disponentenbereich/disposition" },
                    { text: "Stichworte", link: "/disponentenbereich/Stichworte" },
                ],
            },
			{
				text: "Luftrettung",
				collapsed: true,
				items: [
					{ text: "Crew",
						collapsed: true,
						items: [
							{ text: "HEMS-TC", link: "/luftrettung/crew/hems-tc" },
							{ text: "Notarzt", link: "/luftrettung/crew/notarzt" },
						]
					},
					{
                        text: "BOS-Funk",
                        collapsed: true,
                        items: [
                            { text: "Grundlagen", link: "/luftrettung/bos-funk/Grundlagen" },
                            { text: "Funkverkehr", link: "/luftrettung/bos-funk/Funkverkehr" },
                            { text: "OPTA", link: "/luftrettung/bos-funk/OPTA" },
                            { text: "Status", link: "/luftrettung/bos-funk/Status" },
                            { text: "Funkbeispiel", link: "/luftrettung/bos-funk/Funkbeispiel" },
                        ]
                    },
					{ text: "Außenlandungen", link: "/luftrettung/aussenlandung" },
                    { text: "Landestellen", link: "/luftrettung/landeplatz" },
					{ text: "Luftrettungszentren"},
					{ text: "Militärluftrettung",
						collapsed: true,
						items: [
							{ text: "Einführung", link: "/luftrettung/military/Einführung" },
							{ text: "SOP", link: "/luftrettung/military/SOP" },
						]
					}
				]
			},
            {   
                text: "VAR-Systeme",
                collapsed: true,
                items: [
                    { text: "Webleitstelle", link: "/var-systeme/webleitstelle" },
                    { text: "Pilotenansicht", link: "/var-systeme/pilot" },
					{ text: "Mobile App-Alarmierung", link: "/var-systeme/app-alarmierung" },
					{ text: "Flugpläne und Landeplätze", link: "/var-systeme/FlugplanUndWegpunkte" },
					{ text: "Random & Everywhere",
						collapsed: true,
						items: [
							{ text: "Voraussetzungen", link: "/var-systeme/hpg-h145/r-e-integration/Voraussetzungen" },
							{ text: "Einrichtung", link: "/var-systeme/hpg-h145/r-e-integration/Einrichtung" },
							{ text: "Fehlerbehebung", link: "/var-systeme/hpg-h145/r-e-integration/Fehlerbehebung"},]

					}
                ]
            },
            {
                text: "Allgemein",
                collapsed: true,
                items: [
                    {
                        text: "VATSIM",
                        collapsed: true,
                        items: [
                            { text: "Registrierung", link: "/allgemein/vatsim/registrierung" },
                            { text: "Prefile", link: "/allgemein/vatsim/prefile" },
                        ]
                    },
                    { text: "Live-Streaming", link: "/allgemein/streaming" },
                    { text: "Das Team & Struktur", link: "/allgemein/team" },
                ]
            },
            {
                text: "",
                items: [
                    { text: "Mitwirken", link: "/mitwirken"},
                    { text: "VAR FAIR PLAY", link: "/fair-play" },
                    { text: "Impressum", link: "https://virtualairrescue.com/impressum/" },
                    { text: "Datenschutzerklärung", link: "https://virtualairrescue.com/datenschutz/" },
                ],
            },
        ],

        socialLinks: [{ icon: "github", link: "https://github.com/VAR-Virtual-Air-Rescue/docs-v2" }],

        docFooter: {
            prev: "Vorherige Seite",
            next: "Nächste Seite",
        },

        outline: {
            label: "Inhalt",
        },
    },
    markdown: {
        theme: {
            light: "catppuccin-latte",
            dark: "catppuccin-mocha",
        },
        image: {
            lazyLoading: true,
        },
    },
});