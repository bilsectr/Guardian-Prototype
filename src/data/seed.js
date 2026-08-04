// BilSec Guardian — Tohum (seed) veri
// SSB Siber Hijyen-KOBİ kategori ve kontrolleri (gerçek maddeler).
// Seviye: B = Başlangıç, O = Orta, İ = İleri
// Durum: uygun | kismi | eksik

export const SEVIYELER = {
  B: { kod: 'B', ad: 'Başlangıç', renk: '#38bdf8' },
  O: { kod: 'O', ad: 'Orta', renk: '#f59e0b' },
  I: { kod: 'İ', ad: 'İleri', renk: '#a78bfa' },
}

// Artımlı model: seçilen hedef seviye alt seviyeleri de kapsar.
export const SEVIYE_KAPSAM = {
  B: ['B'],
  O: ['B', 'O'],
  I: ['B', 'O', 'I'],
}

export const DURUMLAR = {
  uygun: { kod: 'uygun', ad: 'Uygun', renk: '#16c9ac', puan: 1 },
  kismi: { kod: 'kismi', ad: 'Kısmi', renk: '#f59e0b', puan: 0.5 },
  eksik: { kod: 'eksik', ad: 'Eksik', renk: '#ef4444', puan: 0 },
}

export const FIRMA = {
  ad: 'Örnek Savunma Sanayi A.Ş.',
  sektor: 'Savunma Sanayi Tedarikçisi (Ana Yüklenici Alt Tedarikçisi)',
  personel: 42,
  konum: 'Ankara, Türkiye',
  hedefSeviye: 'I', // İleri (savunma tedarikçisi — tüm 52 kontrol kapsamda)
  raporTarihi: '29.07.2026',
  denetci: 'BilSec Guardian — Otomatik Uyum Değerlendirmesi',
}

export const KATEGORILER = [
  { id: 1, ad: 'Varlık Yönetimi', ikon: '🗂️' },
  { id: 2, ad: 'Ağ ve Sistem Güvenliği', ikon: '🛡️' },
  { id: 3, ad: 'Uç Nokta (İstemci) Güvenliği', ikon: '💻' },
  { id: 4, ad: 'E-Posta Güvenliği', ikon: '✉️' },
  { id: 5, ad: 'Fiziksel ve Çevresel Güvenlik', ikon: '🏢' },
  { id: 6, ad: 'Veri Güvenliği', ikon: '🔐' },
  { id: 7, ad: 'Yedekleme', ikon: '💾' },
  { id: 8, ad: 'Farkındalık', ikon: '🎓' },
  { id: 9, ad: 'Güncelleme Yönetimi', ikon: '🔄' },
  { id: 10, ad: 'Olay / İhlal Yönetimi', ikon: '🚨' },
  { id: 11, ad: 'Bulut Güvenliği', ikon: '☁️' },
  { id: 12, ad: 'Veri İmha Yönetimi', ikon: '🗑️' },
  { id: 13, ad: 'İnsan Kaynakları Güvenliği', ikon: '👥' },
]

