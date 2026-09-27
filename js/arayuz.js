/* ==========================================================================
   Arayüz yardımcıları: DOM kurma, bildirim, pencere, fotoğraf görüntüleyici
   ========================================================================== */

(function (LGS) {
  "use strict";

  /* ------------------------------------------------------------ DOM kurma */

  /**
   * Etiket + öznitelik + çocuklardan öğe kurar.
   * el("div", {class:"kart"}, "metin", digerOge)
   */
  function el(etiket, oznitelikler) {
    const oge = document.createElement(etiket);
    if (oznitelikler) {
      Object.keys(oznitelikler).forEach((k) => {
        const v = oznitelikler[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") oge.className = v;
        else if (k === "html") oge.innerHTML = v;
        else if (k === "text") oge.textContent = v;
        // addEventListener olay adları küçük harf duyarlıdır: onClick -> "click"
        else if (k.startsWith("on") && typeof v === "function")
          oge.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === "style" && typeof v === "object") Object.assign(oge.style, v);
        else oge.setAttribute(k, v === true ? "" : v);
      });
    }
    for (let i = 2; i < arguments.length; i++) {
      const c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) c.forEach((x) => x && oge.appendChild(typeof x === "string" ? document.createTextNode(x) : x));
      else oge.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return oge;
  }

  /** HTML kaçışı — kullanıcı girdisini güvenle basar. */
  function kacis(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const $ = (sec) => document.querySelector(sec);
  const $$ = (sec) => Array.prototype.slice.call(document.querySelectorAll(sec));

  /* ------------------------------------------------------------ bildirim */

  let toastZaman = null;
  function bildir(mesaj, tur) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = mesaj;
    t.className = "toast gor" + (tur ? " " + tur : "");
    clearTimeout(toastZaman);
    toastZaman = setTimeout(() => (t.className = "toast"), 2600);
  }

  /* ------------------------------------------------------------ pencere */

  let kapatmaDuzenleyici = null;

  /**
   * Modal pencere açar.
   * @param {Object} secenekler {baslik, icerik(HTMLElement|string), eylemler:[{metin,tur,onTikla}]}
   */
  function pencere(secenekler) {
    const katman = $("#modal");
    katman.innerHTML = "";
    katman.hidden = false;
    kapatmaDuzenleyici = secenekler.kapatildiginda || null;

    const kutu = el("div", { class: "modal", role: "dialog", "aria-modal": "true" });
    kutu.appendChild(
      el(
        "div",
        { class: "modal-bas" },
        el("h3", { text: secenekler.baslik || "" }),
        el("button", { class: "modal-x", "aria-label": "Kapat", onClick: pencereKapat, html: "&#215;" })
      )
    );

    const govde = el("div", { class: "modal-govde" });
    if (typeof secenekler.icerik === "string") govde.innerHTML = secenekler.icerik;
    else govde.appendChild(secenekler.icerik);
    kutu.appendChild(govde);

    if (secenekler.eylemler && secenekler.eylemler.length) {
      const satir = el("div", { class: "modal-alt" });
      secenekler.eylemler.forEach((e) => {
        satir.appendChild(
          el("button", {
            class: "btn " + (e.tur || "hayalet"),
            text: e.metin,
            onClick: () => {
              if (!e.onTikla) return pencereKapat();
              const sonuc = e.onTikla();
              if (sonuc !== false) pencereKapat();
            },
          })
        );
      });
      kutu.appendChild(satir);
    }

    katman.appendChild(kutu);
    katman.onclick = (ev) => {
      if (ev.target === katman) pencereKapat();
    };
    const kapat = kutu.querySelector(".modal-x");
    if (kapat) kapat.focus();
  }

  function pencereKapat() {
    const katman = $("#modal");
    katman.hidden = true;
    katman.innerHTML = "";
    if (kapatmaDuzenleyici) kapatmaDuzenleyici();
    kapatmaDuzenleyici = null;
  }

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      const katman = $("#modal");
      if (katman && !katman.hidden) pencereKapat();
    }
  });

  /** Onay penceresi. */
  function onayla(baslik, mesaj, onayMetni, geriCagir) {
    pencere({
      baslik: baslik,
      icerik: el("p", { class: "modal-mesaj", text: mesaj }),
      eylemler: [
        { metin: "Vazgeç", tur: "hayalet" },
        {
          metin: onayMetni || "Evet, sil",
          tur: "tehlike",
          onTikla: () => {
            geriCagir();
          },
        },
      ],
    });
  }

  /* ------------------------------------------------------------ fotoğraf görüntüleyici */

  function fotografGoster(foto) {
    const buyuk = el("img", { src: foto.veri, alt: foto.ad || "Yanlışlar fotoğrafı" });
    const kap = el(
      "div",
      { class: "foto-sahne", onClick: () => pencereKapat() },
      buyuk,
      el("div", { class: "foto-alt", text: (foto.ad || "") + (foto.olcu ? " · " + foto.olcu : "") })
    );
    pencere({ baslik: foto.ad || "Fotoğraf", icerik: kap });
  }

  /* ------------------------------------------------------------ biçimlendirme */

  function puanBicim(p) {
    if (p === null || p === undefined || isNaN(p)) return "—";
    return p.toFixed(1).replace(".", ",");
  }

  function netBicim(n) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    return (Math.round(n * 100) / 100).toString().replace(".", ",");
  }

  function tarihBicim(iso) {
    if (!iso) return "";
    const parca = iso.split("-");
    if (parca.length !== 3) return iso;
    const aylar = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
    ];
    return parseInt(parca[2], 10) + " " + aylar[parseInt(parca[1], 10) - 1] + " " + parca[0];
  }

  /** Puanı renk sınıfına çevirir (grafik/etiket için). */
  function puanSinif(p) {
    if (p >= 420) return "seviye-ust";
    if (p >= 370) return "seviye-yuksek";
    if (p >= 320) return "seviye-orta";
    if (p >= 260) return "seviye-dusuk";
    return "seviye-cok-dusuk";
  }

  /** Tür etiketini döndürür. */
  function turAd(tur) {
    const t = LGS.LISE_TURLERI.find((x) => x.id === tur);
    return t ? t.ad : "Diğer";
  }

  LGS.arayuz = {
    el,
    $,
    $$,
    kacis,
    bildir,
    pencere,
    pencereKapat,
    onayla,
    fotografGoster,
    puanBicim,
    netBicim,
    tarihBicim,
    puanSinif,
    turAd,
  };
})(window.LGS);
