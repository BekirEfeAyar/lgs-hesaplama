/* ==========================================================================
   Puan motoru testleri — tarayıcısız çalışır.
   Çalıştırma:  node test/puan.test.js
   ========================================================================== */

const fs = require("fs");
const path = require("path");

// depo.js tarayıcıya bağımlı ama puan.js değil; sadece ayarlar + puan yüklenir.
global.window = {};
global.localStorage = {
  _v: {},
  getItem(k) { return this._v[k] === undefined ? null : this._v[k]; },
  setItem(k, v) { this._v[k] = String(v); },
  removeItem(k) { delete this._v[k]; },
};

const kok = path.join(__dirname, "..", "js");
function yukle(dosya) {
  (0, eval)(fs.readFileSync(path.join(kok, dosya), "utf8"));
}
yukle("ayarlar.js");
yukle("puan.js");

const U = global.window.LGS;
const P = U.puan;

let gecen = 0;
let kalan = 0;
let bolum = "";

function baslik(y) {
  bolum = y;
  console.log("\n" + y);
}

function kontrol(etiket, gercek, beklenen, tolerans) {
  const t = tolerans === undefined ? 0.05 : tolerans;
  const ok = Math.abs(gercek - beklenen) <= t;
  ok ? gecen++ : kalan++;
  console.log((ok ? "  ✓ " : "  ✗ ") + etiket + ": " + gercek + (ok ? "" : "   (beklenen " + beklenen + ")"));
  return ok;
}

function esit(etiket, gercek, beklenen) {
  const ok = gercek === beklenen;
  ok ? gecen++ : kalan++;
  console.log((ok ? "  ✓ " : "  ✗ ") + etiket + ": " + JSON.stringify(gercek) + (ok ? "" : "   (beklenen " + JSON.stringify(beklenen) + ")"));
  return ok;
}

/** İstenen toplam doğru sayısını derslere sırayla dağıtır. */
function dogruDagit(toplam) {
  const d = {};
  U.DERSLER.forEach((x) => (d[x.id] = { d: 0, y: 0 }));
  let kalanHedef = toplam;
  for (const x of U.DERSLER) {
    const al = Math.min(x.soru, kalanHedef);
    d[x.id].d = al;
    kalanHedef -= al;
    if (kalanHedef <= 0) break;
  }
  return d;
}

/* --------------------------------------------------------------- yapı */

baslik("=== SINAV YAPISI ===");
esit("1. oturum soru sayısı (60)", U.DERSLER.filter((x) => x.oturum === 1).reduce((t, x) => t + x.soru, 0), 60);
esit("2. oturum soru sayısı (100)", U.DERSLER.filter((x) => x.oturum === 2).reduce((t, x) => t + x.soru, 0), 100);
esit("Toplam soru", U.TOPLAM_SORU, 160);
esit("Puan üst sınırı", U.MAX_PUAN, 500);
esit("Yanlış etkisi paydası", U.YANLIS_ETKI, 3);
esit("Ders sayısı", U.DERSLER.length, 6);

/* --------------------------------------------------------------- puan */

baslik("=== PUAN: 500 × net ÷ 160 ===");
[
  [160, 500], [140, 437.5], [120, 375], [100, 312.5],
  [80, 250], [60, 187.5], [40, 125], [0, 0],
].forEach(([n, b]) => kontrol("net " + String(n).padStart(3), P.hesapla({ dersler: dogruDagit(n) }).puan, b));

/* --------------------------------------------------------------- net */

baslik("=== YANLIŞ ETKİSİ: net = Doğru − Yanlış/3 ===");
{
  const d = dogruDagit(0);
  d.matematik = { d: 20, y: 9 };
  kontrol("Matematik D=20 Y=9", P.hesapla({ dersler: d }).dersler.find((x) => x.id === "matematik").net, 17);
}
{
  const d = dogruDagit(0);
  d.turkce = { d: 30, y: 3 };
  kontrol("Türkçe D=30 Y=3", P.hesapla({ dersler: d }).dersler.find((x) => x.id === "turkce").net, 29);
}
{
  const d = dogruDagit(0);
  d.fen = { d: 10, y: 20 };
  kontrol("Fen D=10 Y=20", P.hesapla({ dersler: d }).dersler.find((x) => x.id === "fen").net, 10 - 20 / 3);
}
{
  const d = dogruDagit(0);
  d.fen = { d: 5, y: 25 };
  kontrol("Fen D=5 Y=25 → negatif net 0'a çekilir", P.hesapla({ dersler: d }).dersler.find((x) => x.id === "fen").net, 0);
}

/* --------------------------------------------------------------- boş */

baslik("=== BOŞ SAYISI ===");
{
  const d = dogruDagit(0);
  d.turkce = { d: 25, y: 5 };
  kontrol("Türkçe 40 soru, D=25 Y=5 → boş", P.hesapla({ dersler: d }).dersler.find((x) => x.id === "turkce").b, 10);
}
{
  const d = dogruDagit(0);
  d.fen = { d: 30, y: 0 };
  kontrol("Fen 30 soru, hepsi doğru → boş", P.hesapla({ dersler: d }).dersler.find((x) => x.id === "fen").b, 0);
}

/* --------------------------------------------------------------- koruma */

