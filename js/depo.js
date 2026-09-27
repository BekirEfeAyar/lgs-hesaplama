/* ==========================================================================
   Veri katmanı
   - Deneme kayıtları ve lise listesi: localStorage
   - Yanlış fotoğrafları: IndexedDB (localStorage 5 MB sınırına takılmaz)
   ========================================================================== */

(function (LGS) {
  "use strict";

  const A = LGS.ANAHTAR;

  /* ---------------------------------------------------------------- localStorage */

  function oku(anahtar, varsayilan) {
    try {
      const ham = localStorage.getItem(anahtar);
      if (ham === null) return varsayilan;
      return JSON.parse(ham);
    } catch (e) {
      console.warn("Okunamadı:", anahtar, e);
      return varsayilan;
    }
  }

  function yaz(anahtar, deger) {
    try {
      localStorage.setItem(anahtar, JSON.stringify(deger));
      return true;
    } catch (e) {
      console.error("Yazılamadı:", anahtar, e);
      return false;
    }
  }

  /** Yeni, çakışmayan id üretir. */
  function yeniId(onEk) {
    return (
      onEk + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
    );
  }

  /** Bugünün tarihi (YYYY-AA-GG). */
  function bugun() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  /* ---------------------------------------------------------------- denemeler */

  function denemeleriGetir() {
    const liste = oku(A.denemeler, []);
    return Array.isArray(liste) ? liste : [];
  }

  function denemeleriYaz(liste) {
    return yaz(A.denemeler, liste);
  }

  function bosDeneme() {
    const dersler = {};
    LGS.DERSLER.forEach((d) => (dersler[d.id] = { d: 0, y: 0 }));
    return {
      id: yeniId("d"),
      ad: "",
      tarih: bugun(),
      yayin: "",
      dersler: dersler,
      notlar: "",
      olusturma: Date.now(),
      guncelleme: Date.now(),
    };
  }

  function denemeGetir(id) {
    return denemeleriGetir().find((d) => d.id === id) || null;
  }

  function denemeKaydet(deneme) {
    const liste = denemeleriGetir();
    const i = liste.findIndex((d) => d.id === deneme.id);
    deneme.guncelleme = Date.now();
    if (i === -1) {
      deneme.olusturma = deneme.olusturma || Date.now();
      liste.unshift(deneme);
    } else {
      liste[i] = deneme;
    }
    liste.sort((a, b) => (a.tarih < b.tarih ? 1 : a.tarih > b.tarih ? -1 : b.olusturma - a.olusturma));
    return denemeleriYaz(liste);
  }

  function denemeSil(id) {
    const liste = denemeleriGetir().filter((d) => d.id !== id);
    denemeleriYaz(liste);
    // Fotoğrafları da temizle
    return fotoSilDeneme(id);
  }

  /* ---------------------------------------------------------------- IndexedDB */

  let dbPromise = null;

  function dbAc() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((coz, reddet) => {
      if (!window.indexedDB) return reddet(new Error("Tarayıcı IndexedDB desteklemiyor"));
      const istek = indexedDB.open(A.db, 1);
      istek.onupgradeneeded = () => {
        const db = istek.result;
        if (!db.objectStoreNames.contains("fotolar")) {
          const depo = db.createObjectStore("fotolar", { keyPath: "id" });
          depo.createIndex("denemeId", "denemeId", { unique: false });
        }
      };
      istek.onsuccess = () => coz(istek.result);
      istek.onerror = () => reddet(istek.error);
    });
    return dbPromise;
  }

  function tx(mod, islem) {
    return dbAc().then(
      (db) =>
        new Promise((coz, reddet) => {
          const t = db.transaction("fotolar", mod);
          const depo = t.objectStore("fotolar");
          let sonuc;
          try {
            sonuc = islem(depo);
          } catch (e) {
            reddet(e);
            return;
          }
          t.oncomplete = () => coz(sonuc && sonuc.result !== undefined ? sonuc.result : sonuc);
          t.onerror = () => reddet(t.error);
          t.onabort = () => reddet(t.error);
        })
    );
  }

  /** Fotoğrafı kaydeder. */
  function fotoEkle(denemeId, kayit) {
    const tam = {
      id: yeniId("f"),
      denemeId: denemeId,
      ad: kayit.ad || "Yanlışlar",
      tur: kayit.tur || "image/jpeg",
      boyut: kayit.boyut || 0,
      veri: kayit.veri,
      tarih: Date.now(),
    };
    return tx("readwrite", (depo) => depo.add(tam)).then(() => tam);
  }

  /** Bir denemenin fotoğraflarını listeler. */
  function fotoListele(denemeId) {
    return tx("readonly", (depo) => depo.index("denemeId").getAll(denemeId)).then(
      (liste) => (liste || []).sort((a, b) => a.tarih - b.tarih)
    );
  }

  function fotoSil(id) {
    return tx("readwrite", (depo) => depo.delete(id));
  }

  function fotoSilDeneme(denemeId) {
    return tx("readwrite", (depo) => {
      const dizin = depo.index("denemeId");
      const istek = dizin.openCursor(denemeId);
      istek.onsuccess = () => {
        const imlec = istek.result;
        if (imlec) {
          imlec.delete();
          imlec.continue();
        }
      };
    });
  }

  /* ---------------------------------------------------------- resim boyutlandırma */

  /**
   * Seçilen görseli tarayıcıda küçültüp JPEG data-URL'e çevirir.
   * Böylece telefon fotoğrafları (4-8 MB) depoda şişmez.
   */
  function resmiKucult(dosya) {
    return new Promise((coz, reddet) => {
      const okunan = new FileReader();
      okunan.onload = () => {
        const img = new Image();
        img.onload = () => {
          const kenar = LGS.FOTOGRAF.kenar;
          let g = img.width;
          let y = img.height;
          if (g > kenar || y > kenar) {
            const oran = Math.min(kenar / g, kenar / y);
            g = Math.round(g * oran);
            y = Math.round(y * oran);
          }
          const tuval = document.createElement("canvas");
          tuval.width = g;
          tuval.height = y;
          const c = tuval.getContext("2d");
          c.fillStyle = "#fff";
          c.fillRect(0, 0, g, y);
          c.drawImage(img, 0, 0, g, y);
          coz({
            veri: tuval.toDataURL("image/jpeg", LGS.FOTOGRAF.kalite),
            tur: "image/jpeg",
            boyut: Math.round((tuval.toDataURL("image/jpeg", LGS.FOTOGRAF.kalite).length * 3) / 4 / 1024),
            olcu: g + "×" + y,
          });
        };
        img.onerror = () => reddet(new Error("Resim açılamadı"));
        img.src = okunan.result;
      };
      okunan.onerror = () => reddet(new Error("Dosya okunamadı"));
      okunan.readAsDataURL(dosya);
    });
  }

  /* ---------------------------------------------------------------- lise listesi */

  function liseleriGetir() {
    const kayitli = oku(A.liseler, null);
    if (Array.isArray(kayitli)) return kayitli;
    // İlk açılış: örnek listeyi yükle
    const tohum = (typeof ORNEK_LISELER !== "undefined" ? ORNEK_LISELER : []).map((l) => ({
      id: yeniId("l"),
      ad: l.ad,
      sehir: l.sehir,
      ilce: l.ilce,
      tur: l.tur,
      taban: l.taban,
      dilim: l.dilim,
      resmi: false,
      not: "",
    }));
    yaz(A.liseler, tohum);
    return tohum;
  }

  function liseleriYaz(liste) {
    return yaz(A.liseler, liste);
  }

  function liseKaydet(lise) {
    const liste = liseleriGetir();
    if (!lise.id) lise.id = yeniId("l");
    const i = liste.findIndex((l) => l.id === lise.id);
    if (i === -1) liste.push(lise);
    else liste[i] = lise;
    return liseleriYaz(liste);
  }

  function liseSil(id) {
    return liseleriYaz(liseleriGetir().filter((l) => l.id !== id));
  }

  /* ---------------------------------------------------------------- ayarlar */

  function ayarlarGetir() {
    return Object.assign(
      { okulAdi: "", sinif: "8", hedefSehir: "", hedefPuan: 350, otoKaydet: true },
      oku(A.ayarlar, {})
    );
  }

  function ayarlarYaz(y) {
    return yaz(A.ayarlar, y);
  }

  /* ---------------------------------------------------------------- dışa/içe aktarma */

  async function yedekAl() {
    const fotolar = [];
    const tum = await tx("readonly", (depo) => depo.getAll());
    (tum || []).forEach((f) => fotolar.push(f));
    return {
      surum: LGS.SURUM,
      tarih: new Date().toISOString(),
      ayarlar: ayarlarGetir(),
      denemeler: denemeleriGetir(),
      liseler: liseleriGetir(),
      fotolar: fotolar,
    };
  }

  async function yedekYukle(veri) {
    if (!veri || typeof veri !== "object") throw new Error("Geçersiz yedek dosyası");
    if (Array.isArray(veri.ayarlar)) ayarlarYaz(Object.assign(ayarlarGetir(), veri.ayarlar[0]));
    else if (veri.ayarlar) ayarlarYaz(Object.assign(ayarlarGetir(), veri.ayarlar));
    if (Array.isArray(veri.denemeler)) denemeleriYaz(veri.denemeler);
    if (Array.isArray(veri.liseler)) liseleriYaz(veri.liseler);
    if (Array.isArray(veri.fotolar) && veri.fotolar.length) {
      await tx("readwrite", (depo) => {
        veri.fotolar.forEach((f) => depo.put(f));
      });
    }
  }

  function herSeyiSifirla() {
    [A.denemeler, A.liseler, A.ayarlar].forEach((k) => localStorage.removeItem(k));
    return tx("readwrite", (depo) => depo.clear());
  }

  /* ---------------------------------------------------------------- dışa aktar */

  function dosyaIndir(ad, icerik, tur) {
    const blob = new Blob([icerik], { type: tur || "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ad;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  LGS.depo = {
    // localStorage
    oku,
    yaz,
    yeniId,
    bugun,
    dosyaIndir,
    // deneme
    denemeleriGetir,
    denemeGetir,
    denemeKaydet,
    denemeSil,
    bosDeneme,
    // foto
    fotoEkle,
    fotoListele,
    fotoSil,
    fotoSilDeneme,
    resmiKucult,
    // lise
    liseleriGetir,
    liseKaydet,
    liseSil,
    // ayar
    ayarlarGetir,
    ayarlarYaz,
    // yedek
    yedekAl,
    yedekYukle,
    herSeyiSifirla,
  };
})(window.LGS);
