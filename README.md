/* ==========================================================================
   LGS Deneme Takipçisi
   ========================================================================== */

# LGS Deneme Takipçisi

**Canlı adres:** https://bekirefeayar.github.io/lgs-hesaplama/

LGS denemelerini kaydet, yanlışlarının fotoğrafını arşivle, netlerinden puanını hesapla ve
o puanla hangi liseye yerleşebileceğini gör.

Kurulum, sunucu, hesap yönetimi, üyelik — hiçbir şey gerekmiyor. Siteyi aç, kullanmaya başla.

---

## Özellikler

### Denemeler
- Ders bazlı doğru / yanlış gir, net ve puan **anında** hesaplansın
- Deneme adı, yayın, tarih ve kişisel not
- İstatistik: deneme sayısı, ortalama puan, ortalama net, en yüksek, en düşük
- İki denemeden sonra puan gelişim grafiği
- Arşiv: her deneme kalıcı olarak saklanır, istediğin zaman açıp düzenlersin

### Yanlış fotoğraf arşivi
- Denemeye sınırsız fotoğraf ekle (telefondan çektiğin kareler dâhil)
- Görseller otomatik küçültülür (1400 px, JPEG) — yer tasarrufu için
- Tıkla, büyüt, incele
- Fotoğraflar **sadece senin cihazında** durur, internete yüklenmez

### Lise Rehberi
- Puanını gir → o puanla **yerleşebileceğin** liseleri gör
- Şehir ve ilçeye göre filtrele
- Tür filtresi (Fen / MTAL / Proje / Sosyal)
- Ada göre arama
- 4 farklı sıralama
- "Sadece puanıma yetenler" anahtarı
- Her satırda ne kadar puan gerektiği yazıyor

### Veri yönetimi
- Kendi lise kayıtlarını ekle / düzenle / sil
- **Toplu içe aktarma:** Excel'den kopyalayıp yapıştır
- CSV dışa aktarma
- JSON yedek alma ve geri yükleme

---

## Puan nasıl hesaplanıyor?

```
Net  = Doğru − (Yanlış ÷ 3)
Boş  = Soru − Doğru − Yanlış
Puan = (Toplam Net ÷ 160) × 500
```

### Güncel LGS soru dağılımı (160 soru)

| Oturum | Ders | Soru |
|---|---|---:|
| 1. Oturum | Türkçe | 40 |
| 1. Oturum | T.C. İnkılap Tarihi ve Atatürkçülük | 10 |
| 1. Oturum | Din Kültürü ve Ahlak Bilgisi | 10 |
| 2. Oturum | Matematik | 40 |
| 2. Oturum | Fen Bilimleri | 30 |
| 2. Oturum | Sosyal Bilgiler | 30 |
| | **Toplam** | **160** |

### Örnek

| Ders | Doğru | Yanlış | Boş | Net |
|---|---:|---:|---:|---:|
| Türkçe | 30 | 8 | 2 | 27,33 |
| İnkılap | 8 | 2 | 0 | 7,33 |
| Din | 9 | 1 | 0 | 8,67 |
| Matematik | 25 | 12 | 3 | 21,00 |
| Fen | 20 | 8 | 2 | 17,33 |
| Sosyal | 24 | 5 | 1 | 22,33 |
| **Toplam** | **116** | **36** | **8** | **104,00** |

→ Puan = (104 ÷ 160) × 500 = **325,0**

---

## ⚠️ Önemli uyarılar

**1. Bu resmî MEB puanı değildir.**
Resmî LGS puanı, sınav ortalama ve standart sapma verileri kullanılarak MEB tarafından
hesaplanır. Bu sitedeki değer doğru/yanlış oranından çıkan **doğrusal bir tahmindir**.
Gerçek puanın bir miktar altında ya da üstünde olabilir.

**2. Lise taban puanları örnek veridir.**
Depodaki 109 lise, sitenin boş görünmemesi için **yaklaşık örnek değerlerle** hazırlandı.
**Resmî TAB (taban puan) verisi değildir.** LGS taban puanları her yıl değişir.