// 52 kontrol. Durum dağılımı gerçekçi: ~%60 uygun, ~%19 kısmi, ~%21 eksik → skor ~%69.
export const KONTROLLER = [
  // 1. VARLIK YÖNETİMİ
  { no: '1.1', kat: 1, seviye: 'B', durum: 'uygun', metin: 'Bilgi işlem varlıkları (bilgisayar, laptop vb.) kayıt altına alınmalıdır.' },
  { no: '1.2', kat: 1, seviye: 'I', durum: 'kismi', metin: 'Donanım ve yazılım bilgi varlıkları için envanter kaydı oluşturulmalıdır.' },
  { no: '1.3', kat: 1, seviye: 'I', durum: 'eksik', metin: 'Varlık kullanımına yönelik kural/rehber dokümanlar oluşturulmalı ve çalışanlara duyurulmalıdır.' },
  { no: '1.4', kat: 1, seviye: 'O', durum: 'uygun', metin: 'Göreve başlayan personel/yüklenici için varlık zimmet süreçleri oluşturulmalı ve uygulanmalıdır.' },
  { no: '1.5', kat: 1, seviye: 'I', durum: 'kismi', metin: 'Görevi sona eren personel için varlık ve yetki iadesi süreçleri uygulanmalıdır.' },
  { no: '1.6', kat: 1, seviye: 'I', durum: 'uygun', metin: 'Envanter kayıtları en az yılda bir gözden geçirilmelidir.' },

  // 2. AĞ VE SİSTEM GÜVENLİĞİ
  { no: '2.1', kat: 2, seviye: 'O', durum: 'uygun', metin: 'Uzaktan bağlantı için güvenli VPN teknolojileri sağlanmalıdır.' },
  { no: '2.2', kat: 2, seviye: 'I', durum: 'kismi', metin: 'Üretici desteği bitmiş / güncelliğini yitirmiş sunucu, ağ bileşeni ve istemci teknolojileri yönetilmelidir.' },
  { no: '2.3', kat: 2, seviye: 'I', durum: 'uygun', metin: 'Kuruluş bünyesinde güvenlik duvarı bulundurulmalıdır.' },
  { no: '2.4', kat: 2, seviye: 'I', durum: 'kismi', metin: 'WAN IP adresi statik olarak kullanılmalıdır.' },
  { no: '2.5', kat: 2, seviye: 'B', durum: 'uygun', metin: 'Parolalar en az 8 karakter ve karmaşık yapıda olmalıdır.' },
  { no: '2.6', kat: 2, seviye: 'B', durum: 'uygun', metin: 'Wi-Fi ağı güçlü parolayla korunmalı, yalnızca yetkili personele açık olmalıdır.' },
  { no: '2.7', kat: 2, seviye: 'B', durum: 'kismi', metin: 'Kullanıcı şifreleri düzenli aralıklarla (örn. 90 gün) değiştirilmelidir.' },
  { no: '2.8', kat: 2, seviye: 'B', durum: 'uygun', metin: 'Modem şifresi varsayılandan farklı belirlenmelidir.' },
  { no: '2.9', kat: 2, seviye: 'B', durum: 'uygun', metin: "Wi-Fi'da güvenli şifreleme protokolleri (WPA2/WPA3/AES) kullanılmalıdır." },

  // 3. UÇ NOKTA (İSTEMCİ) GÜVENLİĞİ
  { no: '3.1', kat: 3, seviye: 'I', durum: 'kismi', metin: 'Tüm sistemlerde zararlı yazılım tespitine yönelik uç nokta tarama politikaları uygulanmalıdır.' },
  { no: '3.2', kat: 3, seviye: 'O', durum: 'uygun', metin: 'Uç noktalarda yerel güvenlik duvarı etkin olmalıdır.' },
  { no: '3.3', kat: 3, seviye: 'O', durum: 'uygun', metin: 'Kullanıcı bazlı oturum açma zorunlu, ortak/ziyaretçi hesap kullanımı engellenmelidir.' },
  { no: '3.4', kat: 3, seviye: 'B', durum: 'uygun', metin: 'Tüm istemcilerde güncel antivirüs etkin kullanılmalıdır.' },
  { no: '3.5', kat: 3, seviye: 'I', durum: 'eksik', metin: 'Kullanıcı hesaplarına gereksiz yerel yönetici yetkisi verilmemelidir.' },
  { no: '3.6', kat: 3, seviye: 'I', durum: 'uygun', metin: 'Yazılım yüklemeleri yalnızca yetkili personel tarafından yapılmalıdır.' },
  { no: '3.7', kat: 3, seviye: 'O', durum: 'uygun', metin: 'Üretim makineleri ve bağlı istemcilerde uygun güvenlik önlemleri alınmalıdır.' },
  { no: '3.8', kat: 3, seviye: 'B', durum: 'uygun', metin: 'Belirli süre işlem yapılmayınca otomatik ekran kilidi devreye girmeli, girişte parola sorulmalıdır.' },
  { no: '3.9', kat: 3, seviye: 'B', durum: 'eksik', metin: 'Kurumsal e-posta kullanılan mobil cihazlarda ekran kilidi zorunlu olmalıdır.' },

  // 4. E-POSTA GÜVENLİĞİ
  { no: '4.1', kat: 4, seviye: 'O', durum: 'uygun', metin: 'İş iletişiminde kurumsal e-posta kullanılmalı; üçüncü taraf (Gmail vb.) kullanılmamalıdır.' },
  { no: '4.2', kat: 4, seviye: 'O', durum: 'uygun', metin: "Kurumsal e-posta sunucuları kuruluş ağında veya Türkiye'deki servis sağlayıcılarda barındırılmalıdır." },
  { no: '4.3', kat: 4, seviye: 'O', durum: 'eksik', metin: 'Kurumsal e-posta erişiminde iki faktörlü doğrulama (2FA) kullanılmalıdır.' },
  { no: '4.4', kat: 4, seviye: 'O', durum: 'uygun', metin: 'Kurumsal e-posta hesaplarında parola politikası uygulanmalıdır.' },

  // 5. FİZİKSEL VE ÇEVRESEL GÜVENLİK
  { no: '5.1', kat: 5, seviye: 'B', durum: 'uygun', metin: 'Tesis giriş/çıkışları güvenlik kameralarıyla izlenmeli ve kaydedilmelidir.' },
  { no: '5.2', kat: 5, seviye: 'I', durum: 'uygun', metin: 'Kritik odalara girişler yetkili personelle kontrollü yapılmalıdır.' },
  { no: '5.3', kat: 5, seviye: 'I', durum: 'kismi', metin: 'Kritik odalar güvenlik kameralarıyla izlenmelidir.' },
  { no: '5.4', kat: 5, seviye: 'I', durum: 'eksik', metin: 'Kritik odalara girişte uygun doğrulama (biyometrik/kart/PIN) kullanılmalıdır.' },

  // 6. VERİ GÜVENLİĞİ
  { no: '6.1', kat: 6, seviye: 'B', durum: 'uygun', metin: 'Ana yükleniciden gelen verilerin gizlilik derecesi değiştirilmemeli, yetkisiz paylaşılmamalıdır.' },
  { no: '6.2', kat: 6, seviye: 'O', durum: 'eksik', metin: 'Veri güvenliği politikaları (sınıflandırma + koruma tedbirleri) oluşturulmalıdır.' },
  { no: '6.3', kat: 6, seviye: 'I', durum: 'kismi', metin: 'Gizli veriler internet bağlantısı olmayan bilgisayarlarda saklanmalı/işlenmelidir.' },
  { no: '6.4', kat: 6, seviye: 'I', durum: 'eksik', metin: 'Kritik veri taşıyan donanımlar (USB, harici disk vb.) şifreli kullanılmalıdır.' },
  { no: '6.5', kat: 6, seviye: 'B', durum: 'uygun', metin: 'Gizli veriler güvenli dolaplarda kilitli saklanmalıdır.' },

  // 7. YEDEKLEME
  { no: '7.1', kat: 7, seviye: 'O', durum: 'uygun', metin: 'Kritik veri içeren sistemler harici altyapıda yedeklenmelidir.' },
  { no: '7.2', kat: 7, seviye: 'O', durum: 'uygun', metin: 'Yedekler harici altyapıda güvenli tutulmalıdır.' },
  { no: '7.3', kat: 7, seviye: 'O', durum: 'kismi', metin: 'Önemli veriler düzenli yedeklenmeli ve restore testleri yapılmalıdır.' },

  // 8. FARKINDALIK
  { no: '8.1', kat: 8, seviye: 'O', durum: 'kismi', metin: 'Çalışanların temel bilgi güvenliği farkındalık eğitimini tamamladığı kanıtlanmalıdır.' },
  { no: '8.2', kat: 8, seviye: 'I', durum: 'eksik', metin: 'Bilgi güvenliği politikası yazılı oluşturulmalı ve tüm çalışanlara duyurulmalıdır.' },

  // 9. GÜNCELLEME YÖNETİMİ
  { no: '9.1', kat: 9, seviye: 'B', durum: 'uygun', metin: 'Tüm istemci/sunucu işletim sistemleri güncel tutulmalı ve takip edilmelidir.' },
  { no: '9.2', kat: 9, seviye: 'B', durum: 'uygun', metin: 'Yazılımların güvenlik güncellemeleri yapılmış olmalıdır.' },
  { no: '9.3', kat: 9, seviye: 'I', durum: 'eksik', metin: 'Lisanssız/geçersiz sertifikalı yazılım kullanılmamalıdır.' },
  { no: '9.4', kat: 9, seviye: 'B', durum: 'uygun', metin: 'Tarayıcı ve e-posta istemcilerinde desteklenen güncel sürümler kullanılmalıdır.' },

  // 10. OLAY / İHLAL YÖNETİMİ
  { no: '10.1', kat: 10, seviye: 'B', durum: 'uygun', metin: 'Gizli veri çalınması durumunda ilgili makamlar (EGM, ana yüklenici) derhal bilgilendirilmelidir.' },

  // 11. BULUT GÜVENLİĞİ
  { no: '11.1', kat: 11, seviye: 'B', durum: 'uygun', metin: 'Dosya transferleri ana yüklenici yöntemleriyle yapılmalı, veriler yetkisiz üçüncü taraflarla paylaşılmamalıdır.' },

  // 12. VERİ İMHA YÖNETİMİ
  { no: '12.1', kat: 12, seviye: 'B', durum: 'uygun', metin: 'Ana yükleniciden gelen veriler gerekmediğinde güvenli imha edilmelidir.' },
  { no: '12.2', kat: 12, seviye: 'B', durum: 'eksik', metin: 'KVKK kapsamındaki kişisel veriler yasal süreler sonunda güvenli imha edilmelidir.' },

  // 13. İNSAN KAYNAKLARI GÜVENLİĞİ
  { no: '13.1', kat: 13, seviye: 'B', durum: 'eksik', metin: 'Tüm personel işe başlamadan önce ve yılda en az 1 kez adli sicil kontrolünden geçirilmelidir.' },
  { no: '13.2', kat: 13, seviye: 'B', durum: 'uygun', metin: 'Tüm personelle gizlilik sözleşmesi imzalanmalıdır.' },
]

