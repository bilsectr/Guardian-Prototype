// BilSec Guardian — Yerinde Altyapı (BilSec Edge) tohum verisi (mock).
// Ubuntu/Zentyal benzeri yerinde sunucu servisleri. Gerçek entegrasyon yoktur.
// Host adları Directory (BILGISAYARLAR) ile tutarlıdır.

export const SERVIS_DURUMLARI = {
  calisiyor: { kod: 'calisiyor', ad: 'Çalışıyor', renk: '#16c9ac' },
  uyari: { kod: 'uyari', ad: 'Uyarı', renk: '#f59e0b' },
  durdu: { kod: 'durdu', ad: 'Durdu', renk: '#ef4444' },
}

// Servis listesi + karşıladığı SSB kontrolleri (karsilar).
export const SERVISLER = [
  { id: 'dizin', ad: 'Dizin Hizmeti (Samba AD)', durum: 'calisiyor', ozet: '15 kullanıcı · 12 cihaz · 7 politika', karsilar: [] },
  { id: 'dns', ad: 'DNS', durum: 'calisiyor', ozet: '8.240 sorgu/gün · 2 forwarder', karsilar: [] },
  { id: 'dhcp', ad: 'DHCP', durum: 'calisiyor', ozet: '192.168.10.0/24 · %54 dolu', karsilar: [] },
  { id: 'ntp', ad: 'NTP (Zaman Senkron)', durum: 'calisiyor', ozet: 'Senkron · sapma < 5 ms', karsilar: [] },
  { id: 'dosya', ad: 'Dosya Paylaşımı', durum: 'calisiyor', ozet: '4 paylaşım · 318 GB', karsilar: [] },
  { id: 'vpn', ad: 'VPN', durum: 'calisiyor', ozet: '2 aktif bağlantı', karsilar: ['2.1'] },
  { id: 'radius', ad: 'RADIUS / Kablosuz', durum: 'calisiyor', ozet: 'WPA2-Enterprise · yalnız yetkili', karsilar: ['2.6', '2.9'] },
  { id: 'ca', ad: 'Sertifikalar (CA)', durum: 'uyari', ozet: '1 sertifika 20 gün içinde dolacak', karsilar: [] },
  { id: 'firewall', ad: 'Güvenlik Duvarı / IDS', durum: 'calisiyor', ozet: 'Bugün 1.284 bağlantı engellendi', karsilar: [] },
  { id: 'antivirus', ad: 'Antivirüs', durum: 'calisiyor', ozet: '%100 kapsam · imzalar güncel', karsilar: ['3.4'] },
  { id: 'yedek', ad: 'Yedekleme', durum: 'calisiyor', ozet: 'Bugün 03:12 ✓ Başarılı', karsilar: ['7.1', '7.2', '7.3'] },
  { id: 'guncelleme', ad: 'Güncellemeler', durum: 'calisiyor', ozet: '3 bekleyen yama · otomatik açık', karsilar: ['9.1', '9.2'] },
]

export const DHCP = {
  ag: '192.168.10.0/24',
  agGecidi: '192.168.10.1',
  havuz: '192.168.10.100 – 192.168.10.200',
  kullanim: 54,
  leases: [
    { host: 'YON-PC-01', ip: '192.168.10.101', mac: 'A4:5E:60:11:2C:01', kalanSure: '5s 12dk' },
    { host: 'MUH-PC-01', ip: '192.168.10.104', mac: 'A4:5E:60:11:2C:0A', kalanSure: '6s 40dk' },
    { host: 'ARGE-PC-02', ip: '192.168.10.112', mac: '3C:7A:8B:44:9F:02', kalanSure: '3s 05dk' },
    { host: 'ARGE-PC-05', ip: '192.168.10.115', mac: '3C:7A:8B:44:9F:05', kalanSure: '7s 18dk' },
    { host: 'URETIM-PC-03', ip: '192.168.10.123', mac: 'D8:9E:F3:20:71:03', kalanSure: '2s 33dk' },
    { host: 'URETIM-PC-06', ip: '192.168.10.126', mac: 'D8:9E:F3:20:71:06', kalanSure: '6s 02dk' },
    { host: 'BT-PC-01', ip: '192.168.10.131', mac: '58:11:22:AA:BB:01', kalanSure: '7s 55dk' },
    { host: 'SATIS-PC-04', ip: '192.168.10.140', mac: '58:11:22:AA:BB:04', kalanSure: '4s 27dk' },
    { host: 'IK-PC-07', ip: '192.168.10.147', mac: '9C:B6:D0:55:33:07', kalanSure: '1s 09dk' },
    { host: 'IK-PC-09', ip: '192.168.10.149', mac: '9C:B6:D0:55:33:09', kalanSure: '5s 44dk' },
    { host: 'YAZICI-MUH-01', ip: '192.168.10.160', mac: '00:1B:A9:12:34:56', kalanSure: '6s 12dk' },
    { host: 'TEL-KONF-01', ip: '192.168.10.171', mac: '00:1B:A9:65:43:21', kalanSure: '3s 50dk' },
  ],
}

export const DNS = {
  durum: 'calisiyor',
  gunlukSorgu: 8240,
  forwarders: ['1.1.1.1', '8.8.8.8'],
  yerelBolge: 'ornek-savunma.local',
}

export const PAYLASIMLAR = [
  { yol: '\\\\bilsec-edge\\Muhasebe', boyut: '46 GB', grup: 'GRP-Muhasebe' },
  { yol: '\\\\bilsec-edge\\ArGe-Gizli', boyut: '128 GB', grup: 'GRP-ArGe-Gizli' },
  { yol: '\\\\bilsec-edge\\Ortak', boyut: '89 GB', grup: 'Tüm Personel' },
  { yol: '\\\\bilsec-edge\\Yonetim', boyut: '55 GB', grup: 'GRP-Yonetim' },
]

export const VPN = {
  durum: 'calisiyor',
  aktif: [
    { kullanici: 'cdemirtas', ip: '192.168.10.212', sure: '2s 14dk' },
    { kullanici: 'edogan', ip: '192.168.10.215', sure: '0s 47dk' },
  ],
}

export const SERTIFIKALAR = [
  { ad: 'bilsec-edge.ornek-savunma.local', tur: 'İç CA', bitis: '14.02.2027', kalanGun: 199, durum: 'calisiyor' },
  { ad: 'vpn.ornek-savunma.com.tr', tur: "Let's Encrypt", bitis: '18.08.2026', kalanGun: 20, durum: 'uyari' },
  { ad: 'portal.ornek-savunma.com.tr', tur: "Let's Encrypt", bitis: '05.10.2026', kalanGun: 68, durum: 'calisiyor' },
]

export const FIREWALL = { durum: 'calisiyor', bugunEngellenen: 1284, idsAktif: true }

export const ANTIVIRUS = { kapsam: 100, kapsananUcNokta: 12, toplamUcNokta: 12, imzaGuncel: true, sonTarama: '29.07.2026 02:00' }

export const GUNCELLEME = { bekleyen: 3, otomatik: true, sonGuncelleme: '27.07.2026' }
