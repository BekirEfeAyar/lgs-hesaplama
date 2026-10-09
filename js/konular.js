/* ==========================================================================
   Konular sekmesi: yanlış yapılan konulara göre deneme arşivi
   Hangi konuda, hangi denemelerde yanlış yapıldığını gösterir.
   Veri: veri/konular.js (KONULAR), işaretler: deneme.yanlisKonular
   ========================================================================== */

(function (LGS) {
  "use strict";

  const { el, bildir, puanBicim, tarihBicim } = LGS.arayuz;
  const D = LGS.depo;

  let durum = { ders: "", arama: "", sadeceYanlis: true };

  function dersAdi(dersId) {
    const d = (LGS.DERSLER || []).find((x) => x.id === dersId);
    if (!d) return dersId;
    return dersId === "yabanci" ? "Yabancı Dil (İngilizce)" : d.ad;
  }

  function dersSirasi() {
    return (LGS.DERSLER || []).map((d) => d.id);
  }

  /* denemeId/ad/tarih/puan ile birlikte konu indeksi kurar */
  function indeksiKur() {
    const harita = new Map();
    D.denemeleriGetir().forEach((d) => {
      const liste = d.yanlisKonular || [];
      if (!liste.length) return;
      let puan = null;
      try {
        puan = LGS.puan.hesapla(d).puan;
      } catch (e) {
        puan = null;
      }
      liste.forEach((k) => {
        if (!k || !k.ders || !k.unite || !k.konu) return;
        const anahtar = k.ders + "|" + k.unite + "|" + k.konu;
        if (!harita.has(anahtar)) {
          harita.set(anahtar, { ders: k.ders, unite: k.unite, konu: k.konu, denemeler: [] });
        }
        const giris = harita.get(anahtar);
        if (!giris.denemeler.some((x) => x.id === d.id)) {
          giris.denemeler.push({ id: d.id, ad: d.ad || "İsimsiz deneme", tarih: d.tarih || "", puan: puan });
        }
      });
    });
    return harita;
  }

  function ciz(kap) {
    const indeks = indeksiKur();

    kap.appendChild(
      el(
        "div",
        { class: "kart filtre-kart" },
        el(
          "div",
          { class: "filtre-izgara" },
          el(
            "label",
            { class: "alan" },
            el("span", { class: "alan-etiket", text: "Ders" }),
            dersSecici()
          ),
          el(
            "label",
            { class: "alan" },
            el("span", { class: "alan-etiket", text: "Konu ara" }),
            aramaKutusu()
          )
        ),
        el(
          "div",
          { class: "filtre-alt" },
          el(
            "label",
            { class: "anahtar" },
            el("input", {
              type: "checkbox",
              checked: durum.sadeceYanlis,
              onChange: (ev) => {
                durum.sadeceYanlis = ev.target.checked;
                LGS.uygulama.ciz();
              },
            }),
            el("span", { class: "anahtar-govde" }),
            el("span", { class: "anahtar-etiket", text: "Sadece yanlış yaptıklarım" })
          )
        )
      )
    );

    const agac = el("div", { id: "konu-agac", class: "konu-agac" });
    kap.appendChild(agac);
    agaciCiz(agac, indeks);
  }

  function dersSecici() {
    const sec = el("select", { class: "secim" });
    sec.appendChild(el("option", { value: "", text: "Tüm dersler" }));
    dersSirasi().forEach((id) => {
      sec.appendChild(el("option", { value: id, text: dersAdi(id), selected: durum.ders === id }));
    });
    sec.addEventListener("change", () => {
      durum.ders = sec.value;
      LGS.uygulama.ciz();
    });
    return sec;
  }

  function aramaKutusu() {
    const kutu = el("input", {
      type: "search",
      class: "arama",
      placeholder: "örn. Pisagor, Fiilimsi…",
      value: durum.arama,
    });
    kutu.addEventListener("input", () => {
      durum.arama = kutu.value;
      const agac = document.getElementById("konu-agac");
      if (agac) {
        agac.innerHTML = "";
        agaciCiz(agac, indeksiKur());
      }
    });
    return kutu;
  }

  function eslesiyor(dersId, unite, konu) {
    const q = (durum.arama || "").trim().toLocaleLowerCase("tr");
    if (!q) return true;
    return (unite + " " + konu + " " + dersAdi(dersId)).toLocaleLowerCase("tr").includes(q);
  }

  function agaciCiz(agac, indeks) {
    const dersler =
      typeof KONULAR !== "undefined"
        ? dersSirasi().filter((id) => KONULAR[id] && (!durum.ders || durum.ders === id))
        : [];

    let yanlisliKonu = 0;
    let gosterilen = 0;

    dersler.forEach((dersId) => {
      const uniteler = KONULAR[dersId].filter((u) =>
        u.k.some((k) => eslesiyor(dersId, u.u, k))
      );
      if (!birimVar(uniteler, dersId, indeks) && durum.sadeceYanlis && !durum.arama.trim()) {
        // bu derste hiç yanlış yoksa ve filtreli görünümdeysek dersi atla
        return;
      }
      const dersBlok = el("div", { class: "kart" });
      dersBlok.appendChild(el("div", { class: "kart-bas", text: dersAdi(dersId).toLocaleUpperCase("tr-TR") }));

      let dersteSatir = 0;
      uniteler.forEach((u) => {
        const konular = u.k.filter((k) => eslesiyor(dersId, u.u, k));
        const satirlar = [];
        konular.forEach((k) => {
          const giris = indeks.get(dersId + "|" + u.u + "|" + k);
          const adet = giris ? giris.denemeler.length : 0;
          if (adet > 0) yanlisliKonu++;
          if (durum.sadeceYanlis && adet === 0) return;
          dersteSatir++;
          const satir = el(
            "div",
            { class: "konu-satir" + (adet > 0 ? " yanlisli" : "") },
            el(
              "div",
              { class: "konu-bilgi" },
              el("strong", { text: k }),
              el("span", { text: u.u + (adet > 0 ? " · " + adet + " denemede yanlış" : "") })
            )
          );
          if (adet > 0) {
            const cipler = el("div", { class: "cip-satir" });
            giris.denemeler
              .slice()
              .sort((a, b) => (a.tarih < b.tarih ? 1 : -1))
              .forEach((x) => {
                cipler.appendChild(
                  el("button", {
                    class: "cip",
                    title: "Denemeyi aç",
                    onClick: () => LGS.denemeler.denemePenceresi(x.id),
                    text:
                      (x.ad || "Deneme") +
                      (x.tarih ? " · " + tarihBicim(x.tarih) : "") +
                      (x.puan === null || x.puan === undefined ? "" : " · " + puanBicim(x.puan)),
                  })
                );
              });
            satir.appendChild(cipler);
          }
          satirlar.push(satir);
        });
        if (satirlar.length) {
          dersBlok.appendChild(el("div", { class: "unite-baslik", text: u.u }));
          satirlar.forEach((s) => {
            dersBlok.appendChild(s);
            gosterilen++;
          });
        }
      });

      if (dersteSatir > 0) agac.appendChild(dersBlok);
    });

    if (!agac.children.length) {
      const bos = el(
        "div",
        { class: "bos" },
        el("div", { class: "bos-ikon", text: "📝" }),
        el("h3", { text: durum.sadeceYanlis ? "Henüz yanlış işaretli konu yok" : "Sonuç bulunamadı" }),
        el("p", {
          text: durum.sadeceYanlis
            ? "Bir denemenin Yanlışlarım bölümünden yanlış yaptığın konuları ekle, burada hangi denemede takıldığını gör."
            : "Aramayı değiştirip tekrar dene.",
        })
      );
      if (durum.sadeceYanlis && !durum.arama.trim()) {
        bos.appendChild(
          el("button", {
            class: "btn hayalet",
            text: "Tüm konuları göster",
            onClick: () => {
              durum.sadeceYanlis = false;
              LGS.uygulama.ciz();
            },
          })
        );
      }
      agac.appendChild(bos);
    } else {
      agac.insertBefore(
        el("p", {
          class: "ipucu ortalı",
          text: yanlisliKonu + " konuda yanlış · " + gosterilen + " konu gösteriliyor",
        }),
        agac.firstChild
      );
    }
  }

  function birimVar(uniteler, dersId, indeks) {
    for (const u of uniteler) {
      for (const k of u.k) {
        const giris = indeks.get(dersId + "|" + u.u + "|" + k);
        if (giris && giris.denemeler.length) return true;
      }
    }
    return false;
  }

  LGS.konular = { ciz, durum: () => durum, indeksiKur };
})(window.LGS);