// Fidye yazılımı / yedekleme paneli verisi
export const YEDEKLEME = {
  immutableAktif: true,
  kapsananSistem: 7,
  toplamSistem: 9,
  rtoTaahhut: '4 saat',
  rpo: '24 saat',
  sonRestoreTesti: '26.07.2026',
  sonRestoreSonuc: 'Başarılı',
  sonYedek: '29.07.2026 03:12',
  saklamaKonumu: 'Türkiye (yerel veri merkezi) + immutable kopya',
}

// Fidye yazılımı simülasyon alarmı
export const ALARM = {
  id: 'ALM-2026-0729-014',
  baslik: 'Şüpheli şifreleme etkinliği tespit edildi',
  varlik: 'İK-PC-07',
  kullanici: 'm.demir',
  siddet: 'Kritik',
  aciklama:
    'Kısa sürede yüksek sayıda dosya yeniden adlandırma/şifreleme davranışı ve bilinen fidye yazılımı uzantısı (.locked) gözlemlendi.',
  zaman: '29.07.2026 14:32',
}

// Otomatik izolasyon simülasyonu — zaman çizelgesi (sn)
export const IZOLASYON_ADIMLARI = [
  { t: 0, metin: 'Anomali motoru şüpheli şifreleme davranışını işaretledi (EDR skoru 0.94)' },
  { t: 8, metin: 'BilSec Brain olayı sınıflandırdı: Fidye yazılımı — yüksek güven' },
  { t: 18, metin: 'İK-PC-07 ağ segmentinden karantinaya alındı (NAC kuralı uygulandı)' },
  { t: 27, metin: 'İlgili kullanıcı oturumu sonlandırıldı, kimlik bilgileri geçici olarak askıya alındı' },
  { t: 36, metin: 'Immutable yedek bütünlüğü doğrulandı — şifrelemeden etkilenmedi' },
  { t: 48, metin: 'Olay kaydı oluşturuldu ve SOC ekibine bildirim gönderildi (SSB 10.1)' },
  { t: 60, metin: 'İzolasyon tamamlandı — yayılma engellendi, geri yükleme hazır' },
]
