// BilSec Guardian — SOC / SIEM / Olay Yönetimi / SOME tohum verisi (mock).
// Host adları BilSec Directory ile tutarlıdır (IK-PC-07, URETIM-PC-03, MUH-PC-01).
// Gerçek Wazuh/OpenSearch/TheHive/SGB entegrasyonu yoktur.

export const ONEMLER = {
  kritik: { kod: 'kritik', ad: 'Kritik', renk: '#ef4444', sira: 4 },
  yuksek: { kod: 'yuksek', ad: 'Yüksek', renk: '#f97316', sira: 3 },
  orta: { kod: 'orta', ad: 'Orta', renk: '#f59e0b', sira: 2 },
  dusuk: { kod: 'dusuk', ad: 'Düşük', renk: '#38bdf8', sira: 1 },
}

export const ALARM_DURUMLARI = {
  yeni: { kod: 'yeni', ad: 'Yeni', renk: '#38bdf8' },
  inceleniyor: { kod: 'inceleniyor', ad: 'İnceleniyor', renk: '#f59e0b' },
  kapatildi: { kod: 'kapatildi', ad: 'Kapatıldı', renk: '#16c9ac' },
}

export const VAKA_DURUMLARI = {
  acik: { kod: 'acik', ad: 'Açık', renk: '#f97316' },
  kapali: { kod: 'kapali', ad: 'Kapatıldı', renk: '#16c9ac' },
}

// BilSec Brain SOC ajanları
export const AJANLAR = {
  atlas: { ad: 'Atlas', rol: 'Alarm Triyajı', ikon: '🛰️' },
  scribe: { ad: 'Scribe', rol: 'Rapor / Dokümantasyon', ikon: '✍️' },
  sage: { ad: 'Sage', rol: 'Analiz', ikon: '🧭' },
  hammer: { ad: 'Hammer', rol: 'Müdahale', ikon: '🔨' },
}

export const ALARMLAR = [
  {
    id: 'ALM-2026-0729-014',
    zaman: '29.07.2026 14:32',
    host: 'IK-PC-07',
    kullanici: 'm.demir',
    baslik: 'Şüpheli toplu dosya şifreleme etkinliği',
    onem: 'kritik',
    mitre: { kod: 'T1486', ad: 'Data Encrypted for Impact' },
    durum: 'yeni',
    aciklama:
      'Kısa sürede yüksek sayıda dosya yeniden adlandırma/şifreleme ve bilinen fidye yazılımı uzantısı (.locked) gözlemlendi. EDR risk skoru 0.94.',
    vakaId: 'VAKA-2026-014',
  },
  {
    id: 'ALM-2026-0729-011',
    zaman: '29.07.2026 03:47',
    host: 'srv-dosya01',
    kullanici: '—',
    baslik: 'Kısa sürede çok sayıda başarısız oturum denemesi',
    onem: 'yuksek',
    mitre: { kod: 'T1110', ad: 'Brute Force' },
    durum: 'inceleniyor',
    aciklama: '5 dakikada 240+ başarısız kimlik doğrulama; kaynak tek bir dış IP adresi.',
    vakaId: null,
  },
  {
    id: 'ALM-2026-0729-016',
    zaman: '29.07.2026 10:12',
    host: 'MUH-PC-01',
    kullanici: 'msahin',
    baslik: 'Yetkisiz yerel yönetici hesabı eklendi',
    onem: 'yuksek',
    mitre: { kod: 'T1078', ad: 'Valid Accounts' },
    durum: 'yeni',
    aciklama: 'Yeni bir yerel yönetici hesabı ("svc_admin2") BT onayı olmadan oluşturuldu.',
    vakaId: null,
  },
  {
    id: 'ALM-2026-0728-097',
    zaman: '28.07.2026 16:20',
    host: 'URETIM-PC-03',
    kullanici: 'dkoc',
    baslik: 'Tanımsız USB depolama aygıtı takıldı',
    onem: 'orta',
    mitre: { kod: 'T1091', ad: 'Replication Through Removable Media' },
    durum: 'kapatildi',
    aciklama: 'Beyaz listede olmayan bir USB bellek algılandı; içerik taraması temiz döndü.',
    vakaId: null,
  },
  {
    id: 'ALM-2026-0729-018',
    zaman: '29.07.2026 12:05',
    host: 'srv-dosya01',
    kullanici: '—',
    baslik: 'Olağan dışı dış bağlantı / olası C2 trafiği',
    onem: 'orta',
    mitre: { kod: 'T1071', ad: 'Application Layer Protocol' },
    durum: 'inceleniyor',
    aciklama: 'Bilinmeyen bir alan adına periyodik (beacon benzeri) giden HTTPS bağlantıları.',
    vakaId: null,
  },
]

