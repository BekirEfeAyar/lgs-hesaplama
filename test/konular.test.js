/* KONULAR veri bütünlük testi — node test/konular.test.js */
const fs = require("fs");
const path = require("path");
const kok = path.join(__dirname, "..");

function yukle(dosya) {
  const kod = fs.readFileSync(path.join(kok, dosya), "utf8");
  const fn = new Function(
    "window",
    "localStorage",
    "document",
    kod + "\nreturn { KONULAR: (typeof KONULAR !== 'undefined' ? KONULAR : undefined), LGS: (typeof LGS !== 'undefined' ? LGS : (window.LGS || undefined)) };"
  );
  return fn({}, undefined, undefined);
}

let gecen = 0, kalan = 0;
function dene(ad, kosul, detay) {
  if (kosul) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; console.log("  ✗ " + ad + (detay ? " → " + detay : "")); }
}

// ayarlar.js LGS.DERSLER'i kurar
const ayar = yukle("js/ayarlar.js");
const LGS = ayar.LGS;
const dersIdleri = LGS.DERSLER.map((d) => d.id);
dene("6 ders tanımlı", dersIdleri.length === 6, dersIdleri.length);

const { KONULAR } = yukle("veri/konular.js");
dene("KONULAR yüklendi", !!KONULAR && typeof KONULAR === "object");
dene("Tüm derslerin konusu var", dersIdleri.every((id) => Array.isArray(KONULAR[id])), dersIdleri.filter((id) => !KONULAR[id]).join(","));

let uniteSayisi = 0, konuSayisi = 0;
let bosUnite = [], bosKonu = [], tekrarKonu = [];
for (const id of dersIdleri) {
  const uniteler = KONULAR[id] || [];
  dene(id + " en az 4 ünite", uniteler.length >= 4, uniteler.length);
  const gorulen = new Set();
  for (const u of uniteler) {
    uniteSayisi++;
    if (!u.u || !String(u.u).trim()) bosUnite.push(id);
    if (!Array.isArray(u.k) || u.k.length === 0) bosKonu.push(id + "/" + u.u);
    for (const k of (u.k || [])) {
      konuSayisi++;
      const anahtar = id + "|" + u.u + "|" + k;
      if (gorulen.has(anahtar)) tekrarKonu.push(anahtar);
      gorulen.add(anahtar);
    }
  }
}
dene("Boş ünite adı yok", bosUnite.length === 0, bosUnite.join(","));
dene("Konusuz ünite yok", bosKonu.length === 0, bosKonu.join(","));
dene("Tekrar konu yok", tekrarKonu.length === 0, tekrarKonu.slice(0, 3).join("; "));
console.log(`  … ${uniteSayisi} ünite, ${konuSayisi} konu`);

// konular.js modülü yüklenebilir mi (tarayıcı API'siz kısım)? Sadece sözdizimi + LGS kaydı kontrolü
const konularKod = fs.readFileSync(path.join(kok, "js/konular.js"), "utf8");
dene("LGS.konular kaydı var", /LGS\.konular\s*=\s*\{[^}]*ciz/.test(konularKod));
dene("indeksiKur dışarı açık", /indeksiKur/.test(konularKod));

// Dosya kodlaması: tüm metin dosyaları geçerli UTF-8 olmalı (bozuk bayt = �)
function metinDosyalari(dir, liste) {
  for (const ad of fs.readdirSync(dir)) {
    if (ad === ".git" || ad === "node_modules") continue;
    const tam = path.join(dir, ad);
    if (fs.statSync(tam).isDirectory()) metinDosyalari(tam, liste);
    else if (/\.(js|html|css|md|json)$/.test(ad)) liste.push(tam);
  }
  return liste;
}
let bozukDosya = [];
for (const f of metinDosyalari(kok, [])) {
  const buf = fs.readFileSync(f);
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch (e) {
    bozukDosya.push(path.relative(kok, f));
  }
}
dene("Tüm dosyalar geçerli UTF-8", bozukDosya.length === 0, bozukDosya.join(", "));

console.log(`\nGEÇEN: ${gecen}  KALAN: ${kalan}`);
process.exit(kalan === 0 ? 0 : 1);