baslik("=== GEÇERSİZ GİRİŞ KORUMASI ===");
{
  const d = dogruDagit(0);
  d.turkce = { d: 55, y: 10 };
  const h = P.hesapla({ dersler: d });
  const s = h.dersler.find((x) => x.id === "turkce");
  kontrol("Doğru soru sayısına kırpılır", s.d, 40);
  kontrol("Yanlış kalan yer kadar kırpılır", s.y, 0);
  kontrol("Uyarı üretilir", h.hatali.length > 0 ? 1 : 0, 1);
  kontrol("Toplam D+Y+B = 160", h.toplamD + h.toplamY + h.toplamB, 160);
}
{
  const d = dogruDagit(0);
  d.turkce = { d: -5, y: -3 };
  const s = P.hesapla({ dersler: d }).dersler.find((x) => x.id === "turkce");
  kontrol("Negatif giriş → 0", s.d + s.y + s.b, 40);
}
{
  const d = dogruDagit(0);
  d.turkce = { d: "abc", y: null };
  const s = P.hesapla({ dersler: d }).dersler.find((x) => x.id === "turkce");
  kontrol("Metin giriş → 0", s.d + s.y, 0);
}

/* --------------------------------------------------------------- boş deneme */

baslik("=== BOŞ DENEME ===");
{
  const h = P.hesapla({ dersler: {} });
  kontrol("Puan", h.puan, 0);
  kontrol("Net", h.toplamNet, 0);
  kontrol("D+Y+B = 160", h.toplamD + h.toplamY + h.toplamB, 160);
}
{
  const h = P.hesapla(null);
  kontrol("null deneme çökmez", h.puan, 0);
}

/* --------------------------------------------------------------- senaryo */

baslik("=== GERÇEKÇİ SENARYO ===");
{
  const d = dogruDagit(0);
  d.turkce = { d: 30, y: 8 };
  d.inkilap = { d: 8, y: 2 };
  d.din = { d: 9, y: 1 };
  d.matematik = { d: 25, y: 12 };
  d.fen = { d: 20, y: 8 };
  d.sosyal = { d: 24, y: 5 };
  const h = P.hesapla({ dersler: d });
  console.log("    D " + h.toplamD + " · Y " + h.toplamY + " · B " + h.toplamB);
  kontrol("Toplam D+Y+B = 160", h.toplamD + h.toplamY + h.toplamB, 160);
  kontrol("Net", h.toplamNet, (30 - 8 / 3) + (8 - 2 / 3) + (9 - 1 / 3) + (25 - 4) + (20 - 8 / 3) + (24 - 5 / 3));
  kontrol("Puan = 500 × net ÷ 160", h.puan, (500 * h.toplamNet) / 160);
  kontrol("1. oturum neti", h.oturumlar[1].net, (30 - 8 / 3) + (8 - 2 / 3) + (9 - 1 / 3));
  kontrol("2. oturum neti", h.oturumlar[2].net, (25 - 4) + (20 - 8 / 3) + (24 - 5 / 3));
}

/* --------------------------------------------------------------- istatistik */

baslik("=== İSTATİSTİK ===");
{
  const o = P.ozet([
    { id: "a", ad: "D1", tarih: "2026-01-01", dersler: dogruDagit(100) },
    { id: "b", ad: "D2", tarih: "2026-02-01", dersler: dogruDagit(120) },
  ]);
  esit("Adet", o.adet, 2);
  kontrol("En yüksek", o.enYuksek, 375);
  kontrol("En düşük", o.enDusuk, 312.5);
  kontrol("Ortalama", o.ortalama, 343.75);
  kontrol("Son puan (en yeni tarih)", o.sonPuan, 375);
}
{
  const o = P.ozet([]);
  esit("Boş listede adet", o.adet, 0);
  esit("Boş listede ortalama", o.ortalama, 0);
  esit("Boş listede son puan", o.sonPuan, null);
}

/* --------------------------------------------------------------- yorum */

baslik("=== YORUM METNİ ===");
{
  esit("Artış", P.yorum(400, 375), "Önceki denemeye göre 25.0 puan arttın.");
  esit("Düşüş", P.yorum(350, 375), "Önceki denemeye göre 25.0 puan düştün.");
  esit("Değişim yok", P.yorum(375, 375), "Önceki denemeyle aynı seviyedesin.");
  esit("İlk deneme", P.yorum(300, null), "");
}

/* --------------------------------------------------------------- performans */

baslik("=== PERFORMANS ===");
{
  const t0 = Date.now();
  const N = 10000;
  for (let i = 0; i < N; i++) P.hesapla({ dersler: dogruDagit(100 + (i % 40)) });
  const sure = Date.now() - t0;
  console.log("    " + N + " hesaplama: " + sure + " ms (" + (sure / N).toFixed(4) + " ms/adet)");
  kontrol("Ortalama < 1 ms", sure / N < 1 ? 1 : 0, 1);
}

/* --------------------------------------------------------------- sonuç */

console.log("\n" + "=".repeat(46));
console.log("GEÇEN: " + gecen + "    KALAN: " + kalan);
console.log(kalan === 0 ? "TÜM TESTLER BAŞARILI ✓" : "*** HATA VAR ***");
process.exit(kalan === 0 ? 0 : 1);
