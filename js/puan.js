/* ==========================================================================
   Puan motoru
   --------------------------------------------------------------------------
   Net  = Doğru − (Yanlış ÷ 3)
   Boş  = Soru − Doğru − Yanlış
   Puan = 194.752082 + Σ (Ders Neti × Ders Katsayısı)

   Katsayılar: Türkçe 4.348, Matematik 4.2538, Fen 4.123,
               İnkılap 1.666, Din 1.899, Yabancı Dil 1.5075.
   (2025 verilerine dayalı yayınlanmış tahmin modeli; full net ≈ 500.)

   Uyarı: Bu, resmî MEB puanı DEĞİLDİR. MEB puanı sınav ortalama ve standart
   sapma verileriyle dönüştürülerek hesaplanır. Buradaki değer deneme
   performansını gösteren bir tahmindir.
   ========================================================================== */

(function (LGS) {
  "use strict";

  /** Tek bir dersin netini döndürür (negatif net 0'a çekilir). */
  function netHesapla(dogru, yanlis) {
    const d = Math.max(0, Number(dogru) || 0);
    const y = Math.max(0, Number(yanlis) || 0);
    return Math.max(0, d - y / LGS.YANLIS_ETKI);
  }

  /**
   * Bir denemenin tüm ders sonuçlarını ve puanını hesaplar.
   * @returns {{
   *   dersler: Array, toplamD:number, toplamY:number, toplamB:number,
   *   toplamNet:number, puan:number, yuzde:number, oturumlar:Object, hatali:Array
   * }}
   */
  function hesapla(deneme) {
    const satirlar = [];
    const oturumlar = { 1: { d: 0, y: 0, b: 0, net: 0 }, 2: { d: 0, y: 0, b: 0, net: 0 } };
    let toplamD = 0;
    let toplamY = 0;
    let toplamB = 0;
    let toplamNet = 0;
    const hatali = [];

    LGS.DERSLER.forEach((ders) => {
      const giris = (deneme && deneme.dersler && deneme.dersler[ders.id]) || {};
      const d = Math.max(0, Number(giris.d) || 0);
      const y = Math.max(0, Number(giris.y) || 0);

      // Doğru + yanlış soru sayısını aşamaz.
      let uyari = null;
      if (d > ders.soru) uyari = "Doğru, soru sayısından fazla";
      else if (d + y > ders.soru) uyari = "Doğru + yanlış, soru sayısından fazla";
      if (uyari) hatali.push(ders.kisa + ": " + uyari);

      const dd = Math.min(d, ders.soru);
      const yy = Math.min(y, Math.max(0, ders.soru - dd));
      const b = Math.max(0, ders.soru - dd - yy);
      const net = netHesapla(dd, yy);

      toplamD += dd;
      toplamY += yy;
      toplamB += b;
      toplamNet += net;

      const o = oturumlar[ders.oturum];
      o.d += dd;
      o.y += yy;
      o.b += b;
      o.net += net;

      satirlar.push({
        id: ders.id,
        ad: ders.ad,
        kisa: ders.kisa,
        soru: ders.soru,
        oturum: ders.oturum,
        d: dd,
        y: yy,
        b: b,
        net: net,
        uyari: uyari,
      });
    });

    // MEB tarzı katsayılı puan: taban + her dersin neti × katsayısı
    let puan = LGS.PUAN_TABANI;
    satirlar.forEach((s) => {
      puan += s.net * (LGS.KATSAYI[s.id] || 0);
    });
    // Güvenli aralık: MEB puanı 100-500 bandındadır
    puan = Math.max(100, Math.min(LGS.MAX_PUAN, puan));

    return {
      dersler: satirlar,
      toplamD: toplamD,
      toplamY: toplamY,
      toplamB: toplamB,
      toplamNet: toplamNet,
      puan: puan,
      yuzde: (toplamNet / LGS.TOPLAM_SORU) * 100,
      oturumlar: oturumlar,
      hatali: hatali,
    };
  }

  /**
   * Deneme listesinden istatistik özeti çıkarır.
   */
  function ozet(denemeler) {
    if (!denemeler.length) {
      return { adet: 0, ortalama: 0, enYuksek: 0, enDusuk: 0, sonPuan: null, seri: [] };
    }
    const seri = denemeler
      .map((d) => ({ id: d.id, ad: d.ad, tarih: d.tarih, ...hesapla(d) }))
      .sort((a, b) => (a.tarih < b.tarih ? -1 : 1));

    const puanlar = seri.map((s) => s.puan);
    const toplam = puanlar.reduce((t, p) => t + p, 0);

    return {
      adet: denemeler.length,
      ortalama: toplam / denemeler.length,
      enYuksek: Math.max.apply(null, puanlar),
      enDusuk: Math.min.apply(null, puanlar),
      sonPuan: seri.length ? seri[seri.length - 1].puan : null,
      ortalamaNet: (seri.reduce((t, s) => t + s.toplamNet, 0) / denemeler.length),
      seri: seri,
    };
  }

  /** İki denemenin puan farkını veren okunur metin. */
  function yorum(sonraki, onceki) {
    if (sonraki === null || onceki === null) return "";
    const fark = sonraki - onceki;
    if (Math.abs(fark) < 0.5) return "Önceki denemeyle aynı seviyedesin.";
    return fark > 0
      ? "Önceki denemeye göre " + fark.toFixed(1) + " puan arttın."
      : "Önceki denemeye göre " + Math.abs(fark).toFixed(1) + " puan düştün.";
  }

  LGS.puan = { hesapla, netHesapla, ozet, yorum };
})(window.LGS);
