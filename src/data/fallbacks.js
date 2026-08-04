// BilSec Brain — önceden üretilmiş örnek çıktılar (fallback).
// API anahtarı yoksa veya çağrı başarısız olursa görüşmede kesinti olmaması için kullanılır.

export const FALLBACK_POLITIKA = `# Veri Güvenliği Politikası ve Prosedürü
**Doküman No:** BSG-POL-06.2 · **Versiyon:** 1.0 · **İlgili Kontrol:** SSB 6.2 (Orta)

## 1. Amaç
Bu politikanın amacı, Örnek Savunma Sanayi A.Ş. bünyesinde işlenen ve ana yükleniciden gelen tüm verilerin gizlilik derecesine göre sınıflandırılmasını, uygun koruma tedbirlerinin uygulanmasını ve yetkisiz erişime karşı korunmasını sağlamaktır.

## 2. Kapsam
Bu politika; tüm çalışanları, yüklenicileri, stajyerleri ve kurum bilgi varlıklarına erişen üçüncü tarafları kapsar. Kâğıt ve elektronik ortamdaki tüm veriler için geçerlidir.

## 3. Veri Sınıflandırması
Veriler dört seviyede sınıflandırılır:
- **Çok Gizli:** Ana yüklenici projelerine ait teknik veriler. Yalnızca proje ekibi erişebilir.
- **Gizli:** Sözleşme, fiyatlandırma, personel özlük bilgileri.
- **İç Kullanım:** Kurum içi prosedürler, iç yazışmalar.
- **Genel:** Kamuya açık pazarlama içeriği.

## 4. Sorumluluklar
- **Bilgi Güvenliği Sorumlusu:** Politikanın güncelliğinden ve uygulanmasının denetiminden sorumludur.
- **Veri Sahipleri (Birim Yöneticileri):** Kendi birimlerindeki verilerin doğru sınıflandırılmasından sorumludur.
- **Tüm Çalışanlar:** Sınıflandırma etiketlerine ve koruma kurallarına uymakla yükümlüdür.

## 5. Koruma Tedbirleri
1. Gizli ve üzeri veriler aktarım ve saklama sırasında şifrelenir (AES-256).
2. Çok Gizli veriler yalnızca internet bağlantısı olmayan izole sistemlerde işlenir.
3. Erişim "bilmesi gereken" (need-to-know) ilkesine göre verilir ve altı ayda bir gözden geçirilir.
4. Fiziksel gizli belgeler kilitli dolaplarda saklanır.

## 6. Uygulama Adımları
1. Mevcut veri envanteri çıkarılır ve her veri kümesi sınıflandırılır. *(Tahmini süre: 2 hafta)*
2. Sınıflandırma etiketleme rehberi hazırlanır ve çalışanlara duyurulur.
3. Erişim yetkileri sınıflandırmaya göre yeniden düzenlenir.
4. Politika tüm personele tebliğ edilir, imzalı taahhüt alınır.
5. Uygulama yılda bir kez iç denetimle kontrol edilir.

## 7. Yürürlük
Bu politika yayım tarihinde yürürlüğe girer ve en az yılda bir gözden geçirilir.

*— BilSec Brain tarafından oluşturulan taslak. Kurumsal onaydan önce hukuk/uyum birimince gözden geçirilmelidir.*`

export const FALLBACK_ANONIM = `[ANONİMLEŞTİRİLMİŞ METİN]

Olay kaydı: [TARİH] tarihinde İK biriminde görevli [AD-SOYAD] ([E-POSTA]) kullanıcısının bilgisayarında şüpheli etkinlik tespit edildi. Kullanıcı [TELEFON] numarasından bilgilendirildi. TCKN [TCKN] olan personelin erişim yetkileri geçici olarak askıya alındı. Olay, [ADRES] adresindeki merkez ofiste gerçekleşti.

Teknik bulgular (maskeleme yapılmadı — uyum kanıtı):
- Etkilenen sistem: İK-PC-07
- Zararlı uzantı: .locked
- EDR risk skoru: 0.94
- Uygulanan aksiyon: ağ karantinası + oturum sonlandırma
- İlgili SSB kontrolü: 10.1 (Olay/İhlal Bildirimi)

Not: Kişisel veriler KVKK gereği [ETİKET] biçiminde maskelenmiştir; teknik/uyum bilgileri delil bütünlüğü için okunur bırakılmıştır.`