export const VAKALAR = [
  {
    no: 'VAKA-2026-014',
    baslik: 'IK-PC-07 fidye yazılımı şüphesi',
    onem: 'kritik',
    host: 'IK-PC-07',
    kullanici: 'm.demir',
    analist: 'Atlas / SOC Ekibi',
    durum: 'acik',
    acilis: '29.07.2026 14:32',
    kapanis: null,
    ssb: '10.1',
    ozet: 'Otomatik izolasyon uygulandı; DFIR (adli bilişim) incelemesi sürüyor.',
    timeline: [
      { t: '29.07.2026 14:32', tur: 'tespit', metin: 'SIEM: IK-PC-07 üzerinde şüpheli toplu dosya şifreleme etkinliği (T1486).' },
      { t: '29.07.2026 14:33', tur: 'triyaj', metin: 'Atlas triyajı: Fidye yazılımı — yüksek güven; kritik önem doğrulandı.' },
      { t: '29.07.2026 14:34', tur: 'mudahale', metin: 'Hammer: IK-PC-07 ağdan otomatik izole edildi, kullanıcı oturumu sonlandırıldı.' },
      { t: '29.07.2026 14:36', tur: 'mudahale', metin: 'Immutable yedek bütünlüğü doğrulandı; DFIR incelemesi başlatıldı.' },
    ],
  },
  {
    no: 'VAKA-2026-009',
    baslik: 'Oltalama (phishing) e-postası tıklaması',
    onem: 'orta',
    host: 'SATIS-PC-04',
    kullanici: 'edogan',
    analist: 'Sage / SOC Ekibi',
    durum: 'kapali',
    acilis: '12.07.2026 09:14',
    kapanis: '13.07.2026 11:00',
    ssb: '10.1',
    ozet: 'Kimlik bilgisi girilmedi; kullanıcı parolası sıfırlandı, farkındalık eğitimi atandı.',
    timeline: [
      { t: '12.07.2026 09:14', tur: 'tespit', metin: 'E-posta güvenlik: edogan kullanıcısı şüpheli bağlantıya tıkladı.' },
      { t: '12.07.2026 09:20', tur: 'triyaj', metin: 'Atlas: Kimlik avı — orta önem; kimlik bilgisi girilmemiş.' },
      { t: '12.07.2026 10:05', tur: 'mudahale', metin: 'Kullanıcı parolası sıfırlandı, aktif oturumlar kapatıldı.' },
      { t: '13.07.2026 11:00', tur: 'cozum', metin: 'Vaka kapatıldı; kullanıcıya farkındalık eğitimi atandı (SSB 8.1).' },
    ],
  },
  {
    no: 'VAKA-2026-005',
    baslik: 'Dosya sunucusuna kaba kuvvet denemesi',
    onem: 'yuksek',
    host: 'srv-dosya01',
    kullanici: '—',
    analist: 'Atlas / SOC Ekibi',
    durum: 'kapali',
    acilis: '02.07.2026 03:11',
    kapanis: '02.07.2026 04:00',
    ssb: '10.1',
    ozet: 'Kaynak IP güvenlik duvarında engellendi; hesap kilitleme politikası doğrulandı.',
    timeline: [
      { t: '02.07.2026 03:11', tur: 'tespit', metin: 'SIEM: srv-dosya01 üzerinde çok sayıda başarısız oturum denemesi (T1110).' },
      { t: '02.07.2026 03:15', tur: 'triyaj', metin: 'Atlas: Kaba kuvvet saldırısı — yüksek önem.' },
      { t: '02.07.2026 03:20', tur: 'mudahale', metin: 'Kaynak IP güvenlik duvarında engellendi.' },
      { t: '02.07.2026 04:00', tur: 'cozum', metin: 'Vaka kapatıldı; hesap kilitleme politikası doğrulandı.' },
    ],
  },
]

export const TIMELINE_TURLERI = {
  tespit: { ad: 'Tespit', renk: '#38bdf8', ikon: '🔍' },
  triyaj: { ad: 'Triyaj (Atlas)', renk: '#a78bfa', ikon: '🛰️' },
  mudahale: { ad: 'Müdahale (Hammer)', renk: '#f59e0b', ikon: '🔨' },
  cozum: { ad: 'Çözüm / Kapanış', renk: '#16c9ac', ikon: '✅' },
  rapor: { ad: 'Rapor (Scribe)', renk: '#38e1c8', ikon: '✍️' },
}

export const SOME_DURUM = {
  kayit: 'Kayıtlı',
  kayitTarihi: '15.01.2026',
  olgunluk: 2,
  olgunlukMax: 4,
  operator: 'BilSec Yönetilen SOME',
  iletisim: 'some@bilsec.com.tr',
  telefon: '+90 312 000 00 00',
  gorevlerAyriligi:
    'BilSec, müşterinin BT hizmet sağlayıcısı değil, bağımsız siber güvenlik operatörüdür; görevler ayrılığı ilkesi korunur.',
}

export const SGB_BILDIRIMLER = [
  { id: 'SGB-2026-003', olay: 'Kaba kuvvet saldırısı (srv-dosya01)', vaka: 'VAKA-2026-005', tarih: '02.07.2026', durum: 'bildirildi' },
  { id: 'SGB-2026-002', olay: 'Oltalama e-postası olayı (SATIS-PC-04)', vaka: 'VAKA-2026-009', tarih: '13.07.2026', durum: 'bildirildi' },
  { id: 'SGB-2026-004', olay: 'Fidye yazılımı şüphesi (IK-PC-07)', vaka: 'VAKA-2026-014', tarih: '29.07.2026', durum: 'bekliyor' },
]
