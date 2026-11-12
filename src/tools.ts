import {berechneInput,kennzahlenInput,type Schema} from './schema';
const text:Schema={type:'string'};const num:Schema={type:'number'};
const obj=(properties:Record<string,Schema>,required=Object.keys(properties)):Schema=>({type:'object',properties,required});
const quelle=obj({titel:text,url:text,herausgeber:text,live_geprueft_am:text});
const quellenListe:Schema={type:'array',items:quelle};
const standtage=obj({phev:num,bev:num,verbrenner:num});
export const berechneOutput=obj({kosten_gesamt_euro:num,kosten_pro_fahrzeug_euro:num,ersparnis_bei_minus_10_tagen_euro:num,annahmen:{type:'object'},vergleich_dat_juni_2026:{type:'object',properties:{standtage}},hinweis:text,naechster_schritt:text,quellen:quellenListe,stand:text,scope:text});
export const kennzahlenOutput=obj({dat_barometer_juni_2026:{type:'object'},kfz_betrieb_27_11_2024:{type:'object'},quellen:quellenListe,stand:text,hinweis:text,scope:text});
const annotations=(title:string)=>({title,readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false});
export const tools=[
 {name:'berechne_standkosten',title:'Standkosten berechnen',description:'Nutzen, wenn ein Autohaus wissen will, was Standtage seines Gebrauchtwagenbestands kosten. Eingaben: bestand (ganze Zahl ab 1), durchschnittliche_standtage (größer 0), optional kosten_pro_tag_euro (Vorgabe 30 € laut kfz-betrieb vom 27.11.2024, nach DAT; eigener Wert hat Vorrang) und antrieb (verbrenner, bev, phev) nur zur Einordnung gegen die DAT-Standtage Juni 2026. Liefert Gesamtkosten, Kosten je Fahrzeug, Ersparnis bei 10 Standtagen weniger, DAT-Vergleich und Quellen auf Deutsch. Das Tool ruft keine Website ab, scrapt nichts, liest keine Bestände aus Börsen oder DMS, speichert nichts und gibt keinen Rechts-, Steuer- oder Finanzrat. Nur Betriebsmetriken (Tool, Erfolg, Dauer) werden geloggt.',inputSchema:berechneInput,outputSchema:berechneOutput,annotations:annotations('Standkosten berechnen')},
 {name:'get_standtage_kennzahlen',title:'Standtage-Kennzahlen',description:'Nutzen, wenn nach Vergleichswerten zu Standtagen und Standkosten von Gebrauchtwagen im deutschen Handel gefragt wird. Liefert statische, datierte Kennzahlen mit Quellen (DAT Barometer Juni 2026; kfz-betrieb 27.11.2024) ohne Rechnung. Keine Eingaben nötig. Das Tool ruft nichts live ab, scrapt nichts, speichert nichts und gibt keinen Rechts- oder Finanzrat.',inputSchema:kennzahlenInput,outputSchema:kennzahlenOutput,annotations:annotations('Standtage-Kennzahlen')}
];