export const FALLBACK_BOSLUK = `# Öncelikli Uyum Aksiyon Planı — Örnek Savunma Sanayi A.Ş.
Hedef Seviye: Orta · Eksik/Kısmi kontrollere göre önceliklendirilmiştir.

## Yüksek Öncelik (0–30 gün)
1. **E-posta 2FA'yı devreye al (4.3)** — Kurumsal e-postada iki faktörlü doğrulama zorunlu kılınmalı. *Efor: Düşük* — Etki: Yüksek (kimlik avı riskini büyük ölçüde azaltır).
2. **Veri güvenliği politikası oluştur (6.2)** — Sınıflandırma + koruma tedbirleri yazılı hale getirilmeli. *Efor: Orta* — BilSec Brain ile taslak üretilebilir.
3. **Bilgi güvenliği politikasını yazılı hale getir ve duyur (8.2)** — Diğer politikaların şemsiye belgesi. *Efor: Orta*.

## Orta Öncelik (30–60 gün)
4. **Yerel yönetici yetkilerini gözden geçir (3.5)** — Gereksiz admin hakları kaldırılmalı. *Efor: Orta* — Etki: Yüksek (yanal hareket riskini düşürür).
5. **Adli sicil kontrol süreci kur (13.1)** — İşe alım ve yıllık kontrol prosedürü. *Efor: Düşük*.
6. **KVKK veri imha prosedürü (12.2)** — Saklama süreleri ve güvenli imha yöntemi tanımlanmalı. *Efor: Düşük*.
7. **Restore testlerini periyodik hale getir (7.3)** — Üç ayda bir dokümante restore testi. *Efor: Düşük*.

## Düşük Öncelik / İleri Seviye Hazırlığı (60–90 gün)
8. **USB/harici disk şifreleme (6.4)** — BitLocker-to-Go veya donanımsal şifreli medya. *Efor: Orta*.
9. **Kritik oda erişim doğrulaması (5.4)** — Kart/PIN/biyometrik geçiş. *Efor: Yüksek* (donanım yatırımı).
10. **Mobil cihaz ekran kilidi politikası (3.9)** — MDM ile zorunlu kılınmalı. *Efor: Orta*.

**Özet:** Düşük eforlu 4 kontrol (4.3, 13.1, 12.2, 7.3) ilk 30 günde kapatılırsa Orta seviye kapsama oranı belirgin biçimde yükselir.

*— BilSec Brain tarafından oluşturulan aksiyon planı.*`

export const FALLBACK_YERLESTIR = `# Yeni Personel Yerleştirme Önerisi
**Personel:** Yeni Mühendis · **Departman:** Mühendislik / Ar-Ge

## Önerilen Organizasyon Birimi (OU)
**Mühendislik / Ar-Ge**
*Gerekçe:* Departman ile OU eşleşmesi, politika kalıtımının doğru uygulanmasını sağlar.

## Üye Olması Gereken Güvenlik Grupları
- **GRP-ArGe-Gizli** — Ar-Ge projelerine erişim için gereklidir. *(Hassas grup — üyelik loglanır.)*
- **GRP-Uzaktan-Erisim** — Yalnızca uzaktan çalışma gerekiyorsa eklenmelidir; aksi halde eklenmez (least privilege).

## Uygulanacak Dizin Politikaları
- Parola Politikası (SSB 2.5 / 2.7 / 4.4)
- Ekran Kilidi Politikası (SSB 3.8)
- MFA Zorunluluğu (SSB 4.3)
- Yerel Yönetici Kısıtı (SSB 3.5) — son kullanıcı olarak yerel yönetici **verilmez**
- USB / Harici Disk Şifreleme (SSB 6.4)
- Yazılım Yükleme Kısıtı (SSB 3.6 / 9.3)

## Not
Yerel yönetici yetkisi **önerilmez**; gerekirse süreli ve gerekçeli olarak BT ekibince açılmalıdır. Hesap açılışı "İşe Giriş/Çıkış Otomasyonu" politikasıyla kayıt altına alınır (SSB 1.4).

*— BilSec Brain tarafından oluşturulan yerleştirme önerisi.*`

