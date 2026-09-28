/* ==========================================================================
   Hesap sekmesi: e-posta ile giriş/kayıt, eşitleme, moderatör paneli
   ========================================================================== */

(function (LGS) {
  "use strict";

  const { el, bildir, pencere, puanBicim, tarihBicim } = LGS.arayuz;
  const D = LGS.depo;
  const B = () => LGS.bulut;

  function ciz(kap) {
    if (!B() || !B().kurulu()) {
      kap.appendChild(
        el(
          "div",
          { class: "bos" },
          el("div", { class: "bos-ikon", text: "☁️" }),
          el("h3", { text: "Hesap sistemi kapalı" }),
          el(
            "p",
            {
              text: "E-posta ile giriş için site sahibinin Firebase kurulumunu tamamlaması gerekiyor (veri/bulut-ayar.js + README). Kurulum bitene kadar tüm veriler yalnızca bu tarayıcıda saklanır.",
            }
          )
        )
      );
      return;
    }

    if (!B().acik()) {
      kap.appendChild(
        el(
          "div",
          { class: "bos" },
          el("div", { class: "bos-ikon", text: "⏳" }),
          el("h3", { text: "Bulut bağlanıyor…" }),
          el("p", { text: "Bağlantı kurulamazsa internetini kontrol et ve sayfayı yenile." })
        )
      );
      B().baslat().then(() => {
        if (LGS.uygulama) LGS.uygulama.ciz();
      });
      return;
    }

    if (!B().girisVar()) {
      kap.appendChild(girisKarti());
      return;
    }

    kap.appendChild(profilKarti());
    if (B().moderatorMu()) {
      kap.appendChild(moderatorKarti());
    }
  }

  /* ------------------------------------------------------------ giriş */

  function girisKarti() {
    const kart = el("div", { class: "kart" });
    kart.appendChild(el("div", { class: "kart-bas", text: "Hesabına giriş yap" }));

    const form = el("div", { class: "form" });
    const isim = el("input", { type: "text", id: "h-isim", placeholder: "örn. Zehra", autocomplete: "nickname", maxlength: "40" });
    const eposta = el("input", { type: "email", id: "h-eposta", placeholder: "ornek@mail.com", autocomplete: "email" });
    const sifreSar = el("div", { class: "sifre-sar" });
    const sifre = el("input", {
      type: "password",
      id: "h-sifre",
      placeholder: "Şifre (en az 6 karakter)",
      autocomplete: "current-password",
    });
    const goz = el(
      "button",
      {
        type: "button",
        class: "goz-btn",
        title: "Şifreyi göster / gizle",
        "aria-label": "Şifreyi göster veya gizle",
        "aria-pressed": "false",
        text: "👁️",
      }
    );
    goz.addEventListener("click", () => {
      const goster = sifre.type === "password";
      sifre.type = goster ? "text" : "password";
      goz.textContent = goster ? "🙈" : "👁️";
      goz.setAttribute("aria-pressed", String(goster));
      goz.title = goster ? "Şifreyi gizle" : "Şifreyi göster";
    });
    sifreSar.appendChild(sifre);
    sifreSar.appendChild(goz);
    form.appendChild(alan("Hesap ismi (kayıtta kullanılır)", isim));
    form.appendChild(alan("E-posta", eposta));
    form.appendChild(alan("Şifre", sifreSar));

    const dugmeler = el("div", { class: "btn-satir" });
    const girisBtn = el("button", { class: "btn birincil", text: "Giriş yap" });
    const kayitBtn = el("button", { class: "btn hayalet", text: "Yeni hesap oluştur" });
    const sifreBtn = el("button", { class: "btn hayalet", text: "Şifremi unuttum" });
    dugmeler.appendChild(girisBtn);
    dugmeler.appendChild(kayitBtn);
    dugmeler.appendChild(sifreBtn);
    form.appendChild(dugmeler);
    kart.appendChild(form);

    async function isle(fn, basari, isimGerekli) {
      const e = eposta.value.trim();
      const s = sifre.value;
      const ad = isim.value.trim();
      if (isimGerekli && !ad) {
        bildir("Hesap ismini yaz (örn. Zehra)", "hata");
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
        bildir("Geçerli bir e-posta yaz", "hata");
        return;
      }
      if (s.length < 6) {
        bildir("Şifre en az 6 karakter olmalı", "hata");
        return;
      }
      [girisBtn, kayitBtn, sifreBtn].forEach((b) => (b.disabled = true));
      try {
        await fn(e, s, ad);
        bildir(basari);
      } catch (err) {
        bildir(hataCevir(err), "hata");
      } finally {
        [girisBtn, kayitBtn, sifreBtn].forEach((b) => (b.disabled = false));
      }
    }

    girisBtn.addEventListener("click", () => isle((e, s) => B().giris(e, s), "Hoş geldin! Verilerin eşitleniyor…", false));
    kayitBtn.addEventListener("click", () =>
      isle((e, s, ad) => B().kayitOl(e, s, ad), "Hesabın açıldı! Verilerin buluta taşınıyor…", true)
    );
    sifreBtn.addEventListener("click", async () => {
      const e = eposta.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
        bildir("Önce e-postanı yaz", "hata");
        return;
      }
      try {
        await B().sifreSifirla(e);
        bildir("Sıfırlama bağlantısı e-postana gönderildi");
      } catch (err) {
        bildir(hataCevir(err), "hata");
      }
    });

    kart.appendChild(
      el(
        "p",
        { class: "ipucu" },
        "Giriş yaparsan denemelerin ve fotoğrafların hesabına kaydedilir; başka cihazdan da görürsün. ",
        el("strong", { text: "Gizlilik: " }),
        "moderatör (bekirefeayar101@gmail.com) deneme karnelerini görebilir, değiştiremez. Şifreni biz dahil kimse göremez."
      )
    );
    return kart;
  }

  function hataCevir(err) {
    const kod = (err && err.code) || "";
    const mesaj = (err && err.message) || "";
    if (/permission-denied|insufficient permissions|Missing or insufficient/i.test(kod + " " + mesaj))
      return "Yetki hatası: veritabanı kuralları henüz yüklenmemiş olabilir. Birazdan tekrar dene.";
    if (kod.includes("user-not-found") || kod.includes("wrong-password") || kod.includes("invalid-credential"))
      return "E-posta veya şifre hatalı";
    if (kod.includes("email-already-in-use")) return "Bu e-posta zaten kayıtlı — giriş yap";
    if (kod.includes("invalid-email")) return "E-posta biçimi hatalı";
    if (kod.includes("too-many-requests")) return "Çok deneme oldu, biraz bekleyip tekrar dene";
    if (kod.includes("network")) return "İnternet bağlantısı yok";
    return "İşlem olmadı: " + (err && err.message ? err.message : "bilinmeyen hata");
  }

  function alan(etiket, oge) {
    return el("label", { class: "alan" }, el("span", { class: "alan-etiket", text: etiket }), oge);
  }

  /* ------------------------------------------------------------ profil */

  function profilKarti() {
    const ben = B().ben();
    const kart = el("div", { class: "kart" });
    kart.appendChild(el("div", { class: "kart-bas", text: "Hesabım" }));

    const satir = el("div", { class: "hesap-satir" });
    const avatarHarf = (ben.ad || ben.eposta || "?").trim()[0] || "?";
    satir.appendChild(el("div", { class: "hesap-avatar", text: avatarHarf.toLocaleUpperCase("tr") }));
    const bilgi = el("div", { class: "hesap-bilgi" });
    bilgi.appendChild(el("strong", { text: ben.ad || ben.eposta }));
    if (ben.ad) bilgi.appendChild(el("span", { class: "hesap-eposta", text: ben.eposta }));
    bilgi.appendChild(
      el(
        "span",
        { class: "hesap-rol " + (B().moderatorMu() ? "mod" : "") },
        B().moderatorMu() ? "🛡️ Moderatör" : "👤 Öğrenci"
      )
    );
    satir.appendChild(bilgi);
    kart.appendChild(satir);

    // İsim güncelleme
    const isimSatir = el("div", { class: "isim-satir" });
    const isimGirdi = el("input", {
      type: "text",
      value: ben.ad || "",
      placeholder: "Hesap ismin (örn. Zehra)",
      maxlength: "40",
      "aria-label": "Hesap ismi",
    });
    const isimBtn = el("button", { class: "btn kucuk", text: "İsmi kaydet" });
    isimBtn.addEventListener("click", async () => {
      isimBtn.disabled = true;
      try {
        const yeni = await B().adGuncelle(isimGirdi.value);
        bildir("İsmin güncellendi: " + yeni);
        LGS.uygulama.ciz();
      } catch (e) {
        bildir(e && e.message ? e.message : "İsim güncellenemedi", "hata");
      } finally {
        isimBtn.disabled = false;
      }
    });
    isimSatir.appendChild(isimGirdi);
    isimSatir.appendChild(isimBtn);
    kart.appendChild(isimSatir);

    const dugmeler = el("div", { class: "btn-satir" });
    const esitleBtn = el("button", { class: "btn birincil", text: "🔄 Şimdi eşitle" });
    esitleBtn.addEventListener("click", async () => {
      esitleBtn.disabled = true;
      try {
        const s = await B().esitle();
        if (s.yapildi) {
          bildir(
            "Eşitlendi: ↑" + s.yuklenenDeneme + " deneme, ↓" + s.indirilenDeneme + " deneme, " + s.yuklenenFoto + "↑/" + s.indirilenFoto + "↓ fotoğraf"
          );
          LGS.uygulama.ciz();
        } else {
          bildir("Eşitlenemedi", "hata");
        }
      } catch (e) {
        bildir(hataCevir(e), "hata");
      } finally {
        esitleBtn.disabled = false;
      }
    });
    const cikisBtn = el("button", { class: "btn hayalet", text: "Çıkış yap" });
    cikisBtn.addEventListener("click", async () => {
      await B().cikis();
      bildir("Çıkış yapıldı. Yerel verilerin bu cihazda duruyor.");
    });
    dugmeler.appendChild(esitleBtn);
    dugmeler.appendChild(cikisBtn);
    kart.appendChild(dugmeler);

    kart.appendChild(
      el("p", { class: "ipucu", text: "Girişliyken kaydettiğin her deneme ve fotoğraf otomatik olarak hesabına yazılır. Çıkış yapsan da bu cihazdaki kopyan silinmez." })
    );
    return kart;
  }

  /* ------------------------------------------------------------ moderatör */

  function moderatorKarti() {
    const kart = el("div", { class: "kart" });
    kart.appendChild(el("div", { class: "kart-bas", text: "🛡️ Moderatör paneli" }));
    kart.appendChild(
      el("p", { class: "ipucu", text: "Kayıtlı kullanıcıların deneme karnelerini görebilirsin (salt okunur — değiştiremezsin)." })
    );
    const liste = el("div", { class: "yonetim-liste", id: "mod-liste" });
    liste.appendChild(el("p", { class: "ipucu", text: "Yükleniyor…" }));
    kart.appendChild(liste);

    B().kullanicilariGetir().then(
      (kullanicilar) => {
        liste.innerHTML = "";
        const baskalari = kullanicilar.filter((k) => k.uid !== B().ben().uid);
        liste.appendChild(
          el("p", { class: "ipucu", text: baskalari.length + " kullanıcı kayıtlı (kendin hariç)." })
        );
        if (!baskalari.length) {
          liste.appendChild(el("p", { class: "ipucu", text: "Henüz başka kullanıcı yok." }));
          return;
        }
        baskalari.forEach((k) => {
          const satir = el(
            "div",
            { class: "yonetim-satir" },
            el(
              "div",
              { class: "y-bilgi" },
              el("strong", { text: k.ad || k.eposta || k.uid }),
              k.ad ? el("span", { text: k.eposta || "" }) : null
            ),
            el(
              "div",
              { class: "y-eylem" },
              el("button", { class: "btn kucuk", text: "Karneleri gör", onClick: () => kullaniciPenceresi(k) })
            )
          );
          liste.appendChild(satir);
        });
      },
      () => {
        liste.innerHTML = "";
        liste.appendChild(el("p", { class: "ipucu", text: "Liste alınamadı: veritabanı kuralları henüz yüklenmemiş olabilir. Birazdan tekrar dene." }));
      }
    );
    return kart;
  }

  function kullaniciPenceresi(kullanici) {
    const kap = el("div", { class: "form" });
    kap.appendChild(el("p", { class: "ipucu", text: "Yükleniyor…" }));
    pencere({ baslik: kullanici.eposta || "Kullanıcı", icerik: kap });

    B().kullaniciDenemeleri(kullanici.uid).then(async (denemeler) => {
      kap.innerHTML = "";
      if (!denemeler.length) {
        kap.appendChild(el("p", { class: "ipucu", text: "Bu kullanıcının denemesi yok." }));
        return;
      }
      for (const d of denemeler) {
        const h = LGS.puan.hesapla(d);
        const kart = el(
          "div",
          { class: "kart deneme-kart" },
          el(
            "div",
            { class: "deneme-ust" },
            el(
              "div",
              { class: "deneme-bilgi" },
              el("h3", { text: d.ad || "İsimsiz deneme" }),
              el("p", { class: "deneme-meta" }, tarihBicim(d.tarih) + (d.yayin ? " · " + d.yayin : ""))
            ),
            el("div", { class: "puan-rozet " + LGS.arayuz.puanSinif(h.puan) }, el("strong", { text: puanBicim(h.puan) }), el("span", { text: "puan" }))
          ),
          el(
            "div",
            { class: "deneme-satir" },
            el("span", { class: "rozet", text: "D " + h.toplamD }),
            el("span", { class: "rozet", text: "Y " + h.toplamY }),
            el("span", { class: "rozet", text: "B " + h.toplamB }),
            el("span", { class: "rozet vurgu", text: "Net " + LGS.arayuz.netBicim(h.toplamNet) })
          )
        );
        // Ders dökümü
        const tablo = el("div", { class: "mini-tablo" });
        h.dersler.forEach((s) => {
          const satir = el("div", { class: "mini-satir" });
          satir.appendChild(el("span", { text: s.kisa }));
          satir.appendChild(el("strong", { text: "D" + s.d + " Y" + s.y + " B" + s.b + " → " + LGS.arayuz.netBicim(s.net) }));
          tablo.appendChild(satir);
        });
        kart.appendChild(tablo);

        // Fotoğraflar (salt okunur)
        const fotoBtn = el("button", { class: "btn kucuk hayalet", text: "📷 Fotoğrafları gör" });
        fotoBtn.addEventListener("click", async () => {
          fotoBtn.disabled = true;
          try {
            const fotolar = await B().kullaniciFotolari(kullanici.uid, d.id);
            if (!fotolar.length) {
              bildir("Fotoğraf yok");
            } else {
              galeriPenceresi((d.ad || "Deneme") + " · Fotoğraflar", fotolar);
            }
          } catch (e) {
            bildir("Fotoğraflar alınamadı", "hata");
          } finally {
            fotoBtn.disabled = false;
          }
        });
        kart.appendChild(el("div", { class: "deneme-eylem" }, fotoBtn));
        kap.appendChild(kart);
      }
    });
  }

  function galeriPenceresi(baslik, fotolar) {
    const galeri = el("div", { class: "galeri" });
    fotolar.forEach((f) => {
      if (!f.url) return;
      const kart = el("div", { class: "foto-kart" });
      const img = el("img", { src: f.url, alt: f.ad || "", loading: "lazy" });
      img.addEventListener("click", () => LGS.arayuz.fotografGoster({ veri: f.url, ad: f.ad || "" }));
      kart.appendChild(img);
      kart.appendChild(el("div", { class: "foto-etiket" }, el("span", { text: f.ad || "" })));
      galeri.appendChild(kart);
    });
    pencere({ baslik: baslik, icerik: galeri });
  }

  LGS.hesap = { ciz };
})(window.LGS);
