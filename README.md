# BilSec Guardian — MVP / Demo

**BilSec Guardian**, iç BT departmanı olmayan KOBİ'ler ve küçük kritik altyapı operatörleri için yerli bir siber güvenlik yönetim platformudur. Bu depo, TÜBİTAK BİGG (1812) İş Fikri başvurusu için hazırlanan **çalışan demo**yu içerir.

Demoda gösterilen çekirdek modül **BilSec Compass** (SSB Siber Hijyen-KOBİ uyum otomasyonu) ve yapay zekâ katmanı **BilSec Brain**'dir.

---

## Kurulum ve Çalıştırma

Gereksinim: Node.js 18+ (test: Node 24).

```bash
npm install
npm run dev
```

Ardından tarayıcıda **http://localhost:5173** açılır. Uygulama tek komutla ayağa kalkar; backend veya veritabanı gerektirmez.

## Yapay Zekâ Anahtarı (opsiyonel ama önerilir)

BilSec Brain, canlı politika üretimi için Anthropic Claude API kullanır. Anahtar **yoksa** uygulama yine çalışır — yapay zekâ özellikleri önceden gömülü örnek (fallback) çıktıyı gösterir, böylece görüşmede internet/anahtar riski olmaz.

Canlı çağrıyı etkinleştirmek için:

1. `.env.example` dosyasını `.env` olarak kopyalayın.
2. `ANTHROPIC_API_KEY=` satırına anahtarınızı yazın.
3. `npm run dev`'i yeniden başlatın.

