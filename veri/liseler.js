/* ==========================================================================
   ÖRNEK LİSE LİSTESİ
   --------------------------------------------------------------------------
   ⚠️ DİKKAT: Buradaki taban puanlar ve yüzdelik dilimler YAKLAŞIK ÖRNEK
   değerlerdir, resmî TAB (Taban Puan) verisi DEĞİLDİR. LGS taban puanları
   her yıl değişir.

   Bu liste sitenin boş görünmemesi için hazırlandı. Sitede
   "Veriler" sekmesinden her kaydı düzenleyebil, silebilir, kendi resmî
   listeni içe aktarabilirsin. Kendi eklediğin/düzelttiğin kayıtlar
   "resmi" olarak işaretlenir ve tahmini uyarısı kalkar.

   Alanlar: ad, sehir, ilce, tur, taban (puan), dilim (yüzdelik dilim)
   ========================================================================== */

const ORNEK_LISELER = [
  // ---------------- İSTANBUL ----------------
  { ad: "Galatasaray Lisesi", sehir: "İstanbul", ilce: "Kadıköy", tur: "fen", taban: 468, dilim: 0.2 },
  { ad: "İstanbul Erkek Lisesi", sehir: "İstanbul", ilce: "Kadıköy", tur: "fen", taban: 452, dilim: 0.35 },
  { ad: "Vefa Lisesi", sehir: "İstanbul", ilce: "Fatih", tur: "fen", taban: 440, dilim: 0.5 },
  { ad: "İstanbul Atatürk Fen Lisesi", sehir: "İstanbul", ilce: "Kadıköy", tur: "fen", taban: 425, dilim: 0.8 },
  { ad: "Kabataş Erkek Lisesi", sehir: "İstanbul", ilce: "Beşiktaş", tur: "fen", taban: 438, dilim: 0.6 },
  { ad: "Boğaziçi Üniversitesi Fen Lisesi", sehir: "İstanbul", ilce: "Beşiktaş", tur: "fen", taban: 415, dilim: 1.2 },
  { ad: "Işık Lisesi", sehir: "İstanbul", ilce: "Sarıyer", tur: "proje", taban: 470, dilim: 0.18 },
  { ad: "Robert Kolej", sehir: "İstanbul", ilce: "Sarıyer", tur: "proje", taban: 462, dilim: 0.28 },
  { ad: "Üsküdar Amerikan Lisesi", sehir: "İstanbul", ilce: "Üsküdar", tur: "proje", taban: 458, dilim: 0.33 },
  { ad: "M.T.E.V. Türk Eğitim Vakfı Özel Lisesi", sehir: "İstanbul", ilce: "Şişli", tur: "proje", taban: 455, dilim: 0.38 },
  { ad: "İstanbul Bilgi Üniversitesi Preparatory", sehir: "İstanbul", ilce: "Sarıyer", tur: "proje", taban: 450, dilim: 0.45 },
  { ad: "İstanbul Teknik Üniversitesi Lisesi", sehir: "İstanbul", ilce: "Şişli", tur: "fen", taban: 435, dilim: 0.7 },
  { ad: "Gazi Fen Lisesi", sehir: "İstanbul", ilce: "Fatih", tur: "fen", taban: 398, dilim: 2.5 },
  { ad: "Şişli Fen Lisesi", sehir: "İstanbul", ilce: "Şişli", tur: "fen", taban: 372, dilim: 4 },
  { ad: "Üsküdar Fen Lisesi", sehir: "İstanbul", ilce: "Üsküdar", tur: "fen", taban: 365, dilim: 4.6 },
  { ad: "Kadıköy Anadolu Lisesi", sehir: "İstanbul", ilce: "Kadıköy", tur: "fen", taban: 360, dilim: 5 },
  { ad: "Nişantaşı Anadolu Lisesi", sehir: "İstanbul", ilce: "Şişli", tur: "fen", taban: 340, dilim: 6.5 },
  { ad: "Bahçelievler Fen Lisesi", sehir: "İstanbul", ilce: "Bahçelievler", tur: "fen", taban: 345, dilim: 6 },
  { ad: "Bayrampaşa Anadolu Lisesi", sehir: "İstanbul", ilce: "Bayrampaşa", tur: "fen", taban: 312, dilim: 9 },
  { ad: "Zeytinburnu Anadolu Lisesi", sehir: "İstanbul", ilce: "Zeytinburnu", tur: "fen", taban: 305, dilim: 10 },
  { ad: "Pendik MTAL", sehir: "İstanbul", ilce: "Pendik", tur: "mtal", taban: 318, dilim: 8.5 },
  { ad: "Maltepe MTAL", sehir: "İstanbul", ilce: "Maltepe", tur: "mtal", taban: 296, dilim: 11.5 },
  { ad: "Esenler Borsa İstanbul MTAL", sehir: "İstanbul", ilce: "Esenler", tur: "mtal", taban: 288, dilim: 12.5 },
  { ad: "Kartal Anadolu Lisesi", sehir: "İstanbul", ilce: "Kartal", tur: "fen", taban: 300, dilim: 10.5 },
  { ad: "Ataşehir Anadolu Lisesi", sehir: "İstanbul", ilce: "Ataşehir", tur: "fen", taban: 320, dilim: 8 },

  // ---------------- ANKARA ----------------
  { ad: "T.C. Cumhurbaşkanı Anadolu Lisesi", sehir: "Ankara", ilce: "Çankaya", tur: "fen", taban: 432, dilim: 0.8 },
  { ad: "Ankara Fen Lisesi", sehir: "Ankara", ilce: "Çankaya", tur: "fen", taban: 440, dilim: 0.6 },
  { ad: "Atatürk Fen Lisesi", sehir: "Ankara", ilce: "Çankaya", tur: "fen", taban: 425, dilim: 1 },
  { ad: "Hacı Bayram Veli Fen Lisesi", sehir: "Ankara", ilce: "Çankaya", tur: "fen", taban: 418, dilim: 1.2 },
  { ad: "Türk Telekom Fen Lisesi", sehir: "Ankara", ilce: "Çankaya", tur: "fen", taban: 405, dilim: 1.8 },
  { ad: "Vakıf Fen Lisesi", sehir: "Ankara", ilce: "Çankaya", tur: "fen", taban: 398, dilim: 2.4 },
  { ad: "Dr. Mehmet Ali Tanrısev Anadolu Lisesi", sehir: "Ankara", ilce: "Çankaya", tur: "fen", taban: 350, dilim: 5.8 },
  { ad: "Kızılay Anadolu Lisesi", sehir: "Ankara", ilce: "Çankaya", tur: "fen", taban: 335, dilim: 7 },
  { ad: "Şehit Vurhan Vedat Fen Lisesi", sehir: "Ankara", ilce: "Çankaya", tur: "fen", taban: 358, dilim: 5.2 },
  { ad: "Keçiören Fen Lisesi", sehir: "Ankara", ilce: "Keçiören", tur: "fen", taban: 320, dilim: 8 },
  { ad: "Yenimahalle Fen Lisesi", sehir: "Ankara", ilce: "Yenimahalle", tur: "fen", taban: 300, dilim: 10.5 },
  { ad: "Etimesgut Fen Lisesi", sehir: "Ankara", ilce: "Etimesgut", tur: "fen", taban: 310, dilim: 9.2 },
  { ad: "Samhırlı Anadolu Lisesi", sehir: "Ankara", ilce: "Yenimahalle", tur: "fen", taban: 295, dilim: 11 },
  { ad: "Mamak MTAL", sehir: "Ankara", ilce: "Mamak", tur: "mtal", taban: 275, dilim: 14 },
  { ad: "Gölbaşı Fen Lisesi", sehir: "Ankara", ilce: "Gölbaşı", tur: "fen", taban: 342, dilim: 6.6 },

  // ---------------- İZMİR ----------------
  { ad: "İzmir Fen Lisesi", sehir: "İzmir", ilce: "Bornova", tur: "fen", taban: 428, dilim: 1 },
  { ad: "İzmir Erkek Lisesi", sehir: "İzmir", ilce: "Karşıyaka", tur: "proje", taban: 445, dilim: 0.5 },
  { ad: "Atatürk Fen Lisesi", sehir: "İzmir", ilce: "Konak", tur: "fen", taban: 412, dilim: 1.5 },
  { ad: "Karşıyaka Fen Lisesi", sehir: "İzmir", ilce: "Karşıyaka", tur: "fen", taban: 385, dilim: 3 },
  { ad: "Buca Fen Lisesi", sehir: "İzmir", ilce: "Buca", tur: "fen", taban: 362, dilim: 5 },
  { ad: "Bornova Anadolu Lisesi", sehir: "İzmir", ilce: "Bornova", tur: "fen", taban: 352, dilim: 5.6 },
  { ad: "Kemal Atatürk Anadolu Lisesi", sehir: "İzmir", ilce: "Karşıyaka", tur: "fen", taban: 340, dilim: 6.6 },
  { ad: "Bayraklı MTAL", sehir: "İzmir", ilce: "Bayraklı", tur: "mtal", taban: 288, dilim: 12.5 },

  // ---------------- BURSA ----------------
  { ad: "Bursa Fen Lisesi", sehir: "Bursa", ilce: "Nilüfer", tur: "fen", taban: 420, dilim: 1.2 },
  { ad: "Bursa Erkek Fen Lisesi", sehir: "Bursa", ilce: "Osmangazi", tur: "fen", taban: 400, dilim: 2.2 },
  { ad: "Nilüfer Anadolu Lisesi", sehir: "Bursa", ilce: "Nilüfer", tur: "fen", taban: 375, dilim: 3.8 },
  { ad: "Yıldırım Borsa İstanbul Fen Lisesi", sehir: "Bursa", ilce: "Yıldırım", tur: "fen", taban: 358, dilim: 5.2 },
  { ad: "İnegöl Anadolu Lisesi", sehir: "Bursa", ilce: "İnegöl", tur: "fen", taban: 300, dilim: 10.5 },
  { ad: "Gemlik MTAL", sehir: "Bursa", ilce: "Gemlik", tur: "mtal", taban: 290, dilim: 12 },

  // ---------------- ADANA ----------------
  { ad: "Adana Fen Lisesi", sehir: "Adana", ilce: "Seyhan", tur: "fen", taban: 410, dilim: 1.5 },
  { ad: "Çukurova Fen Lisesi", sehir: "Adana", ilce: "Çukurova", tur: "fen", taban: 380, dilim: 3.2 },
  { ad: "Adana Anadolu Lisesi", sehir: "Adana", ilce: "Seyhan", tur: "fen", taban: 345, dilim: 6 },
  { ad: "Yüreğir MTAL", sehir: "Adana", ilce: "Yüreğir", tur: "mtal", taban: 282, dilim: 13.2 },
  { ad: "Çukurova Sanayi MTAL", sehir: "Adana", ilce: "Çukurova", tur: "mtal", taban: 270, dilim: 14.5 },

  // ---------------- ANTALYA ----------------
  { ad: "Antalya Fen Lisesi", sehir: "Antalya", ilce: "Muratpaşa", tur: "fen", taban: 408, dilim: 1.6 },
  { ad: "Kepez Anadolu Lisesi", sehir: "Antalya", ilce: "Kepez", tur: "fen", taban: 335, dilim: 7 },
  { ad: "Antalya Akdeniz MTAL", sehir: "Antalya", ilce: "Muratpaşa", tur: "mtal", taban: 288, dilim: 12.5 },

  // ---------------- KONYA ----------------
  { ad: "Konya Fen Lisesi", sehir: "Konya", ilce: "Selçuklu", tur: "fen", taban: 405, dilim: 1.8 },
  { ad: "Selçuklu Anadolu Lisesi", sehir: "Konya", ilce: "Selçuklu", tur: "fen", taban: 348, dilim: 5.8 },
  { ad: "Meram MTAL", sehir: "Konya", ilce: "Meram", tur: "mtal", taban: 278, dilim: 13.5 },
  { ad: "Karatay Anadolu Lisesi", sehir: "Konya", ilce: "Karatay", tur: "fen", taban: 330, dilim: 7.5 },

  // ---------------- GAZİANTEP ----------------
  { ad: "Gaziantep Fen Lisesi", sehir: "Gaziantep", ilce: "Şahinbey", tur: "fen", taban: 402, dilim: 2 },
  { ad: "Şehitkamil Anadolu Lisesi", sehir: "Gaziantep", ilce: "Şehitkamil", tur: "fen", taban: 352, dilim: 5.4 },
  { ad: "Nizip MTAL", sehir: "Gaziantep", ilce: "Nizip", tur: "mtal", taban: 262, dilim: 15.5 },
  { ad: "Gaziantep Bilim ve Sanayi MTAL", sehir: "Gaziantep", ilce: "Şahinbey", tur: "mtal", taban: 272, dilim: 14.2 },

  // ---------------- MERSİN ----------------
  { ad: "Mersin Fen Lisesi", sehir: "Mersin", ilce: "Toroslar", tur: "fen", taban: 398, dilim: 2.2 },
  { ad: "Yenişehir Anadolu Lisesi", sehir: "Mersin", ilce: "Yenişehir", tur: "fen", taban: 350, dilim: 5.6 },
  { ad: "Akdeniz MTAL", sehir: "Mersin", ilce: "Akdeniz", tur: "mtal", taban: 280, dilim: 13.2 },
  { ad: "Mersin Ticaret Borsa MTAL", sehir: "Mersin", ilce: "Toroslar", tur: "mtal", taban: 292, dilim: 12 },

  // ---------------- KAYSERİ ----------------
  { ad: "Kayseri Fen Lisesi", sehir: "Kayseri", ilce: "Melikgazi", tur: "fen", taban: 396, dilim: 2.4 },
  { ad: "Kocasinan Anadolu Lisesi", sehir: "Kayseri", ilce: "Kocasinan", tur: "fen", taban: 344, dilim: 6.2 },
  { ad: "Talas MTAL", sehir: "Kayseri", ilce: "Talas", tur: "mtal", taban: 285, dilim: 12.8 },
  { ad: "Kayseri Kızıl Bölge MTAL", sehir: "Kayseri", ilce: "Melikgazi", tur: "mtal", taban: 300, dilim: 10.5 },

  // ---------------- SAMSUN ----------------
  { ad: "Samsun Fen Lisesi", sehir: "Samsun", ilce: "İlkadım", tur: "fen", taban: 395, dilim: 2.5 },
  { ad: "İlkadım Anadolu Lisesi", sehir: "Samsun", ilce: "İlkadım", tur: "fen", taban: 340, dilim: 6.5 },
  { ad: "Atakum MTAL", sehir: "Samsun", ilce: "Atakum", tur: "mtal", taban: 290, dilim: 12.2 },

  // ---------------- ESKİŞEHİR ----------------
  { ad: "Eskişehir Fen Lisesi", sehir: "Eskişehir", ilce: "Odunpazarı", tur: "fen", taban: 400, dilim: 2 },
  { ad: "Atatürk Fen Lisesi", sehir: "Eskişehir", ilce: "Tepebaşı", tur: "fen", taban: 385, dilim: 3 },
  { ad: "Eskişehir Anadolu Lisesi", sehir: "Eskişehir", ilce: "Odunpazarı", tur: "fen", taban: 330, dilim: 7.5 },
  { ad: "Eskişehir Şeker Fabrikası MTAL", sehir: "Eskişehir", ilce: "Odunpazarı", tur: "mtal", taban: 265, dilim: 15 },

  // ---------------- DİYARBAKIR ----------------
  { ad: "Diyarbakır Fen Lisesi", sehir: "Diyarbakır", ilce: "Bağlar", tur: "fen", taban: 388, dilim: 2.8 },
  { ad: "Özel Diyarbakır Fen Lisesi", sehir: "Diyarbakır", ilce: "Kayapınar", tur: "proje", taban: 375, dilim: 3.8 },
  { ad: "Diyarbakır GAP MTAL", sehir: "Diyarbakır", ilce: "Bağlar", tur: "mtal", taban: 270, dilim: 14.5 },

  // ---------------- TRABZON ----------------
  { ad: "Trabzon Fen Lisesi", sehir: "Trabzon", ilce: "Ortahisar", tur: "fen", taban: 382, dilim: 3.2 },
  { ad: "Trabzon Buluçlar-Ege Anadolu Lisesi", sehir: "Trabzon", ilce: "Ortahisar", tur: "fen", taban: 342, dilim: 6.4 },

  // ---------------- MALATYA ----------------
  { ad: "Malatya Fen Lisesi", sehir: "Malatya", ilce: "Battalgazi", tur: "fen", taban: 380, dilim: 3.5 },
  { ad: "Battalgazi Anadolu Lisesi", sehir: "Malatya", ilce: "Battalgazi", tur: "fen", taban: 335, dilim: 7 },

  // ---------------- SAKARYA ----------------
  { ad: "Sakarya Fen Lisesi", sehir: "Sakarya", ilce: "Serdivan", tur: "fen", taban: 415, dilim: 1.4 },
  { ad: "Sakarya Anadolu Lisesi", sehir: "Sakarya", ilce: "Adapazarı", tur: "fen", taban: 348, dilim: 5.8 },
  { ad: "Serdivan MTAL", sehir: "Sakarya", ilce: "Serdivan", tur: "mtal", taban: 305, dilim: 10 },

  // ---------------- KOCAELİ ----------------
  { ad: "Bilişim Vadisi Fen Lisesi", sehir: "Kocaeli", ilce: "İzmit", tur: "fen", taban: 412, dilim: 1.5 },
  { ad: "Kocaeli Fen Lisesi", sehir: "Kocaeli", ilce: "İzmit", tur: "fen", taban: 380, dilim: 3.2 },
  { ad: "Gebze Anadolu Lisesi", sehir: "Kocaeli", ilce: "Gebze", tur: "fen", taban: 340, dilim: 6.5 },
  { ad: "Kocaeli Şehit Ömer Halisdemir MTAL", sehir: "Kocaeli", ilce: "İzmit", tur: "mtal", taban: 295, dilim: 11 },

  // ---------------- DENİZLİ ----------------
  { ad: "Denizli Fen Lisesi", sehir: "Denizli", ilce: "Merkezefendi", tur: "fen", taban: 386, dilim: 3 },
  { ad: "Denizli Gazi MTAL", sehir: "Denizli", ilce: "Merkezefendi", tur: "mtal", taban: 268, dilim: 14.8 },

  // ---------------- ERZURUM ----------------
  { ad: "Erzurum Fen Lisesi", sehir: "Erzurum", ilce: "Yakutiye", tur: "fen", taban: 372, dilim: 4.2 },
  { ad: "Erzurum Anadolu Lisesi", sehir: "Erzurum", ilce: "Yakutiye", tur: "fen", taban: 322, dilim: 7.8 },

  // ---------------- MANİSA ----------------
  { ad: "Manisa Fen Lisesi", sehir: "Manisa", ilce: "Şehzadeler", tur: "fen", taban: 390, dilim: 2.6 },
  { ad: "Celal Bayar Anadolu Lisesi", sehir: "Manisa", ilce: "Yunusemre", tur: "fen", taban: 338, dilim: 6.8 },

  // ---------------- BALIKESİR ----------------
  { ad: "Balıkesir Fen Lisesi", sehir: "Balıkesir", ilce: "Altıeylül", tur: "fen", taban: 375, dilim: 4 },
  { ad: "Balıkesir MTAL", sehir: "Balıkesir", ilce: "Altıeylül", tur: "mtal", taban: 265, dilim: 15 },

  // ---------------- AYDIN ----------------
  { ad: "Aydın Fen Lisesi", sehir: "Aydın", ilce: "Efeler", tur: "fen", taban: 368, dilim: 4.5 },
  { ad: "Aydın Anadolu Lisesi", sehir: "Aydın", ilce: "Efeler", tur: "fen", taban: 328, dilim: 7.6 },
];
