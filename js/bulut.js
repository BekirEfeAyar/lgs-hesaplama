/* ==========================================================================
   Bulut katmanı (Firebase: Auth + Firestore + Storage)
   --------------------------------------------------------------------------
   - BULUT_AYAR.kullan false ise tüm fonksiyonlar etkisizdir; site
     tamamen yerel çalışır (eski davranış, testler bunu doğrular).
   - Giriş yapılınca yerel kayıtlar bulutla BİRLEŞTİRİLİR (yenisi kazanır).
   - Her yerel yazma, girişteyken buluta da yansır (arka planda).
   - Silinenler "mezar taşı" listesinde tutulur, eşitlemede buluttan silinir.
   - Moderatör: herkesin karnesini OKUR (kurallar yazmayı yasaklar).
   ========================================================================== */

(function (LGS) {
  "use strict";

  const SDK = [
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js",
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js",
  ];

  let app = null;
  let auth = null;
  let db = null;
  let baslatildi = false;
  let baslatiliyor = null;
  let suAnki = null; // { uid, eposta }

  /* ------------------------------------------------------------ yardımcı */

  function ayar() {
    if (typeof BULUT_AYAR === "undefined") return null;
    if (!BULUT_AYAR.kullan) return null;
    const f = BULUT_AYAR.firebase || {};
    if (!f.apiKey || !f.projectId) return null;
    return BULUT_AYAR;
  }

  /** Bulut yapılandırılmış mı? (SDK yüklü olmasa da true dönebilir.) */
  function kurulu() {
    return !!ayar();
  }

  /** SDK yüklü ve hazır mı? */
  function acik() {
    return baslatildi && !!auth;
  }

  function girisVar() {
    return !!(suAnki && suAnki.uid);
  }

  function ben() {
    return suAnki;
  }

  function moderatorMu(eposta) {
    // E-postada locale'li küçültme YAPILMAZ (tr'de I→ı olur, eşleşme bozulur)
    const e = (eposta || (suAnki && suAnki.eposta) || "").toLowerCase();
    if (!e || typeof BULUT_AYAR === "undefined" || !Array.isArray(BULUT_AYAR.moderatorEpostalar)) return false;
    return BULUT_AYAR.moderatorEpostalar.some((m) => String(m).toLowerCase() === e);
  }

  function scriptYukle(src) {
    return new Promise((coz, reddet) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = coz;
      s.onerror = () => reddet(new Error("SDK yüklenemedi: " + src));
      document.head.appendChild(s);
    });
  }

  /* ------------------------------------------------------------ başlatma */

  function baslat() {
    if (baslatiliyor) return baslatiliyor;
    baslatiliyor = (async () => {
      if (!ayar() || typeof document === "undefined") return false;
      try {
        for (const src of SDK) {
          // eslint-disable-next-line no-undef
          if (typeof firebase !== "undefined" && firebase.apps && firebase.apps.length) break;
          await scriptYukle(src);
        }
        // eslint-disable-next-line no-undef
        if (typeof firebase === "undefined") return false;
        // eslint-disable-next-line no-undef
        app = firebase.apps.length ? firebase.app() : firebase.initializeApp(ayar().firebase);
        // eslint-disable-next-line no-undef
        auth = firebase.auth();
        // eslint-disable-next-line no-undef
        db = firebase.firestore();
        baslatildi = true;
        // İnternet gelince bekleyen işleri sessizce eşitle
        if (typeof window !== "undefined" && window.addEventListener) {
          window.addEventListener("online", () => {
            if (girisVar()) esitle().catch(() => {});
          });
        }
        let ilkOlay = true;
        auth.onAuthStateChanged(async (k) => {
          suAnki = k ? { uid: k.uid, eposta: k.email || "", ad: k.displayName || "" } : null;
          if (suAnki) {
            try {
              await profilYaz();
            } catch (e) {
              console.warn("Profil yazılamadı:", e);
            }
            // Uygulama açılışında kalan oturum varsa sessizce eşitle.
            // (Kayıt/giriş zaten açıkça eşitler; kilit sayesinde çakışmaz.)
            if (ilkOlay) esitle().catch(() => {});
          }
          ilkOlay = false;
          if (LGS.uygulama) LGS.uygulama.ciz();
        });
        return true;
      } catch (e) {
        console.warn("Bulut başlatılamadı, yerel kipte devam:", e);
        return false;
      }
    })();
    return baslatiliyor;
  }

  /* ------------------------------------------------------------ hesap */

  async function kayitOl(eposta, sifre, ad) {
    const k = await auth.createUserWithEmailAndPassword(eposta.trim(), sifre);
    const isim = (ad || "").trim();
    if (isim) {
      try {
        await k.user.updateProfile({ displayName: isim });
      } catch (e) {
        console.warn("Görünen ad yazılamadı:", e);
      }
    }
    suAnki = { uid: k.user.uid, eposta: k.user.email || "", ad: isim };
    await profilYaz();
    await esitle();
    return { ...suAnki };
  }

  async function giris(eposta, sifre) {
    const k = await auth.signInWithEmailAndPassword(eposta.trim(), sifre);
    suAnki = { uid: k.user.uid, eposta: k.user.email || "", ad: k.user.displayName || "" };
    await profilYaz();
    await esitle();
    return { ...suAnki };
  }

  async function cikis() {
    await auth.signOut();
    suAnki = null;
  }

  async function sifreSifirla(eposta) {
    await auth.sendPasswordResetEmail(eposta.trim());
  }

  async function profilYaz() {
    if (!suAnki) return;
    const veri = { eposta: suAnki.eposta, olusturma: Date.now() };
    // Görünen adı boşsa mevcut kaydı ezme
    if (suAnki.ad) veri.ad = suAnki.ad;
    await db.collection("kullanicilar").doc(suAnki.uid).set(veri, { merge: true });
  }

  /** Görünen hesap ismini günceller (Auth profili + Firestore). */
  async function adGuncelle(ad) {
    const isim = (ad || "").trim();
    if (!isim) throw new Error("İsim boş olamaz");
    if (isim.length > 40) throw new Error("İsim en fazla 40 karakter olabilir");
    await auth.currentUser.updateProfile({ displayName: isim });
    suAnki.ad = isim;
    await profilYaz();
    return isim;
  }

  /* ------------------------------------------------------------ mezar taşı */

  const MEZAR = "lgs.silinen.v1";

  function mezarOku() {
    try {
      const ham = typeof localStorage !== "undefined" ? localStorage.getItem(MEZAR) : null;
      const v = ham ? JSON.parse(ham) : null;
      return { denemeler: (v && v.denemeler) || [], fotograflar: (v && v.fotograflar) || [] };
    } catch (e) {
      return { denemeler: [], fotograflar: [] };
    }
  }

  function mezarYaz(v) {
    try {
      if (typeof localStorage !== "undefined") localStorage.setItem(MEZAR, JSON.stringify(v));
    } catch (e) {
      /* yoksay */
    }
  }

  function mezarEkle(tur, id) {
    const m = mezarOku();
    m[tur].push({ id: id, tarih: Date.now() });
    mezarYaz(m);
  }

  function mezarTemizle() {
    mezarYaz({ denemeler: [], fotograflar: [] });
  }

  /* ------------------------------------------------------------ birleştirme */

  /**
   * İki deneme listesini id'ye göre birleştirir; çakışmada
   * guncelleme zamanı yeni olan kazanır. Saf fonksiyondur (test edilir).
   */
  function birlestirDeneme(yerel, bulut) {
    const harita = new Map();
    (yerel || []).forEach((d) => harita.set(d.id, { kayit: d, kaynak: "yerel" }));
    (bulut || []).forEach((d) => {
      const eski = harita.get(d.id);
      if (!eski) {
        harita.set(d.id, { kayit: d, kaynak: "bulut" });
      } else {
        const yTarih = eski.kayit.guncelleme || eski.kayit.olusturma || 0;
        const bTarih = d.guncelleme || d.olusturma || 0;
        if (bTarih > yTarih) harita.set(d.id, { kayit: d, kaynak: "bulut" });
      }
    });
    return [...harita.values()].map((v) => v.kayit);
  }

  /* ------------------------------------------------------------ deneme eşitleme */

  function temizDeneme(d) {
    // Firestore'a Firestore'a özel alanlar gitmesin diye sadeleştir
    const kopya = JSON.parse(JSON.stringify(d));
    delete kopya._bulut;
    return kopya;
  }

  async function denemeYukle(d) {
    if (!girisVar()) return false;
    const veri = temizDeneme(d);
    veri.sahip = suAnki.uid;
    veri.eposta = suAnki.eposta;
    veri.guncelleme = veri.guncelleme || Date.now();
    await db.collection("denemeler").doc(d.id).set(veri);
    return true;
  }

  /** Arka plan yükleme: hata verirse sessizce günlüğe düşer, akışı bozmaz. */
  function denemeYukleArkaPlan(d) {
    if (!acik() || !girisVar()) return;
    denemeYukle(d).catch((e) => console.warn("Buluta yazılamadı:", e && e.message));
  }

  async function denemelerim() {
    const snap = await db.collection("denemeler").where("sahip", "==", suAnki.uid).get();
    return snap.docs.map((x) => x.data());
  }

  async function denemeSilBulut(id) {
    // Fotoğraf belgelerini de temizle
    const fSnap = await db.collection("fotograflar").where("sahip", "==", suAnki.uid).where("denemeId", "==", id).get();
    for (const doc of fSnap.docs) {
      await doc.ref.delete();
    }
    await db.collection("denemeler").doc(id).delete();
  }

  function denemeSilArkaPlan(id) {
    mezarEkle("denemeler", id);
    if (!acik() || !girisVar()) return;
    denemeSilBulut(id)
      .then(() => {
        const m = mezarOku();
        m.denemeler = m.denemeler.filter((x) => x.id !== id);
        mezarYaz(m);
      })
      .catch((e) => console.warn("Buluttan silinemedi (sonra tekrar denenecek):", e && e.message));
  }

  /* ------------------------------------------------------------ fotoğraf */

  async function fotoYukle(denemeId, kayit) {
    // kayit: { id?, ad, veri(dataURL), boyut }
    // Fotoğraf baytı doğrudan belgeye yazılır (1400px JPEG ~100-300KB,
    // Firestore belge limiti 1MB — güvenli aralıkta).
    const fotoId = kayit.id || LGS.depo.yeniId("f");
    const belge = {
      id: fotoId,
      denemeId: denemeId,
      sahip: suAnki.uid,
      ad: kayit.ad || "Yanlışlar",
      boyut: kayit.boyut || 0,
      veri: kayit.veri,
      tarih: Date.now(),
    };
    await db.collection("fotograflar").doc(fotoId).set(belge);
    return belge;
  }

  function fotoYukleArkaPlan(denemeId, kayit) {
    if (!acik() || !girisVar()) return;
    fotoYukle(denemeId, kayit).catch((e) => console.warn("Fotoğraf buluta yüklenemedi:", e && e.message));
  }

  async function fotoSilBulut(fotoId) {
    await db.collection("fotograflar").doc(fotoId).delete();
  }

  function fotoSilArkaPlan(fotoId) {
    mezarEkle("fotograflar", fotoId);
    if (!acik() || !girisVar()) return;
    fotoSilBulut(fotoId)
      .then(() => {
        const m = mezarOku();
        m.fotograflar = m.fotograflar.filter((x) => x.id !== fotoId);
        mezarYaz(m);
      })
      .catch((e) => console.warn("Fotoğraf buluttan silinemedi:", e && e.message));
  }

  async function fotoBelgelerim(denemeId) {
    let sorgu = db.collection("fotograflar").where("sahip", "==", suAnki.uid);
    if (denemeId) sorgu = sorgu.where("denemeId", "==", denemeId);
    const snap = await sorgu.get();
    return snap.docs.map((x) => x.data());
  }

  /* ------------------------------------------------------------ eşitleme */

  // Aynı anda tek eşitleme çalışır; çakışan çağrılar aynı söze bağlanır.
  let esitleSoz = null;

  function esitle() {
    if (esitleSoz) return esitleSoz;
    esitleSoz = esitleGovde().finally(() => {
      esitleSoz = null;
    });
    return esitleSoz;
  }

  async function esitleGovde() {
    if (!acik() || !girisVar()) return { yapildi: false, neden: "giris-yok" };
    const D = LGS.depo;
    const ozet = { yuklenenDeneme: 0, indirilenDeneme: 0, yuklenenFoto: 0, indirilenFoto: 0, silinen: 0 };

    // 1) Mezar taşları: buluttan sil
    const mezar = mezarOku();
    for (const s of mezar.denemeler) {
      try {
        await denemeSilBulut(s.id);
        ozet.silinen++;
      } catch (e) {
        console.warn("Eşitleme: deneme silinemedi", s.id);
      }
    }
    for (const s of mezar.fotograflar) {
      try {
        await fotoSilBulut(s.id);
        ozet.silinen++;
      } catch (e) {
        console.warn("Eşitleme: fotoğraf silinemedi", s.id);
      }
    }
    mezarTemizle();

    // 2) Çek: bulut denemeleri + fotoğraf belgeleri
    const bulutDenemeler = await denemelerim();
    const bulutFotolar = await fotoBelgelerim(null);
    const silinenId = new Set();
    mezarOku().denemeler.forEach((s) => silinenId.add(s.id));

    // 3) Birleştir (yenisi kazanır), yerele yaz
    const yerel = D.denemeleriGetir();
    const birlesik = birlestirDeneme(yerel, bulutDenemeler).filter((d) => !silinenId.has(d.id));
    D.denemeleriYaz(birlesik);

    // 4) Bulutta eksik/eskileri yükle
    const bulutHarita = new Map(bulutDenemeler.map((d) => [d.id, d]));
    for (const d of birlesik) {
      const b = bulutHarita.get(d.id);
      const bTarih = (b && (b.guncelleme || b.olusturma)) || 0;
      const yTarih = d.guncelleme || d.olusturma || 0;
      if (!b || yTarih > bTarih) {
        await denemeYukle(d);
        ozet.yuklenenDeneme++;
      } else {
        ozet.indirilenDeneme++;
      }
    }

    // 5) Fotoğraflar: bulutta olup yerelde olmayanı indir (veri belgede)
    const bulutFotoHarita = new Map(bulutFotolar.map((f) => [f.id, f]));
    for (const f of bulutFotolar) {
      const yerelde = await D.fotoGetir(f.id);
      if (!yerelde && f.veri && f.veri.startsWith("data:")) {
        try {
          await D.fotoKoy({ id: f.id, denemeId: f.denemeId, ad: f.ad, tur: "image/jpeg", boyut: f.boyut || 0, veri: f.veri, tarih: f.tarih || Date.now() });
          ozet.indirilenFoto++;
        } catch (e) {
          console.warn("Fotoğraf indirilemedi:", f.id);
        }
      }
    }

    // 6) Yerelde olup bulutta olmayanı yükle
    for (const d of birlesik) {
      const yereller = await D.fotoListele(d.id);
      for (const f of yereller) {
        if (!bulutFotoHarita.has(f.id) && f.veri && f.veri.startsWith("data:")) {
          try {
            await fotoYukle(d.id, f);
            ozet.yuklenenFoto++;
          } catch (e) {
            console.warn("Fotoğraf yüklenemedi:", f.id);
          }
        }
      }
    }

    return { yapildi: true, ...ozet };
  }

  /* ------------------------------------------------------------ moderatör */

  async function kullanicilariGetir() {
    const snap = await db.collection("kullanicilar").orderBy("eposta").get();
    return snap.docs.map((x) => ({ uid: x.id, ...x.data() }));
  }

  async function kullaniciDenemeleri(uid) {
    const snap = await db.collection("denemeler").where("sahip", "==", uid).get();
    const liste = snap.docs.map((x) => x.data());
    liste.sort((a, b) => (a.tarih < b.tarih ? 1 : -1));
    return liste;
  }

  async function kullaniciFotolari(uid, denemeId) {
    let sorgu = db.collection("fotograflar").where("sahip", "==", uid);
    if (denemeId) sorgu = sorgu.where("denemeId", "==", denemeId);
    const snap = await sorgu.get();
    // Fotoğraf baytı belgenin "veri" alanında (dataURL); ayrıca url de ata
    const liste = snap.docs.map((doc) => {
      const v = doc.data();
      v.url = v.veri && v.veri.startsWith("data:") ? v.veri : null;
      return v;
    });
    liste.sort((a, b) => (a.tarih || 0) - (b.tarih || 0));
    return liste;
  }

  LGS.bulut = {
    kurulu,
    acik,
    girisVar,
    ben,
    moderatorMu,
    baslat,
    kayitOl,
    giris,
    cikis,
    sifreSifirla,
    adGuncelle,
    esitle,
    birlestirDeneme,
    denemeYukle,
    denemeSilBulut,
    denemeYukleArkaPlan,
    denemeSilArkaPlan,
    fotoYukle,
    fotoSilBulut,
    fotoYukleArkaPlan,
    fotoSilArkaPlan,
    kullanicilariGetir,
    kullaniciDenemeleri,
    kullaniciFotolari,
  };
})(window.LGS);