Anahtar **yalnızca dev sunucusunda** (`/api/brain` proxy'si) kullanılır; tarayıcıya sızmaz. Model varsayılanı `claude-sonnet-5` olup `CLAUDE_MODEL` ile değiştirilebilir.

---

## İki Katmanlı Mimari: Edge (yerinde) + Bulut (Yönetilen CSIRT)

BilSec Guardian iki fiziksel düzlemde çalışır ve bu ayrım artık ekranlara yansır:

- **🖥️ BilSec Edge — müşteri lokasyonunda (on-prem cihaz).** Kimlik yönetimi (Directory), yerinde altyapı (DHCP/DNS/VPN/sertifika/yedek), log/telemetri toplama, EDR ajanları ve **yerelde çalışan otomatik izolasyon** (Hammer) bu cihazda yaşar. Ağ kopsa bile temel koruma otonom sürer.
- **☁️ BilSec Bulut SOC — Yönetilen CSIRT-as-a-Service.** Çok-müşterili SIEM agregasyonu, Atlas triyajı, olay/vaka yönetimi, SOME → SGB/USOM bildirimi, Scribe raporlama ve 7/24 SOC nöbeti BilSec'in merkezi bulutunda **hizmet olarak** işletilir. Bir bulut SOC, sahadaki tüm Edge cihazlarını izler (**N müşteri lokasyonu → 1 bulut SOC**). Görevler ayrılığı korunur: BilSec bağımsız operatördür, müşterinin BT'si değil.

Sağ üstteki üç yönlü anahtar bu düzlemleri gezmenizi sağlar: **Müşteri · Yönetici**, **Müşteri · Uzman**, **BilSec Bulut SOC**. Bulut SOC portföyünde "Bu demo" etiketli müşteriye (Örnek Savunma A.Ş.) tıklamak, o müşterinin tek-kiracılı Uzman ekranlarına iner; Uzman kenar çubuğundaki "☁️ Bulut SOC portföyüne dön" ile geri çıkılır.

## Demo Akışı (3–4 dakika)

Uygulama **Yönetici (Patron) Görünümü** ile açılır: jargonsuz, 4 büyük kart (Güvenlik Durumu trafik ışığı, Belgeye Hazırlık, BilSec Bugün Ne Yaptı, Sıradaki Adım). İlk açılışta otomatik **tanıtım turu** başlar (sağ üstten tekrar izlenebilir). Sağ üstteki görünüm anahtarı teknik katmanı ve bulut SOC'u açar; her karttaki "Detayları gör" ilgili teknik ekrana götürür.

Aşağıdaki teknik (Uzman) akış, "Detayları gör" ya da anahtar ile açılır:

1. **Genel Bakış** — Örnek Savunma Sanayi A.Ş.'nin uyum skoru (~%80), hedef seviye, 13 kategori kapsaması, fidye yazılımı hazırlığı.
2. **Compass Uyum** — 13 kategori / 52 gerçek SSB kontrolü; seviye filtresi (Başlangıç/Orta/İleri) ve canlı kapsama yüzdesi. Directory ile otomatik karşılanan kontroller "Uygun · Kaynak: Directory" rozetiyle işaretlidir.
3. **Kimlik Yönetimi (BilSec Directory)** *(tek ekran kanıtı)* — OU ağacı, kullanıcılar (kasıtlı sorunlu kayıtlar: MFA pasif, gereksiz yerel admin, atıl hesap), bilgisayarlar, gruplar ve dizin politikaları. Politika kartındaki "SSB xx" rozetine tıklayınca Compass'ta ilgili kontrole gider; politikayı aç/kapa yaptığınızda skor canlı değişir. "Bu dizin yapılandırması 52 kontrolün 11'ini otomatik karşılıyor."
4. **Yerinde Altyapı (BilSec Edge)** — DHCP kiralamaları (host'lar diğer modüllerle tutarlı), DNS/NTP, dosya paylaşımları, VPN, sertifikalar (biri 20 gün içinde dolacak — sarı uyarı), yedek durumu (bugün 03:12 ✓) ve servis sağlığı. Kartlardaki "SSB xx" rozetleri Compass'ta ilgili kontrolü **"Uygun · Kaynak: Yerinde Altyapı"** yapar (9 kontrol).
5. **İzleme (SIEM)** — 7/24 alarm akışı (host adları Directory ile tutarlı), MITRE ATT&CK eşlemesi, önem/durum/host filtreleri. İK-PC-07 fidye alarmını seçin → **Atlas** ile canlı triyaj → "Vaka oluştur".
6. **Olaylar & SOME** — Vaka yönetimi + zaman çizelgeli olay geçmişi; **Scribe** ile olay müdahale raporu. SOME alt sekmesi: kayıt durumu, olgunluk, SGB'ye olay bildirimi (simüle) ve dönemsel SOME faaliyet raporu (Scribe).
7. **BilSec Brain → Politika Taslağı** *(demo yıldızı)* — Eksik bir kontrol seçin → "Politika üret" → canlı Türkçe politika taslağı.
8. **BilSec Brain → Delil Anonimleştir** — Örnek delil metnindeki kişisel verileri (ad, TCKN, e-posta, telefon, adres) KVKK gereği maskeleyin.
9. **Fidye Koruması** — İK-PC-07 alarmı → "Otomatik izolasyon" (Hammer) → 60 sn'lik müdahale zaman çizelgesi (hızlandırılmış).
10. **Rapor** — "SSB Siber Hijyen-KOBİ Uyum Durum Raporu" önizlemesi → Yazdır/PDF.

### Uçtan uca döngü (demonun bel kemiği)
SIEM alarmı (İK-PC-07 fidye) → **Atlas** triyajı → **Vaka oluştur** → **Hammer** otomatik izolasyon (Fidye paneli) → **Scribe** olay raporu → **SGB'ye bildir** (SOME) → SOME faaliyet raporuna yansıma → Compass'ta **Olay İhlal Yönetimi (10.1)** kontrolü otomatik "Uygun · Kaynak: Olay Yönetimi". Zincirin her adımı ekranlar arası tıklanabilir.

> İpucu: Ekran kaydını 1920×1080 çözünürlükte alın; politika üretimi ve uçtan uca döngü demoların en kritik anlarıdır.

---

## Teknik Yığın

- **Frontend:** React 18 + Vite + Tailwind CSS v4
- **Grafik:** Recharts
- **Veri:** Yerel JSON seed (`src/data/seed.js`) — gerçek SSB Siber Hijyen-KOBİ kontrolleri
- **Yapay Zekâ:** Anthropic Claude API, hafif Vite middleware proxy (`/api/brain`) üzerinden; her özellik için fallback çıktı gömülü

## Proje Yapısı

```
src/
  App.jsx                 Sekmeli kabuk + ortak state (kontroller, hedef seviye)
  data/
    seed.js               13 kategori, 52 SSB kontrolü, firma, yedekleme, alarm
    directory.js          OU ağacı, kullanıcılar, bilgisayarlar, gruplar, dizin politikaları
    edge.js               Yerinde altyapı: servisler, DHCP, DNS, paylaşım, VPN, sertifika
    soc.js                SIEM alarmları, vakalar, zaman çizelgesi, SOME, SGB bildirimleri
    cloud.js              Bulut SOC: çok-müşterili portföy, Edge heartbeat, SLA, nöbet ekibi
    fallbacks.js          Önceden üretilmiş yapay zekâ çıktıları
  lib/
    ai.js                 BilSec Brain istemcisi (/api/brain + fallback)
    scoring.js            Kapsama % ve seviye hesaplamaları
  components/
    Dashboard.jsx         Genel Bakış
    Compliance.jsx        Compass uyum modülü (Directory kaynaklı otomatik kontroller dahil)
    Directory.jsx         Kimlik yönetimi: OU/kullanıcı/bilgisayar/grup/politika + AI yerleştirme
    Edge.jsx              Yerinde altyapı durumu (DHCP, DNS, VPN, sertifika, yedek, servis sağlığı)
    Siem.jsx              SIEM alarm akışı + Atlas triyaj paneli
    Incidents.jsx         Vaka yönetimi + zaman çizelgesi + Scribe + SOME alt sekmesi
    Brain.jsx             Yapay zekâ: politika / anonimleştirme / boşluk analizi
    Ransomware.jsx        Fidye koruması + izolasyon simülasyonu
    Report.jsx            Uyum raporu (yazdır/PDF)
    CloudSoc.jsx          BilSec Bulut SOC: müşteri portföyü, çok-müşterili alarm akışı, nöbet
    ui.jsx                Ortak arayüz bileşenleri
vite.config.js            BilSec Brain proxy (ANTHROPIC_API_KEY sunucu tarafında)
```

---

## Kapsam Notu

Bu bir **demo/MVP**'dir, üretim sistemi değildir. Gerçek Wazuh/SIEM entegrasyonu, kimlik doğrulama, çok-müşterili altyapı ve gerçek yedekleme motoru kapsam dışıdır (seed/mock veri kullanılır). Amaç, ürünün gerçekliğini ve teknoloji hazırlık seviyesini (TRL) ikna edici tek bir dikey dilimle göstermektir.
