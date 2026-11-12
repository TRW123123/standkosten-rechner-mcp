export type Antrieb='verbrenner'|'bev'|'phev';
export interface BerechnungInput {bestand:number;durchschnittliche_standtage:number;kosten_pro_tag_euro?:number;antrieb?:Antrieb}
export const STAND='2026-11-12';
export const scope='Rechnet nur mit den übergebenen Zahlen. Ruft keine Website ab, scrapt nichts, speichert nichts und gibt keinen Rechts-, Steuer- oder Finanzrat. Ergebnis ist eine Schätzung.';
export const VORGABE_KOSTEN_PRO_TAG=30;
export const quellen={
 dat_barometer_juni_2026:{titel:'DAT Barometer Juni 2026 (Händlerbefragung Mai 2026)',url:'https://www.dat.de/barometer/dat-barometer-juni/',herausgeber:'Deutsche Automobil Treuhand GmbH (DAT)',live_geprueft_am:STAND},
 kfz_betrieb_2024:{titel:'Gebrauchtwagen: Standkosten stark gestiegen (27.11.2024)',url:'https://www.kfz-betrieb.vogel.de/dat-barometer-standtage-a-a1968a8a0e4cd2f5d153fe7df75b3e7d/',herausgeber:'kfz-betrieb (Vogel Communications Group), nach DAT-Barometer',live_geprueft_am:STAND}
} as const;
export const datJuni2026={
 standtage:{phev:97,bev:93,verbrenner:81},
 anteil_laenger_als_90_tage:'fast 30 % aller Gebrauchtwagen (gelten als Risikobestand)',
 kosten_pro_tag_euro_rund:25,
 befragung:{haendler:255,methode:'Online-Interviews (CAWI) über TeleResearch',zeitraum:'12.05.–29.05.2026'},
 quelle:quellen.dat_barometer_juni_2026
} as const;
export const kfzBetrieb2024={kosten_pro_tag_euro:30,vorjahr_oktober_2023_euro:23,anstieg_prozent:30.4,artikel_datum:'2024-11-27',quelle:quellen.kfz_betrieb_2024} as const;
const cent=(n:number)=>Math.round(n*100)/100;
// Euro-Beträge in Cent rechnen, damit z. B. 12,5 × 19,99 € kaufmännisch auf 249,88 € rundet.
const euro=(faktor:number,kostenEuro:number)=>Math.round(faktor*Math.round(kostenEuro*100))/100;
export function berechneStandkosten(input:BerechnungInput){
 const {bestand,durchschnittliche_standtage:tage}=input;
 const kosten=input.kosten_pro_tag_euro??VORGABE_KOSTEN_PRO_TAG;
 if(!Number.isInteger(bestand)||bestand<1)throw Error('bestand muss eine ganze Zahl ab 1 sein.');
 if(!Number.isFinite(tage)||tage<=0)throw Error('durchschnittliche_standtage muss größer als 0 sein.');
 if(!Number.isFinite(kosten)||kosten<0)throw Error('kosten_pro_tag_euro darf nicht negativ sein.');
 const pro=euro(tage,kosten);
 const gesamt=euro(bestand*tage,kosten);
 const gesparteTage=Math.min(10,tage);
 const ersparnis=euro(bestand*gesparteTage,kosten);
 const vorgabe=input.kosten_pro_tag_euro===undefined;
 const datWert=input.antrieb?datJuni2026.standtage[input.antrieb]:undefined;
 const differenz=datWert===undefined?null:cent(tage-datWert);
 const einordnung=datWert===undefined
  ?'Kein Antrieb angegeben. DAT-Werte Juni 2026 zum Vergleich: PHEV 97, BEV 93, Verbrenner 81 Tage.'
  :differenz===0?`Ihr Schnitt entspricht dem DAT-Wert für ${label(input.antrieb!)} (${datWert} Tage).`
  :`Ihr Schnitt liegt ${Math.abs(differenz!).toLocaleString('de-DE')} Tage ${differenz!>0?'über':'unter'} dem DAT-Wert für ${label(input.antrieb!)} (${datWert} Tage).`;
 return {
  kosten_gesamt_euro:gesamt,
  kosten_pro_fahrzeug_euro:pro,
  ersparnis_bei_minus_10_tagen_euro:ersparnis,
  annahmen:{bestand,durchschnittliche_standtage:tage,kosten_pro_tag_euro:kosten,kosten_pro_tag_quelle:vorgabe?'Vorgabe 30 €: Durchschnitt laut kfz-betrieb vom 27.11.2024 (nach DAT-Barometer). Kein Wert für 2026; eigene Kalkulation eintragen.':'Vom Nutzer angegeben.',formel:'bestand × durchschnittliche_standtage × kosten_pro_tag_euro',ersparnis_formel:`bestand × ${gesparteTage} Tage × kosten_pro_tag_euro`},
  vergleich_dat_juni_2026:{
   standtage:{...datJuni2026.standtage},
   ihr_antrieb:input.antrieb??null,
   differenz_zum_dat_wert_tage:differenz,
   einordnung,
   ueber_90_tage_hinweis:tage>90?'Ihr Durchschnitt liegt über 90 Tagen. Laut DAT gelten Fahrzeuge ab mehr als 90 Standtagen als Risikobestand.':'Laut DAT stehen fast 30 % aller Gebrauchtwagen länger als 90 Tage (Risikobestand).',
   anteil_laenger_als_90_tage:datJuni2026.anteil_laenger_als_90_tage,
   dat_kosten_pro_tag_euro_rund:datJuni2026.kosten_pro_tag_euro_rund,
   kosten_gesamt_bei_dat_kostensatz_euro:euro(bestand*tage,datJuni2026.kosten_pro_tag_euro_rund),
   befragung:`${datJuni2026.befragung.haendler} Händler, ${datJuni2026.befragung.zeitraum}`,
   quelle:datJuni2026.quelle.url
  },
  hinweis:'Die Rechnung ist eine Schätzung mit Ihren Eingaben. Die Vorgabe von 30 € je Tag ist der Durchschnitt laut kfz-betrieb (27.11.2024, nach DAT), keine Zahl für 2026. Das DAT Barometer Juni 2026 nennt rund 25 € je Pkw und Standtag; der Vergleichswert steht im Feld vergleich_dat_juni_2026. Der Antrieb ändert die Rechnung nicht. Kein Rechts-, Steuer- oder Finanzrat.',
  naechster_schritt:'Standtage senken, z. B. durch vollständigere Inserate mit mehr Bildern oder einem Fahrzeugvideo, und den Bestand über 90 Tage zuerst prüfen.',
  quellen:[quellen.dat_barometer_juni_2026,quellen.kfz_betrieb_2024],
  stand:STAND,
  scope
 };
}
const label=(a:Antrieb)=>a==='bev'?'BEV':a==='phev'?'PHEV':'Verbrenner';
export function getKennzahlen(){
 return {
  dat_barometer_juni_2026:{standtage:{...datJuni2026.standtage},einheit:'Tage, Durchschnitt Gebrauchtwagen im Handel',anteil_laenger_als_90_tage:datJuni2026.anteil_laenger_als_90_tage,kosten_pro_tag_euro_rund:datJuni2026.kosten_pro_tag_euro_rund,befragung:{...datJuni2026.befragung},quelle:datJuni2026.quelle},
  kfz_betrieb_27_11_2024:{kosten_pro_tag_euro:kfzBetrieb2024.kosten_pro_tag_euro,vorjahr_oktober_2023_euro:kfzBetrieb2024.vorjahr_oktober_2023_euro,anstieg_prozent:kfzBetrieb2024.anstieg_prozent,hinweis:'Durchschnitt laut kfz-betrieb nach DAT-Barometer, Stand Ende 2024. Vorgabewert des Rechners.',quelle:kfzBetrieb2024.quelle},
  quellen:[quellen.dat_barometer_juni_2026,quellen.kfz_betrieb_2024],
  stand:STAND,
  hinweis:'Statische, datierte Kennzahlen. Keine Rechnung, kein Live-Abruf. Vor Veröffentlichung die Quellen erneut prüfen.',
  scope
 };
}
