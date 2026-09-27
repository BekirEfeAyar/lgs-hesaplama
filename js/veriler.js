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
    const liseler = D.liseleriGetir();
    const veriliIller = new Set(liseler.map((l) => l.sehir));
    const toplamIlce = IL_ILCE_TUMU.reduce((t, x) => t + x.ilceler.length, 0);

    const kart = el("div", { class: "kart" });
    kart.appendChild(el("div", { class: "kart-bas", text: "Kapsam" }));

    const tablo = el("div", { class: "mini-tablo" });
    tablo.appendChild(satir("İl (tamamı)", String(IL_ILCE_TUMU.length) + " / 81"));
    tablo.appendChild(satir("İlçe (tamamı)", String(toplamIlce)));
    tablo.appendChild(satir("Verisi olan il", String(veriliIller.size)));
    tablo.appendChild(satir("Kayıtlı lise", String(liseler.length)));
    tablo.appendChild(satir("Resmî işaretli", String(liseler.filter((l) => l.resmi).length)));
    tablo.appendChild(satir("Kayıtlı deneme", String(denemeler.length)));
    const fotoSatiri = satir("Yüklenen fotoğraf", "…");
    tablo.appendChild(fotoSatiri);
    tablo.appendChild(satir("Toplam soru", String(LGS.TOPLAM_SORU)));
    tablo.appendChild(satir("Puan üst sınırı", String(LGS.MAX_PUAN)));
    Promise.all(denemeler.map((d) => D.fotoListele(d.id))).then((hepsi) => {
      fotoSatiri.querySelector("strong").textContent = String(hepsi.reduce((t, h) => t + h.length, 0));
    });
    kart.appendChild(tablo);

    const eksik = IL_ILCE_TUMU.length - veriliIller.size;
    if (eksik > 0) {
      kart.appendChild(
        el(
          "div",
          { class: "uyari-kutu", style: { marginTop: "12px" } },
          el("strong", { text: eksik + " il için lise verisi yok. " }),
          "İl ve ilçe listesi tam (81 il / " + toplamIlce + " ilçe) ama lise taban puanları yalnızca " +
            veriliIller.size + " il için eklendi. Aşağıdaki 'Toplu içe aktar' ile kendi resmî listeni ekleyebilirsin."
        )
      );
    }
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
    const tDeger = (l) => (l.taban === null || l.taban === undefined ? -1 : l.taban);
    const liste = D.liseleriGetir()
      .filter((l) => !filtre || (l.ad + " " + l.sehir + " " + l.ilce + " " + (l.alan || "")).toLocaleLowerCase("tr").includes(filtre))
      .sort((a, b) => a.sehir.localeCompare(b.sehir, "tr") || tDeger(b) - tDeger(a));

    if (!liste.length) {
      kap.appendChild(el("p", { class: "ipucu", text: "Kayıt bulunamadı." }));
      return;
    }

    liste.slice(0, 300).forEach((l) => {
      const bilgi = l.sehir + " / " + l.ilce + " · " + turAd(l.tur) +
        (l.alan ? " · " + l.alan : "") + " · " +
        (l.taban === null || l.taban === undefined ? "puan yok" : puanBicim(l.taban) + " puan") +
        (l.kaynak === "unsalim2025" ? " · 2025" : l.resmi ? "" : " (örnek)");
      kap.appendChild(
        el(
          "div",
          { class: "yonetim-satir" },
          el(
            "div",
            { class: "y-bilgi" },
            el("strong", { text: l.ad }),
            el("span", { text: bilgi })
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
    const l = lise || { ad: "", sehir: "", ilce: "", tur: "anadolu", alan: "", taban: null, taban2024: null, dilim: "", kontenjan: "", resmi: true, not: "" };

    const form = el("div", { class: "form" });
    form.appendChild(el("div", { class: "alan-izgara" }, alan("Lise adı", el("input", { type: "text", id: "l-ad", value: l.ad, placeholder: "örn. Atatürk Fen Lisesi" }))));

    /* --- İl: 81 ilin listesi --- */
    const ilSec = el("select", { id: "l-sehir", class: "secim" });
    ilSec.appendChild(el("option", { value: "", text: "— İl seç —" }));
    LGS.iller()
      .forEach((ad) => {
        const sayi = D.liseleriGetir().filter((x) => x.sehir === ad).length;
        ilSec.appendChild(el("option", { value: ad, text: sayi ? ad + " (" + sayi + ")" : ad, selected: ad === l.sehir }));
      });
    if (l.sehir && !LGS.iller().includes(l.sehir)) {
      ilSec.appendChild(el("option", { value: l.sehir, text: l.sehir + " (listede yok)", selected: true }));
    }

    /* --- İlçe: seçilen ilin ilçeleri --- */
    const ilceSec = el("select", { id: "l-ilce", class: "secim" });

    function ilceDoldur(secili) {
      const ilAdi = ilSec.value;
      const ilceler = ilAdi ? LGS.ilceler(ilAdi) : [];
      ilceSec.innerHTML = "";
      if (!ilAdi) {
        ilceSec.appendChild(el("option", { value: "", text: "Önce il seç" }));
        ilceSec.disabled = true;
        return;
      }
      ilceSec.disabled = false;
      ilceSec.appendChild(el("option", { value: "", text: "İlçe seç (" + ilceler.length + ")" }));
      ilceler.forEach((d) => ilceSec.appendChild(el("option", { value: d, text: d, selected: d === secili })));
      if (secili && !ilceler.includes(secili)) {
        ilceSec.appendChild(el("option", { value: secili, text: secili + " (listede yok)", selected: true }));
      }
    }
    ilSec.addEventListener("change", () => ilceDoldur(""));
    ilceDoldur(l.ilce);

    form.appendChild(el("div", { class: "alan-izgara" }, alan("İl", ilSec), alan("İlçe", ilceSec)));

    const turSec = el("select", { id: "l-tur", class: "secim" });
    LGS.LISE_TURLERI.forEach((t) => turSec.appendChild(el("option", { value: t.id, text: t.ad, selected: t.id === l.tur })));
    form.appendChild(
      el(
        "div",
        { class: "alan-izgara" },
        alan("Tür", turSec),
        alan("Alan / dal", el("input", { type: "text", id: "l-alan", value: l.alan || "", placeholder: "örn. Fen Bilimleri" }))
      )
    );

    form.appendChild(
      el(
        "div",
        { class: "alan-izgara" },
        alan("Taban puan (2025)", el("input", { type: "number", id: "l-taban", value: l.taban === null || l.taban === undefined ? "" : String(l.taban), min: "0", max: String(LGS.MAX_PUAN), step: "0.0001", placeholder: "boş = puan yok" })),
        alan("Taban puan (2024)", el("input", { type: "number", id: "l-taban2024", value: l.taban2024 === null || l.taban2024 === undefined ? "" : String(l.taban2024), min: "0", max: String(LGS.MAX_PUAN), step: "0.0001", placeholder: "isteğe bağlı" }))
      )
    );
    form.appendChild(
      el(
        "div",
        { class: "alan-izgara" },
        alan("Yüzdelik dilim (%)", el("input", { type: "number", id: "l-dilim", value: l.dilim === "" || l.dilim === null || l.dilim === undefined ? "" : String(l.dilim), min: "0", step: "0.01", placeholder: "örn. 1.5" })),
        alan("Kontenjan", el("input", { type: "number", id: "l-kontenjan", value: l.kontenjan === null || l.kontenjan === undefined ? "" : String(l.kontenjan), min: "0", step: "1", placeholder: "örn. 120" }))
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
    form.appendChild(el("p", { class: "ipucu", text: "Resmî olarak işaretlediğin kayıtlarda listede 'örnek veri' uyarısı çıkmaz." }));
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
            const okuSayi = (id) => {
              const v = document.getElementById(id).value;
              return v === "" ? null : Number(v);
            };
            const kayit = {
              id: lise ? lise.id : undefined,
              ad: document.getElementById("l-ad").value.trim(),
              sehir: document.getElementById("l-sehir").value,
              ilce: document.getElementById("l-ilce").value,
              tur: document.getElementById("l-tur").value,
              alan: document.getElementById("l-alan").value.trim(),
              taban: okuSayi("l-taban"),
              taban2024: okuSayi("l-taban2024"),
              dilim: okuSayi("l-dilim"),
              kontenjan: okuSayi("l-kontenjan"),
              kod: lise ? lise.kod || "" : "",
              resmi: document.getElementById("l-resmi").checked,
              kaynak: lise ? lise.kaynak || "" : "",
              not: document.getElementById("l-not").value,
            };
            if (!kayit.ad) {
              bildir("Lise adı boş olamaz", "hata");
              return false;
            }
            if (!kayit.sehir) {
              bildir("İl seçmelisin", "hata");
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
        "Lise adı; İl; İlçe; Taban puan; Yüzdelik dilim; Tür; Alan\n" +
        "Atatürk Fen Lisesi; Ankara; Çankaya; 425,5; 1,2; fen; Fen Bilimleri\n" +
        "Nilüfer MTAL; Bursa; Nilüfer; 318,25; 8,5; mtal; Elektrik-Elektronik Tek.\n\n" +
        "Tür: fen, anadolu, sosyal, mtal, imamhatip, proje, diger\n" +
        "İl adı 81 ilin gerçek adlarından biri olmalı (örn. İstanbul, Ankara, Şanlıurfa).\n" +
        "Sadece adı yazarsan kayıt 'Diğer' türünde eklenir. Taban boşsa 'puan yok' olur.",
    });

    const form = el("div", { class: "form" });
    form.appendChild(
      el("p", { class: "ipucu", text: "Excel'den kopyalayıp yapıştırabilirsin. Türkçe karakterler ve ondalık ayırıcı olarak virgül veya nokta desteklenir. İl adı listede yoksa kayıt yine de eklenir ama uyarı listelenir." })
    );
    form.appendChild(alani);
    form.appendChild(
      el("label", { class: "anahtar" },
        el("input", { type: "checkbox", id: "toplu-resmi", checked: true }),
        el("span", { class: "anahtar-govde" }),
        el("span", { class: "anahtar-etiket", text: "Bunları resmî veri olarak işaretle" })
      )
    );
    const onizleme = el("div", { class: "sayac-hint", id: "onizleme", text: "0 satır algılandı" });
    form.appendChild(onizleme);
    const uyariKutusu = el("div", { id: "toplu-uyari" });
    form.appendChild(uyariKutusu);

    function onizlemeYenile() {
      const satirlar = ayikla(alani.value);
      const bilinenIl = new Set(IL_ILCE_TUMU.map((x) => x.il));
      const bilinmeyen = [...new Set(satirlar.map((s) => s.sehir).filter((s) => s && !bilinenIl.has(s)))];
      onizleme.textContent = satirlar.length + " satır algılandı";
      uyariKutusu.innerHTML = "";
      if (bilinmeyen.length) {
        uyariKutusu.appendChild(
          el("p", { class: "uyari", text: "⚠ Listede olmayan il adı: " + bilinmeyen.join(", ") })
        );
      }
    }
    alani.addEventListener("input", onizlemeYenile);

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
            const bilinenIl = new Set(IL_ILCE_TUMU.map((x) => x.il));
            let eklendi = 0;
            let ilBilinmeyen = 0;
            satirlar.forEach((s) => {
              if (!s.ad) return;
              if (s.sehir && !bilinenIl.has(s.sehir)) ilBilinmeyen++;
              D.liseKaydet({
                ad: s.ad,
                sehir: s.sehir || "Bilinmiyor",
                ilce: s.ilce || "Bilinmiyor",
                tur: s.tur || "diger",
                alan: s.alan || "",
                taban: s.taban,
                dilim: s.dilim,
                resmi: resmi,
                not: "",
              });
              eklendi++;
            });
            bildir(eklendi + " lise eklendi" + (ilBilinmeyen ? " · " + ilBilinmeyen + " kayıtta il adı tanınmadı" : ""));
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
          alan: parcalar[6] || "",
        };
      })
      .filter((s) => s.ad);
  }

  function csvDisaAktar() {
    const satirlar = ["Lise;İl;İlçe;Tür;Alan;2025 Taban;2024 Taban;Yüzdelik Dilim;Kontenjan;Kod;Kaynak"];
    D.liseleriGetir()
      .slice()
      .sort((a, b) => {
        if (a.sehir !== b.sehir) return a.sehir.localeCompare(b.sehir, "tr");
        const ta = a.taban === null || a.taban === undefined ? -1 : a.taban;
        const tb = b.taban === null || b.taban === undefined ? -1 : b.taban;
        return tb - ta;
      })
      .forEach((l) => {
        satirlar.push(
          [l.ad, l.sehir, l.ilce, l.tur, l.alan || "", l.taban === null ? "" : l.taban,
           l.taban2024 === null || l.taban2024 === undefined ? "" : l.taban2024,
           l.dilim === null || l.dilim === undefined ? "" : l.dilim,
           l.kontenjan === null || l.kontenjan === undefined ? "" : l.kontenjan,
           l.kod || "", l.resmi ? "resmi" : l.kaynak || "ornek"]
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
