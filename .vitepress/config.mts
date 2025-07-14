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
				"<a href='https://virtualairrescue.com/impressum/'>Impressum</a> | <a href='https://virtualairrescue.com/datenschutz/'>Datenschutzerklärung</a>",
		},

		sidebar: [
			{
				text: "Pilotenbereich",
				items: [
					{ text: "How-To Pilot", link: "/pilotenbereich/how-to-pilot" },
					{
						text: "HPG H145",
						collapsed: false,
						items: [
							{ text: "Allgemeine Informationen", link: "/pilotenbereich/hpg-h145/info" },
							{ text: "Start-Up", link: "/pilotenbereich/hpg-h145/Start-Up" },
							{ text: "Powering Down", link: "/pilotenbereich/hpg-h145/Powering-Down" },
							{
								text: "R&E Integration",
								collapsed: true,
								items: [
									{
										text: "Voraussetzungen",
										link: "/pilotenbereich/hpg-h145/r-e-integration/Voraussetzungen",
									},
									{
										text: "Einrichtung",
										link: "/pilotenbereich/hpg-h145/r-e-integration/Einrichtung",
									},
									{
										text: "Fehlerbehebung",
										link: "/pilotenbereich/hpg-h145/r-e-integration/Fehlerbehebung",
									},
								],
							},
						],
					},
					{ text: "EC135 Bedienung", link: "/pilotenbereich/ec-135" },
					{ text: "Hubschrauber Steuerorgane", link: "/pilotenbereich/Steuerorgane" },
					{ text: "Luftraumstruktur", link: "/pilotenbereich/Luftraumstruktur" },
					{ text: "Meteorologie", link: "/pilotenbereich/Meteorologie" },
					{ text: "Navigation", link: "/pilotenbereich/Navigation" },
					{ text: "Standardplatzrunde", link: "/pilotenbereich/Standardplatzrunde" },
					{ text: "Reichweite / Endurance", link: "/pilotenbereich/Endurance" },
					{ text: "Hubschraubertypen", link: "/pilotenbereich/Hubschraubertypen" },
					{
						text: "Luftrettung",
						collapsed: true,
						items: [
							{ text: "Außenlandung", link: "/pilotenbereich/luftrettung/aussenlandung" },
							{ text: "Landeplätze- und Stellen", link: "/pilotenbereich/luftrettung/landeplatz" },
							{
								text: "Crew",
								collapsed: true,
								items: [
									{ text: "HEMS-TC", link: "/pilotenbereich/luftrettung/crew/hems-tc" },
									{ text: "Notarzt", link: "/pilotenbereich/luftrettung/crew/notarzt" },
								],
							},
							{
								text: "Militärfliegerei (SAR)",
								collapsed: true,
								items: [
									{ text: "Einführung", link: "/pilotenbereich/luftrettung/military/Einführung" },
									{ text: "SOP", link: "/pilotenbereich/luftrettung/military/SOP" },
								],
							},
						],
					},
					{ text: "Mobile App-Alarmierung", link: "/pilotenbereich/app-alarmierung" },
				],
			},
			{
				text: "Disponentenbereich",
				items: [
					{ text: "How-To Disponent", link: "/disponentenbereich/how-to-disponent" },
					{ text: "Disposition", link: "/disponentenbereich/disposition" },
					{ text: "Stichworte", link: "/disponentenbereich/Stichworte" },
				],
			},
			{
				text: "Allgemein",
				items: [
					{
						text: "VAR Systeme",
						collapsed: false,
						items: [
							{ text: "Änderungen in der V2", link: "/allgemein/var-systeme/v2-changes" },
							{
								text: "HUB",
								collapsed: true,
								items: [
									{ text: "How-To Discord", link: "/allgemein/var-systeme/hub/how-to-discord" },
								],
							},
							{
								text: "Operations Center",
								collapsed: true,
								items: [
									{ text: "Piloten", link: "/allgemein/var-systeme/leitstelle/pilot" },
									{ text: "Disponenten", link: "/allgemein/var-systeme/leitstelle/disponent" },
								],
							},
						],
					},

					{
						text: "BOS Funk",
						collapsed: true,
						items: [
							{ text: "Grundlagen", link: "/allgemein/bos-funk/Grundlagen" },
							{ text: "Funkverkehr", link: "/allgemein/bos-funk/Funkverkehr" },
							{ text: "OPTA", link: "/allgemein/bos-funk/OPTA" },
							{ text: "Status", link: "/allgemein/bos-funk/Status" },
							{ text: "Funkbeispiel", link: "/allgemein/bos-funk/Funkbeispiel" },
						],
					},

					{
						text: "VATSIM",
						collapsed: true,
						items: [
							{ text: "Registrierung", link: "/allgemein/vatsim/registrierung" },
							{ text: "Prefile", link: "/allgemein/vatsim/prefile" },
						],
					},
					{ text: "Live-Streaming", link: "/allgemein/streaming" },
					{ text: "Das Team & Struktur", link: "/allgemein/team" },
				],
			},
			{
				text: "",
				items: [
					{ text: "Impressum", link: "https://virtualairrescue.com/impressum/" },
					{ text: "Datenschutzerklärung", link: "https://virtualairrescue.com/datenschutz/" },
					{ text: "Mitwirken", link: "/" },
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
