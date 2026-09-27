/* ==========================================================================
   Lise Rehberi ekranı
   - Puanına göre yerleşebileceğin liseler
   - Şehir / ilçe / tür filtreleri
   - Tüm listeyi görme, arama, sıralama
   ========================================================================== */

(function (LGS) {
  "use strict";

  const { el, kacis, bildir, puanBicim, puanSinif, turAd } = LGS.arayuz;
  const D = LGS.depo;

  // Ekran ölçekleri (modül içinde kalır, sekme değişince sıfırlanır)
  let durum = {
    puan: 350,
    sehir: "",
    ilce: "",
    tur: "",
    arama: "",
    siralama: "taban-desc",
    sadeceYerlesir: false,
  };

  function ciz(kap) {
    const ayarlar = D.ayarlarGetir();
    if (durum.puan === null) durum.puan = ayarlar.hedefPuan || 350;
    const liseler = D.liseleriGetir();

    kap.appendChild(puanKutusu());
    kap.appendChild(
      el("div", { class: "uyari-kutu" }, el("strong", { text: "Taban puanlar örnektir. " }), "Bu listedeki puan ve yüzdelik dilimler yaklaşık örnek değerlerdir, resmî TAB verisi değildir. Sitedeki kendi lise kaydını ekleyip güncellersen o satır resmî olarak işaretlenir.")
    );
    kap.appendChild(filtreler(liseler));
    kap.appendChild(sonuclar(liseler));
  }

  /* ---------------------------------------------------------------- puan kutusu */

  function puanKutusu() {
    const ayarlar = D.ayarlarGetir();
    const denemeler = D.denemeleriGetir();
    const ozet = LGS.puan.ozet(denemeler);

    const kart = el("div", { class: "kart puan-kutusu" });
    kart.appendChild(el("div", { class: "kart-bas", text: "Hangi puanı hedefliyorsun?" }));

    const satir = el("div", { class: "puan-satir" });

    const sayi = el("input", { type: "number", min: "0", max: String(LGS.MAX_PUAN), step: "0.1", value: String(durum.puan), class: "puan-giris", id: "puan-giris" });
    sayi.addEventListener("input", () => {
      const v = Math.max(0, Math.min(LGS.MAX_PUAN, Number(sayi.value) || 0));
      durum.puan = v;
      goster();
    });

    const kaydirici = el("input", { type: "range", min: "0", max: String(LGS.MAX_PUAN), step: "1", value: String(Math.round(durum.puan)), class: "puan-kaydirici", id: "puan-kaydirici" });
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

  function filtreler(liseler) {
    const sehirler = [...new Set(liseler.map((l) => l.sehir))].sort((a, b) => a.localeCompare(b, "tr"));
    const ilceler = [...new Set(liseler.filter((l) => !durum.sehir || l.sehir === durum.sehir).map((l) => l.ilce))].sort((a, b) =>
      a.localeCompare(b, "tr")
    );

    const kart = el("div", { class: "kart filtre-kart" });

    const izgara = el("div", { class: "filtre-izgara" });

    izgara.appendChild(
      secici("Şehir", sehirler, durum.sehir, (v) => {
        durum.sehir = v;
        durum.ilce = "";
        yenidenCiz();
      }, "Tüm şehirler")
    );

    izgara.appendChild(
      secici("İlçe", ilceler, durum.ilce, (v) => {
        durum.ilce = v;
        yenidenCiz();
      }, "Tüm ilçeler")
    );

    izgara.appendChild(
      secici("Tür", LGS.LISE_TURLERI.map((t) => t.ad), LGS.LISE_TURLERI.find((t) => t.id === durum.tur)?.ad || "", (v) => {
        durum.tur = (LGS.LISE_TURLERI.find((t) => t.ad === v) || {}).id || "";
        yenidenCiz();
      }, "Tüm türler")
    );

    const arama = el("input", { type: "search", value: durum.arama, placeholder: "Lise adı ara…", class: "arama" });
    arama.addEventListener("input", () => {
      durum.arama = arama.value;
      goster();
    });
    izgara.appendChild(el("label", { class: "alan" }, el("span", { class: "alan-etiket", text: "Ara" }), arama));

    kart.appendChild(izgara);

    const satirlar = el("div", { class: "filtre-alt" });
    const siralama = el("select", { class: "secim" });
    [
      { v: "taban-desc", ad: "Taban puana göre (yüksek → düşük)" },
      { v: "taban-asc", ad: "Taban puana göre (düşük → yüksek)" },
      { v: "sehir", ad: "Şehre göre (A → Z)" },
      { v: "ad", ad: "Lise adına göre (A → Z)" },
    ].forEach((s) => siralama.appendChild(el("option", { value: s.v, text: s.ad, selected: durum.siralama === s.v })));
    siralama.addEventListener("change", () => {
      durum.siralama = siralama.value;
      goster();
    });
    satirlar.appendChild(el("label", { class: "alan dar" }, el("span", { class: "alan-etiket", text: "Sıralama" }), siralama));

    const onay = el("label", { class: "anahtar" },
      el("input", { type: "checkbox", checked: durum.sadeceYerlesir }),
      el("span", { class: "anahtar-govde" }),
      el("span", { class: "anahtar-etiket", text: "Sadece puanıma yeten liseleri göster" })
    );
    onay.querySelector("input").addEventListener("change", (ev) => {
      durum.sadeceYerlesir = ev.target.checked;
      goster();
    });
    satirlar.appendChild(onay);

    if (durum.sehir || durum.ilce || durum.tur || durum.arama || durum.sadeceYerlesir) {
      satirlar.appendChild(
        el("button", {
          class: "btn kucuk hayalet",
          text: "Filtreleri temizle",
          onClick: () => {
            durum.sehir = "";
            durum.ilce = "";
            durum.tur = "";
            durum.arama = "";
            durum.sadeceYerlesir = false;
            yenidenCiz();
          },
        })
      );
    }
    kart.appendChild(satirlar);
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

  function goster() {
    const kap = document.getElementById("sonuc-alan");
    if (!kap) return;
    kap.innerHTML = "";
    kap.appendChild(sonuclar(D.liseleriGetir()));
  }

  function yenidenCiz() {
    LGS.uygulama.ciz();
  }

  function sonuclar(liseler) {
    const kap = el("div", { id: "sonuc-alan" });

    let liste = liseler.filter((l) => {
      if (durum.sehir && l.sehir !== durum.sehir) return false;
      if (durum.ilce && l.ilce !== durum.ilce) return false;
      if (durum.tur && l.tur !== durum.tur) return false;
      if (durum.arama) {
        const q = durum.arama.toLocaleLowerCase("tr");
        if (!(l.ad + " " + l.sehir + " " + l.ilce).toLocaleLowerCase("tr").includes(q)) return false;
      }
      return true;
    });

    const yerlesir = liste.filter((l) => durum.puan >= l.taban);
    if (durum.sadeceYerlesir) liste = yerlesir;

    liste.sort(sirala);

    // Özet
    const basliklarim = el("div", { class: "bolum-baslik" },
      durum.sadeceYerlesir ? "Puanına yeten liseler" : "Lise listesi",
      el("span", { class: "sayac", text: liste.length })
    );
    kap.appendChild(basliklarim);

    if (!durum.sadeceYerlesir) {
      kap.appendChild(
        el(
          "div",
          { class: "ozet-serit" },
          ozetKutu("Puanın", puanBicim(durum.puan), puanSinif(durum.puan)),
          ozetKutu("Yeten lise", String(yerlesir.length), "iyi"),
          ozetKutu("En yakın hedef", enYakin(liseler, durum.puan), ""),
          ozetKutu("Listelenen", String(liste.length), "")
        )
      );
    }

    if (!liste.length) {
      kap.appendChild(
        el("div", { class: "bos" },
          el("div", { class: "bos-ikon", text: "🔍" }),
          el("h3", { text: "Sonuç bulunamadı" }),
          el("p", { text: "Filtreleri gevşetmeyi ya da Veriler sekmesinden yeni lise eklemeyi dene." })
        )
      );
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
    liste.forEach((l) => tablo.appendChild(liseSatiri(l)));
    kap.appendChild(tablo);
    return kap;
  }

  function ozetKutu(etiket, deger, sinif) {
    return el("div", { class: "ozet-kutu" }, el("span", { text: etiket }), el("strong", { class: sinif, text: deger }));
  }

  function enYakin(liseler, puan) {
    if (!liseler.length) return "—";
    const uygun = liseler.filter((l) => l.taban > puan).sort((a, b) => a.taban - b.taban)[0];
    if (!uygun) return "Hepsi yeter";
    const fark = uygun.taban - puan;
    return "+" + fark.toFixed(1).replace(".", ",") + " puan";
  }

  function sirala(a, b) {
    switch (durum.siralama) {
      case "taban-asc":
        return a.taban - b.taban;
      case "sehir":
        return a.sehir.localeCompare(b.sehir, "tr") || a.ilce.localeCompare(b.ilce, "tr") || b.taban - a.taban;
      case "ad":
        return a.ad.localeCompare(b.ad, "tr");
      default:
        return b.taban - a.taban;
    }
  }

  function liseSatiri(l) {
    const yeter = durum.puan >= l.taban;
    const fark = l.taban - durum.puan;
    return el(
      "div",
      { class: "lise-satir " + (yeter ? "yeter" : "yetersiz") },
      el(
        "div",
        { class: "lise-ad" },
        el("strong", { text: l.ad }),
        el("span", { class: "lise-etiketler" },
          el("em", { class: "tur", text: turAd(l.tur) }),
          el("em", { class: "sehir", text: l.sehir }),
          l.resmi ? null : el("em", { class: "tahmini", text: "örnek veri", title: "Resmî olmayan örnek değer" })
        )
      ),
      el("div", { class: "lise-ilce", text: l.ilce }),
      el("div", { class: "lise-taban" },
        el("strong", { text: puanBicim(l.taban) }),
        l.dilim ? el("span", { text: "%" + String(l.dilim).replace(".", ",") }) : null
      ),
      el("div", { class: "lise-durum " + (yeter ? "tamam" : "eksik") },
        yeter ? "Yeterli ✓" : fark.toFixed(1).replace(".", ",") + " puan gerek"
      )
    );
  }

  LGS.lise = { ciz, durum: () => durum };
})(window.LGS);
