/* ==========================================================================
   LGS Deneme Takipçisi — ayarlar ve sabitler
   ========================================================================== */

const LGS = (window.LGS = window.LGS || {});

/** Sürüm: index.html'deki ?v= parametresi ile birlikte artırılır (önbellek için). */
LGS.SURUM = 2;

/** Resmî olmayan uyarı metni — tek yerden yönetilir. */
LGS.OTORITE = "MEB";

/**
 * Güncel LGS sınav yapısı (2019 sonrası).
 * 1. Oturum: Türkçe 40 + İnkılap 10 + Din 10 = 60 soru
 * 2. Oturum: Matematik 40 + Fen 30 + Sosyal 30 = 100 soru
 * Toplam 160 soru
 */
LGS.DERSLER = [
  { id: "turkce", ad: "Türkçe", kisa: "Türkçe", soru: 40, oturum: 1 },
  { id: "inkilap", ad: "T.C. İnkılap Tarihi ve Atatürkçülük", kisa: "İnkılap", soru: 10, oturum: 1 },
  { id: "din", ad: "Din Kültürü ve Ahlak Bilgisi", kisa: "Din Kült.", soru: 10, oturum: 1 },
  { id: "matematik", ad: "Matematik", kisa: "Matematik", soru: 40, oturum: 2 },
  { id: "fen", ad: "Fen Bilimleri", kisa: "Fen", soru: 30, oturum: 2 },
  { id: "sosyal", ad: "Sosyal Bilgiler", kisa: "Sosyal", soru: 30, oturum: 2 },
];

/** Bir yanlış, kaç doğruyu götürür? (Net = Doğru − Yanlış / 3) */
LGS.YANLIS_ETKI = 3;

/** LGS puan üst sınırı. */
LGS.MAX_PUAN = 500;

/** Lise türleri. */
LGS.LISE_TURLERI = [
  { id: "fen", ad: "Fen Lisesi" },
  { id: "mtal", ad: "MTAL" },
  { id: "proje", ad: "Proje Okulu" },
  { id: "sosyal", ad: "Sosyal Bilimler" },
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
