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

### Yanlışlarım (her denemede)
- **Yanlış Yaptığım Sorular:** denemeye sınırsız fotoğraf ekle (telefondan çektiğin kareler dâhil)
- **Yanlış Yaptığım Konular:** ders → ünite → konu seçerek yanlışlarını işaretle (8. sınıf MEB konu listesi, 6 ders, 207 konu)
- Görseller otomatik küçültülür (1400 px, JPEG) — yer tasarrufu için
- Tıkla, büyüt, incele

### Konular (yanlış arşivi)
- Hangi konuda, hangi denemelerde yanlış yaptığını tek ekranda gör
- Ders filtresi + konu arama + "sadece yanlış yaptıklarım" anahtarı
- Her konunun altında deneme çipleri (ad · tarih · puan) — tıkla, denemeyi aç

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
Puan = 194,75 + Σ (Ders Neti × Ders Katsayısı)
```

Katsayılar (2025 verilerine dayalı yayınlanmış tahmin modeli):
Türkçe ×4,348 · Matematik ×4,2538 · Fen ×4,123 ·
İnkılap ×1,666 · Din ×1,899 · Yabancı Dil ×1,5075.
Full net ≈ 500 verir. Katsayılı model, MEB'in standart puan hesabına
doğrusal yaklaştırımdır — aynı nette Türkçe/Matematik/Fen ağırlığı daha fazladır.

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

→ Puan = 194,75 + (15×4,348 + 7,33×1,666 + 8,67×1,899 + 7,67×1,5075 + 10×4,2538 + 14×4,123) = **400,5**

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

Yüzdelik dilimler tabanpuanlari.net verisidir; her kayıt taban puanıyla birebir
eşleştirilerek doğrulandı (2602/3096 kayıt, %84). Eşleşmeyen kayıtlarda dilim
boş görünür. Kendi verini eklersen dilimi girebilirsin.

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
│   ├── denemeler.js        Deneme ekranı + Yanlışlarım (soru/konu sekmeleri)
│   ├── konular.js          Konular ekranı (yanlış arşivi ağacı)
│   ├── liseler.js          Lise Rehberi ekranı
│   ├── veriler.js          Veri yönetimi ekranı
│   ├── bulut.js            Firebase Auth/Firestore senkronu
│   ├── hesap.js            Hesap sekmesi + moderatör paneli
│   └── uygulama.js         Tema, sekmeler, başlatma
├── veri/
│   ├── il-ilce.js          81 il + 973 ilçe (turkiyeapi.dev)
│   ├── konular.js          8. sınıf MEB konu listesi (6 ders, 207 konu)
│   └── liseler.js          3096 program: 2025+2024 taban puanları (unsalim.com rehberi)
├── test/
│   ├── puan.test.js        Puan motoru testleri (node test/puan.test.js)
│   └── konular.test.js     Konu verisi bütünlük testleri (node test/konular.test.js)
└── README.md
```

## Test

```bash
node test/puan.test.js     # 52 test — puan motoru
node test/konular.test.js  # 14 test — konu verisi bütünlüğü
```

Tarayıcı testleri (gerçek tıklama, 51 test) depo dışında CDP sürücüsüyle çalıştırılır.
`arayuz.js` içindeki `el()` yardımcısında olay adları **küçük harfe çevrilir**
(`onClick` → `click`); bu unutulursa hiçbir buton çalışmaz.

## Envanter

