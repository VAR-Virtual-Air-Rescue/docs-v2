// Zugriffsschutz für die Docs: Hub-Login (OAuth) + Sperrprüfung, danach Auslieferung der statischen Dateien.
// Keine Abhängigkeiten, läuft im Container anstelle von nginx.
import { createServer } from "node:http";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const env = (k, d) => process.env[k] || d;
const PORT = Number(env("PORT", "80"));
const DIST = resolve(env("DOCS_DIST", fileURLToPath(new URL("../.vitepress/dist", import.meta.url))));
const HUB_URL = env("HUB_URL", "https://hub.virtualairrescue.com").replace(/\/$/, "");
const HUB_INTERNAL_URL = env("HUB_INTERNAL_URL", HUB_URL).replace(/\/$/, "");
const DOCS_URL = env("DOCS_URL", "https://docs.virtualairrescue.com").replace(/\/$/, "");
const CLIENT_ID = env("DOCS_OAUTH_CLIENT_ID", "5");
const CLIENT_SECRET = env("DOCS_OAUTH_CLIENT_SECRET", "");
const INTERNAL_SECRET = env("HUB_INTERNAL_API_SECRET", "");
const SESSION_SECRET = env("DOCS_SESSION_SECRET", "");
const SESSION_MAX_AGE = 12 * 3600 * 1000; // maximale Sitzungsdauer
const RECHECK_AFTER = 30 * 1000; // Sperrstatus alle 30 Sekunden neu beim Hub prüfen
const GRACE = 15 * 60 * 1000; // so lange darf der Hub bei der Prüfung ausfallen
const SECURE = DOCS_URL.startsWith("https://");
// Live-Daten für Flughafenliste, Stationskarte und Spitalkarte (nur angemeldet erreichbar)
const OPS_API_URL = env("OPS_API_URL", "https://ops.virtualairrescue.com").replace(/\/$/, "");
const API_PATHS = new Set(["/api/airports", "/api/stations", "/api/hospitals"]);

if (!CLIENT_SECRET || !INTERNAL_SECRET || SESSION_SECRET.length < 32) {
	console.error("DOCS_OAUTH_CLIENT_SECRET, HUB_INTERNAL_API_SECRET und DOCS_SESSION_SECRET (>=32 Zeichen) sind Pflicht.");
	process.exit(1);
}

const MIME = {
	".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
	".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
	".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".pdf": "application/pdf",
	".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".map": "application/json", ".webmanifest": "application/manifest+json",
};

const b64 = (b) => Buffer.from(b).toString("base64url");
const mac = (data) => createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
const safeEq = (a, b) => {
	const x = Buffer.from(a), y = Buffer.from(b);
	return x.length === y.length && timingSafeEqual(x, y);
};
const seal = (obj) => {
	const body = b64(JSON.stringify(obj));
	return `${body}.${mac(body)}`;
};
const unseal = (value) => {
	if (!value) return null;
	const [body, sig] = value.split(".");
	if (!body || !sig || !safeEq(sig, mac(body))) return null;
	try {
		return JSON.parse(Buffer.from(body, "base64url").toString());
	} catch {
		return null;
	}
};
const parseCookies = (req) =>
	Object.fromEntries(
		(req.headers.cookie || "").split(";").map((c) => {
			const i = c.indexOf("=");
			return i < 0 ? [c.trim(), ""] : [c.slice(0, i).trim(), decodeURIComponent(c.slice(i + 1).trim())];
		}),
	);
const cookie = (name, value, maxAgeSec) =>
	`${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${SECURE ? "; Secure" : ""}`;

