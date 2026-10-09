/* ==========================================================================
   8. SINIF KONU LİSTESİ — 2026/2027 (MEB 2018 programı, 8. sınıfta yürürlükte)
   Kaynak: 8_Sinif_Konu_Listesi_2026-2027.md
   Yapı: KONULAR[dersId] = [{ u: "Ünite adı", k: ["Konu 1", ...] }, ...]
   Ders id'leri js/ayarlar.js LGS.DERSLER ile aynıdır.
   İngilizce konuları "yabanci" dersine bağlıdır.
   ========================================================================== */

const KONULAR = {
  turkce: [
    { u: "Fiilimsiler", k: ["İsim-Fiil: -ma, -ış, -mak", "Sıfat-Fiil: -an, -ası, -mez, -ar, -dık, -ecek, -miş", "Zarf-Fiil: -ken, -alı, -ince, -ip, -arak, -dıkça, -madan, -meksizin, -casına"] },
    { u: "Sözcükte Anlam", k: ["Gerçek, Mecaz, Terim Anlam", "Eş, Zıt, Eş Sesli, Yakın Anlamlı Sözcükler", "Deyimler ve Atasözleri, Özdeyişler", "Söz Gruplarında Anlam"] },
    { u: "Cümlede Anlam", k: ["Neden-Sonuç, Amaç-Sonuç, Koşul-Sonuç, Karşılaştırma", "Öznel-Nesnel, Örtülü Anlam, Geçiş ve Bağlantı İfadeleri", "Tanım, Öneri, Varsayım, Eleştiri, Olasılık, Abartma, Yakınma, Sitem, Pişmanlık"] },
    { u: "Parçada Anlam", k: ["Ana Düşünce, Yardımcı Düşünce, Konu, Başlık", "Anlatım Biçimleri: Betimleme, Öyküleme, Açıklama, Tartışma", "Düşünceyi Geliştirme: Tanımlama, Karşılaştırma, Örnekleme, Tanık Gösterme, Benzetme, Sayısal Veri", "Paragraf Yapısı, Akışı Bozan Cümle, İkiye Bölme, Tamamlama", "Tablo-Grafik İnceleme, Görsel Okuma, Sözel Mantık"] },
    { u: "Cümlenin Öğeleri", k: ["Temel Öğeler: Özne, Yüklem", "Yardımcı Öğeler: Nesne (Belirtili-Belirtisiz), Dolaylı Tümleç, Zarf Tümleci"] },
    { u: "Cümle Türleri", k: ["Yüklemine Göre: İsim Cümlesi, Fiil Cümlesi", "Yapısına Göre: Basit, Birleşik, Sıralı, Bağlı", "Anlamına Göre: Olumlu, Olumsuz, Soru, Ünlem", "Yüklemin Yerine Göre: Kurallı, Devrik, Eksiltili"] },
    { u: "Fiilde Çatı", k: ["Öznesine Göre: Etken, Edilgen, Dönüşlü, İşteş", "Nesnesine Göre: Geçişli, Geçişsiz, Oldurgan, Ettirgen"] },
    { u: "Söz Sanatları", k: ["Benzetme, Kişileştirme, Konuşturma, Karşıtlık, Abartma"] },
    { u: "Yazım Kuralları", k: ["Büyük Harf, Birleşik Kelime, -de/-da/-ki, -mi, İkilemeler, Sayılar, Kısaltmalar"] },
    { u: "Noktalama İşaretleri", k: ["Nokta, Virgül, Noktalı Virgül, İki Nokta, Ünlem, Soru, Kesme, Tırnak, Yay Ayraç, Kısa Çizgi"] },
    { u: "Metin Türleri", k: ["Hikaye, Roman, Masal, Fabl, Destan", "Makale, Deneme, Fıkra, Röportaj, Haber, Günlük, Anı, Biyografi, Otobiyografi, Dilekçe"] },
    { u: "Anlatım Bozuklukları", k: ["Özne-Yüklem Uyumsuzluğu, Öğe Eksikliği, Gereksiz Sözcük, Anlam Belirsizliği, Mantık Hatası, Deyim Yanlışı"] },
  ],
  matematik: [
    { u: "Çarpanlar ve Katlar", k: ["Pozitif Tam Sayı Çarpanları", "Katlar", "EBOB – EKOK", "Aralarında Asal Sayılar"] },
    { u: "Üslü İfadeler", k: ["Tam Sayıların Kuvvetleri", "Negatif Kuvvet", "Üslü İfadelerde Çarpma ve Bölme", "Ondalık Gösterim Çözümleme", "Çok Büyük / Çok Küçük Sayılar ve Bilimsel Gösterim"] },
    { u: "Kareköklü İfadeler", k: ["Tam Kare Sayılar", "Karekök Alma, İrrasyonel Sayılar, Gerçek Sayılar", "Yaklaşık Değer Bulma, Sıralama", "Çarpma, Bölme, Toplama, Çıkarma", "Ondalık İfadelerin Karekökü"] },
    { u: "Veri Analizi", k: ["En Büyük / En Küçük Değer, Açıklık", "Aritmetik Ortalama, Ortanca, Tepe Değer", "Sütun, Çizgi ve Daire Grafiği, Grafik Dönüşümleri"] },
    { u: "Basit Olayların Olma Olasılığı", k: ["Eş Olasılıklı Sonuçlar, Olası Durumlar", "Olasılık Değeri (0-1 arası), Kesin / İmkansız Olay"] },
    { u: "Cebirsel İfadeler ve Özdeşlikler", k: ["Terim, Katsayı, Değişken", "Çarpma İşlemi", "Özdeşlikler: (a±b)², a²-b²", "Çarpanlara Ayırma"] },
    { u: "Doğrusal Denklemler", k: ["Birinci Dereceden Bir Bilinmeyenli Denklem Çözme", "Koordinat Sistemi, Sıralı İkililer", "Tablo – Denklem – Grafik İlişkisi", "Doğrunun Grafiği, Eksen Kesen / Paralel / Orijinden Geçen", "Eğim"] },
    { u: "Eşitsizlikler", k: ["Günlük Hayattan Eşitsizlik Cümlesi Yazma", "Sayı Doğrusunda Gösterme", "Eşitsizlik Çözme"] },
    { u: "Üçgenler", k: ["Kenarortay, Açıortay, Yükseklik İnşası", "Üçgen Eşitsizliği", "Kenar – Açı İlişkisi", "Pisagor Bağıntısı"] },
    { u: "Eşlik ve Benzerlik", k: ["Eş ve Benzer Şekillerde Kenar-Açı İlişkisi", "Benzerlik Oranı, Eş ve Benzer Çokgen Oluşturma"] },
    { u: "Dönüşüm Geometrisi", k: ["Öteleme", "Yansıma", "Ardışık Öteleme / Yansıma, Desen-Motif"] },
    { u: "Geometrik Cisimler", k: ["Dik Prizma (eleman, açınım)", "Dik Dairesel Silindir (eleman, açınım, yüzey alanı, hacim)", "Dik Piramit ve Dik Koni (eleman, açınım – alan/hacim yok)"] },
  ],
  fen: [
    { u: "Mevsimler ve İklim", k: ["Dünya’nın Dönme ve Dolanma Hareketleri", "Eksen Eğikliği", "Mevsimlerin Oluşumu", "Güneş Işınlarının Geliş Açısı, Gölge Boyu, Gece-Gündüz Süresi", "Ekinoks: 21 Mart – 23 Eylül", "Solstis: 21 Haziran – 21 Aralık", "Hava Olayları ve İklim Farkı", "Rüzgarın Oluşumu (Isınma Farkı – Basınç Farkı)", "İklim ve Hava Hareketleri"] },
    { u: "DNA ve Genetik Kod", k: ["Nükleotid, Gen, DNA, Kromozom İlişkisi", "DNA’nın Yapısı ve Kendini Eşlemesi", "Kalıtım, Baskın – Çekinik Gen, Genotip – Fenotip", "Çaprazlama, Akraba Evliliği", "Mutasyon ve Modifikasyon (Farkı + Örnekleri)", "Adaptasyon (Çevreye Uyum)", "Biyoteknoloji, GDO, Klonlama, Gen Tedavisi, Islah"] },
    { u: "Basınç", k: ["Katı Basıncı (Kuvvet / Alan, bıçak, traktör paleti, kar ayakkabısı)", "Sıvı Basıncı (Derinlik, Yoğunluk, Pascal Prensibi, Bileşik Kaplar)", "Gaz Basıncı (Açık Hava Basıncı, Torricelli Deneyi, Barometre, Manometre)", "Basıncın Günlük Hayat ve Teknolojideki Uygulamaları"] },
    { u: "Madde ve Endüstri", k: ["Periyodik Sistem (Grup, Periyot, Metal, Ametal, Yarı Metal, Soygaz)", "Fiziksel ve Kimyasal Değişimler", "Kimyasal Tepkimeler (Kütlenin Korunumu, Yanma, Paslanma)", "Asitler ve Bazlar (pH, Turnusol, Nötralleşme, Günlük Örnekler)", "Maddenin Isı ile Etkileşimi (Öz Isı, Hâl Değişimi, Isınma Grafiği)", "Türkiye’de Kimya Endüstrisi (Petrokimya, Gübre, İlaç, Boya, Cam, Seramik)"] },
    { u: "Basit Makineler", k: ["Sabit Makara, Hareketli Makara, Palanga", "Kaldıraç (Destek, Yük, Kuvvet Kolu)", "Eğik Düzlem, Çıkrık, Vida, Dişli Çark, Kasnak", "Kuvvet Kazancı, İş Kolaylığı, Verim"] },
    { u: "Enerji Dönüşümleri ve Çevre Bilimi", k: ["Besin Zinciri ve Enerji Akışı (Üretici, Tüketici, Ayrıştırıcı, Enerji Piramidi)", "Fotosentez ve Solunum", "Madde Döngüleri (Su, Oksijen, Karbon, Azot Döngüsü)", "Çevre Sorunları (Sera Etkisi, Küresel Isınma, Asit Yağmuru, Hava-Su-Toprak Kirliliği)", "Sürdürülebilir Kalkınma, Geri Dönüşüm, Tasarruf"] },
    { u: "Elektrik Yükleri ve Elektrik Enerjisi", k: ["Elektriklenme (Sürtünme, Dokunma, Etki ile)", "İletken – Yalıtkan, Topraklama, Elektroskop", "Seri ve Paralel Bağlama, Ampul Parlaklığı", "Akım, Gerilim, Direnç, Ohm Yasası", "Elektrik Enerjisi ve Güç (Sigorta, Fatura, Tasarruf)"] },
  ],
  inkilap: [
    { u: "Bir Kahraman Doğuyor", k: ["XX. Yüzyıl Başında Osmanlı (Siyasi, Sosyal, Ekonomik Durum)", "Mustafa Kemal’in Çocukluğu ve Öğrenim Hayatı (Selanik, Manastır, Harp Okulu)", "Kişilik Özellikleri ve Fikir Hayatını Etkileyen Kişiler/Olaylar", "Trablusgarp Savaşı, Balkan Savaşları", "I. Dünya Savaşı’nda Osmanlı ve Mustafa Kemal (Çanakkale, Kafkas, Suriye)"] },
    { u: "Millî Uyanış – Bağımsızlık Yolunda Atılan Adımlar", k: ["I. Dünya Savaşı Neden-Sonuç, Osmanlı’nın Savaşa Girmesi", "Mondros Ateşkes Antlaşması ve İşgaller", "Cemiyetler (Zararlı / Yararlı), Kuvâ-yı Milliye", "Mustafa Kemal’in Samsun’a Çıkışı (19 Mayıs 1919)", "Havza Genelgesi, Amasya Genelgesi", "Erzurum Kongresi, Sivas Kongresi, Temsil Heyeti", "Misak-ı Millî, Son Osmanlı Meclisi, İstanbul’un İşgali", "TBMM’nin Açılışı (23 Nisan 1920), Ayaklanmalar, Sevr Antlaşması"] },
    { u: "Millî Bir Destan – Ya İstiklal Ya Ölüm!", k: ["Doğu Cephesi (Ermeniler, Gümrü Antlaşması)", "Güney Cephesi (Fransızlar, Ankara Antlaşması)", "Batı Cephesi: I. İnönü, II. İnönü, Eskişehir-Kütahya, Sakarya, Büyük Taarruz", "Mudanya Ateşkes Antlaşması", "Lozan Barış Antlaşması ve Kazanımları"] },
    { u: "Atatürkçülük ve Çağdaşlaşan Türkiye", k: ["Atatürk İlkeleri: Cumhuriyetçilik, Milliyetçilik, Halkçılık, Devletçilik, Laiklik, İnkılapçılık", "Siyasi: Saltanatın Kaldırılması, Cumhuriyetin İlanı, Halifeliğin Kaldırılması", "Hukuk: Türk Medeni Kanunu, Kadına Haklar", "Eğitim-Kültür: Tevhid-i Tedrisat, Harf İnkılabı, Millet Mektepleri, Türk Tarih/Dil Kurumu, Üniversite Reformu", "Toplumsal: Şapka, Takvim-Saat-Ölçü, Soyadı Kanunu", "Ekonomi: İzmir İktisat Kongresi, Aşar’ın Kaldırılması, 1929 Buhranı", "Sağlık Alanı Çalışmaları", "Nutuk, Gençliğe Hitabe, Atatürk’ün Kişiliği"] },
    { u: "Demokratikleşme Çabaları", k: ["Cumhuriyet Halk Fırkası", "Terakkiperver Cumhuriyet Fırkası", "Serbest Cumhuriyet Fırkası", "Mustafa Kemal’e Suikast Girişimi", "Cumhuriyet’e Tehditler (Şeyh Sait, Menemen)"] },
    { u: "Atatürk Dönemi Türk Dış Politikası", k: ["Temel İlkeler: Yurtta Sulh Cihanda Sulh, Tam Bağımsızlık", "Yabancı Okullar, Dış Borçlar, Musul, Nüfus Mübadelesi", "Milletler Cemiyeti’ne Giriş", "Balkan Antantı, Sadabat Paktı", "Montrö Boğazlar Sözleşmesi", "Hatay’ın Anavatana Katılması"] },
    { u: "Atatürk’ün Ölümü ve Sonrası", k: ["Atatürk’ün Ölümü (10 Kasım 1938), Yerli-Yabancı Basında Yankılar", "İsmet İnönü’nün Cumhurbaşkanı Seçilmesi", "Atatürk’ün Eserleri (En Büyük Eserim Cumhuriyet)", "II. Dünya Savaşı Neden-Sonuç, Türkiye’nin Denge Siyaseti", "Savaşın Türkiye’ye Siyasi-Ekonomik Etkileri", "Çok Partili Hayata Geçiş (1946 Seçimlerine Kadar)"] },
  ],
  din: [
    { u: "Kader İnancı", k: ["Kader ve Kaza İnancı", "Allah Her Şeyi Bir Ölçüye Göre Yaratmıştır (Kamer 49)", "Evrendeki Yasalar: Fiziksel, Biyolojik, Toplumsal", "İnsanın İradesi ve Kader (Cüz’i İrade, Sorumluluk)", "Kaderle İlgili Kavramlar: Tevekkül, Ecel, Rızık, Ömür", "Bir Peygamber Tanıyorum: Hz. Musa (a.s.)", "Bir Ayet Tanıyorum: Ayet el-Kürsi ve Anlamı"] },
    { u: "Zekât ve Sadaka", k: ["İslam’ın Paylaşma ve Yardımlaşmaya Verdiği Önem", "Zekât İbadeti (Nisap, 1/40, Kimlere Verilir / Verilmez)", "Sadaka, Sadaka-i Cariye, Fıtır Sadakası (Fitre)", "Zekât ve Sadakanın Bireysel ve Toplumsal Faydaları", "Bir Peygamber Tanıyorum: Hz. Şuayb (a.s.) – Ölçü-Tartıda Doğruluk", "Bir Sure Tanıyorum: Maûn Suresi ve Anlamı"] },
    { u: "Din ve Hayat", k: ["Din Kavramı, İnanma İhtiyacı (Fıtri)", "Din, Birey ve Toplum İlişkisi", "Dinin Temel Gayesi (Akıl, Can, Nesil, Mal, Din Emniyeti)", "Kur’an’ın Ana Konuları (İnanç, İbadet, Ahlak, Muamelat)", "Bir Peygamber Tanıyorum: Hz. Yusuf (a.s.)", "Bir Sure Tanıyorum: Asr Suresi ve Anlamı"] },
    { u: "Hz. Muhammed’in Örnekliği", k: ["Üsve-i Hasene (En Güzel Örnek)", "Doğruluğu ve Güvenilirliği (el-Emin)", "Merhametli ve Affedici Oluşu", "Cesaret ve Kararlılığı", "Hakkı Gözetmesi, İstişareye Önem Vermesi", "Hikmetli Söz ve Davranışları (Hadis – Sünnet)", "Bir Sure Tanıyorum: Kureyş Suresi ve Anlamı"] },
    { u: "Kur’an-ı Kerim ve Özellikleri", k: ["İslam’ın Temel Kaynakları: Kur’an ve Sünnet", "Vahiy, 610 Ramazan, 23 Yılda İniş", "Derlenmesi ve Çoğaltılması (Hz. Ebubekir – Hz. Osman)", "Yapısı: 30 Cüz, 114 Sure, 6236 Ayet, Mekki-Medeni", "Temel Özellikleri ve Ana Konuları", "Kur’an’a Saygı, Meal-Tefsir Kavramı"] },
  ],
  yabanci: [
    { u: "Friendship", k: ["Making invitations, Accepting – Refusing, Apologizing, Giving reasons", "like + V-ing / to + V"] },
    { u: "Teen Life", k: ["Daily routines, Hobbies, Likes – Dislikes, Preferences", "Present Simple Tense, Adverbs of Frequency (always, usually, never)"] },
    { u: "In the Kitchen", k: ["Cooking, Recipes, Kitchen tools, Quantities, Process description", "Imperatives, some / any, much / many / a lot of, Sequencing words (first, then, finally)"] },
    { u: "On the Phone", k: ["Phone conversations, Asking for someone, Taking – Leaving messages, Requests", "Can / Could for requests, Will for instant decisions"] },
    { u: "The Internet", k: ["Internet use, Online safety, Giving suggestions and warnings", "should / shouldn’t, must / mustn’t for rules"] },
    { u: "Adventures", k: ["Adventure sports, Talking about experiences, Courage – Fear", "Present Perfect Tense (have / has + V3), ever / never"] },
    { u: "Tourism", k: ["Travel, Holiday plans, Directions, Tourist attractions, Suggestions", "Past Simple for holiday experiences, Superlatives"] },
    { u: "Chores", k: ["House chores, Responsibilities, Asking for help", "have to / has to, must, Frequency adverbs"] },
    { u: "Science", k: ["Inventions, Scientists, Experiments, Describing a process", "Passive Voice (is / was + V3), Sequencers"] },
    { u: "Natural Forces", k: ["Natural disasters, Weather events, Predictions, Cause – Effect", "Will for prediction, Comparatives, Cause-effect linkers (because, so, therefore)"] },
  ],
};
