/* ==========================================================================
   Uygulama çekirdeği: tema, sekmeler, ilk açılış
   ========================================================================== */

(function (LGS) {
  "use strict";

  const { $, $$, bildir } = LGS.arayuz;
  const D = LGS.depo;

  const SAYFALAR = {
    denemeler: { ad: "Denemeler", ciz: (k) => LGS.denemeler.ciz(k) },
    konular: { ad: "Konular", ciz: (k) => LGS.konular.ciz(k) },
    lise: { ad: "Lise Rehberi", ciz: (k) => LGS.lise.ciz(k) },
    veriler: { ad: "Veriler", ciz: (k) => LGS.veriler.ciz(k) },
    hesap: { ad: "Hesap", ciz: (k) => LGS.hesap.ciz(k) },
  };

  let aktifSayfa = "denemeler";

  /* ---------------------------------------------------------------- tema */

  function temayiUygula(koyu) {
    document.documentElement.setAttribute("data-tema", koyu ? "koyu" : "acik");
    const ikon = $("#tema-ikon");
    if (ikon) {
      ikon.innerHTML = koyu
        ? '<path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0-5v3m0 14v3M2 12h3m14 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1m0-15.6-2.1 2.1M6.3 17.7l-2.1 2.1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>'
        : '<path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9"/>';
    }
    const dugme = $("#tema-btn");
    if (dugme) dugme.setAttribute("aria-label", koyu ? "Açık temaya geç" : "Koyu temaya geç");
  }

  function temaYukle() {
    const kayitli = localStorage.getItem(LGS.ANAHTAR.tema);
    if (kayitli) {
      temayiUygula(kayitli === "koyu");
      return;
    }
    const koyu = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    temayiUygula(!!koyu);
  }

  function temaDegistir() {
    const koyu = document.documentElement.getAttribute("data-tema") === "koyu";
    const yeni = !koyu;
    temayiUygula(yeni);
    localStorage.setItem(LGS.ANAHTAR.tema, yeni ? "koyu" : "acik");
  }

  /* ---------------------------------------------------------------- yönlendirme */

  function sekmeyiIsaretle(ad) {
    $$(".sekme").forEach((s) => s.classList.toggle("etkin", s.dataset.sayfa === ad));
  }

  function ciz() {
    const icerik = $("#icerik");
    if (!icerik) return;
    icerik.innerHTML = "";
    const sayfa = SAYFALAR[aktifSayfa] || SAYFALAR.denemeler;
    try {
      sayfa.ciz(icerik);
    } catch (e) {
      console.error("Sayfa çizilemedi:", e);
      icerik.appendChild(
        LGS.arayuz.el(
          "div",
          { class: "bos" },
          LGS.arayuz.el("h3", { text: "Bir şeyler ters gitti" }),
          LGS.arayuz.el("p", { text: String(e && e.message ? e.message : e) })
        )
      );
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function sayfayaGit(ad, dogrudan) {
    if (!SAYFALAR[ad]) return;
    aktifSayfa = ad;
    sekmeyiIsaretle(ad);
    if (location.hash.slice(1) !== ad) {
      history.replaceState(null, "", "#" + ad);
    }
    ciz();
  }

  /* ---------------------------------------------------------------- ilk açılış */

  function baslat() {
    temaYukle();

    // Bulut yapılandırılmışsa SDK'yı yükle (yapılandırılmamışsa sessizce atlanır)
    if (LGS.bulut) {
      LGS.bulut.baslat();
    }

    const temaBtn = $("#tema-btn");
    if (temaBtn) temaBtn.addEventListener("click", temaDegistir);

    $$(".sekme").forEach((s) => {
      s.addEventListener("click", () => sayfayaGit(s.dataset.sayfa));
    });

    window.addEventListener("hashchange", () => {
      const ad = location.hash.slice(1);
      if (SAYFALAR[ad] && ad !== aktifSayfa) sayfayaGit(ad);
    });

    // İlk açılışta lise listesini tohumla
    D.liseleriGetir();

    const baslangic = location.hash.slice(1);
    sayfayaGit(SAYFALAR[baslangic] ? baslangic : "denemeler", true);

    // Tarayıcı geri/ileri düğmeleri
    window.addEventListener("popstate", () => {
      const ad = location.hash.slice(1);
      if (SAYFALAR[ad] && ad !== aktifSayfa) sayfayaGit(ad);
    });
  }

  LGS.uygulama = { baslat, ciz, sayfayaGit, temaDegistir };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", baslat);
  } else {
    baslat();
  }
})(window.LGS);
