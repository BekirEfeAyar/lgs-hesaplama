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
- **3096 program, 81 il** — 2025 ilk yerleştirme taban puanları
- Puanını gir → o puanla **yerleşebileceğin** liseleri gör
- **Bölge → İl → İlçe** zincirleme filtre (973 ilçe tamamı)
- Tür filtresi (Fen / Anadolu / Sosyal / MTAL / İmam Hatip / Proje)
- Alan / dal bilgisi (örn. Fen Bilimleri, Elektrik-Elektronik Tek.)
- Her satırda 2024 taban puanı da yazar (değişimi gör)
- Tabanı oluşmamış programlar "puan yok" diye işaretlenir
- Ada göre arama, 5 farklı sıralama, sayfalama (100'lük sayfalar)
- "Sadece puanıma yetenler" anahtarı
- Her satırda ne kadar puan gerektiği yazıyor

### Veri yönetimi
- Kendi lise kayıtlarını ekle / düzenle / sil (il ve ilçe seçimi açılır listeden)
- **Toplu içe aktarma:** Excel'den kopyalayıp yapıştır
- CSV dışa aktarma (alan, 2024 puan, kontenjan, kod, kaynak sütunlarıyla)
- JSON yedek alma ve geri yükleme
- Eski sürümden geçişte kendi resmî kayıtların korunur

---

## Puan nasıl hesaplanıyor?

```
Net  = Doğru − (Yanlış ÷ 3)
Boş  = Soru − Doğru − Yanlış
Puan = (Toplam Net ÷ 90) × 500
```

### Güncel LGS soru dağılımı (90 soru, MEB Kılavuzu)

| Oturum | Ders | Soru |
|---|---|---:|
| 1. Oturum (Sözel, 75 dk) | Türkçe | 20 |
| 1. Oturum | T.C. İnkılap Tarihi ve Atatürkçülük | 10 |
| 1. Oturum | Din Kültürü ve Ahlak Bilgisi | 10 |
| 1. Oturum | Yabancı Dil | 10 |
| 2. Oturum (Sayısal, 80 dk) | Matematik | 20 |
| 2. Oturum | Fen Bilimleri | 20 |
| | **Toplam** | **90** |

### Örnek

| Ders | Doğru | Yanlış | Boş | Net |
|---|---:|---:|---:|---:|
| Türkçe | 16 | 3 | 1 | 15,00 |
| İnkılap | 8 | 2 | 0 | 7,33 |
| Din | 9 | 1 | 0 | 8,67 |
| Yabancı Dil | 8 | 1 | 1 | 7,67 |
| Matematik | 12 | 6 | 2 | 10,00 |
| Fen | 15 | 3 | 2 | 14,00 |
| **Toplam** | **68** | **16** | **6** | **62,67** |

→ Puan = (62,67 ÷ 90) × 500 = **348,1**

---

## ⚠️ Önemli uyarılar

**1. Bu resmî MEB puanı değildir.**
Resmî LGS puanı, sınav ortalama ve standart sapma verileri kullanılarak MEB tarafından
hesaplanır. Bu sitedeki değer doğru/yanlış oranından çıkan **doğrusal bir tahmindir**.
Gerçek puanın bir miktar altında ya da üstünde olabilir.

**2. Lise puanları 2025 verisidir, 2026 henüz açıklanmadı.**
Listedeki 3096 program, unsalim.com'un "2025 LGS Taban Puanları, Puan Farkları ve
Yerleşme Bilgileri" rehberinden alındı (MEB / e-Okul verilerine dayanır). Her satırda
kaynak etiketi ("2025") var. 2026 taban puanları yerleştirme sonuçlarıyla belli olur.

Yüzdelik dilim bu kaynakta YOK — o yüzden sitede dilim sütunu boş. Kendi verini
eklersen dilimi girebilirsin.

İl ve ilçe listesi ise **tam ve gerçektir** (81 il / 973 ilçe, turkiyeapi.dev).

Bu uyarılar sitede her ekranda görünür. Doğru karar için mutlaka resmî kaynaklardan teyit et.

### Kendi lise listeni eklemek

**Veriler** sekmesinden iki yolun var:

**Yol 1 — Tek tek:** `+ Lise ekle` → il açılır listeden 81ilden seçilir, ilçe listesi
otomatik dolar, sonra tür ve taban puan girilir. `Resmî veri` kutusunu işaretle,
listedeki "örnek veri" etiketi kalkar.

**Yol 2 — Toplu:** `Toplu içe aktar` → Excel'den kopyaladığın satırları yapıştır:

```
Lise adı; İl; İlçe; Taban puan; Yüzdelik dilim; Tür
Atatürk Fen Lisesi; Ankara; Çankaya; 425,5; 1,2; fen
Nilüfer MTAL; Bursa; Nilüfer; 318,25; 8,5; mtal
```

İl adı 81 ilin gerek adlarından biri olmalı. Tanınmayan il adları içe aktarma
öncesi uyarı olarak gösterilir. Ayırıcı `;` veya `|` olabilir, ondalık için virgül ya da nokta.
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
│   ├── ayarlar.js          Dersler, soru sayıları, il/ilçe yardımcıları
│   ├── depo.js             localStorage + IndexedDB katmanı
│   ├── puan.js             Puan hesaplama motoru
│   ├── arayuz.js           DOM yardımcıları, pencere, bildirim
│   ├── denemeler.js        Deneme ekranı
│   ├── liseler.js          Lise Rehberi ekranı
│   ├── veriler.js          Veri yönetimi ekranı
│   └── uygulama.js         Tema, sekmeler, başlatma
├── veri/
│   ├── il-ilce.js          81 il + 973 ilçe (turkiyeapi.dev)
│   └── liseler.js          3096 program: 2025+2024 taban puanları (unsalim.com rehberi)
├── test/
│   └── puan.test.js        Puan motoru testleri (node test/puan.test.js)
└── README.md
```

## Test

```bash
node test/puan.test.js     # 48 test — puan motoru
```

Tarayıcı testleri (gerçek tıklama, 51 test) depo dışında CDP sürücüsüyle çalıştırılır.
`arayuz.js` içindeki `el()` yardımcısında olay adları **küçük harfe çevrilir**
(`onClick` → `click`); bu unutulursa hiçbir buton çalışmaz.

## Envanter

| Dosya | KB |
|---|---:|
| index.html | 3,4 |
| style.css | 23,0 |
| js/*.js | 8 dosya, ~68 |
| veri/il-ilce.js | 23,5 |
| veri/liseler.js | ~750 |
| test/puan.test.js | 7,8 |

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

Puan motoru testleri tarayıcısız çalışır:

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
