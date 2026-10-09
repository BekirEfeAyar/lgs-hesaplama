/* ==========================================================================
   Lise Rehberi ekranı
   - 81 il / 973 ilçe filtresi (veri/il-ilce.js)
   - Puanına göre yerleşebileceğin liseler
   - Arama, sıralama, tür filtresi
   ========================================================================== */

(function (LGS) {
  "use strict";

  const { el, bildir, puanBicim, puanSinif, turAd } = LGS.arayuz;
  const D = LGS.depo;

  // Ekran ölçekleri — sekme değişince korunur
  let durum = {
    puan: 350,
    bolge: "",
    sehir: "",
    ilce: "",
    tur: "",
    arama: "",
    siralama: "taban-desc",
    sadeceYerlesir: false,
  };

  /** Listede kaç kayıt gösteriliyor (sayfalama). */
  let gosterilen = 100;
  const SAYFA_BOYUTU = 100;

  function ciz(kap) {
    const ayarlar = D.ayarlarGetir();
    if (!durum.puan) durum.puan = ayarlar.hedefPuan || 350;
    kap.appendChild(puanKutusu());
    kap.appendChild(
      el(
        "div",
        { class: "uyari-kutu" },
        el("strong", { text: "2025 taban puanları. " }),
        "Bu liste 2025 ilk yerleştirme sonuçlarına dayanır (taban: unsalim.com rehberi; yüzdelik dilim: tabanpuanlari.net, taban eşleşmesiyle doğrulandı). 2026 puanları henüz açıklanmadı. Tercih yaparken MEB'in güncel duyurularını teyit et."
      )
    );
    kap.appendChild(filtreler());
    kap.appendChild(sonuclar());
  }

  /* ---------------------------------------------------------------- puan kutusu */

  function puanKutusu() {
    const ayarlar = D.ayarlarGetir();
    const ozet = LGS.puan.ozet(D.denemeleriGetir());

    const kart = el("div", { class: "kart puan-kutusu" });
    kart.appendChild(el("div", { class: "kart-bas", text: "Hangi puanı hedefliyorsun?" }));

    const satir = el("div", { class: "puan-satir" });
    const sayi = el("input", {
      type: "number", min: "0", max: String(LGS.MAX_PUAN), step: "0.1",
      value: String(durum.puan), class: "puan-giris", id: "puan-giris",
    });
    const kaydirici = el("input", {
      type: "range", min: "0", max: String(LGS.MAX_PUAN), step: "1",
      value: String(Math.round(durum.puan)), class: "puan-kaydirici", id: "puan-kaydirici",
    });

    sayi.addEventListener("input", () => {
      durum.puan = Math.max(0, Math.min(LGS.MAX_PUAN, Number(sayi.value) || 0));
      goster();
    });
    kaydirici.addEventListener("input", () => {
      durum.puan = Number(kaydirici.value);
      sayi.value = durum.puan;
      goster();
    });
    satir.appendChild(el("div", { class: "puan-girdi" }, sayi, el("span", { class: "puan-birim", text: "/ " + LGS.MAX_PUAN })));
    satir.appendChild(el("div", { class: "puan-araligi" }, kaydirici));
    kart.appendChild(satir);

    const hizli = el("div", { class: "hizli-butonlar" });
    [
      { etiket: "Hedefim", puan: ayarlar.hedefPuan || 350 },
      { etiket: "Son denemem", puan: ozet.sonPuan },
      { etiket: "Ortalamam", puan: ozet.adet ? ozet.ortalama : null },
    ].forEach((h) => {
      if (h.puan === null || h.puan === undefined) return;
      hizli.appendChild(
        el("button", {
          class: "btn kucuk" + (Math.round(h.puan) === Math.round(durum.puan) ? " birincil" : " hayalet"),
          text: h.etiket + " (" + puanBicim(h.puan) + ")",
          onClick: () => {
            durum.puan = h.puan;
            sayi.value = h.puan;
            kaydirici.value = Math.round(h.puan);
            goster();
          },
        })
      );
    });
    kart.appendChild(hizli);
    return kart;
  }

  /* ---------------------------------------------------------------- filtreler */

  function filtreler() {
    const liseler = D.liseleriGetir();
    const kart = el("div", { class: "kart filtre-kart" });
    const izgara = el("div", { class: "filtre-izgara" });

    // Bölge
    const bolgeler = [...new Set(IL_ILCE_TUMU.map((x) => x.bolge).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "tr")
    );
    izgara.appendChild(
      secici("Bölge", bolgeler, durum.bolge, (v) => {
        durum.bolge = v;
        durum.sehir = "";
        durum.ilce = "";
        yenidenCiz();
      }, "Tüm bölgeler")
    );

    // İl — kaç lise kaydı olduğunu gösterek
    const sayac = {};
    liseler.forEach((l) => (sayac[l.sehir] = (sayac[l.sehir] || 0) + 1));
    const ilAdlari = [...new Set(IL_ILCE_TUMU.map((x) => x.il))].sort((a, b) => a.localeCompare(b, "tr"));
    const secenekler = ilAdlari.map((ad) => ({ ad, sayi: sayac[ad] || 0 }));
    secenekler.sort((a, b) => b.sayi - a.sayi || a.ad.localeCompare(b.ad, "tr"));

    const ilSec = el("select", { class: "secim" });
    ilSec.appendChild(el("option", { value: "", text: "Tüm 81 il" }));
    secenekler.forEach((o) => {
      const metin = o.sayi ? o.ad + " (" + o.sayi + ")" : o.ad + " — veri yok";
      ilSec.appendChild(el("option", { value: o.ad, text: metin, selected: o.ad === durum.sehir }));
    });
    ilSec.addEventListener("change", () => {
      durum.sehir = ilSec.value;
      durum.ilce = "";
      yenidenCiz();
    });
    izgara.appendChild(el("label", { class: "alan" }, el("span", { class: "alan-etiket", text: "İl" }), ilSec));

    // İlçe — seçilen ilin TÜM ilçeleri
    const ilceKaynak = durum.sehir
      ? LGS.ilceler(durum.sehir)
      : [...new Set(liseler.map((l) => l.ilce))].sort((a, b) => a.localeCompare(b, "tr"));
    izgara.appendChild(secici("İlçe", ilceKaynak, durum.ilce, (v) => {
      durum.ilce = v;
      yenidenCiz();
    }, durum.sehir ? "Tüm ilçeler (" + ilceKaynak.length + ")" : "Önce il seç"));

    // Tür
    izgara.appendChild(
      secici("Tür", LGS.LISE_TURLERI.map((t) => t.ad), (LGS.LISE_TURLERI.find((t) => t.id === durum.tur) || {}).ad || "", (v) => {
        durum.tur = (LGS.LISE_TURLERI.find((t) => t.ad === v) || {}).id || "";
        yenidenCiz();
      }, "Tüm türler")
    );

    // Arama
    const arama = el("input", { type: "search", value: durum.arama, placeholder: "Lise adı ara…", class: "arama" });
    arama.addEventListener("input", () => {
      durum.arama = arama.value;
      gosterilen = SAYFA_BOYUTU;
      goster();
    });
    izgara.appendChild(el("label", { class: "alan" }, el("span", { class: "alan-etiket", text: "Ara" }), arama));

    kart.appendChild(izgara);

    /* ---- alt satır ---- */
    const satirlar = el("div", { class: "filtre-alt" });

    const siralama = el("select", { class: "secim" });
    [
      { v: "taban-desc", ad: "Taban puana göre (yüksek → düşük)" },
      { v: "taban-asc", ad: "Taban puana göre (düşük → yüksek)" },
      { v: "sehir", ad: "Şehre göre (A → Z)" },
      { v: "ilce", ad: "İlçeye göre (A → Z)" },
      { v: "ad", ad: "Lise adına göre (A → Z)" },
    ].forEach((s) => siralama.appendChild(el("option", { value: s.v, text: s.ad, selected: durum.siralama === s.v })));
    siralama.addEventListener("change", () => {
      durum.siralama = siralama.value;
      gosterilen = SAYFA_BOYUTU;
      goster();
    });
    satirlar.appendChild(el("label", { class: "alan dar" }, el("span", { class: "alan-etiket", text: "Sıralama" }), siralama));

    const onay = el(
      "label",
      { class: "anahtar" },
      el("input", { type: "checkbox", checked: durum.sadeceYerlesir }),
      el("span", { class: "anahtar-govde" }),
      el("span", { class: "anahtar-etiket", text: "Sadece puanıma yeten liseleri göster" })
    );
    onay.querySelector("input").addEventListener("change", (ev) => {
      durum.sadeceYerlesir = ev.target.checked;
      goster();
    });
    satirlar.appendChild(onay);

    // "Filtreleri temizle" her zaman DOM'da durur; görünürlüğü güncellenir.
    // Böylece arama kutusuna yazarken odak kaybolmaz, filtre kartı yeniden kurulmaz.
    const temizleBtn = el("button", {
      class: "btn kucuk hayalet",
      id: "filtre-temizle",
      text: "Filtreleri temizle",
      onClick: () => {
        durum.bolge = "";
        durum.sehir = "";
        durum.ilce = "";
        durum.tur = "";
        durum.arama = "";
        durum.sadeceYerlesir = false;
        yenidenCiz();
      },
    });
    satirlar.appendChild(temizleBtn);
    kart.appendChild(satirlar);
    temizleBtn.hidden = !(
      durum.bolge || durum.sehir || durum.ilce || durum.tur || durum.arama || durum.sadeceYerlesir
    );
    return kart;
  }

  function secici(etiket, secenekler, secili, degisim, bosMetin) {
    const s = el("select", { class: "secim" });
    s.appendChild(el("option", { value: "", text: bosMetin }));
    secenekler.forEach((o) => s.appendChild(el("option", { value: o, text: o, selected: o === secili })));
    s.addEventListener("change", () => degisim(s.value));
    return el("label", { class: "alan" }, el("span", { class: "alan-etiket", text: etiket }), s);
  }

  /* ---------------------------------------------------------------- sonuçlar */

  /** Kaydırma / filtreleme sırasında yalnızca sonuç alanını yeniler. */
  function goster() {
    // Filtre kartındaki "temizle" butonunun görünürlüğünü güncelle
    const temizle = document.getElementById("filtre-temizle");
    if (temizle) {
      const aktif = !!(durum.bolge || durum.sehir || durum.ilce || durum.tur || durum.arama || durum.sadeceYerlesir);
      temizle.hidden = !aktif;
    }
    const kap = document.getElementById("sonuc-alan");
    if (!kap) return;
    kap.innerHTML = "";
    kap.appendChild(sonuclar());
  }

  /** Filtre değiştiğinde liste başa döner. */
  function yenidenCiz() {
    gosterilen = SAYFA_BOYUTU;
    LGS.uygulama.ciz();
  }

  /**
   * Dışarıdan (örn. deneme kartı) verilen puanla Lise Rehberi'ni açar.
   * Sayfalama sıfırlanır, kullanıcıya hangi puana bakıldığı söylenir.
   */
  function puanaGit(puan, etiket) {
    durum.puan = Math.max(0, Math.min(LGS.MAX_PUAN, Number(puan) || 0));
    gosterilen = SAYFA_BOYUTU;
    LGS.uygulama.sayfayaGit("lise");
    bildir((etiket || "Deneme") + " puanı (" + puanBicim(durum.puan) + ") ile girilebilen liseler");
  }

  function sonuclar() {
    const kap = el("div", { id: "sonuc-alan" });
    const tumu = D.liseleriGetir();

    let liste = tumu.filter((l) => {
      if (durum.sehir && l.sehir !== durum.sehir) return false;
      if (durum.ilce && l.ilce !== durum.ilce) return false;
      if (durum.bolge && LGS.bolge(l.sehir) !== durum.bolge) return false;
      if (durum.tur && l.tur !== durum.tur) return false;
      if (durum.arama) {
        const q = durum.arama.toLocaleLowerCase("tr");
        if (!(l.ad + " " + l.sehir + " " + l.ilce).toLocaleLowerCase("tr").includes(q)) return false;
      }
      return true;
    });

    const yerlesir = liste.filter((l) => l.taban !== null && l.taban !== undefined && durum.puan >= l.taban);
    if (durum.sadeceYerlesir) liste = yerlesir;
    liste.sort(sirala);

    kap.appendChild(
      el(
        "div",
        { class: "bolum-baslik" },
        durum.sadeceYerlesir ? "Puanına yeten liseler" : "Lise listesi",
        el("span", { class: "sayac", text: liste.length })
      )
    );

    if (!durum.sadeceYerlesir) {
      kap.appendChild(
        el(
          "div",
          { class: "ozet-serit" },
          ozetKutu("Puanın", puanBicim(durum.puan), puanSinif(durum.puan)),
          ozetKutu("Yeten lise", String(yerlesir.length), "iyi"),
          ozetKutu("En yakın hedef", enYakin(tumu, durum.puan)),
          ozetKutu("Listelenen", String(liste.length))
        )
      );
    }

    if (!liste.length) {
      kap.appendChild(veriYokEkrani());
      return kap;
    }

    const tablo = el("div", { class: "lise-tablo" });
    tablo.appendChild(
      el("div", { class: "lise-bas" },
        el("span", { text: "Lise" }),
        el("span", { text: "İlçe" }),
        el("span", { text: "Taban" }),
        el("span", { text: "Durum" })
      )
    );
    // Sayfalama: ilk 100 kayıt, gerisi butonla
    const gosterilecek = liste.slice(0, gosterilen);
    gosterilecek.forEach((l) => tablo.appendChild(liseSatiri(l)));
    kap.appendChild(tablo);

    if (liste.length > gosterilen) {
      const kalan = liste.length - gosterilen;
      kap.appendChild(
        el(
          "button",
          {
            class: "btn hayalet genis",
            id: "daha-fazla",
            style: { marginTop: "10px" },
            onClick: () => {
              gosterilen += SAYFA_BOYUTU;
              goster();
              // Butonun yerine kaydırma yapma, kullanıcı kaldığı yerden devam eder
            },
          },
          "Daha fazla göster (" + kalan + " kayıt kaldı)"
        )
      );
    } else if (liste.length > SAYFA_BOYUTU) {
      kap.appendChild(
        el("p", { class: "ipucu ortalı", style: { marginTop: "10px" }, text: "Tüm " + liste.length + " kayıt gösteriliyor." })
      );
    }
    return kap;
  }

  function veriYokEkrani() {
    const kutu = el("div", { class: "bos" });
    kutu.appendChild(el("div", { class: "bos-ikon", text: "📋" }));

    if (durum.arama) {
      kutu.appendChild(el("h3", { text: "Sonuç bulunamadı" }));
      kutu.appendChild(el("p", { text: '"' + durum.arama + '" için lise kaydı yok. Filtreleri gevşetmeyi dene.' }));
      return kutu;
    }

    kutu.appendChild(el("h3", { text: "Bu filtrede lise bulunamadı" }));
    kutu.appendChild(
      el("p", {
        text: "Filtreleri gevşetmeyi ya da Veriler sekmesinden yeni lise eklemeyi dene.",
      })
    );
    kutu.appendChild(
      el("button", {
        class: "btn birincil",
        text: "Lise listesine git ve veri ekle",
        onClick: () => LGS.uygulama.sayfayaGit("veriler"),
      })
    );
    return kutu;
  }

  function ozetKutu(etiket, deger, sinif) {
    return el("div", { class: "ozet-kutu" }, el("span", { text: etiket }), el("strong", { class: sinif || "", text: deger }));
  }

  function enYakin(liseler, puan) {
    if (!liseler.length) return "—";
    const uygun = liseler
      .filter((l) => l.taban !== null && l.taban !== undefined && l.taban > puan)
      .sort((a, b) => a.taban - b.taban)[0];
    if (!uygun) return "Hepsi yeter";
    return "+" + (uygun.taban - puan).toFixed(1).replace(".", ",") + " puan";
  }

  function tabanDeger(l) {
    // Tabanı olmayanın sıralama değeri -1: her yönde en sonda
    if (l.taban === null || l.taban === undefined) return -1;
    return l.taban;
  }

  function sirala(a, b) {
    switch (durum.siralama) {
      case "taban-asc": {
        const ta = tabanDeger(a);
        const tb = tabanDeger(b);
        if (ta === -1 && tb === -1) return 0;
        if (ta === -1) return 1;
        if (tb === -1) return -1;
        return ta - tb;
      }
      case "sehir":
        return a.sehir.localeCompare(b.sehir, "tr") || a.ilce.localeCompare(b.ilce, "tr") || tabanDeger(b) - tabanDeger(a);
      case "ilce":
        return a.ilce.localeCompare(b.ilce, "tr") || tabanDeger(b) - tabanDeger(a);
      case "ad":
        return a.ad.localeCompare(b.ad, "tr");
      default: {
        const ta = tabanDeger(a);
        const tb = tabanDeger(b);
        if (ta === -1 && tb === -1) return 0;
        if (ta === -1) return 1;
        if (tb === -1) return -1;
        return tb - ta;
      }
    }
  }

  /** Kaynak etiketi: resmî (kullanıcı) / 2025 listesi / örnek. */
  function kaynakEtiket(l) {
    if (l.resmi) return null;
    if (l.kaynak === "unsalim2025")
      return el("em", { class: "kaynak", text: "2025", title: "2025 taban puanı (unsalim.com rehberi, MEB verilerine dayanır)" });
    return el("em", { class: "tahmini", text: "örnek veri", title: "Resmî olmayan örnek değer" });
  }

  function liseSatiri(l) {
    const tabanYok = l.taban === null || l.taban === undefined;
    const yeter = !tabanYok && durum.puan >= l.taban;
    const fark = tabanYok ? 0 : l.taban - durum.puan;
    return el(
      "div",
      { class: "lise-satir " + (tabanYok ? "bilinmiyor" : yeter ? "yeter" : "yetersiz") },
      el(
        "div",
        { class: "lise-ad" },
        el("strong", { text: l.ad }),
        el(
          "span",
          { class: "lise-etiketler" },
          el("em", { class: "tur", text: turAd(l.tur) }),
          el("em", { class: "sehir", text: l.sehir }),
          l.alan ? el("em", { class: "alan", text: l.alan, title: "Alan / dal" }) : null,
          kaynakEtiket(l)
        )
      ),
      el("div", { class: "lise-ilce", text: l.ilce }),
      el(
        "div",
        { class: "lise-taban" },
        tabanYok ? el("strong", { class: "yok", text: "—" }) : el("strong", { text: puanBicim(l.taban) }),
        !tabanYok && l.dilim ? el("span", { class: "dilim", text: "%" + String(l.dilim).replace(".", ","), title: "2025 yüzdelik dilimi" }) : null,
        !tabanYok && l.taban2024 ? el("span", { class: "gecmis", text: "2024: " + puanBicim(l.taban2024), title: "2024 taban puanı" }) : null
      ),
      tabanYok
        ? el("div", { class: "lise-durum notr", text: "puan yok", title: "Bu programın 2025 taban puanı oluşmadı" })
        : el("div", { class: "lise-durum " + (yeter ? "tamam" : "eksik") }, yeter ? "Yeterli ✓" : fark.toFixed(1).replace(".", ",") + " puan gerek")
    );
  }

  LGS.lise = { ciz, durum: () => durum, puanaGit };
})(window.LGS);
