/* Lise verisi bütünlük testleri — node test/liseler.test.js */
const fs = require("fs");
const path = require("path");
const kok = path.join(__dirname, "..");

let gecen = 0, kalan = 0;
function dene(ad, kosul, detay) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; console.log("  ✗ " + ad + (detay ? " → " + detay : "")); }
}

const kod = fs.readFileSync(path.join(kok, "veri/liseler.js"), "utf8");
const L = new Function(kod + "\nreturn TABAN_LISELER;")();

dene("3096 kayıt", L.length === 3096, L.length);
const dolu = L.filter((k) => k.dilim !== null && k.dilim !== undefined);
dene("dilim dolu ≥ 2500", dolu.length >= 2500, dolu.length);
dene("dilim hep [0,100] aralığında", dolu.every((k) => typeof k.dilim === "number" && k.dilim >= 0 && k.dilim <= 100));
const bul = (ad) => L.find((k) => k.ad === ad);
dene("Galatasaray %0,01", bul("Galatasaray Üniversitesi Galatasaray L.").dilim === 0.01);
dene("Kabataş %0,01", L.filter((k) => k.ad === "Kabataş Erkek L.").every((k) => k.dilim === 0.01));
dene("taban>400 olanlarda dilim<=20", L.filter((k) => k.taban != null && k.taban > 400 && k.dilim !== null && k.dilim > 20).length === 0);
// taban-dilim monotonluğu kabaca: en yüksek 10 tabanın dilimi <= 1 olmalı
const sirali = dolu.filter((k) => k.taban != null).sort((a, b) => b.taban - a.taban);
dene("en yüksek 10 tabanda dilim<=1", sirali.slice(0, 10).every((k) => k.dilim <= 1));

console.log(`\nGEÇEN: ${gecen}  KALAN: ${kalan}`);
process.exit(kalan === 0 ? 0 : 1);