const send = (res, status, body, headers = {}) => {
	res.writeHead(status, { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", ...headers });
	res.end(body);
};
const redirect = (res, location, headers = {}) => send(res, 302, "", { Location: location, ...headers });

const lockedPage = () => `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Zugriff gesperrt</title>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 1rem"><h1>Zugriff gesperrt</h1><p>Dein Account ist permanent gesperrt.</p><p>Daher hast du keinen Zugriff auf die Dokumentation.</p></body></html>`;

// Fragt den Hub, ob der Nutzer dauerhaft gesperrt ist (Zeitstrafen sperren die Docs nicht). Wirft bei Netzwerk-/Serverfehlern.
const pendingChecks = new Map();
const checkUser = (userId) => {
	if (!pendingChecks.has(userId)) {
		pendingChecks.set(userId, fetchCheck(userId).finally(() => pendingChecks.delete(userId)));
	}
	return pendingChecks.get(userId);
};
const fetchCheck = async (userId) => {
	const r = await fetch(`${HUB_INTERNAL_URL}/api/internal/auth/check`, {
		method: "POST",
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${INTERNAL_SECRET}` },
		body: JSON.stringify({ userId }),
		signal: AbortSignal.timeout(5000),
	});
	if (!r.ok) throw new Error(`Hub check ${r.status}`);
	return r.json();
};

const startLogin = (req, res, target) => {
	const nonce = randomBytes(16).toString("base64url");
	const state = seal({ n: nonce, t: target, exp: Date.now() + 10 * 60 * 1000 });
	const url = new URL(`${HUB_URL}/oauth`);
	url.searchParams.set("client_id", CLIENT_ID);
	url.searchParams.set("redirect_uri", `${DOCS_URL}/auth/callback`);
	url.searchParams.set("state", state);
	redirect(res, url.href, { "Set-Cookie": cookie("docs_oauth", nonce, 600) });
};

const handleCallback = async (req, res, url) => {
	const cookies = parseCookies(req);
	const state = unseal(url.searchParams.get("state") || "");
	const code = url.searchParams.get("code");
	if (!state || state.exp < Date.now() || !cookies.docs_oauth || !safeEq(state.n, cookies.docs_oauth) || !code) {
		return redirect(res, "/");
	}
	const target = typeof state.t === "string" && state.t.startsWith("/") && !state.t.startsWith("//") ? state.t : "/";
	try {
		const tokenRes = await fetch(`${HUB_INTERNAL_URL}/api/auth/accessToken`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({ code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
			signal: AbortSignal.timeout(5000),
		});
		if (tokenRes.status === 403) return send(res, 403, lockedPage(), { "Content-Type": "text/html; charset=utf-8" });
		if (!tokenRes.ok) return send(res, 401, "Anmeldung fehlgeschlagen. Bitte erneut versuchen.");
		const { access_token } = await tokenRes.json();
		// Token kam direkt vom Hub (Server-zu-Server), wir brauchen nur die Nutzer-ID
		const userId = JSON.parse(Buffer.from(access_token.split(".")[1], "base64url").toString()).id;
		const check = await checkUser(userId);
		if (!check.allowed) return send(res, 403, lockedPage(), { "Content-Type": "text/html; charset=utf-8" });
		const now = Date.now();
		redirect(res, target, {
			"Set-Cookie": [
				cookie("docs_session", seal({ uid: userId, iat: now, chk: now }), SESSION_MAX_AGE / 1000),
				cookie("docs_oauth", "", 0),
			],
		});
	} catch (e) {
		console.error("Callback-Fehler:", e);
		send(res, 503, "Anmeldung momentan nicht möglich. Bitte später erneut versuchen.");
	}
};

// Liefert Sitzung oder null. Aktualisiert bei Bedarf den Sperrstatus; setzt ggf. neues Cookie.
const getSession = async (req, res) => {
	const s = unseal(parseCookies(req).docs_session);
	const now = Date.now();
	if (!s || !s.uid || now - s.iat > SESSION_MAX_AGE) return { session: null };
	if (now - s.chk <= RECHECK_AFTER) return { session: s };
	try {
		const check = await checkUser(s.uid);
		if (!check.allowed) return { session: null, locked: check };
		res.setHeader("Set-Cookie", cookie("docs_session", seal({ ...s, chk: now }), (SESSION_MAX_AGE - (now - s.iat)) / 1000 | 0));
		return { session: s };
	} catch (e) {
		console.error("Sperrprüfung fehlgeschlagen:", e.message);
		if (now - s.chk <= GRACE) return { session: s }; // kurze Hub-Ausfälle überbrücken
		return { session: null, unavailable: true };
	}
};

const serveFile = async (req, res, pathname) => {
	let rel;
	try {
		rel = normalize(decodeURIComponent(pathname));
	} catch {
		return send(res, 400, "Bad request");
	}
	if (rel.includes("\0")) return send(res, 400, "Bad request");
	let file = join(DIST, rel);
	if (file !== DIST && !file.startsWith(DIST + sep)) return send(res, 403, "Forbidden");
	try {
		if ((await stat(file)).isDirectory()) file = join(file, "index.html");
		const data = await readFile(file);
		const type = MIME[extname(file).toLowerCase()] || "application/octet-stream";
		const cache = file.includes(`${sep}assets${sep}`) ? "private, max-age=3600" : "private, no-store";
		return send(res, 200, req.method === "HEAD" ? "" : data, { "Content-Type": type, "Cache-Control": cache });
	} catch {
		try {
			const nf = await readFile(join(DIST, "404.html"));
			return send(res, 404, nf, { "Content-Type": "text/html; charset=utf-8" });
		} catch {
			return send(res, 404, "Not found");
		}
	}
};

// Leitet freigegebene /api/-Abfragen an die OPS-API weiter. Cookies und Login-Daten werden nicht mitgeschickt.
const proxyApi = async (req, res, url) => {
	try {
		const r = await fetch(`${OPS_API_URL}${url.pathname}${url.search}`, {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(30_000),
		});
		const body = Buffer.from(await r.arrayBuffer());
		return send(res, r.status, req.method === "HEAD" ? "" : body, {
			"Content-Type": r.headers.get("content-type") || "application/json; charset=utf-8",
		});
	} catch (e) {
		console.error("API-Weiterleitung fehlgeschlagen:", url.pathname, e.message);
		return send(res, 502, "API nicht erreichbar");
	}
};

createServer(async (req, res) => {
	try {
		const url = new URL(req.url || "/", DOCS_URL);
		if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method not allowed", { Allow: "GET, HEAD" });
		if (url.pathname === "/healthz") return send(res, 200, "ok");
		if (url.pathname === "/auth/callback") return await handleCallback(req, res, url);
		if (url.pathname === "/auth/logout") {
			return redirect(res, "/", { "Set-Cookie": cookie("docs_session", "", 0) });
		}
		const { session, locked, unavailable } = await getSession(req, res);
		if (locked) return send(res, 403, lockedPage(), { "Content-Type": "text/html; charset=utf-8", "Set-Cookie": cookie("docs_session", "", 0) });
		if (unavailable) return send(res, 503, "Anmeldung momentan nicht möglich. Bitte später erneut versuchen.");
		const isApi = url.pathname.startsWith("/api/");
		if (!session) return isApi ? send(res, 401, "Nicht angemeldet") : startLogin(req, res, url.pathname + url.search);
		if (isApi) return API_PATHS.has(url.pathname) ? await proxyApi(req, res, url) : send(res, 404, "Not found");
		return await serveFile(req, res, url.pathname);
	} catch (e) {
		console.error(e);
		send(res, 500, "Internal error");
	}
}).listen(PORT, () => console.log(`Docs-Gateway auf :${PORT}, Dateien aus ${DIST}`));
