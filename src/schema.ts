export type Schema={type?:string;description?:string;examples?:unknown[];properties?:Record<string,Schema>;items?:Schema;required?:string[];additionalProperties?:boolean;enum?:readonly unknown[];maxLength?:number;minLength?:number;minimum?:number;exclusiveMinimum?:number;maximum?:number;maxItems?:number;pattern?:string;default?:unknown};
// Kopie der Validierung aus car-listing-check, ergänzt um exclusiveMinimum und deutsche Fehlermeldungen.
export function validate(value:unknown,s:Schema,path='arguments'):void{
 if(s.type==='object'){
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error(`${path} muss ein Objekt sein.`);
  const v=value as Record<string,unknown>;
  for(const k of s.required??[])if(!(k in v))throw Error(`${path}.${k} fehlt (Pflichtfeld).`);
  for(const [k,x] of Object.entries(v)){const child=s.properties&&Object.hasOwn(s.properties,k)?s.properties[k]:undefined;if(!child){if(s.additionalProperties===false)throw Error(`${path}: unbekanntes Feld ${k}.`);}else validate(x,child,`${path}.${k}`);}
 }else if(s.type==='string'){
  if(typeof value!=='string'||!value.trim()||Array.from(value).length>(s.maxLength??Infinity)||(s.pattern&&!new RegExp(s.pattern).test(value)))throw Error(`${path} muss ein nicht leerer Text sein (höchstens ${s.maxLength} Zeichen).`);
 }else if(s.type==='number'||s.type==='integer'){
  const lower=s.exclusiveMinimum!==undefined?`größer als ${s.exclusiveMinimum}`:`mindestens ${s.minimum}`;
  if(typeof value!=='number'||!Number.isFinite(value)||value<(s.minimum??-Infinity)||(s.exclusiveMinimum!==undefined&&value<=s.exclusiveMinimum)||value>(s.maximum??Infinity)||(s.type==='integer'&&!Number.isInteger(value)))throw Error(`${path} muss eine ${s.type==='integer'?'ganze Zahl':'Zahl'} sein, ${lower} und höchstens ${s.maximum}.`);
 }
 if(s.enum&&!s.enum.includes(value))throw Error(`${path} muss einer dieser Werte sein: ${s.enum.join(', ')}.`);
}
export const berechneInput:Schema={type:'object',additionalProperties:false,required:['bestand','durchschnittliche_standtage'],properties:{
 bestand:{type:'integer',description:'Anzahl Gebrauchtwagen im Bestand (ganze Zahl, mindestens 1).',examples:[120],minimum:1,maximum:100000},
 durchschnittliche_standtage:{type:'number',description:'Durchschnittliche Standtage je Fahrzeug (größer als 0).',examples:[85],exclusiveMinimum:0,maximum:3650},
 kosten_pro_tag_euro:{type:'number',description:'Kosten je Fahrzeug und Standtag in Euro. Vorgabe 30 (Durchschnitt laut kfz-betrieb vom 27.11.2024 nach DAT). Eigene Kalkulation hat Vorrang.',examples:[30],minimum:0,maximum:10000,default:30},
 antrieb:{type:'string',description:'Optional: verbrenner, bev oder phev. Nur zur Einordnung gegen die DAT-Standtage (Juni 2026); ändert die Rechnung nicht.',examples:['verbrenner'],enum:['verbrenner','bev','phev'],minLength:1,maxLength:20}
}};
export const kennzahlenInput:Schema={type:'object',additionalProperties:false,properties:{}};
