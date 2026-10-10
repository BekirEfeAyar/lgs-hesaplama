/* ==========================================================================
   Ana Menü ekranı: açılış sayfası, kartlardan diğer sekmelere geçiş
   ========================================================================== */

(function (LGS) {
  "use strict";

  const { el } = LGS.arayuz;
  const D = LGS.depo;

  // Sekme çubuğundaki çizgi ikonlarla aynı dil
  const IKON = {
    denemeler: '<svg viewBox="0 0 24 24"><path d="M5 3h11l4 4v14H5zm10 1.5V8h3.5z"/></svg>',
    konular: '<svg viewBox="0 0 24 24"><path d="M4 5h16v3H4zm0 5h16v3H4zm0 5h10v3H4z"/></svg>',
    lise: '<svg viewBox="0 0 24 24"><path d="M12 3 2 8l10 5 8-4v6h2V8zM6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5l-6 3z"/></svg>',
    veriler: '<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8m8.9 4a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L16 3H8l-.4 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L8 21h8l.4-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2"/></svg>',
    hesap: '<svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m0 2c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5"/></svg>',
  };

  function sayi(n) {
    return typeof n === "number" ? String(n) : "—";
  }

  function ciz(kap) {
    let denemeSayisi = 0;
    let liseSayisi = 0;
    try {
      denemeSayisi = D.denemeleriGetir().length;
    } catch (e) {}
    try {
      liseSayisi = D.liseleriGetir().length;
    } catch (e) {}

    const kartlar = [
      { sayfa: "denemeler", baslik: "Denemeler", aciklama: "Deneme sonuçlarını kaydet, puanını otomatik hesapla.", rozet: denemeSayisi ? sayi(denemeSayisi) + " deneme" : null },
      { sayfa: "konular", baslik: "Konular", aciklama: "Konu listeni tut, yanlış yaptıklarını işaretle.", rozet: null },
      { sayfa: "lise", baslik: "Lise Rehberi", aciklama: "2025 taban puanları ve yüzdelik dilimlerle lise ara.", rozet: liseSayisi ? sayi(liseSayisi) + " program" : null },
      { sayfa: "veriler", baslik: "Veriler", aciklama: "Yedek al, geri yükle, lise listeni yönet.", rozet: null },
      { sayfa: "hesap", baslik: "Hesap", aciklama: "Bulut eşitlemesi ve hesap ayarları.", rozet: null },
    ];

    kap.appendChild(
      el(
        "div",
        { class: "kart menu-karsilama" },
        el("p", { class: "menu-ust", text: "LGS Deneme Takipçisi" }),
        el("h2", { text: "Nereden başlamak istersin?" }),
        el("p", { class: "menu-alt", text: "Kartlardan birini seç; üstteki menüden her zaman gezinebilirsin." })
      )
    );

    kap.appendChild(
      el(
        "div",
        { class: "menu-izgara" },
        ...kartlar.map((k) =>
          el(
            "button",
            { class: "kart menu-kart", onClick: () => LGS.uygulama.sayfayaGit(k.sayfa) },
            el(
              "span",
              { class: "menu-ust-satir" },
              el("span", { class: "menu-ikon", html: IKON[k.sayfa] }),
              el("span", { class: "menu-ok", text: "→", "aria-hidden": "true" })
            ),
            el("strong", { class: "menu-baslik", text: k.baslik }),
            el("span", { class: "menu-aciklama", text: k.aciklama }),
            k.rozet ? el("span", { class: "menu-rozet", text: k.rozet }) : null
          )
        )
      )
    );
  }

  LGS.menu = { ciz };
})(window.LGS);
