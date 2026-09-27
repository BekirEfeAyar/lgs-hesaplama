/* ==========================================================================
   BULUT AYARLARI (Firebase)
   --------------------------------------------------------------------------
   Hesap sistemini açmak için:

   1. https://console.firebase.google.com adresinde "lgs-hesaplama" adında
      ücretsiz proje aç.
   2. Authentication → Sign-in method → "E-posta/Şifre" → Etkinleştir.
   3. Firestore Database → "Üretim modunda başlat" → konum: eur3.
   4. Storage → "Başlayın" (aynı bölge).
   5. Proje Ayarları (dişli simgesi) → "Uygulamalar" → Web uygulaması ekle
      → çıkan firebaseConfig değerlerini aşağıya yapıştır.
   6. Firestore → Kurallar sekmesi → firestore.rules dosyasının içeriğini
      yapıştır → Yayımla. Aynısını Storage → Rules için storage.rules ile yap.
   7. Aşağıda kullan seçeneğini true yap, siteyi yükle (git push).

   Ayrıntılı adımlar README.md içinde.
   ========================================================================== */

const BULUT_AYAR = {
  // Hesap sistemini açmak için true yap ve firebase bilgilerini doldur.
  kullan: true,

  firebase: {
    apiKey: "AIzaSyAp14o6ck8zMMX6_p56nVI8V1h5h0EqlJI",
    authDomain: "lgs-hesaplama-6e9da.firebaseapp.com",
    projectId: "lgs-hesaplama-6e9da",
    storageBucket: "lgs-hesaplama-6e9da.firebasestorage.app",
    messagingSenderId: "423643381532",
    appId: "1:423643381532:web:cad8f127405fa9fd2d84d9",
  },

  // Bu listedeki e-postalar moderatördür: herkesin deneme karnesini
  // GÖREBİLİR (değiştiremez, silemez). Kurallar dosyalarında da aynı
  // adres yazılıdır; değiştirirsen orayı da güncelle.
  moderatorEpostalar: ["bekirefeayar101@gmail.com"],
};
