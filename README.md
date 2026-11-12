# Standkosten-Rechner (MCP-Server)

Remote-MCP-Server für Autohäuser im DACH-Raum: rechnet aus Bestand, durchschnittlichen Standtagen und Kosten pro Standtag aus, was stehende Gebrauchtwagen kosten, und ordnet die Standtage gegen datierte DAT-Werte ein.

- Registry-Name: `de.autohaus-video/standkosten-rechner`
- Website: https://autohaus-video.de
- Entwickler: Autohaus-Video (betrieben von Safak Tepecik)
- Lizenz: MIT
- Transport: Streamable HTTP, JSON-RPC 2.0 auf `POST /mcp`; `GET /health`; Protokollversionen 2025-03-26, 2025-06-18, 2025-11-25

## Status

Version 0.1.0, gebaut und getestet am 12.11.2026. Lokal mit `wrangler dev` geprüft. **Noch kein Production-Deploy**: die in `server.json` eingetragene URL `https://mcp.autohaus-video.de/mcp` ist ein Vorschlag und erst nach Cloudflare-Login und Safaks OK erreichbar.

## Tools

| Tool | Zweck |
|---|---|
| `berechne_standkosten` | Eingaben `bestand` (ganze Zahl ≥ 1), `durchschnittliche_standtage` (> 0), optional `kosten_pro_tag_euro` (Vorgabe 30, ≥ 0) und `antrieb` (`verbrenner`, `bev`, `phev`, nur zur Einordnung). Ausgabe: `kosten_gesamt_euro`, `kosten_pro_fahrzeug_euro`, `ersparnis_bei_minus_10_tagen_euro`, `vergleich_dat_juni_2026`, `hinweis`, `naechster_schritt`, `quellen`, `stand`. |
| `get_standtage_kennzahlen` | Statische, datierte Kennzahlen mit Quellen, ohne Rechnung. |

Formeln: Gesamtkosten = Bestand × Standtage × Kosten/Tag. Je Fahrzeug = Standtage × Kosten/Tag. Ersparnis = Bestand × min(10, Standtage) × Kosten/Tag. Beträge werden in Cent gerechnet und kaufmännisch gerundet.

Beispiel: 100 Fahrzeuge, 81 Standtage, 30 €/Tag → 243.000 € gesamt, 2.430 € je Fahrzeug, 30.000 € Ersparnis bei 10 Tagen weniger.

## Quellen (live geprüft am 12.11.2026)

- DAT Barometer Juni 2026, https://www.dat.de/barometer/dat-barometer-juni/ : Standtage PHEV 97, BEV 93, Verbrenner 81 Tage; „fast 30 % aller Gebrauchtwagen stehen länger als 90 Tage“ (Risikobestand); Kosten je Pkw und Standtag „momentan rund 25 Euro“; Händlerbefragung mit 255 Online-Interviews, 12.05.–29.05.2026.
- kfz-betrieb, 27.11.2024, https://www.kfz-betrieb.vogel.de/dat-barometer-standtage-a-a1968a8a0e4cd2f5d153fe7df75b3e7d/ : im Schnitt 30 € pro Tag (Oktober 2023: 23 €; +30,4 %), nach DAT-Barometer.

Die Vorgabe 30 €/Tag ist der Wert von Ende 2024, keine Zahl für 2026. Der DAT-Wert von rund 25 € (Juni 2026) wird als Vergleich ausgegeben (`kosten_gesamt_bei_dat_kostensatz_euro`). Eigene Kalkulation hat immer Vorrang.

## Scope

Rechnet nur mit den übergebenen Zahlen. Kein Abruf oder Scraping von Websites, Börsen oder DMS, nichts wird gespeichert. Keine Rechts-, Steuer- oder Finanzberatung. Geloggt werden nur Tool-Name, Erfolg und Dauer; keine IPs, keine Eingaben.

## Lokal starten und testen

```bash
npm install
npm run typecheck
npm test
npm run secret-scan
npm run dev            # wrangler dev auf http://127.0.0.1:8789, ohne Cloudflare-Login
bash scripts/smoke.sh  # zweites Terminal: health, initialize, tools/list, tools/call positiv und negativ
```

## Production (offen)

Braucht einen gültigen Cloudflare-Login auf der Box (`wrangler whoami` liefert derzeit Invalid access token) und Safaks OK für eine Subdomain wie `mcp.autohaus-video.de`. Danach `npx wrangler deploy`, Custom Domain setzen, `scripts/smoke.sh https://…` ausführen, dann Registry-Eintrag.
