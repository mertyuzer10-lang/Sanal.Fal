# Sanal Fal

Kızlara yönelik romantik temalı "sanal fal" sitesi. İsim → 10 soru → "fal açılıyor" animasyonu → "sizi bekleyen kişi" → 5 kısa not → bitiş.

## Dosyalar
- `index.html` / `css/style.css` / `js/app.js` — ana site
- `admin.html` / `js/admin.js` — gizli yönetim paneli
- `result.json` — admin'in yazdığı kalıcı fal sonucu (GitHub'a yüklenince herkese görünür)

## Admin panele giriş
- Sitede sağ alt köşedeki sönük 🔒 simgesine tıkla (ya da `admin.html`'i aç).
- Şifre: `sanalfal2024` (`js/admin.js` içindeki `ADMIN_PASSWORD`'ten değiştir).

## Fal sonucunu kalıcı yapma (önemli)
1. Admin panelinde **Fal Sonucu** sekmesine yaz, **Kaydet**.
2. **"Kalıcı Yap · result.json indir"** butonuna bas → `result.json` iner.
3. İnen dosyayı proje klasörüne koy (var olan `result.json`'un üstüne yaz).
4. Tüm dosyaları GitHub'a yükle.

Bundan sonra yazdığın sonuç, siteyi açan herkese kalıcı görünür.

> Not: Local'de (`file://`) açarken `result.json` okunamaz (tarayıcı engeller), bu yüzden local'de panelde kaydettiğin sonuç geçerli olur. GitHub Pages'te (`https://`) `result.json` sorunsuz okunur.

## GitHub Pages'te yayınlama
1. Tüm dosyaları bir GitHub reposuna yükle (kök dizine).
2. Repo ayarları → **Pages** → Source: `Deploy from a branch` → `main` / `/root`.
3. 1-2 dk sonra `https://kullaniciadi.github.io/repo-adi/` adresinde yayında.

## Sınırlar
- Katılımcı verileri `localStorage`'da tutulur → yalnızca girildiği tarayıcıda görünür. Tüm cihazlardan toplayıp tek tabloda görmek için bir backend (Firebase/Node) gerekir.
- Admin şifresi istemci tarafındadır → kaynak kodu gören bulur. Gerçek koruma için sunucu tarafı doğrulama gerekir.