Bu iki uyarı sitede her ekranda görünür. Doğru karar için mutlaka resmî kaynaklardan teyit et.

### Kendi lise listeni eklemek

**Veriler** sekmesinden iki yolun var:

**Yol 1 — Tek tek:** `+ Lise ekle` → ad, şehir, ilçe, tür, taban puan, yüzdelik dilim.
`Resmî veri` kutusunu işaretle, listedeki "örnek veri" etiketi kalkar.

**Yol 2 — Toplu:** `Toplu içe aktar` → Excel'den kopyaladığın satırları yapıştır:

```
Lise adı; Şehir; İlçe; Taban puan; Yüzdelik dilim; Tür
Atatürk Fen Lisesi; Ankara; Çankaya; 425,5; 1,2; fen
Nilüfer MTAL; Bursa; Nilüfer; 318,25; 8,5; mtal
```

Ayırıcı olarak `;` veya `|` kullanabilirsin. Ondalık için virgül ya da nokta olur.
Tür adları: `fen`, `mtal`, `proje`, `sosyal`, `diger`

---

## Veriler nerede saklanıyor?

**Yalnızca senin tarayıcında.**

- Deneme kayıtları ve lise listesi → `localStorage`
- Yanlış fotoğrafları → `IndexedDB` (localStorage 5 MB sınırına takılmaz)

Hiçbir şey sunucuya gönderilmez. Bu da şu anlama geliyor:

- Cihaz değiştirirsen veriler **gelmez** → cihazlar arası taşımak için JSON yedeği al
- Tarayıcı verilerini silersen veriler gider
- Gizli sekmede açarsan ayrı bir boş sayfa görürsün

**Veriler** sekmesinden düzenli olarak `⬇ Yedek al (JSON)` yap. Yedeği istediğin cihazda
`⬆ Yedekten geri yükle` ile geri alabilirsin.

---

## Dosya yapısı

```
lgs-hesaplama/
├── index.html              Sayfa iskeleti
├── style.css               Tasarım (açık + koyu tema)
├── .nojekyll               GitHub Pages ayarı
├── js/
│   ├── ayarlar.js          Dersler, soru sayıları, sabitler
│   ├── depo.js             localStorage + IndexedDB katmanı
│   ├── puan.js             Puan hesaplama motoru
│   ├── arayuz.js           DOM yardımcıları, pencere, bildirim
│   ├── denemeler.js        Deneme ekranı
│   ├── liseler.js          Lise Rehberi ekranı
│   ├── veriler.js          Veri yönetimi ekranı
│   └── uygulama.js         Tema, sekmeler, başlatma
├── veri/
│   └── liseler.js          Örnek lise listesi (109 kayıt)
└── README.md
```

## Envanter

| Dosya | KB |
|---|---:|
| index.html | 3,1 |
| style.css | 19,0 |
| js/*.js | 8 dosya |
| veri/liseler.js | 17,0 |

## Tarayıcı desteği

Chrome, Edge, Firefox, Safari (güncel sürümler). Mobil uyumlu, çevrimdışı da çalışır.

---

## Geliştirici için

### Yerelde çalıştırma

Kurulum gerekmez, dosyaya çift tıkla da çalışır. Sunucuyla denemek istersen:

```bash
npx serve .
# veya
python -m http.server 8000
```

### Test

Puan motoru ve arayüz için test betikleri repo dışında tutulur; `js/puan.js` saf
fonksiyonlardan oluşur, tarayıcısız Node üzerinde test edilebilir:

```bash
node test/puan.test.js
```

### Sürüm numarası

`index.html` içindeki `?v=` parametreleri GitHub Pages önbelleğini baypas eder.
Dosya değiştirdiğinde `js/ayarlar.js` içindeki `LGS.SURUM` değerini ve `?v=` parametrelerini
artır — kullanıcılar güncel dosyayı görsün.

### Yayınlama

```bash
git add .
git commit -m "degisiklik"
git push
```

1–2 dakika içinde site kendiliğinden güncellenir.
