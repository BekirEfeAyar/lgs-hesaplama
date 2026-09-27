/* ==========================================================================
   Veriler sekmesi
   - Profil ayarları
   - Lise ekleme / düzenleme / silme
   - Yedek alma ve geri yükleme
   - Toplu içe aktarma (metin veya CSV)
   ========================================================================== */

(function (LGS) {
  "use strict";

  const { el, bildir, pencere, puanBicim, turAd, onayla } = LGS.arayuz;
  const D = LGS.depo;

  function ciz(kap) {
    kap.appendChild(hesapBilgisi());
    kap.appendChild(profilKartlari());
    kap.appendChild(liseYonetimi());
    kap.appendChild(yedekKartlari());
  }

  /* ---------------------------------------------------------------- durum */

  function hesapBilgisi() {
    const denemeler = D.denemeleriGetir();
    const kart = el("div", { class: "kart" });
    kart.appendChild(el("div", { class: "kart-bas", text: "Bu cihazdaki veriler" }));
    const tablo = el("div", { class: "mini-tablo" });
    tablo.appendChild(satir("Kayıtlı deneme", String(denemeler.length)));
    tablo.appendChild(satir("Kayıtlı lise", String(D.liseleriGetir().length)));
    const fotoSatiri = satir("Yüklenen fotoğraf", "…");
    tablo.appendChild(fotoSatiri);
    tablo.appendChild(satir("Toplam soru", String(LGS.TOPLAM_SORU)));
    tablo.appendChild(satir("Puan üst sınırı", String(LGS.MAX_PUAN)));
    Promise.all(denemeler.map((d) => D.fotoListele(d.id))).then((hepsi) => {
      const toplam = hepsi.reduce((t, h) => t + h.length, 0);
      fotoSatiri.querySelector("strong").textContent = String(toplam);
    });
    kart.appendChild(tablo);
    return kart;
  }

  function satir(etiket, deger) {
    return el("div", { class: "mini-satir" }, el("span", { text: etiket }), el("strong", { text: deger }));
  }

  /* ---------------------------------------------------------------- profil */

  function profilKartlari() {
    const a = D.ayarlarGetir();
    const kart = el("div", { class: "kart" });
    kart.appendChild(el("div", { class: "kart-bas", text: "Profil" }));

    const izgara = el("div", { class: "alan-izgara" });
    izgara.appendChild(alan("Adın", el("input", { type: "text", id: "a-okul", value: a.okulAdi, placeholder: "örn. Efe" })));
    izgara.appendChild(alan("Sınıf", el("input", { type: "text", id: "a-sinif", value: a.sinif, placeholder: "8" })));
    izgara.appendChild(alan("Hedef puanın", el("input", { type: "number", id: "a-hedef", value: String(a.hedefPuan), min: "0", max: String(LGS.MAX_PUAN) })));
    izgara.appendChild(alan("Hedef şehir", el("input", { type: "text", id: "a-sehir", value: a.hedefSehir, placeholder: "örn. İstanbul" })));
    kart.appendChild(izgara);
    kart.appendChild(
      el("button", {
        class: "btn birincil",
        text: "Ayarları kaydet",
        onClick: () => {
          const y = D.ayarlarGetir();
          y.okulAdi = document.getElementById("a-okul").value;
          y.sinif = document.getElementById("a-sinif").value;
          y.hedefPuan = Number(document.getElementById("a-hedef").value) || 0;
          y.hedefSehir = document.getElementById("a-sehir").value;
          D.ayarlarYaz(y);
          bildir("Ayarlar kaydedildi");
        },
      })
    );
    return kart;
  }

  function alan(etiket, oge) {
    return el("label", { class: "alan" }, el("span", { class: "alan-etiket", text: etiket }), oge);
  }

  /* ---------------------------------------------------------------- lise yönetimi */

  function liseYonetimi() {
    const kart = el("div", { class: "kart" });
    kart.appendChild(
      el("div", { class: "kart-bas" }, "Lise listesi", el("span", { class: "sayac", text: String(D.liseleriGetir().length) }))
    );

    const dugmeler = el("div", { class: "btn-satir" });
    dugmeler.appendChild(el("button", { class: "btn birincil", text: "+ Lise ekle", onClick: () => lisePenceresi(null) }));
    dugmeler.appendChild(el("button", { class: "btn hayalet", text: "Toplu içe aktar", onClick: topluIceAktarPenceresi }));
    dugmeler.appendChild(el("button", { class: "btn hayalet", text: "Listeyi dışa aktar (CSV)", onClick: csvDisaAktar }));
    kart.appendChild(dugmeler);

    const arama = el("input", { type: "search", class: "arama", placeholder: "Listede ara…" });
    const sonuc = el("div", { class: "yonetim-liste" });
    arama.addEventListener("input", () => listeyiCiz(sonuc, arama.value));
    kart.appendChild(arama);
    listeyiCiz(sonuc, "");
    kart.appendChild(sonuc);
    return kart;
  }

  function listeyiCiz(kap, q) {
    kap.innerHTML = "";
    const filtre = (q || "").toLocaleLowerCase("tr");
    const liste = D.liseleriGetir()
      .filter((l) => !filtre || (l.ad + " " + l.sehir + " " + l.ilce).toLocaleLowerCase("tr").includes(filtre))
      .sort((a, b) => a.sehir.localeCompare(b.sehir, "tr") || b.taban - a.taban);

    if (!liste.length) {
      kap.appendChild(el("p", { class: "ipucu", text: "Kayıt bulunamadı." }));
      return;
    }

    liste.slice(0, 300).forEach((l) => {
      kap.appendChild(
        el(
          "div",
          { class: "yonetim-satir" },
          el(
            "div",
            { class: "y-bilgi" },
            el("strong", { text: l.ad }),
            el("span", { text: l.sehir + " / " + l.ilce + " · " + turAd(l.tur) + " · " + puanBicim(l.taban) + " puan" + (l.resmi ? "" : " (örnek)") })
          ),
          el(
            "div",
            { class: "y-eylem" },
            el("button", { class: "btn kucuk", text: "Düzenle", onClick: () => lisePenceresi(l) }),
            el("button", {
              class: "btn kucuk hayalet sil",
              text: "Sil",
              onClick: () =>
                onayla("Liseyi sil", '"' + l.ad + '" listeden kaldırılacak.', "Sil", () => {
                  D.liseSil(l.id);
                  bildir("Lise silindi");
                  LGS.uygulama.ciz();
                }),
            })
          )
        )
      );
    });
    if (liste.length > 300) {
      kap.appendChild(el("p", { class: "ipucu", text: "İlk 300 kayıt gösteriliyor. Arama kutusunu kullan." }));
    }
  }

  function lisePenceresi(lise) {
    const yeni = !lise;
    const l = lise || { ad: "", sehir: "", ilce: "", tur: "fen", taban: 300, dilim: "", resmi: true, not: "" };

    const form = el("div", { class: "form" });
    form.appendChild(
      el(
        "div",
        { class: "alan-izgara" },
        alan("Lise adı", el("input", { type: "text", id: "l-ad", value: l.ad, placeholder: "örn. Atatürk Fen Lisesi" }))
      )
    );
    form.appendChild(
      el(
        "div",
        { class: "alan-izgara" },
        alan("Şehir", el("input", { type: "text", id: "l-sehir", value: l.sehir, placeholder: "örn. Ankara" })),
        alan("İlçe", el("input", { type: "text", id: "l-ilce", value: l.ilce, placeholder: "örn. Çankaya" }))
      )
    );

    const turSec = el("select", { id: "l-tur", class: "secim" });
    LGS.LISE_TURLERI.forEach((t) => turSec.appendChild(el("option", { value: t.id, text: t.ad, selected: t.id === l.tur })));
    form.appendChild(el("div", { class: "alan-izgara" }, alan("Tür", turSec)));

    form.appendChild(
      el(
        "div",
        { class: "alan-izgara" },
        alan("Taban puan", el("input", { type: "number", id: "l-taban", value: String(l.taban), min: "0", max: String(LGS.MAX_PUAN), step: "0.01" })),
        alan("Yüzdelik dilim (%)", el("input", { type: "number", id: "l-dilim", value: l.dilim === "" || l.dilim === null ? "" : String(l.dilim), min: "0", step: "0.01", placeholder: "örn. 1.5" }))
      )
    );

    const resmiKutu = el("input", { type: "checkbox", id: "l-resmi", checked: l.resmi !== false });
    form.appendChild(
      el(
        "label",
        { class: "anahtar" },
        resmiKutu,
        el("span", { class: "anahtar-govde" }),
        el("span", { class: "anahtar-etiket", text: "Bu veri resmî (kendi girdiğim)" })
      )
    );
    form.appendChild(
      el("p", { class: "ipucu", text: "Resmî olarak işaretlediğin kayıtlarda listede 'örnek veri' uyarısı çıkmaz." })
    );
    form.appendChild(alan("Not", el("textarea", { id: "l-not", rows: "2", value: l.not || "" })));

    pencere({
      baslik: yeni ? "Yeni lise ekle" : "Liseyi düzenle",
      icerik: form,
      eylemler: [
        { metin: "Vazgeç", tur: "hayalet" },
        {
          metin: "Kaydet",
          tur: "birincil",
          onTikla: () => {
            const kayit = {
              id: lise ? lise.id : undefined,
              ad: document.getElementById("l-ad").value.trim(),
              sehir: document.getElementById("l-sehir").value.trim(),
              ilce: document.getElementById("l-ilce").value.trim(),
              tur: document.getElementById("l-tur").value,
              taban: Number(document.getElementById("l-taban").value) || 0,
              dilim: document.getElementById("l-dilim").value === "" ? null : Number(document.getElementById("l-dilim").value),
              resmi: document.getElementById("l-resmi").checked,
              not: document.getElementById("l-not").value,
            };
            if (!kayit.ad) {
              bildir("Lise adı boş olamaz", "hata");
              return false;
            }
            D.liseKaydet(kayit);
            bildir("Lise kaydedildi");
            LGS.uygulama.ciz();
          },
        },
      ],
    });
  }

  /* ---------------------------------------------------------------- toplu içe aktarma */

  function topluIceAktarPenceresi() {
    const alani = el("textarea", {
      rows: "12",
      class: "kod-alani",
      placeholder:
        "Her satıra bir lise. Ayırıcı olarak ; veya | kullanabilirsin.\n\n" +
        "Lise adı; Şehir; İlçe; Taban puan; Yüzdelik dilim; Tür\n" +
        "Atatürk Fen Lisesi; Ankara; Çankaya; 425,5; 1,2; fen\n" +
        "Nilüfer MTAL; Bursa; Nilüfer; 318,25; 8,5; mtal\n\n" +
        "Sadece adı yazarsan kayıt 'Diğer' türünde eklenir.",
    });

    const form = el("div", { class: "form" });
    form.appendChild(el("p", { class: "ipucu", text: "Excel'den kopyalayıp yapıştırabilirsin. Türkçe karakterler ve ondalık ayırıcı olarak virgül veya nokta desteklenir." }));
    form.appendChild(alani);
    form.appendChild(
      el("label", { class: "anahtar" },
        el("input", { type: "checkbox", id: "toplu-resmi", checked: true }),
        el("span", { class: "anahtar-govde" }),
        el("span", { class: "anahtar-etiket", text: "Bunları resmî veri olarak işaretle" })
      )
    );
    form.appendChild(el("div", { class: "sayac-hint", id: "onizleme", text: "0 satır algılandı" }));
    alani.addEventListener("input", () => {
      document.getElementById("onizleme").textContent = ayikla(alani.value).length + " satır algılandı";
    });

    pencere({
      baslik: "Toplu içe aktar",
      icerik: form,
      eylemler: [
        { metin: "Vazgeç", tur: "hayalet" },
        {
          metin: "İçe aktar",
          tur: "birincil",
          onTikla: () => {
            const satirlar = ayikla(alani.value);
            if (!satirlar.length) {
              bildir("Aktarılacak satır bulunamadı", "hata");
              return false;
            }
            const resmi = document.getElementById("toplu-resmi").checked;
            let eklendi = 0;
            satirlar.forEach((s) => {
              if (!s.ad) return;
              D.liseKaydet({
                ad: s.ad,
                sehir: s.sehir || "Bilinmiyor",
                ilce: s.ilce || "Bilinmiyor",
                tur: s.tur || "diger",
                taban: s.taban === null ? 0 : s.taban,
                dilim: s.dilim,
                resmi: resmi,
                not: "",
              });
              eklendi++;
            });
            bildir(eklendi + " lise eklendi");
            LGS.uygulama.ciz();
          },
        },
      ],
    });
  }

  /** Serbest metni satırlara böler. */
  function ayikla(metin) {
    return metin
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("#"))
      .map((satir) => {
        const parcalar = satir.split(/\s*[;|]\s*|\s{2,}|\s*,\s(?=\D)/).map((p) => p.trim());
        const ilk = parcalar[0] || "";
        const sayisal = (p) => {
          if (p === undefined || p === "") return null;
          const n = Number(String(p).replace(",", ".").replace(/[^\d.]/g, ""));
          return isNaN(n) ? null : n;
        };
        const turAdi = (p) => {
          if (!p) return null;
          const t = LGS.LISE_TURLERI.find((x) => x.id === p.toLocaleLowerCase("tr"));
          return t ? t.id : null;
        };
        return {
          ad: ilk,
          sehir: parcalar[1],
          ilce: parcalar[2],
          taban: sayisal(parcalar[3]),
          dilim: sayisal(parcalar[4]),
          tur: turAdi(parcalar[5]),
        };
      })
      .filter((s) => s.ad);
  }

  function csvDisaAktar() {
    const satirlar = ["Lise;Şehir;İlçe;Taban Puan;Yüzdelik Dilim;Tür;Kaynak"];
    D.liseleriGetir()
      .slice()
      .sort((a, b) => a.sehir.localeCompare(b.sehir, "tr") || b.taban - a.taban)
      .forEach((l) => {
        satirlar.push(
          [l.ad, l.sehir, l.ilce, l.taban, l.dilim === null ? "" : l.dilim, l.tur, l.resmi ? "resmi" : "ornek"]
            .map((v) => String(v).replace(/;/g, ","))
            .join(";")
        );
      });
    D.dosyaIndir("lise-listesi.csv", "﻿" + satirlar.join("\n"), "text/csv;charset=utf-8");
    bildir("CSV indirildi");
  }

  /* ---------------------------------------------------------------- yedekleme */

  function yedekKartlari() {
    const kart = el("div", { class: "kart" });
    kart.appendChild(el("div", { class: "kart-bas", text: "Yedekleme" }));
    kart.appendChild(
      el("p", { class: "ipucu", text: "Veriler yalnızca bu tarayıcıda saklanır. Tarayıcı verisini silersen kayıtların gider. Düzenli olarak yedek al." })
    );

    const girdi = el("input", { type: "file", accept: ".json,application/json", class: "gizli", id: "yedek-girdi" });
    girdi.addEventListener("change", () => {
      const dosya = girdi.files && girdi.files[0];
      if (!dosya) return;
      const okuyucu = new FileReader();
      okuyucu.onload = () => {
        try {
          const veri = JSON.parse(okuyucu.result);
          onayla(
            "Yedeği geri yükle",
            "Mevcut bütün veriler bu yedekle değiştirilecek. Emin misin?",
            "Geri yükle",
            () => {
              D.yedekYukle(veri).then(() => {
                bildir("Yedek geri yüklendi");
                LGS.uygulama.ciz();
              });
            }
          );
        } catch (e) {
          bildir("Dosya okunamadı: geçersiz yedek", "hata");
        }
        girdi.value = "";
      };
      okuyucu.readAsText(dosya);
    });

    kart.appendChild(girdi);
    const satir = el("div", { class: "btn-satir" });
    satir.appendChild(
      el("button", {
        class: "btn birincil",
        text: "⬇ Yedek al (JSON)",
        onClick: async () => {
          try {
            const yedek = await D.yedekAl();
            D.dosyaIndir("lgs-yedek-" + LGS.depo.bugun() + ".json", JSON.stringify(yedek));
            bildir("Yedek indirildi");
          } catch (e) {
            bildir("Yedek alınamadı: " + e.message, "hata");
          }
        },
      })
    );
    satir.appendChild(el("button", { class: "btn hayalet", text: "⬆ Yedekten geri yükle", onClick: () => girdi.click() }));
    satir.appendChild(
      el("button", {
        class: "btn hayalet",
        text: "📄 Lise listesini içe aktar",
        onClick: topluIceAktarPenceresi,
      })
    );
    kart.appendChild(satir);

    kart.appendChild(el("div", { class: "bolum-baslik yeni" }, "Tehlikeli işlemler"));
    kart.appendChild(
      el(
        "button",
        {
          class: "btn tehlike",
          text: "Her şeyi sil",
          onClick: () =>
            onayla("Her şeyi sil", "Bütün denemeler, fotoğraflar ve lise listesi kalıcı olarak silinecek. Bu işlem geri alınamaz.", "Evet, her şeyi sil", () => {
              D.herSeyiSifirla().then(() => {
                bildir("Tüm veriler silindi");
                LGS.uygulama.ciz();
              });
            }),
        }
      )
    );
    return kart;
  }

  LGS.veriler = { ciz };
})(window.LGS);