| Dosya | KB |
|---|---:|
| index.html | 3,4 |
| style.css | 23,0 |
| js/*.js | 11 dosya, ~130 |
| veri/il-ilce.js | 23,5 |
| veri/konular.js | 13,4 |
| veri/liseler.js | ~750 |
| test/puan.test.js | 7,8 |
| test/konular.test.js | 2,5 |

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

## Hesap sistemi (e-posta ile giriş + veritabanı)

Site varsayılan olarak **tamamen yerel** çalışır: hesap yok, veri yalnızca tarayıcıda.
E-posta ile girişi açmak için ücretsiz Firebase projesi gerekir (kurulum ~10 dakika,
sonrası bedava katmanda kalır).

### Adım adım kurulum (site sahibi yapar)

1. https://console.firebase.google.com → **Proje oluştur** → ad: `lgs-hesaplama`
   (Analytics'i kapatabilirsin, şart değil) → Oluştur.
2. Sol menü **Authentication** → **Sign-in method** → **E-posta/Şifre** →
   **Etkinleştir** → Kaydet. (Bu sayfayı bir kez açmak servisi hazırlar.)
3. Sol menü **Firestore Database** → **Veritabanı oluştur** →
   **Üretim modunda başlat** → konum `eur3 (Europe)` → Etkinleştir.
   (Storage GEREKMEZ — fotoğraflar Firestore belgelerinde durur.)
4. Sol üst dişli → **Proje ayarları** → en altta **"Uygulamalar"** →
   `</>` (Web) → takma ad `lgs` → **Uygulamayı kaydet**.
   Ekrana çıkan `firebaseConfig` içindeki 6 değeri kopyala.
5. `veri/bulut-ayar.js` dosyasını aç:
   - `kullan: false` → `kullan: true`
   - `firebase: { ... }` içine 6 değeri yapıştır.
6. Firebase konsolunda **Firestore Database → Kurallar** sekmesi:
   depodaki `firestore.rules` dosyasının **tamamını** yapıştır → **Yayımla**.
7. Değişikliği yükle:

```bash
git add .
git commit -m "hesap sistemi acildi"
git push
```

2 dakika sonra sitede **Hesap** sekmesi giriş formu gösterir.

### Nasıl çalışır?

- Öğrenci **Hesap** sekmesinden e-posta + şifreyle kaydolur/giriş yapar.
- Girişte yerel denemeler buluta **birleştirilir** (aynı kayıtta yenisi kazanır,
  hiçbir şey silinmez). Sonrası otomatik: her kaydetme buluta da yazılır.
- Fotoğraflar Firestore belgelerinde durur (1400px JPEG ~100-300KB, belge
  limiti 1MB). Ayrı Storage kurulumu gerekmez, kredi kartı/fatura istemez.
- Çıkış yapılsa da cihazdaki kopya durur; site hesapsız da tam çalışır.
- **Gizlilik:** giriş ekranında yazar — moderatör karneleri görebilir.
  Şifreler Firebase'de saklanır, kimse (site sahibi dahil) göremez.

### Moderatör (bekirefeayar101@gmail.com)

- Bu adresle giriş yapınca **🛡️ Moderatör paneli** açılır.
- Kayıtlı kullanıcı listesi → **Karneleri gör** → deneme + ders dökümü + fotoğraflar.
- **Salt okunur:** kurallar (`firestore.rules`) yazmayı ve
  silmeyi yasaklar. Kural dosyasında e-posta iki yerde yazılıdır
  (`bulut-ayar.js` + kurallar); adres değişirse ikisini de güncelle.

### Ücretsiz katman yeter mi?

Spark (bedava) katman: günde 50.000 okuma / 20.000 yazma, 1 GB depolama.
Birkaç yüz öğrenci için rahat yeter. Kotalar Firebase konsolunda görünür.

### Test

```bash
node test/puan.test.js     # 52 test — puan motoru
```

Bulut birleştirme mantığı (`birlestirDeneme`, moderatör e-posta kontrolü)
Firebase gerektirmez, mantık testleri depo dışındaki betiklerle çalıştırılır.
Gerçek bulut akışı (kayıt → giriş → eşitleme → moderatör görüntüleme)
Firebase projesi kurulduktan sonra iki tarayıcıda el ile doğrulanmalıdır:
1. A cihazında hesap aç, deneme + fotoğraf ekle.
2. B cihazında aynı hesapla gir → verilerin geldiğini gör.
3. Moderatör mailiyle gir → Hesap sekmesinde kullanıcıyı ve karnes çatısını gör.

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