export const FALLBACK_ATLAS = `## Atlas Triyaj Sonucu
**Alarm:** IK-PC-07 — Şüpheli toplu dosya şifreleme (T1486)

**Özet**
IK-PC-07 üzerinde kısa sürede yüksek hacimli dosya şifreleme davranışı ve bilinen fidye yazılımı uzantısı tespit edildi. Davranış profili, aktif bir fidye yazılımı çalıştırmasıyla yüksek düzeyde uyumludur.

**Olası Etki**
- İK birimine ait yerel dosyaların şifrelenmesi ve erişilemez hale gelmesi
- Ağ paylaşımları üzerinden yanal yayılma riski
- KVKK kapsamında kişisel veri içeren dosyalarda olası ihlal

**Önem Doğrulaması**
Kritik (doğrulandı). EDR risk skoru 0.94; MITRE T1486 — Data Encrypted for Impact ile eşleşiyor.

**Önerilen İlk Aksiyon**
1. IK-PC-07'yi ağdan derhal izole et (Hammer otomatik izolasyonu tetiklenebilir).
2. m.demir kullanıcı oturumunu sonlandır, kimlik bilgilerini geçici askıya al.
3. Immutable yedeğin bütünlüğünü doğrula; geri yükleme senaryosunu hazırla.
4. Vaka aç ve DFIR incelemesini başlat; olayı SGB bildirimi için işaretle.

*— BilSec Brain / Atlas tarafından üretildi.*`

export const FALLBACK_SCRIBE_OLAY = `# Olay Müdahale Raporu — VAKA-2026-014
**Olay:** IK-PC-07 fidye yazılımı şüphesi · **Önem:** Kritik · **Tarih:** 29.07.2026

## Özet
29.07.2026 14:32'de SIEM, IK-PC-07 üzerinde şüpheli toplu dosya şifreleme etkinliği tespit etti (MITRE T1486). Atlas triyajı olayı yüksek güvenle fidye yazılımı olarak sınıflandırdı ve otomatik izolasyon devreye alındı.

## Kök Neden
Ön bulgular, kullanıcıya ulaşan zararlı bir ek/bağlantı yoluyla fidye yazılımının çalıştırıldığına işaret etmektedir. Uç noktada yerel yönetici kısıtının tam uygulanmaması yayılma yüzeyini artırmıştır. Kesin kök neden DFIR incelemesiyle netleşecektir.

## Alınan Aksiyonlar
1. IK-PC-07 ağdan izole edildi; m.demir oturumu sonlandırıldı (14:34).
2. Immutable yedek bütünlüğü doğrulandı — yedekler şifrelemeden etkilenmedi (14:36).
3. Vaka açıldı, DFIR incelemesi başlatıldı; olay SGB bildirimi için işaretlendi.

## Öneriler
- Yerel yönetici kısıtı politikasının tüm uç noktalarda tam uygulanması (SSB 3.5).
- Kullanıcı farkındalık eğitiminin tekrarlanması (SSB 8.1).
- 4 saatlik RTO hedefiyle kontrollü geri yükleme ve kapanış doğrulaması.

*— BilSec Brain / Scribe tarafından üretildi. Kapanış öncesi SOC sorumlusunca onaylanmalıdır.*`

export const FALLBACK_SCRIBE_SOME = `# SOME Faaliyet Raporu — Temmuz 2026
**Operatör:** BilSec Yönetilen SOME · **Kuruluş:** Örnek Savunma Sanayi A.Ş.

## Dönem Özeti
Dönem içinde toplam 5 güvenlik alarmı işlendi; 1 kritik, 2 yüksek, 2 orta önemde. 3 vaka yönetildi (1 açık, 2 kapatıldı). Ortalama triyaj süresi < 2 dakika (Atlas otomasyonu).

## Önemli Olaylar
- **VAKA-2026-014 (Kritik):** IK-PC-07 fidye yazılımı şüphesi — otomatik izolasyon uygulandı, DFIR sürüyor.
- **VAKA-2026-009 (Orta):** Oltalama e-postası tıklaması — kapatıldı, eğitim atandı.
- **VAKA-2026-005 (Yüksek):** Dosya sunucusuna kaba kuvvet — kaynak IP engellendi, kapatıldı.

## SGB'ye Bildirilen Olaylar
- SGB-2026-003 — Kaba kuvvet saldırısı (02.07.2026) — Bildirildi
- SGB-2026-002 — Oltalama olayı (13.07.2026) — Bildirildi
- SGB-2026-004 — Fidye yazılımı şüphesi (IK-PC-07) — Bildirim bekliyor

## İyileştirme Önerileri
- Uç noktalarda yerel yönetici kısıtının tamamlanması (SSB 3.5).
- E-posta 2FA ve farkındalık eğitiminin yaygınlaştırılması (SSB 4.3 / 8.1).
- SOME olgunluk seviyesinin 2'den 3'e çıkarılması için tatbikat planı.

*— BilSec Brain / Scribe tarafından üretildi.*`
