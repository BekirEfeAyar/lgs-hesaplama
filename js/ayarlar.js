/* ==========================================================================
   LGS Deneme Takipçisi — ayarlar ve sabitler
   ========================================================================== */

const LGS = (window.LGS = window.LGS || {});

/** Sürüm: index.html'deki ?v= parametresi ile birlikte artırılır (önbellek için). */
LGS.SURUM = 13;

/** Resmî olmayan uyarı metni — tek yerden yönetilir. */
LGS.OTORITE = "MEB";

/**
 * Güncel LGS sınav yapısı (MEB Kılavuzu).
 * 1. Oturum (Sözel, 75 dk): Türkçe 20 + İnkılap 10 + Din 10 + Yabancı Dil 10 = 50 soru
 * 2. Oturum (Sayısal, 80 dk): Matematik 20 + Fen Bilimleri 20 = 40 soru
 * Toplam 90 soru
 */
LGS.DERSLER = [
  { id: "turkce", ad: "Türkçe", kisa: "Türkçe", soru: 20, oturum: 1 },
  { id: "inkilap", ad: "T.C. İnkılap Tarihi ve Atatürkçülük", kisa: "İnkılap", soru: 10, oturum: 1 },
  { id: "din", ad: "Din Kültürü ve Ahlak Bilgisi", kisa: "Din Kült.", soru: 10, oturum: 1 },
  { id: "yabanci", ad: "Yabancı Dil", kisa: "Yab. Dil", soru: 10, oturum: 1 },
  { id: "matematik", ad: "Matematik", kisa: "Matematik", soru: 20, oturum: 2 },
  { id: "fen", ad: "Fen Bilimleri", kisa: "Fen", soru: 20, oturum: 2 },
];

/** Bir yanlış, kaç doğruyu götürür? (Net = Doğru − Yanlış / 3) */
LGS.YANLIS_ETKI = 3;

/**
 * MEB tarzı puan katsayıları (ders neti başına puan).
 * Kaynak: 2025 verilerine dayalı yayınlanmış tahmin modelleri
 * (inekle.com, teknofenkoleji.com — iki bağımsız kaynakta aynı değerler).
 * MEB'in gerçek hesabı standart sapmalıdır; bu katsayılar o hesabın
 * doğrusal yaklaştırımıdır. Full net ≈ 500 verir.
 */
LGS.KATSAYI = {
  turkce: 4.348,
  matematik: 4.2538,
  fen: 4.123,
  inkilap: 1.666,
  din: 1.899,
  yabanci: 1.5075,
};

/** Puan tabanı (0 netle bile alınan sabit). */
LGS.PUAN_TABANI = 194.752082;

/** LGS puan üst sınırı. */
LGS.MAX_PUAN = 500;

/** Lise türleri. */
LGS.LISE_TURLERI = [
  { id: "fen", ad: "Fen Lisesi" },
  { id: "anadolu", ad: "Anadolu Lisesi" },
  { id: "sosyal", ad: "Sosyal Bilimler" },
  { id: "mtal", ad: "MTAL" },
  { id: "imamhatip", ad: "İmam Hatip" },
  { id: "proje", ad: "Proje Okulu" },
  { id: "diger", ad: "Diğer" },
];

/** Depolama anahtarları. */
LGS.ANAHTAR = {
  denemeler: "lgs.denemeler.v1",
  liseler: "lgs.liseler.v1",
  ayarlar: "lgs.ayarlar.v1",
  tema: "lgs.tema.v1",
  db: "lgs.veritabani.v1",
};

/** Fotoğraf yüklemede kullanılacak en büyük kenar (px) ve JPEG kalitesi. */
LGS.FOTOGRAF = { kenar: 1400, kalite: 0.72 };

/** Toplam soru sayısı. */
LGS.TOPLAM_SORU = LGS.DERSLER.reduce((t, d) => t + d.soru, 0);

/* ---------------------------------------------------------------- il / ilçe */

/** Türkiye'nin 81 ili ve ilçeleri (veri/il-ilce.js). */
const IL_ILCE_TUMU = typeof IL_ILCE !== "undefined" ? IL_ILCE : [];

/** Coğrafi bölgeler — sıralı. */
LGS.BOLGELER = [
  "Marmara",
  "Ege",
  "Akdeniz",
  "İç Anadolu",
  "Karadeniz",
  "Güneydoğu Anadolu",
  "Doğu Anadolu",
];

/** İl adından ilçe listesini döndürür. */
LGS.ilceler = function (ilAdi) {
  const kayit = IL_ILCE_TUMU.find((x) => x.il === ilAdi);
  return kayit ? kayit.ilceler : [];
};

/** İl adından bölge adını döndürür. */
LGS.bolge = function (ilAdi) {
  const kayit = IL_ILCE_TUMU.find((x) => x.il === ilAdi);
  return kayit ? kayit.bolge : "";
};

/** Tüm il adları (alfabetik). */
LGS.iller = function () {
  return IL_ILCE_TUMU.map((x) => x.il).sort((a, b) => a.localeCompare(b, "tr"));
};
