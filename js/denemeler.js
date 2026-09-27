/* ==========================================================================
   Denemeler ekranı: liste, istatistik, deneme düzenleyici, fotoğraf arşivi
   ========================================================================== */

(function (LGS) {
  "use strict";

  const { el, $, kacis, bildir, pencere, puanBicim, netBicim, tarihBicim, puanSinif, turAd } = LGS.arayuz;
  const D = LGS.depo;

  /* ---------------------------------------------------------------- liste */

  function ciz(kap) {
    const denemeler = D.denemeleriGetir();
    const ozet = LGS.puan.ozet(denemeler);

    kap.appendChild(istatistikKartlari(ozet));
    kap.appendChild(seriGrafigi(ozet));

    const baslik = el("div", { class: "bolum-baslik" }, "Kayıtlı denemeler", el("span", { class: "sayac", text: denemeler.length }));
    kap.appendChild(baslik);

    if (!denemeler.length) {
      kap.appendChild(
        el(
          "div",
          { class: "bos" },
          el("div", { class: "bos-ikon", text: "📝" }),
          el("h3", { text: "Henüz deneme kaydın yok" }),
          el("p", { text: "İlk denemeni ekle; doğru ve yanlışlarını gir, puanın otomatik hesaplansın." }),
          el("button", { class: "btn birincil", text: "+ Yeni deneme ekle", onClick: () => denemePenceresi(null) })
        )
      );
      return;
    }

    const liste = el("div", { class: "liste" });
    denemeler.forEach((d) => liste.appendChild(denemeKarti(d)));
    kap.appendChild(liste);
  }

  function istatistikKartlari(ozet) {
    const kart = el("div", { class: "istatistik" });
    const kutular = [
      { etiket: "Deneme sayısı", deger: ozet.adet, renk: "" },
      { etiket: "Ortalama puan", deger: ozet.adet ? puanBicim(ozet.ortalama) : "—", renk: "" },
      { etiket: "Ortalama net", deger: ozet.adet ? netBicim(ozet.ortalamaNet) : "—", renk: "" },
      { etiket: "En yüksek", deger: ozet.adet ? puanBicim(ozet.enYuksek) : "—", renk: "iyi" },
      { etiket: "En düşük", deger: ozet.adet ? puanBicim(ozet.enDusuk) : "—", renk: "" },
    ];
    kutular.forEach((k) => {
      kart.appendChild(
        el(
          "div",
          { class: "ist-kutu" },
          el("span", { class: "ist-etiket", text: k.etiket }),
          el("strong", { class: "ist-deger " + k.renk, text: String(k.deger) })
        )
      );
    });
    return kart;
  }

  /** Basit çizgi grafik (SVG). */
  function seriGrafigi(ozet) {
    if (ozet.seri.length < 2) return el("div");
    const veriler = ozet.seri;
    const g = 320;
    const y = 130;
    const pad = 24;
    const enFazla = Math.max.apply(
      null,
      veriler.map((s) => s.puan)
    );
    const enCok = Math.min.apply(
      null,
      veriler.map((s) => s.puan)
    );
    const taban = Math.max(0, Math.floor(enCok / 20) * 20 - 10);
    const tavan = Math.min(LGS.MAX_PUAN, Math.ceil(enFazla / 20) * 20 + 10);
    const aralik = Math.max(1, tavan - taban);
    const adim = (veriler.length - 1) * pad;

    let noktalar = "";
    veriler.forEach((s, i) => {
      const x = pad + i * ((adim) / Math.max(1, veriler.length - 1));
      const yy = y - ((s.puan - taban) / aralik) * (y - pad * 1.4) - pad * 0.6;
      noktalar += (i ? " L" : "M") + x.toFixed(1) + " " + yy.toFixed(1);
    });

    const svg =
      '<svg viewBox="0 0 ' + g + " " + y + '" class="grafik" preserveAspectRatio="none">' +
      '<path d="' + noktalar + '" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' +
      veriler
        .map((s, i) => {
          const x = pad + i * (adim / Math.max(1, veriler.length - 1));
          const yy = y - ((s.puan - taban) / aralik) * (y - pad * 1.4) - pad * 0.6;
          return '<circle cx="' + x.toFixed(1) + '" cy="' + yy.toFixed(1) + '" r="3.5" fill="currentColor"/>';
        })
        .join("") +
      "</svg>";

    return el(
      "div",
      { class: "kart grafik-kart" },
      el("div", { class: "kart-bas", text: "Puan gelişimi" }),
      el("div", { class: "grafik-sar", html: svg }),
      el(
        "div",
        { class: "grafik-etiketler" },
        el("span", { text: veriler[0].tarih.slice(0, 10) }),
        el("span", { text: veriler[veriler.length - 1].tarih.slice(0, 10) })
      )
    );
  }

  function denemeKarti(d) {
    const h = LGS.puan.hesapla(d);
    return el(
      "article",
      { class: "kart deneme-kart" },
      el(
        "div",
        { class: "deneme-ust" },
        el(
          "div",
          { class: "deneme-bilgi" },
          el("h3", { text: d.ad || "İsimsiz deneme" }),
          el(
            "p",
            { class: "deneme-meta" },
            tarihBicim(d.tarih),
            d.yayin ? " · " + kacis(d.yayin) : ""
          )
        ),
        el("div", { class: "puan-rozet " + puanSinif(h.puan) }, el("strong", { text: puanBicim(h.puan) }), el("span", { text: "puan" }))
      ),
      el(
        "div",
        { class: "deneme-satir" },
        el("span", { class: "rozet", text: "D " + h.toplamD }),
        el("span", { class: "rozet", text: "Y " + h.toplamY }),
        el("span", { class: "rozet", text: "B " + h.toplamB }),
        el("span", { class: "rozet vurgu", text: "Net " + netBicim(h.toplamNet) })
      ),
      d.notlar ? el("p", { class: "deneme-not", text: d.notlar }) : null,
      el(
        "div",
        { class: "deneme-eylem" },
        el("button", { class: "btn kucuk", text: "Aç", onClick: () => denemePenceresi(d.id) }),
        el("button", { class: "btn kucuk hayalet", text: "Fotoğraf", onClick: () => fotograflariAc(d.id) }),
        el("button", { class: "btn kucuk hayalet sil", text: "Sil", onClick: () => silOnayla(d) })
      )
    );
  }

  function silOnayla(d) {
    LGS.arayuz.onayla(
      "Denemeyi sil",
      '"' + (d.ad || "İsimsiz deneme") + '" ve buna ait bütün fotoğraflar kalıcı olarak silinecek. Emin misin?',
      "Evet, sil",
      () => {
        D.denemeSil(d.id);
        bildir("Deneme silindi");
        LGS.uygulama.ciz();
      }
    );
  }

  /* ---------------------------------------------------------------- düzenleyici */

  function denemePenceresi(id) {
    const deneme = id ? D.denemeGetir(id) : D.bosDeneme();
    if (!deneme) {
      bildir("Deneme bulunamadı", "hata");
      return;
    }
    const kopya = JSON.parse(JSON.stringify(deneme));

    const form = el("div", { class: "form" });

    const adGir = el("input", { type: "text", value: kopya.ad, placeholder: "örn. 3D Yayınları - Deneme 4" });
    const yayinGir = el("input", { type: "text", value: kopya.yayin, placeholder: "örn. Apotemi, Bilgi Sarmal" });
    const tarihGir = el("input", { type: "date", value: kopya.tarih });
    const notGir = el("textarea", {
      rows: "3",
      placeholder: "Bu denemede neyi iyi / kötü yaptın? Gelecek denemeye not düş.",
    });
    notGir.value = kopya.notlar || "";

    form.appendChild(
      el("div", { class: "alan-izgara" }, alan("Deneme adı", adGir), alan("Yayın / kaynak", yayinGir))
    );
    form.appendChild(alan("Tarih", tarihGir));

    // Canlı puan kutusu
    const canli = el("div", { class: "canli-puan" });
    form.appendChild(canli);

    // Ders tablosu
    const tablo = el("div", { class: "tablo" });
    tablo.appendChild(
      el(
        "div",
        { class: "tablo-bas" },
        el("span", { class: "s-ders", text: "Ders" }),
        el("span", { class: "s-soru", text: "Soru" }),
        el("span", { class: "s-giris", text: "Doğru" }),
        el("span", { class: "s-giris", text: "Yanlış" }),
        el("span", { class: "s-sonuc", text: "Net" })
      )
    );

    const netHucreleri = {};
    const sayiGirleri = {};
    LGS.DERSLER.forEach((ders) => {
      const v = kopya.dersler[ders.id] || { d: 0, y: 0 };
      const netKutu = el("span", { class: "s-sonuc net-deger", text: "0" });
      netHucreleri[ders.id] = netKutu;

      const dGir = el("input", { type: "number", min: "0", max: String(ders.soru), value: String(v.d), class: "sayi-giris" });
      const yGir = el("input", { type: "number", min: "0", max: String(ders.soru), value: String(v.y), class: "sayi-giris" });
      sayiGirleri[ders.id] = { d: dGir, y: yGir };

      tablo.appendChild(
        el(
          "div",
          { class: "tablo-satir" },
          el("span", { class: "s-ders", text: ders.kisa, title: ders.ad }),
          el("span", { class: "s-soru", text: ders.soru }),
          el("span", { class: "s-giris" }, dGir),
          el("span", { class: "s-giris" }, yGir),
          el("span", { class: "s-sonuc" }, netKutu)
        )
      );
    });

    function tabloyuGuncelle() {
      const anlik = veriyiTopla();
      const h = LGS.puan.hesapla(anlik);
      LGS.DERSLER.forEach((ders) => {
        const satir = h.dersler.find((x) => x.id === ders.id);
        netHucreleri[ders.id].textContent = netBicim(satir.net);
        netHucreleri[ders.id].className = "s-sonuc net-deger" + (satir.net > 0 ? " dolu" : "");
      });
      canli.innerHTML = "";
      canli.appendChild(
        el(
          "div",
          { class: "canli-ic" },
          el("span", { class: "canli-etiket", text: "Tahmini LGS puanın" }),
          el("strong", { class: "canli-puan-sayi " + puanSinif(h.puan), text: puanBicim(h.puan) }),
          el("div", { class: "canli-net", text: "Toplam net " + netBicim(h.toplamNet) + " / 160" }),
          el("div", { class: "canli-ozet", text: "D " + h.toplamD + " · Y " + h.toplamY + " · B " + h.toplamB })
        )
      );
      if (h.hatali.length) {
        canli.appendChild(el("p", { class: "uyari", text: "⚠ " + h.hatali.join(" · ") }));
      }
    }

    function veriyiTopla() {
      const d = {
        id: kopya.id,
        ad: adGir.value,
        yayin: yayinGir.value,
        tarih: tarihGir.value,
        notlar: notGir.value,
        olusturma: kopya.olusturma,
        dersler: {},
      };
      LGS.DERSLER.forEach((ders) => {
        const g = sayiGirleri[ders.id];
        d.dersler[ders.id] = { d: Number(g.d.value) || 0, y: Number(g.y.value) || 0 };
      });
      return d;
    }

    tablo.querySelectorAll("input").forEach((g) => {
      g.addEventListener("input", () => {
        tabloyuGuncelle();
      });
    });

    form.appendChild(el("p", { class: "bolum-baslik yeni" }, "Ders bazlı sonuçlar"));
    form.appendChild(tablo);
    form.appendChild(
      el("p", {
        class: "ipucu",
        text: "Net = Doğru − (Yanlış ÷ 3). Puan = (Toplam net ÷ 160) × 500. Bu bir tahmindir, resmî MEB puanı değildir.",
      })
    );

    form.appendChild(alan("Notlar", notGir));
    tabloyuGuncelle();

    pencere({
      baslik: id ? "Denemeyi düzenle" : "Yeni deneme",
      icerik: form,
      eylemler: [
        { metin: "Vazgeç", tur: "hayalet" },
        {
          metin: "Kaydet",
          tur: "birincil",
          onTikla: () => {
            const veri = veriyiTopla();
            if (!veri.ad.trim()) veri.ad = "İsimsiz deneme";
            D.denemeKaydet(veri);
            bildir("Deneme kaydedildi");
            LGS.uygulama.ciz();
          },
        },
      ],
    });
  }

  function alan(etiket, oge) {
    return el("label", { class: "alan" }, el("span", { class: "alan-etiket", text: etiket }), oge);
  }

  /* ---------------------------------------------------------------- fotoğraflar */

  function fotograflariAc(denemeId) {
    const deneme = D.denemeGetir(denemeId);
    if (!deneme) return;

    const kap = el("div", { class: "foto-bolum" });

    const girdi = el("input", {
      type: "file",
      accept: "image/*",
      multiple: true,
      class: "gizli",
      id: "foto-girdi",
    });
    girdi.addEventListener("change", () => {
      const dosyalar = Array.prototype.slice.call(girdi.files || []);
      if (!dosyalar.length) return;
      girdi.disabled = true;
      bildir(dosyalar.length + " fotoğraf işleniyor…");
      let bitti = 0;
      dosyalar.forEach((dosya) => {
        D.resmiKucult(dosya)
          .then((kucuk) =>
            D.fotoEkle(denemeId, { ad: dosya.name.replace(/\.[^.]+$/, "") || "Yanlışlar", veri: kucuk.veri, tur: kucuk.tur, boyut: kucuk.boyut })
          )
          .then(() => {
            bitti++;
            if (bitti === dosyalar.length) {
              girdi.disabled = false;
              bildir("Fotoğraflar eklendi");
              LGS.uygulama.ciz();
              fotograflariAc(denemeId);
            }
          })
          .catch((e) => {
            console.error(e);
            bitti++;
            bildir("Fotoğraf eklenemedi: " + dosya.name, "hata");
            if (bitti === dosyalar.length) {
              girdi.disabled = false;
              LGS.uygulama.ciz();
              fotograflariAc(denemeId);
            }
          });
      });
    });

    kap.appendChild(girdi);
    kap.appendChild(
      el(
        "button",
        {
          class: "btn birincil genis",
          text: "📷 Yanlış fotoğrafı yükle",
          onClick: () => girdi.click(),
        }
      )
    );
    kap.appendChild(el("p", { class: "ipucu", text: "Telefondan çektiğin fotoğrafları da seçebilirsin. Görseller cihazında kalır, internet'e yüklenmez." }));

    const galeri = el("div", { class: "galeri", id: "galeri" });
    kap.appendChild(galeri);

    pencere({
      baslik: (deneme.ad || "Deneme") + " · Yanlış arşivi",
      icerik: kap,
      eylemler: [{ metin: "Kapat", tur: "hayalet", onTikla: () => LGS.uygulama.ciz() }],
    });

    D.fotoListele(denemeId).then((fotolar) => {
      if (!fotolar.length) {
        galeri.appendChild(el("p", { class: "ipucu ortalı", text: "Bu denemeye henüz fotoğraf eklemedin." }));
        return;
      }
      fotolar.forEach((f) => {
        const kart = el("div", { class: "foto-kart" });
        const img = el("img", { src: f.veri, alt: f.ad, loading: "lazy" });
        img.addEventListener("click", () => LGS.arayuz.fotografGoster(f));
        kart.appendChild(img);
        kart.appendChild(
          el(
            "div",
            { class: "foto-etiket" },
            el("span", { text: f.ad }),
            el("button", {
              class: "ikon-btn kucuk sil",
              title: "Fotoğrafı sil",
              html: "&#215;",
              onClick: (ev) => {
                ev.stopPropagation();
                LGS.arayuz.onayla("Fotoğrafı sil", '"' + f.ad + '" silinecek.', "Sil", () => {
                  D.fotoSil(f.id).then(() => {
                    kart.remove();
                    bildir("Fotoğraf silindi");
                  });
                });
              },
            })
          )
        );
        galeri.appendChild(kart);
      });
    });
  }

  LGS.denemeler = { ciz, denemePenceresi, fotograflariAc, alan };
})(window.LGS);
